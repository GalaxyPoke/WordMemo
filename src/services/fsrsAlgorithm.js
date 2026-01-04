/**
 * FSRS (Free Spaced Repetition Scheduler) 算法实现
 * 基于 open-spaced-repetition/fsrs4anki 项目
 * 这是目前最精确的开源间隔重复算法，已被 Anki 官方采纳
 */

// FSRS 默认参数（基于大规模用户数据训练得出）
const DEFAULT_PARAMETERS = {
  w: [
    0.4,    // w0: 初始稳定性（首次学习后）
    0.6,    // w1: 初始稳定性增量
    2.4,    // w2: 初始难度
    5.8,    // w3: 难度变化因子
    4.93,   // w4: 稳定性增长基数
    0.94,   // w5: 稳定性增长难度因子
    0.86,   // w6: 稳定性增长可提取性因子
    0.01,   // w7: 稳定性衰减因子（答错时）
    1.49,   // w8: 稳定性恢复因子
    0.14,   // w9: 稳定性恢复可提取性因子
    0.94,   // w10: 难度变化因子
    2.18,   // w11: 难度初始化因子
    0.05,   // w12: 难度最小衰减
    0.34,   // w13: 短期稳定性增长
    1.26,   // w14: 短期稳定性因子
    0.29,   // w15: 遗忘后难度惩罚
    2.61,   // w16: 遗忘后稳定性恢复
  ],
  requestRetention: 0.9,  // 期望记忆保持率
  maximumInterval: 36500, // 最大复习间隔（天）
  enableFuzz: true,       // 启用随机偏移，避免同一天复习过多
}

// 评分等级
export const Rating = {
  Again: 1,   // 完全不记得
  Hard: 2,    // 很难想起来
  Good: 3,    // 想起来了
  Easy: 4,    // 太简单了
}

// 卡片状态
export const State = {
  New: 0,       // 新卡片
  Learning: 1,  // 学习中（首次学习阶段）
  Review: 2,    // 复习中（已掌握，进入长期复习）
  Relearning: 3 // 重新学习（复习时忘记了）
}

/**
 * 创建新卡片
 */
export function createCard() {
  return {
    due: new Date(),           // 下次复习时间
    stability: 0,              // 记忆稳定性
    difficulty: 0,             // 难度 (1-10)
    elapsedDays: 0,            // 距上次复习的天数
    scheduledDays: 0,          // 计划的复习间隔
    reps: 0,                   // 复习次数
    lapses: 0,                 // 遗忘次数
    state: State.New,          // 当前状态
    lastReview: null,          // 上次复习时间
    // 学习阶段专用
    learningStage: 0,          // 当前学习阶段 (0-3)
    correctStreak: 0,          // 连续答对次数
  }
}

/**
 * FSRS 调度器类
 */
export class FSRS {
  constructor(params = {}) {
    this.p = { ...DEFAULT_PARAMETERS, ...params }
  }

  /**
   * 计算可提取性（回忆概率）
   * R(t) = (1 + t/(9*S))^(-1)
   */
  retrievability(card, now = new Date()) {
    if (card.state === State.New) return 0
    const elapsedDays = (now - new Date(card.lastReview)) / (1000 * 60 * 60 * 24)
    return Math.pow(1 + elapsedDays / (9 * card.stability), -1)
  }

  /**
   * 计算初始难度
   */
  initDifficulty(rating) {
    const w = this.p.w
    return Math.min(10, Math.max(1, 
      w[2] + (rating - 3) * w[3]
    ))
  }

  /**
   * 计算初始稳定性
   */
  initStability(rating) {
    const w = this.p.w
    return Math.max(0.1, w[rating - 1])
  }

  /**
   * 计算下一个难度值
   */
  nextDifficulty(d, rating) {
    const w = this.p.w
    const nextD = d - w[10] * (rating - 3)
    return Math.min(10, Math.max(1, 
      w[11] * Math.pow(d, 1) * (1 - Math.exp(-nextD / w[11])) + nextD * Math.exp(-nextD / w[11])
    ))
  }

