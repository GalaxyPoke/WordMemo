import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Volume2, 
  Star, 
  StarOff,
  Check, 
  X, 
  RotateCcw,
  BookOpen,
  Target,
  Flame,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Settings,
  BarChart3,
  Clock,
  Zap,
  Brain,
  Eye,
  EyeOff,
  Shuffle,
  Play,
  Pause,
  Loader,
  User,
  Palette,
  Mail
} from 'lucide-react'
import { kaoyanWords, wordBooks as defaultWordBooks, ecdictWords, wordBookCategories } from '../../data/vocabulary/kaoyanWords'
import { fetchWordDetails, playWordAudio, translateToChinese } from '../../services/dictionaryApi'
import { getEnrichedWordDataSync } from '../../services/localDictionary'
import { 
  handleLearningAnswer, 
  needsReview, 
  isMastered, 
  getCurrentStage, 
  getLearningProgress,
  formatNextReview,
  LEARNING_STAGES,
  MASTERY_STAGES,
  State
} from '../../services/fsrsAlgorithm'
import { 
  CalendarPage, 
  ProfilePage, 
  StudySettingsPage, 
  BookListPage,
  Dashboard,
  StudyModeSelector,
  HomePage,
  WordTest,
  CompletionPage,
  ImmersiveLearning,
  CollectionPage
} from './components'

// 获取后台上传的自定义词汇书
function getCustomWordBooks() {
  try {
    const data = localStorage.getItem('admin_word_books')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 获取自定义词汇书的单词
function getCustomWords(bookId) {
  try {
    const data = localStorage.getItem(`admin_custom_words_${bookId}`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 合并默认词汇书和自定义词汇书
function getAllWordBooks() {
  const customBooks = getCustomWordBooks().map(book => ({
    ...book,
    isCustom: true
  }))
  return [...defaultWordBooks, ...customBooks]
}

// 获取词汇书的单词
function getBookWords(bookId, isCustom = false, bookConfig = null) {
  if (isCustom) {
    return getCustomWords(bookId)
  }
  
  // 查找词汇书配置
  let book = bookConfig
  if (!book) {
    const allBooks = wordBookCategories.flatMap(cat => cat.books)
    book = allBooks.find(b => b.id === bookId)
  }
  
  if (!book) return []
  
  // 根据source获取基础词汇
  let baseWords = []
  if (book.source === 'ecdict-ky') {
    baseWords = ecdictWords.ky || []
  } else if (book.source === 'ecdict-cet4') {
    baseWords = ecdictWords.cet4 || []
  } else if (book.source === 'ecdict-cet6') {
    baseWords = ecdictWords.cet6 || []
  } else {
    return kaoyanWords
  }
  
  // 应用过滤器
  if (book.filter && typeof book.filter === 'function') {
    return baseWords.filter(book.filter)
  }
  
  return baseWords
}

// FSRS 算法已替代旧的艾宾浩斯固定间隔
// 旧间隔保留用于兼容性
const REVIEW_INTERVALS = [
  5,           // 5分钟后
  30,          // 30分钟后
  12 * 60,     // 12小时后
  24 * 60,     // 1天后
  2 * 24 * 60, // 2天后
  4 * 24 * 60, // 4天后
  7 * 24 * 60, // 7天后
  15 * 24 * 60 // 15天后
]

// 使用 FSRS 算法计算下次复习时间
function getNextReviewTimeFSRS(wordProgress) {
  if (!wordProgress || !wordProgress.card || !wordProgress.card.due) {
    return Date.now() + 5 * 60 * 1000 // 默认5分钟后
  }
  return new Date(wordProgress.card.due).getTime()
}

// 学习状态管理
const STORAGE_KEY = 'bubei_word_progress'
const SETTINGS_KEY = 'bubei_settings'
const STATS_KEY = 'bubei_stats'

// 获取学习进度
function getProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

// 保存学习进度
function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.warn('保存进度失败:', e)
  }
}

// 获取设置
function getSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    return saved ? JSON.parse(saved) : {
      dailyGoal: 30,
      reviewFirst: true,
      autoPlay: false,
      showPhonetic: true
    }
  } catch {
    return { dailyGoal: 30, reviewFirst: true, autoPlay: false, showPhonetic: true }
  }
}

// 保存设置
function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('保存设置失败:', e)
  }
}

// 获取统计数据
function getStats() {
  try {
    const saved = localStorage.getItem(STATS_KEY)
    return saved ? JSON.parse(saved) : {
      totalLearned: 0,
      totalReviewed: 0,
      streak: 0,
      lastStudyDate: null,
      dailyHistory: {}
    }
  } catch {
    return { totalLearned: 0, totalReviewed: 0, streak: 0, lastStudyDate: null, dailyHistory: {} }
  }
}

