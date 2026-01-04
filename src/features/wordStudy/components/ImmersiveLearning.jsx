import { useState, useEffect, useCallback } from 'react'
import { 
  ArrowLeft, 
  Volume2, 
  Star, 
  StarOff,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Brain,
  Loader
} from 'lucide-react'
import { getEnrichedWordDataSync } from '../../../services/localDictionary'
import { playWordAudio } from '../../../services/dictionaryApi'
import { 
  handleLearningAnswer, 
  isMastered,
  MASTERY_STAGES
} from '../../../services/fsrsAlgorithm'
import { getSettings, saveProgress, saveStats, isWordMastered, getNextReviewTimeFSRS } from '../utils'

// 沉浸式学习界面 - 不背单词选择题风格
function ImmersiveLearning({ words, bookId, onComplete, onBack, progress, setProgress, stats, setStats }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [options, setOptions] = useState([])
  const [isCollected, setIsCollected] = useState(false)
  const [learnedCount, setLearnedCount] = useState(0)
  const [apiWordData, setApiWordData] = useState(null)
  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const settings = getSettings()

  const currentWord = words[currentIndex]

  // 生成选项
  useEffect(() => {
    if (!currentWord) return

    const correctAnswer = {
      pos: currentWord.meanings[0].pos,
      definition: currentWord.meanings[0].definition,
      isCorrect: true
    }
    
    const wrongAnswers = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => ({
        pos: w.meanings[0].pos,
        definition: w.meanings[0].definition,
        isCorrect: false
      }))

    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5)

    setOptions(allOptions)
    setSelectedOption(null)
    setShowAnswer(false)
  }, [currentIndex, currentWord, words])

  useEffect(() => {
    if (currentWord) {
      const wordProgress = progress[currentWord.id]
      setIsCollected(wordProgress?.collected || false)
    }
  }, [currentIndex, currentWord, progress])

  const handleSelectOption = useCallback(async (option, index) => {
    if (showAnswer) return
    
    setSelectedOption(index)
    setShowAnswer(true)
    
    setIsLoadingApi(false)
    const enrichedData = getEnrichedWordDataSync(currentWord.word)
    if (enrichedData) {
      setApiWordData({
        examples: enrichedData.examples,
        collocations: enrichedData.collocations,
        memory: enrichedData.memory,
        relatedWords: enrichedData.relatedWords
      })
    } else {
      setApiWordData(null)
    }

    const wordProgress = progress[currentWord.id] || null
    const updatedWordProgress = handleLearningAnswer(wordProgress, option.isCorrect, bookId)
    
    const newLevel = updatedWordProgress.card ? 
      (isMastered(updatedWordProgress) ? 1 : 0) : 
      (option.isCorrect ? 1 : 0)
    
    const newProgress = {
      ...progress,
      [currentWord.id]: {
        ...updatedWordProgress,
        level: newLevel,
        nextReview: getNextReviewTimeFSRS(updatedWordProgress),
        lastReview: Date.now(),
        bookId
      }
    }
    
    setProgress(newProgress)
    saveProgress(newProgress)

    const wasNotMastered = !wordProgress || !isWordMastered(wordProgress)
    const isNowMastered = isWordMastered(updatedWordProgress)
    if (wasNotMastered && isNowMastered && option.isCorrect) {
      const today = new Date().toDateString()
      const newStats = {
        ...stats,
        totalLearned: stats.totalLearned + 1,
        dailyHistory: {
          ...stats.dailyHistory,
          [today]: (stats.dailyHistory[today] || 0) + 1
        }
      }
      setStats(newStats)
      saveStats(newStats)
      setLearnedCount(prev => prev + 1)
    }
  }, [currentWord, progress, bookId, stats, showAnswer])

  const toggleCollect = useCallback(() => {
    if (!currentWord) return

    const wordProgress = progress[currentWord.id] || { level: 0, bookId }
    const newProgress = {
      ...progress,
      [currentWord.id]: {
        ...wordProgress,
        collected: !wordProgress.collected,
        bookId
      }
    }
    
    setProgress(newProgress)
    saveProgress(newProgress)
    setIsCollected(!isCollected)
  }, [currentWord, progress, bookId, isCollected])

  const goNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setApiWordData(null)
    } else {
      onComplete(learnedCount)
    }
  }, [currentIndex, words.length, onComplete, learnedCount])

  const handleShowAnswer = useCallback(async () => {
    setShowAnswer(true)
    
    setIsLoadingApi(false)
    const enrichedData = getEnrichedWordDataSync(currentWord.word)
    if (enrichedData) {
      setApiWordData({
        examples: enrichedData.examples,
        collocations: enrichedData.collocations,
        memory: enrichedData.memory,
        relatedWords: enrichedData.relatedWords
      })
    } else {
      setApiWordData(null)
    }
    
    const wordProgress = progress[currentWord.id] || null
    const updatedWordProgress = handleLearningAnswer(wordProgress, false, bookId)
    
    const newProgress = {
      ...progress,
      [currentWord.id]: {
        ...updatedWordProgress,
        level: 0,
        nextReview: getNextReviewTimeFSRS(updatedWordProgress),
        lastReview: Date.now(),
        bookId
      }
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }, [currentWord, progress, bookId])

  const playPronunciation = useCallback(() => {
    if (currentWord && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }, [currentWord])

  if (!currentWord) {
    return (
      <div className="word-study-container">
        <div className="empty-state">
          <BookOpen size={48} />
          <p>没有可学习的单词</p>
          <button onClick={onBack}>返回</button>
        </div>
      </div>
    )
  }

  const playApiAudio = useCallback(() => {
    if (apiWordData?.audioUrl) {
      playWordAudio(apiWordData.audioUrl)
    } else {
      playPronunciation()
    }
  }, [apiWordData, playPronunciation])

  const displayWord = apiWordData ? {
    ...currentWord,
    phonetic: apiWordData.phonetic || currentWord.phonetic,
    meanings: currentWord.meanings,
    examples: apiWordData.examples?.length > 0 ? apiWordData.examples : currentWord.examples,
    collocations: apiWordData.collocations?.length > 0 ? apiWordData.collocations : currentWord.collocations,
    synonyms: apiWordData.synonyms || [],
    antonyms: apiWordData.antonyms || []
  } : currentWord

  // 答案详情界面
  if (showAnswer) {
    return (
      <div className="immersive-learning answer-detail">
        <div className="learning-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="progress-indicator">
            <span>{currentIndex + 1}/{words.length}</span>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <RotateCcw size={18} />
            </button>
            <button 
              className={`header-btn ${isCollected ? 'collected' : ''}`}
              onClick={toggleCollect}
            >
              {isCollected ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
            </button>
          </div>
        </div>

        <div className="answer-content">
          <div className="word-header">
            <h1 className="word-text-large">{displayWord.word}</h1>
            <div className="phonetic-row">
              <span className="phonetic-label">英</span>
              <button className="pronunciation-btn-small" onClick={playApiAudio}>
                <Volume2 size={14} />
              </button>
              <span className="phonetic-text">{displayWord.phonetic}</span>
            </div>
            <p className="word-meaning-main">
              {displayWord.meanings.map((m, i) => (
                <span key={i}>{m.pos} {m.definition}{i < displayWord.meanings.length - 1 ? '；' : ''}</span>
              ))}
            </p>
          </div>

          {isLoadingApi && (
            <div className="loading-indicator">
              <Loader size={20} className="spinning" />
              <span>加载更多内容...</span>
            </div>
          )}

          {displayWord.examples && displayWord.examples.length > 0 && (
            <div className="example-section">
              <div className="example-content">
                <button className="example-audio-btn" onClick={playApiAudio}>
                  <Volume2 size={14} />
                </button>
                <p className="example-en">{displayWord.examples[0].sentence}</p>
              </div>
              <p className="example-cn">{displayWord.examples[0].translation || '加载翻译中...'}</p>
            </div>
          )}

          <div className="collocations-section">
            {displayWord.collocations && displayWord.collocations.length > 0 ? (
              <>
                {displayWord.collocations.map((col, i) => (
                  <div key={i} className="collocation-item">
                    <span className="collocation-en">{col.phrase}</span>
                    <span className="collocation-cn">{col.meaning || '...'}</span>
                  </div>
                ))}
                <button className="more-collocations">
                  学习所有考研真题词组 <ChevronRight size={14} />
                </button>
              </>
            ) : (
              <p className="no-collocations">{isLoadingApi ? '加载中...' : '暂无词组搭配'}</p>
            )}
          </div>

          {apiWordData?.memory && (
            <div className="memory-section">
              <div className="memory-header">
                <Brain size={16} />
                <span>词根记忆</span>
              </div>
              <p className="memory-content">{apiWordData.memory}</p>
            </div>
          )}

          {apiWordData?.relatedWords?.length > 0 && (
            <div className="related-words-section">
              <div className="related-header">
                <span>派生词</span>
              </div>
              <div className="related-words-list">
                {apiWordData.relatedWords.map((rel, i) => (
                  <div key={i} className="related-word-item">
                    <span className="related-word">{rel.word}</span>
                    <span className="related-pos">{rel.pos}</span>
                    <span className="related-meaning">{rel.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(displayWord.synonyms?.length > 0 || displayWord.antonyms?.length > 0) && (
            <div className="synonyms-section">
              {displayWord.synonyms?.length > 0 && (
                <div className="synonym-row">
                  <span className="synonym-label">近义词</span>
                  <span className="synonym-words">{displayWord.synonyms.join(', ')}</span>
                </div>
              )}
              {displayWord.antonyms?.length > 0 && (
                <div className="synonym-row">
                  <span className="synonym-label">反义词</span>
                  <span className="synonym-words">{displayWord.antonyms.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          <div className="bottom-tabs">
            <button className="tab-btn active">词组搭配</button>
            <button className="tab-btn">派生</button>
            <button className="tab-btn">近义</button>
          </div>
        </div>

        <div className="answer-footer">
          <button className="next-word-btn" onClick={goNext}>
            下一词
          </button>
        </div>
      </div>
    )
  }

  // 选择题界面
  return (
    <div className="immersive-learning">
      <div className="learning-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="progress-indicator">
          <span>{currentIndex + 1}/{words.length}</span>
          <div className="mini-progress">
            <div 
              className="mini-progress-fill" 
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>
        <button 
          className={`collect-btn ${isCollected ? 'collected' : ''}`}
          onClick={toggleCollect}
        >
          {isCollected ? <Star size={20} fill="currentColor" /> : <StarOff size={20} />}
        </button>
      </div>

      <div className="word-card-main">
        <div className="word-display">
          <h1 className="word-text">{currentWord.word}</h1>
          {(() => {
            const wordProg = progress[currentWord.id]
            const streak = wordProg?.correctStreak || 0
            const mastered = isWordMastered(wordProg)
            return !mastered && (
              <div className="inline-stage-dots">
                {[...Array(MASTERY_STAGES)].map((_, i) => (
                  <span key={i} className={`stage-dot ${i < streak ? 'filled' : ''}`} />
                ))}
              </div>
            )
          })()}
        </div>
        
        {settings.showPhonetic && (
          <p className="word-phonetic">
            <button className="pronunciation-btn" onClick={playPronunciation}>
              <Volume2 size={14} />
            </button>
            {currentWord.phonetic}
          </p>
        )}

        <p className="test-hint">先回想词义再选择，想不起来「看答案」</p>

        <div className="test-options">
          {options.map((option, index) => (
            <button
              key={index}
              className="test-option"
              onClick={() => handleSelectOption(option, index)}
            >
              <span className="option-pos">{option.pos}</span>
              <span>{option.definition}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="learning-footer">
        <button className="show-answer-btn" onClick={handleShowAnswer}>
          看答案
        </button>
      </div>
    </div>
  )
}

export default ImmersiveLearning
