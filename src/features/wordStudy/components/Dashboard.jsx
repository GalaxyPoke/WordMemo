import { useState } from 'react'
import { 
  ChevronLeft, ChevronRight, BookOpen, Zap, BarChart3, Clock,
  Target, Star
} from 'lucide-react'

function Dashboard({ 
  progress, 
  stats, 
  settings,
  onSelect,
  onBack
}) {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const currentBook = {
    id: 'kaoyan_core',
    name: '考研核心词汇',
    wordCount: 4801
  }
  
  const bookLearned = Object.keys(progress).filter(
    id => progress[id]?.bookId === currentBook.id
  ).length
  
  const todayStr = new Date().toISOString().split('T')[0]
  const todayLearned = stats.dailyHistory?.[todayStr]?.learned || 0
  const todayReviewed = stats.dailyHistory?.[todayStr]?.reviewed || 0

  const getWeekDays = () => {
    const days = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    
    const dayNames = ['一', '二', '三', '四', '五', '六', '日']
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const isToday = dateStr === todayStr
      const studied = stats.dailyHistory?.[dateStr]?.learned > 0
      days.push({
        dayName: dayNames[i],
        day: date.getDate(),
        dateStr,
        isToday,
        studied
      })
    }
    return days
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <button className="close-btn" onClick={() => setActiveTab('home')}>
          <ChevronLeft size={24} />
        </button>
        <h1>仪表盘</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="current-book-section">
        <div className="section-title">
          <span>正在学习</span>
          <button className="change-book-btn" onClick={() => onSelect('change-book')}>换本词书</button>
        </div>
        
        <div className="current-book-card">
          <div className="book-cover">
            <div className="book-tag">考研</div>
            <div className="book-subtitle">核心词汇</div>
            <div className="book-progress-ring">
              <svg viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#e0e0ff" strokeWidth="6"/>
                <circle 
                  cx="30" cy="30" r="24" fill="none" stroke="#6366f1" strokeWidth="6"
                  strokeDasharray={`${(bookLearned / currentBook.wordCount) * 150} 150`}
                  transform="rotate(-90 30 30)"
                />
              </svg>
            </div>
          </div>
          <div className="book-details">
            <h3>配套真题词组</h3>
            <button className="add-word-btn">+</button>
          </div>
        </div>

        <div className="book-stats-row">
          <div className="book-stat">
            <BookOpen size={16} className="stat-icon" />
            <span>生词本 0</span>
          </div>
        </div>

        <div className="progress-bar-full">
          <div className="progress-fill" style={{ width: `${(bookLearned / currentBook.wordCount) * 100}%` }}></div>
        </div>
        <div className="progress-labels">
          <span>已学习 {bookLearned}</span>
          <span>总词数 {currentBook.wordCount}</span>
        </div>
      </div>

      <div className="my-data-section">
        <h2>我的数据</h2>
        
        <div className="data-card">
          <div className="data-header">
            <span>概览</span>
            <ChevronRight size={18} />
          </div>
          
          <div className="data-grid">
            <div className="data-item">
              <Zap size={16} className="data-icon orange" />
              <span className="data-label">今日学习&复习</span>
              <div className="data-value">
                <strong>{todayLearned + todayReviewed}</strong>
                <span>词</span>
              </div>
            </div>
            <div className="data-item">
              <BarChart3 size={16} className="data-icon purple" />
              <span className="data-label">累计学习</span>
              <div className="data-value">
                <strong>{stats.totalLearned || 0}</strong>
                <span>词</span>
              </div>
            </div>
            <div className="data-item">
              <Clock size={16} className="data-icon green" />
              <span className="data-label">今日总时长</span>
              <div className="data-value">
                <strong>{Math.round((stats.dailyHistory?.[todayStr]?.time || 0) / 60)}</strong>
                <span>分钟</span>
              </div>
            </div>
            <div className="data-item">
              <Clock size={16} className="data-icon red" />
              <span className="data-label">累计时长</span>
              <div className="data-value">
                <strong>{Math.round((stats.totalTime || 0) / 60)}</strong>
                <span>分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-section" onClick={() => onSelect('calendar')}>
        <div className="calendar-header">
          <h2>日历</h2>
          <span className="streak-text">连续签到 {stats.streak} 天 <ChevronRight size={16} /></span>
        </div>
        
        <div className="week-calendar">
          {getWeekDays().map((day, i) => (
            <div key={i} className={`calendar-day ${day.isToday ? 'today' : ''} ${day.studied ? 'studied' : ''}`}>
              <span className="day-name">{day.dayName}</span>
              <span className="day-number">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-nav">
        <button className="nav-item" onClick={() => onBack()}>
          <BookOpen size={22} />
        </button>
        <button className="nav-item active">
          <Target size={22} />
        </button>
        <button className="nav-item" onClick={() => onSelect('collection')}>
          <Star size={22} />
        </button>
      </div>
    </div>
  )
}

export default Dashboard
