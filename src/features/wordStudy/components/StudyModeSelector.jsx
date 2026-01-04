import { ArrowLeft, ChevronRight, BookOpen, RotateCcw, Zap, Clock } from 'lucide-react'
import { wordBookCategories } from '../../../data/vocabulary/kaoyanWords'

function StudyModeSelector({ bookId, isCustomBook, onSelect, onBack }) {
  const allBooks = wordBookCategories.flatMap(cat => cat.books)
  const book = allBooks.find(b => b.id === bookId)
  
  return (
    <div className="word-study-container">
      <div className="word-study-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>{book?.name || '学习模式'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="study-modes">
        <div className="mode-card" onClick={() => onSelect('learn')}>
          <div className="mode-icon learn">
            <BookOpen size={22} />
          </div>
          <div className="mode-info">
            <h3>学习新词</h3>
            <p>沉浸式学习新单词，通过真实语境记忆</p>
          </div>
          <ChevronRight size={18} className="mode-arrow" />
        </div>

        <div className="mode-card" onClick={() => onSelect('review')}>
          <div className="mode-icon review">
            <RotateCcw size={22} />
          </div>
          <div className="mode-info">
            <h3>复习单词</h3>
            <p>根据艾宾浩斯遗忘曲线智能复习</p>
          </div>
          <ChevronRight size={18} className="mode-arrow" />
        </div>

        <div className="mode-card" onClick={() => onSelect('test')}>
          <div className="mode-icon test">
            <Zap size={22} />
          </div>
          <div className="mode-info">
            <h3>单词测试</h3>
            <p>检验学习成果，巩固记忆</p>
          </div>
          <ChevronRight size={18} className="mode-arrow" />
        </div>

        <div className="mode-card" onClick={() => onSelect('sprint')}>
          <div className="mode-icon sprint">
            <Clock size={22} />
          </div>
          <div className="mode-info">
            <h3>限时挑战</h3>
            <p>3分钟快速记忆挑战</p>
          </div>
          <ChevronRight size={18} className="mode-arrow" />
        </div>
      </div>
    </div>
  )
}

export default StudyModeSelector
