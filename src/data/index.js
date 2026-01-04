// 真题数据索引文件
// 导入各考试类型的真题数据

import { kaoyanData } from './kaoyan/index.js'
import { cet4Data } from './cet4.js'
import { cet6Data } from './cet6.js'
import { temData } from './tem.js'

// 统一导出所有数据
export { kaoyanData, cet4Data, cet6Data, temData }

// 根据考试类型、年份、套数获取试卷
export function getPaper(type, year, set) {
  const dataMap = {
    kaoyan: kaoyanData,
    cet4: cet4Data,
    cet6: cet6Data,
    tem: temData
  }
  
  const data = dataMap[type]
  if (!data || !data[year] || !data[year][set]) {
    return null
  }
  
  return data[year][set]
}
