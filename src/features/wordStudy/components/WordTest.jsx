import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'

const REVIEW_INTERVALS = [0, 1, 3, 7, 15, 30, 60]

function getNextReviewTime(level) {
  const days = REVIEW_INTERVALS[Math.min(level, REVIEW_INTERVALS.length - 1)]
  return Date.now() + days * 24 * 60 * 60 * 1000
}

function saveProgress(progress) {
  localStorage.setItem('word_study_progress', JSON.stringify(progress))
}

function WordTest({ words, onComplete, onBack, progress, setProgress }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [options, setOptions] = useState([])
  const [isFinished, setIsFinished] = useState(false)

  const currentWord = words[currentIndex]

  useEffect(() => {
    if (!currentWord) return

    const correctAnswer = currentWord.meanings[0].definition
    const wrongAnswers = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meanings[0].definition)

    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5)
      .map((text, index) => ({
        id: index,
        text,
        isCorrect: text === correctAnswer
      }))

    setOptions(allOptions)
    setSelectedAnswer(null)
    setShowResult(false)
  }, [currentIndex, currentWord, words])

  const handleSelect = (option) => {
    if (showResult) return
    
    setSelectedAnswer(option.id)
    setShowResult(true)

    if (option.isCorrect) {
      setScore(prev => prev + 1)
    }

    const wordProgress = progress[currentWord.id] || { level: 0 }
    const newLevel = option.isCorrect 
      ? Math.min(wordProgress.level + 1, REVIEW_INTERVALS.length)
      : Math.max(0, wordProgress.level - 1)

    const newProgress = {
      ...progress,
      [currentWord.id]: {
        ...wordProgress,
        level: newLevel,
        nextReview: getNextReviewTime(newLevel),
        lastReview: Date.now()
      }
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  if (isFinished) {
    const percentage = Math.round((score / words.length) * 100)
    return (
      <div className="word-study-container">
        <div className="test-result">
          <div className="result-icon">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </div>
          <h2>测试完成！</h2>
          <div className="result-score">
            <span className="score">{score}</span>
            <span className="total">/ {words.length}</span>
          </div>
          <p className="result-percentage">{percentage}% 正确率</p>
          <div className="result-actions">
            <button onClick={() => onComplete(score)}>完成</button>
            <button onClick={() => {
              setCurrentIndex(0)
              setScore(0)
              setIsFinished(false)
            }}>再测一次</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentWord) return null

  return (
    <div className="word-study-container">
      <div className="word-study-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="progress-indicator">
          <span>{currentIndex + 1} / {words.length}</span>
        </div>
        <div className="test-score">
          <span>{score} 分</span>
        </div>
      </div>

      <div className="test-card">
        <h2 className="test-word">{currentWord.word}</h2>
        <p className="test-phonetic">{currentWord.phonetic}</p>

        <div className="test-options">
          {options.map(option => (
            <button
              key={option.id}
              className={`test-option ${
                showResult 
                  ? option.isCorrect 
                    ? 'correct' 
                    : selectedAnswer === option.id 
                      ? 'wrong' 
                      : ''
                  : selectedAnswer === option.id 
                    ? 'selected' 
                    : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.text}
            </button>
          ))}
        </div>

        {showResult && (
          <button className="next-btn" onClick={handleNext}>
            {currentIndex < words.length - 1 ? '下一题' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  )
}

export default WordTest
