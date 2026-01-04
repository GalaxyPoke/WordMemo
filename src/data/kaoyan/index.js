// 考研英语真题数据索引
// 按年份组织，每个年份一个文件夹

import { english1_2025 } from './2025/index.js'

// 汇总所有年份数据
export const kaoyanData = {
  2025: {
    1: english1_2025,
    // 2: english2_2025  // 英语二待添加
  },
  // 2024: { ... }  // 待添加
  // 2023: { ... }  // 待添加
}

// 获取指定年份和类型的试卷
export function getKaoyanPaper(year, set) {
  return kaoyanData[year]?.[set] || null
}
