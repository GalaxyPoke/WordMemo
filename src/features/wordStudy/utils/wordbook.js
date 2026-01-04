// 词汇书管理工具

import { kaoyanWords, wordBooks as defaultWordBooks, ecdictWords, wordBookCategories } from '../../../data/vocabulary/kaoyanWords'
import { getCustomWordBooks, getCustomWords } from './storage'

// 合并默认词汇书和自定义词汇书
export function getAllWordBooks() {
  const customBooks = getCustomWordBooks().map(book => ({
    ...book,
    isCustom: true
  }))
  return [...defaultWordBooks, ...customBooks]
}

// 获取词汇书的单词
export function getBookWords(bookId, isCustom = false, bookConfig = null) {
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
export const REVIEW_INTERVALS = [
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
export function getNextReviewTimeFSRS(wordProgress) {
  if (!wordProgress || !wordProgress.card || !wordProgress.card.due) {
    return Date.now() + 5 * 60 * 1000 // 默认5分钟后
  }
  return new Date(wordProgress.card.due).getTime()
}

// 检查单词是否已掌握
export function isWordMastered(wordProgress) {
  if (!wordProgress) return false
  return wordProgress.correctStreak >= 3
}

// 重新导出词汇书数据
export { kaoyanWords, defaultWordBooks, ecdictWords, wordBookCategories }