  /**
   * 计算复习后的稳定性（答对时）
   */
  nextRecallStability(d, s, r, rating) {
    const w = this.p.w
    const hardPenalty = rating === Rating.Hard ? w[13] : 1
    const easyBonus = rating === Rating.Easy ? w[14] : 1
    
    return s * (
      1 +
      Math.exp(w[4]) *
      (11 - d) *
      Math.pow(s, -w[5]) *
      (Math.exp((1 - r) * w[6]) - 1) *
      hardPenalty *
      easyBonus
    )
  }

  /**
   * 计算遗忘后的稳定性（答错时）
   */
  nextForgetStability(d, s, r) {
    const w = this.p.w
    return Math.max(0.1,
      w[7] *
      Math.pow(d, -w[8]) *
      (Math.pow(s + 1, w[9]) - 1) *
      Math.exp((1 - r) * w[16])
    )
  }

  /**
   * 计算下次复习间隔
   */
  nextInterval(s) {
    const interval = (s / 0.9) * (Math.pow(this.p.requestRetention, 1 / -0.5) - 1)
    let result = Math.min(Math.max(1, Math.round(interval)), this.p.maximumInterval)
    
    // 添加随机偏移，避免大量卡片同一天到期
    if (this.p.enableFuzz && result >= 2.5) {
      const fuzz = result * 0.05
      result = Math.round(result + (Math.random() * 2 - 1) * fuzz)
    }
    
    return result
  }

  /**
   * 核心调度函数：根据评分更新卡片
   */
  schedule(card, rating, now = new Date()) {
    const newCard = { ...card }
    newCard.reps++
    newCard.lastReview = now

    if (card.state === State.New) {
      // 新卡片：初始化稳定性和难度
      newCard.difficulty = this.initDifficulty(rating)
      newCard.stability = this.initStability(rating)
      
      if (rating === Rating.Again) {
        newCard.state = State.Learning
        newCard.scheduledDays = 0
        newCard.due = new Date(now.getTime() + 1 * 60 * 1000) // 1分钟后
      } else if (rating === Rating.Hard) {
        newCard.state = State.Learning
        newCard.scheduledDays = 0
        newCard.due = new Date(now.getTime() + 5 * 60 * 1000) // 5分钟后
      } else if (rating === Rating.Good) {
        newCard.state = State.Learning
        newCard.scheduledDays = 0
        newCard.due = new Date(now.getTime() + 10 * 60 * 1000) // 10分钟后
      } else {
        // Easy: 直接进入复习阶段
        newCard.state = State.Review
        const interval = this.nextInterval(newCard.stability)
        newCard.scheduledDays = interval
        newCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
      }
    } else if (card.state === State.Learning || card.state === State.Relearning) {
      // 学习/重学阶段
      if (rating === Rating.Again) {
        newCard.scheduledDays = 0
        newCard.due = new Date(now.getTime() + 5 * 60 * 1000) // 5分钟后
      } else if (rating === Rating.Hard) {
        newCard.scheduledDays = 0
        newCard.due = new Date(now.getTime() + 10 * 60 * 1000) // 10分钟后
      } else {
        // Good 或 Easy: 进入复习阶段
        newCard.state = State.Review
        const interval = this.nextInterval(newCard.stability)
        newCard.scheduledDays = interval
        newCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
      }
    } else {
      // 复习阶段
      const elapsedDays = (now - new Date(card.lastReview)) / (1000 * 60 * 60 * 24)
      const r = this.retrievability(card, now)
      
      newCard.difficulty = this.nextDifficulty(card.difficulty, rating)
      
      if (rating === Rating.Again) {
        // 忘记了
        newCard.lapses++
        newCard.stability = this.nextForgetStability(card.difficulty, card.stability, r)
        newCard.state = State.Relearning
        newCard.scheduledDays = 0
        newCard.due = new Date(now.getTime() + 5 * 60 * 1000) // 5分钟后
      } else {
        // 记得
        newCard.stability = this.nextRecallStability(card.difficulty, card.stability, r, rating)
        const interval = this.nextInterval(newCard.stability)
        newCard.scheduledDays = interval
        newCard.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
      }
      
      newCard.elapsedDays = elapsedDays
    }

    return newCard
  }
}

// ============ 多阶段学习机制（仿不背单词） ============

