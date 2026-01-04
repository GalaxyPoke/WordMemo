/**
 * 词库数据处理脚本
 * 将 dict 项目的丰富数据整合到项目中使用
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解压并处理考研词库
const bookDir = path.join(__dirname, 'book');
const outputDir = path.join(__dirname, '..', 'vocabulary');

// 需要处理的词库文件
const targetBooks = [
  { zip: 'KaoYan_2', name: '考研核心' },
  { zip: 'CET4_3', name: '四级' },
  { zip: 'CET6_3', name: '六级' },
];

// 创建词库索引（按单词查询）
function createWordIndex(jsonData) {
  const index = {};
  
  jsonData.forEach(item => {
    const word = item.headWord.toLowerCase();
    const content = item.content?.word?.content || {};
    
    index[word] = {
      word: item.headWord,
      // 音标
      usphone: content.usphone || content.phone,
      ukphone: content.ukphone,
      // 释义
      trans: content.trans?.map(t => ({
        pos: t.pos,
        cn: t.tranCn,
        en: t.tranOther
      })) || [],
      // 例句
      sentences: content.sentence?.sentences?.map(s => ({
        en: s.sContent,
        cn: s.sCn
      })) || [],
      // 词组短语
      phrases: content.phrase?.phrases?.map(p => ({
        phrase: p.pContent,
        meaning: p.pCn
      })) || [],
      // 同近义词
      synonyms: content.syno?.synos?.flatMap(s => 
        s.hwds?.map(h => h.w) || []
      ) || [],
      // 反义词
      antonyms: content.antos?.anto?.map(a => a.hwd) || [],
      // 词根记忆
      memory: content.remMethod?.val || null,
      // 同根词/派生词
      relatedWords: content.relWord?.rels?.flatMap(r => 
        r.words?.map(w => ({ word: w.hwd, meaning: w.tran, pos: r.pos })) || []
      ) || [],
      // 考试真题
      exams: content.exam?.map(e => ({
        question: e.question,
        choices: e.choices?.map(c => c.choice) || [],
        answer: e.answer?.rightIndex,
        explain: e.answer?.explain
      })) || []
    };
  });
  
  return index;
}

// 处理单个词库文件
function processBook(bookName) {
  const jsonPath = path.join(bookDir, bookName, `${bookName}.json`);
  
  if (!fs.existsSync(jsonPath)) {
    console.log(`跳过 ${bookName}: 文件不存在`);
    return null;
  }
  
  console.log(`处理 ${bookName}...`);
  
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  // 每行是一个JSON对象
  const lines = rawData.trim().split('\n');
  const jsonData = lines.map(line => JSON.parse(line));
  
  console.log(`  - 共 ${jsonData.length} 个单词`);
  
  return createWordIndex(jsonData);
}

// 主函数
function main() {
  const allWords = {};
  
  // 处理已解压的词库
  const dirs = fs.readdirSync(bookDir).filter(f => 
    fs.statSync(path.join(bookDir, f)).isDirectory()
  );
  
  dirs.forEach(dir => {
    const index = processBook(dir);
    if (index) {
      Object.assign(allWords, index);
    }
  });
  
  console.log(`\n总计: ${Object.keys(allWords).length} 个单词`);
  
  // 保存整合后的词库
  const outputPath = path.join(outputDir, 'enriched-words.json');
  fs.writeFileSync(outputPath, JSON.stringify(allWords, null, 2), 'utf8');
  console.log(`已保存到: ${outputPath}`);
  
  // 同时生成一个轻量版（只包含常用字段）
  const lightIndex = {};
  Object.entries(allWords).forEach(([word, data]) => {
    lightIndex[word] = {
      p: data.usphone, // 音标
      s: data.sentences.slice(0, 2), // 最多2个例句
      ph: data.phrases.slice(0, 5), // 最多5个词组
      m: data.memory, // 词根记忆
      r: data.relatedWords.slice(0, 3), // 最多3个派生词
    };
  });
  
  const lightPath = path.join(outputDir, 'enriched-words-light.json');
  fs.writeFileSync(lightPath, JSON.stringify(lightIndex), 'utf8');
  console.log(`轻量版已保存到: ${lightPath}`);
}

main();