// 保存统计数据
function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (e) {
    console.warn('保存统计失败:', e)
  }
}

// 计算下次复习时间（旧版兼容）
function getNextReviewTimeLegacy(level) {
  const interval = REVIEW_INTERVALS[Math.min(level, REVIEW_INTERVALS.length - 1)]
  return Date.now() + interval * 60 * 1000
}

// 检查是否需要复习（旧版兼容）
function needsReviewLegacy(wordProgress) {
  if (!wordProgress || wordProgress.level === 0) return false
  return Date.now() >= wordProgress.nextReview
}

// 检查单词是否已掌握（FSRS）
function isWordMastered(wordProgress) {
  // 兼容旧数据和新数据
  if (wordProgress?.card) {
    return isMastered(wordProgress)
  }
  return wordProgress?.level > 0
}

// 生成打卡日历数据
function generateCalendarData(stats) {
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayNames = ['日', '一', '二', '三', '四', '五', '六']
    days.push({
      date: dateStr,
      day: dayNames[date.getDay()],
      isToday: i === 0,
      studied: stats.dailyHistory?.[dateStr]?.learned > 0 || false,
      count: stats.dailyHistory?.[dateStr]?.learned || 0
    })
  }
  return days
}

// 计算待复习单词数
function getReviewCount(progress) {
  const now = Date.now()
  return Object.values(progress).filter(p => {
    if (p.card?.due) {
      return new Date(p.card.due).getTime() <= now && p.card.state !== 0
    }
    return p.level > 0 && p.nextReview && p.nextReview <= now
  }).length
}

// Bing每日壁纸API（通过Vite代理避免跨域）
const BING_API = '/api/bing/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'

// 备用壁纸列表（本地高质量渐变）
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

function getDailyGradient() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return FALLBACK_GRADIENTS[dayOfYear % FALLBACK_GRADIENTS.length]
}

// 获取Bing每日壁纸（带本地缓存）
async function fetchBingWallpaper() {
  const today = new Date().toDateString()
  const cacheKey = 'bing_wallpaper_cache'
  
  try {
    // 先检查缓存
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { date, url, base64 } = JSON.parse(cached)
      // 如果是今天的缓存且有base64数据，直接返回
      if (date === today && base64) {
        return base64
      }
      // 如果是今天的URL但没有base64，返回URL
      if (date === today && url) {
        return url
      }
    }
    
    // 通过Vite代理请求Bing API
    const response = await fetch(BING_API)
    if (response.ok) {
      const data = await response.json()
      if (data.images && data.images[0]) {
        const wallpaperUrl = 'https://www.bing.com' + data.images[0].url
        
        // 先保存URL缓存
        localStorage.setItem(cacheKey, JSON.stringify({ date: today, url: wallpaperUrl }))
        
        // 后台下载并转换为base64缓存
        convertToBase64(wallpaperUrl).then(base64 => {
          if (base64) {
            localStorage.setItem(cacheKey, JSON.stringify({ date: today, url: wallpaperUrl, base64 }))
          }
        })
        
        return wallpaperUrl
      }
    }
  } catch (e) {
    console.warn('Bing壁纸获取失败:', e)
  }
  
  // 备用：Picsum高清图
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return `https://picsum.photos/id/${(dayOfYear % 1000) + 1}/1920/1080`
}

// 将图片URL转换为base64并缓存
async function convertToBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    console.warn('图片转base64失败:', e)
    return null
  }
}

