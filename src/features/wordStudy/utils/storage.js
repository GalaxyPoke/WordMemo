// 学习状态存储管理

const STORAGE_KEY = 'bubei_word_progress'
const SETTINGS_KEY = 'bubei_settings'
const STATS_KEY = 'bubei_stats'

// 获取学习进度
export function getProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

// 保存学习进度
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.warn('保存进度失败:', e)
  }
}

// 获取设置
export function getSettings() {
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
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('保存设置失败:', e)
  }
}

// 获取统计数据
export function getStats() {
  try {
    const saved = localStorage.getItem(STATS_KEY)
    return saved ? JSON.parse(saved) : {
      totalLearned: 0,
      totalReviewed: 0,
      streak: 0,
      lastStudyDate: null,
      dailyHistory: {},
      totalTime: 0
    }
  } catch {
    return { totalLearned: 0, totalReviewed: 0, streak: 0, lastStudyDate: null, dailyHistory: {}, totalTime: 0 }
  }
}

// 保存统计数据
export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (e) {
    console.warn('保存统计失败:', e)
  }
}

// 获取后台上传的自定义词汇书
export function getCustomWordBooks() {
  try {
    const data = localStorage.getItem('admin_word_books')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 获取自定义词汇书的单词
export function getCustomWords(bookId) {
  try {
    const data = localStorage.getItem(`admin_custom_words_${bookId}`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
