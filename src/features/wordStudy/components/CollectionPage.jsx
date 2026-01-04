import { ArrowLeft, Star, Play, BookOpen, Target } from 'lucide-react'
import { kaoyanWords } from '../../../data/vocabulary/kaoyanWords'

function CollectionPage({ progress, onBack, onStudy, onSelect }) {
  const collectedWords = kaoyanWords.filter(w => progress[w.id]?.collected)

  return (
    <div className="collection-page">
      <div className="collection-page-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>我的收藏</h1>
        <div style={{ width: 40 }} />
      </div>

      {collectedWords.length === 0 ? (
        <div className="empty-state">
          <Star size={48} />
          <p>还没有收藏任何单词</p>
          <p className="sub">学习时点击星标可收藏单词</p>
        </div>
      ) : (
        <>
          <div className="collection-header">
            <span>共 {collectedWords.length} 个单词</span>
            <button onClick={() => onStudy(collectedWords)}>
              <Play size={16} />
              开始学习
            </button>
          </div>
          <div className="word-list">
            {collectedWords.map(word => (
              <div key={word.id} className="word-list-item">
                <div className="word-info">
                  <span className="word">{word.word}</span>
                  <span className="phonetic">{word.phonetic}</span>
                </div>
                <span className="meaning">
                  {word.meanings[0].pos} {word.meanings[0].definition}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="home-nav">
        <button className="nav-item" onClick={onBack}>
          <BookOpen size={22} />
        </button>
        <button className="nav-item" onClick={() => onSelect('dashboard')}>
          <Target size={22} />
        </button>
        <button className="nav-item active">
          <Star size={22} />
        </button>
      </div>
    </div>
  )
}

export default CollectionPage
