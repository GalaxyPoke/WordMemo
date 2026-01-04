/**
 * 本地词库服务
 * 使用丰富的本地数据，秒开无加载
 */

// 直接导入词库数据（Vite 支持）
import enrichedWordsData from '../data/vocabulary/enriched-words-light.json';

// 词库数据
let enrichedWords = enrichedWordsData;

// 加载丰富词库
async function loadEnrichedWords() {
  console.log(`本地词库已加载: ${Object.keys(enrichedWords).length} 词`);
  return enrichedWords;
}

/**
 * 获取单词的丰富数据
 * @param {string} word - 单词
 * @returns {Object|null} 单词数据
 */
export async function getEnrichedWordData(word) {
  const dict = await loadEnrichedWords();
  const key = word.toLowerCase();
  
  if (!dict[key]) return null;
  
  const data = dict[key];
  return {
    phonetic: data.p || null,
    examples: data.s?.map(s => ({
      sentence: s.en,
      translation: s.cn
    })) || [],
    collocations: data.ph?.map(p => ({
      phrase: p.phrase,
      meaning: p.meaning
    })) || [],
    memory: data.m || null,
    relatedWords: data.r?.map(r => ({
      word: r.word,
      meaning: r.meaning,
      pos: r.pos
    })) || []
  };
}

/**
 * 检查单词是否有丰富数据
 */
export async function hasEnrichedData(word) {
  const dict = await loadEnrichedWords();
  return !!dict[word.toLowerCase()];
}

/**
 * 同步获取（需要先调用 loadEnrichedWords）
 */
export function getEnrichedWordDataSync(word) {
  if (!enrichedWords) return null;
  const key = word.toLowerCase();
  
  if (!enrichedWords[key]) return null;
  
  const data = enrichedWords[key];
  return {
    phonetic: data.p || null,
    examples: data.s?.map(s => ({
      sentence: s.en,
      translation: s.cn
    })) || [],
    collocations: data.ph?.map(p => ({
      phrase: p.phrase,
      meaning: p.meaning
    })) || [],
    memory: data.m || null,
    relatedWords: data.r?.map(r => ({
      word: r.word,
      meaning: r.meaning,
      pos: r.pos
    })) || []
  };
}

// 预加载词库
loadEnrichedWords();

export default {
  getEnrichedWordData,
  getEnrichedWordDataSync,
  hasEnrichedData,
  loadEnrichedWords
};