// 学习统计页面
function StudyStats({ stats, progress, onBack }) {
  const today = new Date().toDateString()
  const todayCount = stats.dailyHistory[today] || 0
  const settings = getSettings()

  // 计算各级别单词数量
  const levelCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  Object.values(progress).forEach(p => {
    if (p.level !== undefined) {
      levelCounts[p.level]++
    }
  })

  // 获取最近7天数据
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toDateString()
    last7Days.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      count: stats.dailyHistory[dateStr] || 0
    })
  }

  const maxCount = Math.max(...last7Days.map(d => d.count), 1)

  return (
    <div className="word-study-container">
      <div className="word-study-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>学习统计</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="stats-overview">
        <div className="stats-card main">
          <div className="today-progress">
            <div className="progress-ring">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="8"
                  strokeDasharray={`${(todayCount / settings.dailyGoal) * 283} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="progress-text">
                <span className="count">{todayCount}</span>
                <span className="goal">/ {settings.dailyGoal}</span>
              </div>
            </div>
            <p>今日学习</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stats-card">
            <Flame size={24} className="stat-icon fire" />
            <span className="stat-value">{stats.streak}</span>
            <span className="stat-label">连续天数</span>
          </div>
          <div className="stats-card">
            <Target size={24} className="stat-icon target" />
            <span className="stat-value">{stats.totalLearned}</span>
            <span className="stat-label">累计学习</span>
          </div>
          <div className="stats-card">
            <Brain size={24} className="stat-icon brain" />
            <span className="stat-value">{stats.totalReviewed}</span>
            <span className="stat-label">复习次数</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>最近7天</h3>
        <div className="chart-container">
          {last7Days.map((day, i) => (
            <div key={i} className="chart-bar-wrapper">
              <div 
                className="chart-bar"
                style={{ height: `${(day.count / maxCount) * 100}%` }}
              >
                {day.count > 0 && <span className="bar-value">{day.count}</span>}
              </div>
              <span className="bar-label">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h3>记忆强度分布</h3>
        <div className="level-distribution">
          {levelCounts.map((count, level) => (
            <div key={level} className="level-item">
              <div className="level-bar-wrapper">
                <div 
                  className={`level-bar level-${level}`}
                  style={{ width: `${(count / Math.max(...levelCounts, 1)) * 100}%` }}
                />
              </div>
              <span className="level-label">Lv.{level}</span>
              <span className="level-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// CollectionPage 已移至 ./components/CollectionPage.jsx

// 主组件
export default function WordStudy() {
  const [view, setView] = useState('books') // books, modes, learn, review, test, stats, collection, complete
  const [selectedBook, setSelectedBook] = useState(null)
  const [studyWords, setStudyWords] = useState([])
  const [progress, setProgress] = useState(getProgress())
  const [stats, setStats] = useState(getStats())
  const [learnedCount, setLearnedCount] = useState(0)
  // 初始化时先检查缓存
  const [globalWallpaper, setGlobalWallpaper] = useState(() => {
    try {
      const cached = localStorage.getItem('bing_wallpaper_cache')
      if (cached) {
        const { date, base64, url } = JSON.parse(cached)
        const today = new Date().toDateString()
        if (date === today && (base64 || url)) {
          const cachedUrl = base64 || url
          document.documentElement.style.setProperty('--global-wallpaper', `url(${cachedUrl})`)
          return cachedUrl
        }
      }
    } catch (e) {}
    return ''
  })

  // 加载全局壁纸（如果缓存没有或过期）
  useEffect(() => {
    if (!globalWallpaper) {
      fetchBingWallpaper().then(url => {
        setGlobalWallpaper(url)
        document.documentElement.style.setProperty('--global-wallpaper', `url(${url})`)
      })
    }
  }, [globalWallpaper])

  // 更新连续学习天数
  useEffect(() => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (stats.lastStudyDate !== today) {
      let newStreak = stats.streak
      if (stats.lastStudyDate === yesterday) {
        newStreak = stats.streak + 1
      } else if (stats.lastStudyDate !== today) {
        newStreak = 1
      }
      
      const newStats = {
        ...stats,
        streak: newStreak,
        lastStudyDate: today
      }
      setStats(newStats)
      saveStats(newStats)
    }
  }, [])

  const [isCustomBook, setIsCustomBook] = useState(false)
  const [currentBookConfig, setCurrentBookConfig] = useState(null)

  const handleBookSelect = (bookId, isCustom = false, bookConfig = null) => {
    if (bookId === 'stats') {
      setView('stats')
    } else if (bookId === 'profile') {
      setView('profile')
    } else if (bookId === 'calendar') {
      setView('calendar')
    } else if (bookId === 'change-book') {
      setView('book-list')
    } else if (bookId === 'review') {
      // 获取需要复习的单词
      let reviewWords = []
      
      // 从所有词汇书获取需要复习的单词
      const allBooks = wordBookCategories.flatMap(cat => cat.books)
      allBooks.forEach(book => {
        const words = getBookWords(book.id, false, book)
        const needReview = words.filter(w => needsReview(progress[w.id]))
        reviewWords = [...reviewWords, ...needReview]
      })
      
      // 从自定义词汇书获取
      allBooks.filter(b => b.isCustom).forEach(book => {
        const customWords = getCustomWords(book.id)
        const needReview = customWords.filter(w => needsReview(progress[w.id]))
        reviewWords = [...reviewWords, ...needReview]
      })
      
      if (reviewWords.length > 0) {
        setStudyWords(reviewWords.slice(0, 30))
        setView('learn')
      } else {
        alert('暂无需要复习的单词')
      }
    } else if (bookId === 'collection') {
      setView('collection')
    } else if (bookId === 'dashboard') {
      setView('dashboard')
    } else if (bookId === 'learn-direct') {
      // 直接开始学习，使用默认词书
      const settings = getSettings()
      const defaultBook = wordBookCategories[0]?.books[0]
      if (defaultBook) {
        const bookWords = getBookWords(defaultBook.id, false, defaultBook)
        const unlearnedWords = bookWords
          .filter(w => !progress[w.id] || progress[w.id].level === 0)
          .slice(0, settings.dailyGoal)
        if (unlearnedWords.length > 0) {
          setSelectedBook(defaultBook.id)
          setCurrentBookConfig(defaultBook)
          setStudyWords(unlearnedWords)
          setView('learn')
        } else {
          alert('恭喜！你已学完所有单词')
        }
      }
    } else {
      setSelectedBook(bookId)
      setIsCustomBook(isCustom)
      setCurrentBookConfig(bookConfig)
      setView('modes')
    }
  }

  const handleModeSelect = (mode) => {
    const settings = getSettings()
    let words = []
    
    // 获取当前词汇书的单词
    const bookWords = getBookWords(selectedBook, isCustomBook, currentBookConfig)

    if (mode === 'learn') {
      // 获取未学习的单词
      words = bookWords
        .filter(w => !progress[w.id] || progress[w.id].level === 0)
        .slice(0, settings.dailyGoal)
    } else if (mode === 'review') {
      // 获取需要复习的单词
      words = bookWords
        .filter(w => needsReview(progress[w.id]))
        .slice(0, 30)
    } else if (mode === 'test' || mode === 'sprint') {
      // 随机选择已学单词测试
      words = bookWords
        .filter(w => progress[w.id] && progress[w.id].level > 0)
        .sort(() => Math.random() - 0.5)
        .slice(0, mode === 'sprint' ? 20 : 30)
    }

    if (words.length === 0) {
      if (mode === 'learn') {
        alert('恭喜！你已经学完所有单词')
      } else {
        alert('没有可用的单词，请先学习一些新单词')
      }
      return
    }

    setStudyWords(words)
    setView(mode === 'test' || mode === 'sprint' ? 'test' : 'learn')
  }

  const handleComplete = (count) => {
    setLearnedCount(count)
    setView('complete')
  }

  const handleStudyCollection = (words) => {
    setStudyWords(words)
    setView('learn')
  }

  const settings = getSettings()

  // 渲染不同视图
  switch (view) {
    case 'books':
      return (
        <HomePage 
          onSelect={handleBookSelect}
          progress={progress}
          stats={stats}
          settings={settings}
        />
      )
    
    case 'dashboard':
      return (
        <Dashboard 
          stats={stats}
          progress={progress}
          onSelect={handleBookSelect}
          onBack={() => setView('books')}
        />
      )
    
    case 'modes':
      return (
        <StudyModeSelector 
          bookId={selectedBook}
          isCustomBook={isCustomBook}
          onSelect={handleModeSelect}
          onBack={() => setView('books')}
        />
      )
    
    case 'learn':
      return (
        <ImmersiveLearning 
          words={studyWords}
          bookId={selectedBook}
          onComplete={handleComplete}
          onBack={() => setView('books')}
          progress={progress}
          setProgress={setProgress}
          stats={stats}
          setStats={setStats}
        />
      )
    
    case 'test':
      return (
        <WordTest 
          words={studyWords}
          onComplete={handleComplete}
          onBack={() => setView('modes')}
          progress={progress}
          setProgress={setProgress}
        />
      )
    
    case 'stats':
      return (
        <StudyStats 
          stats={stats}
          progress={progress}
          onBack={() => setView('books')}
        />
      )
    
    case 'collection':
      return (
        <CollectionPage 
          progress={progress}
          onBack={() => setView('books')}
          onStudy={handleStudyCollection}
          onSelect={handleBookSelect}
        />
      )
    
    case 'complete':
      return (
        <CompletionPage 
          learnedCount={learnedCount}
          onBack={() => setView('books')}
          onContinue={() => setView('modes')}
        />
      )
    
    case 'profile':
      return (
        <ProfilePage 
          stats={stats}
          progress={progress}
          onBack={() => setView('books')}
          onNavigate={(page) => {
            if (page === 'study-settings') setView('study-settings')
            else if (page === 'more') setView('stats')
            else if (page === 'appearance') alert('外观设置功能开发中...')
          }}
        />
      )
    
    case 'study-settings':
      return (
        <StudySettingsPage 
          settings={settings}
          onSave={(newSettings) => saveSettings(newSettings)}
          onBack={() => setView('profile')}
        />
      )
    
    case 'calendar':
      return (
        <CalendarPage 
          stats={stats}
          onBack={() => setView('books')}
        />
      )
    
    case 'book-list':
      return (
        <BookListPage 
          wordBookCategories={wordBookCategories}
          progress={progress}
          onSelectBook={(book) => {
            setSelectedBook(book.id)
            setCurrentBookConfig(book)
            setView('books')
          }}
          onBack={() => setView('books')}
        />
      )
    
    default:
      return null
  }
}
