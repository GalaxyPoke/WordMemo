import { useState } from 'react'
import { BookOpen, Target, Star, User, Flame } from 'lucide-react'
import { kaoyanWords, wordBookCategories } from '../../../data/vocabulary/kaoyanWords'

function getReviewCount(progress) {
  const now = Date.now()
  return Object.values(progress).filter(p => {
    if (p.card?.due) {
      return new Date(p.card.due).getTime() <= now && p.card.state !== 0
    }
    return p.level > 0 && p.nextReview && p.nextReview <= now
  }).length
}

function HomePage({ onSelect, progress, stats, settings }) {
  const reviewCount = getReviewCount(progress)
  
  // 显示词书剩余单词数
  const currentBookId = 'ky-core'
  const currentBook = wordBookCategories.flatMap(c => c.books).find(b => b.id === currentBookId)
  const bookWordCount = currentBook?.wordCount || 4801
  const bookLearnedCount = Object.keys(progress).filter(id => progress[id]?.bookId === currentBookId).length
  const toLearnCount = Math.max(0, bookWordCount - bookLearnedCount)

  const [featuredWord] = useState(() => {
    const words = kaoyanWords.slice(0, 100)
    return words[Math.floor(Math.random() * words.length)]
  })

  return (
    <div className="bubei-home">
      <div className="home-background">
        <div className="bg-overlay"></div>
      </div>

      <div className="home-header">
        <button className="header-icon-btn avatar-btn" onClick={() => onSelect('profile')}>
          <User size={22} />
        </button>
        <div className="streak-badge">
          <Flame size={16} />
          <span>{stats.streak}</span>
        </div>
      </div>

      <div className="featured-word-area">
        <h1 className="featured-word">{featuredWord?.word || 'Hello'}</h1>
        <p className="featured-phonetic">{featuredWord?.phonetic || '/həˈləʊ/'}</p>
      </div>

      <div className="home-actions">
        <button 
          className="home-action-btn"
          onClick={() => onSelect('learn-direct')}
        >
          <span className="action-label">Learn</span>
          <span className="action-count">{toLearnCount}</span>
        </button>
        <div className="action-divider"></div>
        <button 
          className="home-action-btn"
          onClick={() => onSelect('review')}
        >
          <span className="action-label">Review</span>
          <span className="action-count">{reviewCount}</span>
        </button>
      </div>

      <div className="home-nav">
        <button className="nav-item active">
          <BookOpen size={22} />
        </button>
        <button className="nav-item" onClick={() => onSelect('dashboard')}>
          <Target size={22} />
        </button>
        <button className="nav-item" onClick={() => onSelect('collection')}>
          <Star size={22} />
        </button>
      </div>
    </div>
  )
}

export default HomePage
