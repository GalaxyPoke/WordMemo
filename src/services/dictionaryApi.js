// 词典API服务
// 使用 Free Dictionary API (https://dictionaryapi.dev/)

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'

// 缓存已查询的单词
const wordCache = new Map()

/**
 * 从Free Dictionary API获取单词详情
 * @param {string} word - 要查询的单词
 * @returns {Promise<Object>} 单词详情
 */
export async function fetchWordDetails(word) {
  // 检查缓存
  if (wordCache.has(word.toLowerCase())) {
    return wordCache.get(word.toLowerCase())
  }

  try {
    const response = await fetch(`${DICTIONARY_API_BASE}/${word.toLowerCase()}`)
    
    if (!response.ok) {
      throw new Error(`Word not found: ${word}`)
    }

    const data = await response.json()
    const result = parseApiResponse(data, word)
    
    // 存入缓存
    wordCache.set(word.toLowerCase(), result)
    
    return result
  } catch (error) {
    console.error(`Failed to fetch word details for "${word}":`, error)
    return null
  }
}

/**
 * 解析API响应，转换为我们需要的格式
 */
function parseApiResponse(data, originalWord) {
  if (!data || !data[0]) return null

  const entry = data[0]
  
  // 提取音标
  const phonetics = entry.phonetics || []
  const phonetic = phonetics.find(p => p.text)?.text || ''
  const audioUrl = phonetics.find(p => p.audio)?.audio || ''

  // 提取释义
  const meanings = []
  const allDefinitions = []
  const synonyms = new Set()
  const antonyms = new Set()

  entry.meanings?.forEach(meaning => {
    const pos = getPosAbbreviation(meaning.partOfSpeech)
    
    meaning.definitions?.forEach((def, index) => {
      // 只取每个词性的前2个释义
      if (index < 2) {
        meanings.push({
          pos,
          definition: def.definition,
          example: def.example || null
        })
      }
      
      allDefinitions.push({
        pos,
        definition: def.definition,
        example: def.example || null
      })

      // 收集同义词和反义词
      def.synonyms?.forEach(s => synonyms.add(s))
      def.antonyms?.forEach(a => antonyms.add(a))
    })

    // 词性级别的同义词和反义词
    meaning.synonyms?.forEach(s => synonyms.add(s))
    meaning.antonyms?.forEach(a => antonyms.add(a))
  })

  // 提取例句
  const examples = allDefinitions
    .filter(d => d.example)
    .slice(0, 3)
    .map(d => ({
      sentence: d.example,
      translation: '', // API不提供翻译
      source: 'Dictionary'
    }))

  // 生成词组搭配（从同义词和例句中提取常见搭配）
  const collocations = generateCollocations(originalWord, allDefinitions, Array.from(synonyms))

  return {
    word: entry.word || originalWord,
    phonetic,
    audioUrl,
    meanings: meanings.slice(0, 4), // 最多4个释义
    examples,
    collocations,
    synonyms: Array.from(synonyms).slice(0, 6),
    antonyms: Array.from(antonyms).slice(0, 4),
    allDefinitions // 保留完整释义供详情页使用
  }
}

/**
 * 词性缩写转换
 */
function getPosAbbreviation(partOfSpeech) {
  const posMap = {
    'noun': 'n.',
    'verb': 'v.',
    'adjective': 'adj.',
    'adverb': 'adv.',
    'pronoun': 'pron.',
    'preposition': 'prep.',
    'conjunction': 'conj.',
    'interjection': 'int.',
    'exclamation': 'excl.'
  }
  return posMap[partOfSpeech?.toLowerCase()] || partOfSpeech || ''
}

/**
 * 生成词组搭配
 */
function generateCollocations(word, definitions, synonyms) {
  const collocations = []
  
  // 从例句中提取包含该单词的短语
  definitions.forEach(def => {
    if (def.example) {
      const phrase = extractPhrase(def.example, word)
      if (phrase && phrase !== word) {
        collocations.push({
          phrase,
          meaning: '' // 需要翻译API
        })
      }
    }
  })

  // 添加一些常见搭配模式
  const commonPatterns = getCommonPatterns(word, definitions[0]?.pos)
  collocations.push(...commonPatterns)

  // 去重并限制数量
  const uniqueCollocations = []
  const seen = new Set()
  
  for (const col of collocations) {
    const key = col.phrase.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueCollocations.push(col)
    }
    if (uniqueCollocations.length >= 4) break
  }

  return uniqueCollocations
}

/**
 * 从例句中提取短语
 */
function extractPhrase(sentence, word) {
  const wordLower = word.toLowerCase()
  const sentenceLower = sentence.toLowerCase()
  const index = sentenceLower.indexOf(wordLower)
  
  if (index === -1) return null

  // 提取单词前后的2-3个词
  const words = sentence.split(/\s+/)
  const wordIndex = words.findIndex(w => 
    w.toLowerCase().includes(wordLower)
  )
  
  if (wordIndex === -1) return null

  const start = Math.max(0, wordIndex - 1)
  const end = Math.min(words.length, wordIndex + 3)
  
  return words.slice(start, end).join(' ').replace(/[.,!?;:]+$/, '')
}

/**
 * 获取常见搭配模式
 */
function getCommonPatterns(word, pos) {
  const patterns = []
  
  if (pos === 'v.') {
    patterns.push(
      { phrase: `${word} up`, meaning: '' },
      { phrase: `${word} out`, meaning: '' }
    )
  } else if (pos === 'adj.') {
    patterns.push(
      { phrase: `very ${word}`, meaning: '' },
      { phrase: `quite ${word}`, meaning: '' }
    )
  } else if (pos === 'n.') {
    patterns.push(
      { phrase: `a ${word}`, meaning: '' },
      { phrase: `the ${word}`, meaning: '' }
    )
  }

  return patterns.slice(0, 2)
}

/**
 * 批量获取单词详情
 */
export async function fetchMultipleWords(words) {
  const results = await Promise.all(
    words.map(word => fetchWordDetails(word))
  )
  return results.filter(Boolean)
}

/**
 * 播放单词发音
 */
export function playWordAudio(audioUrl) {
  if (!audioUrl) return false
  
  try {
    const audio = new Audio(audioUrl)
    audio.play()
    return true
  } catch (error) {
    console.error('Failed to play audio:', error)
    return false
  }
}

/**
 * 使用有道翻译API获取中文翻译（备用）
 * 注意：这是非官方API，可能不稳定
 */
export async function translateToChineseYoudao(text) {
  try {
    const response = await fetch(
      `https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(text)}`
    )
    const data = await response.json()
    return data.translateResult?.[0]?.[0]?.tgt || ''
  } catch (error) {
    console.error('Translation failed:', error)
    return ''
  }
}

/**
 * 使用免费翻译API获取中文翻译
 */
export async function translateToChinese(text) {
  try {
    // 使用 MyMemory 翻译 API (免费，每天1000次)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`
    )
    const data = await response.json()
    return data.responseData?.translatedText || ''
  } catch (error) {
    console.error('Translation failed:', error)
    return ''
  }
}

export default {
  fetchWordDetails,
  fetchMultipleWords,
  playWordAudio,
  translateToChinese,
  translateToChineseYoudao
}