// 学习阶段配置
export const LEARNING_STAGES = [
  { type: 'word_to_meaning', name: '看词选义', description: '看英文选中文' },
  { type: 'word_to_meaning_2', name: '再次确认', description: '换一组选项' },
  { type: 'meaning_to_word', name: '看义选词', description: '看中文选英文' },
  { type: 'spelling', name: '拼写练习', description: '拼写单词' },
]

// 需要连续答对的阶段数（答错重置）
export const MASTERY_STAGES = 3 // 答对3个阶段即可进入复习

/**
 * 处理学习阶段答题
 * @param {Object} wordProgress - 单词进度
 * @param {boolean} isCorrect - 是否答对
 * @param {string} bookId - 词书ID
 * @returns {Object} 更新后的进度
 */
export function handleLearningAnswer(wordProgress, isCorrect, bookId) {
  const fsrs = new FSRS()
  const now = new Date()
  
  // 初始化进度
  if (!wordProgress || !wordProgress.card) {
    wordProgress = {
      card: createCard(),
      learningStage: 0,
      correctStreak: 0,
      bookId,
      totalCorrect: 0,
      totalWrong: 0,
    }
  }

  const progress = { ...wordProgress }
  
  if (progress.card.state === State.New || progress.card.state === State.Learning) {
    // 【学习阶段】还未掌握
    if (isCorrect) {
      progress.correctStreak++
      progress.totalCorrect++
      progress.learningStage++
      
      if (progress.correctStreak >= MASTERY_STAGES) {
        // 🎉 达到阈值，正式掌握！使用 FSRS 调度
        progress.card = fsrs.schedule(progress.card, Rating.Good, now)
        progress.masteredAt = now.toISOString()
        progress.learningStage = 0
        progress.correctStreak = 0
      }
    } else {
      // ❌ 答错，连续次数和阶段重置
      progress.correctStreak = 0
      progress.learningStage = 0
      progress.totalWrong++
      progress.card = fsrs.schedule(progress.card, Rating.Again, now)
    }
  } else {
    // 【复习阶段】已掌握
    progress.totalCorrect += isCorrect ? 1 : 0
    progress.totalWrong += isCorrect ? 0 : 1
    
    const rating = isCorrect ? Rating.Good : Rating.Again
    progress.card = fsrs.schedule(progress.card, rating, now)
  }

  return progress
}

/**
 * 检查单词是否需要复习
 */
export function needsReview(wordProgress) {
  if (!wordProgress || !wordProgress.card) return false
  if (wordProgress.card.state === State.New) return false
  return new Date() >= new Date(wordProgress.card.due)
}

/**
 * 检查单词是否已掌握（进入复习阶段）
 */
export function isMastered(wordProgress) {
  if (!wordProgress || !wordProgress.card) return false
  return wordProgress.card.state === State.Review || wordProgress.card.state === State.Relearning
}

/**
 * 获取当前学习阶段信息
 */
export function getCurrentStage(wordProgress) {
  if (!wordProgress) return LEARNING_STAGES[0]
  const stageIndex = Math.min(wordProgress.learningStage || 0, LEARNING_STAGES.length - 1)
  return LEARNING_STAGES[stageIndex]
}

/**
 * 获取学习进度百分比
 */
export function getLearningProgress(wordProgress) {
  if (!wordProgress) return 0
  if (isMastered(wordProgress)) return 100
  return Math.round((wordProgress.correctStreak || 0) / MASTERY_STAGES * 100)
}

/**
 * 格式化下次复习时间
 */
export function formatNextReview(wordProgress) {
  if (!wordProgress || !wordProgress.card || !wordProgress.card.due) return '未学习'
  
  const due = new Date(wordProgress.card.due)
  const now = new Date()
  const diffMs = due - now
  
  if (diffMs <= 0) return '现在'
  
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}分钟后`
  if (diffHours < 24) return `${diffHours}小时后`
  if (diffDays < 30) return `${diffDays}天后`
  return `${Math.floor(diffDays / 30)}个月后`
}

export default {
  FSRS,
  Rating,
  State,
  createCard,
  handleLearningAnswer,
  needsReview,
  isMastered,
  getCurrentStage,
  getLearningProgress,
  formatNextReview,
  LEARNING_STAGES,
  MASTERY_STAGES,
}
