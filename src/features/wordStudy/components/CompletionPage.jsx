import { Check, RotateCcw, Home } from 'lucide-react'

function CompletionPage({ learnedCount, onContinue, onBack }) {
  return (
    <div className="completion-page">
      <div className="completion-content">
        <div className="completion-icon">
          <Check size={48} />
        </div>
        <h1>学习完成!</h1>
        <p className="completion-stats">
          本次学习了 <strong>{learnedCount}</strong> 个单词
        </p>
        <div className="completion-actions">
          <button className="action-btn primary" onClick={onContinue}>
            <RotateCcw size={18} />
            <span>继续学习</span>
          </button>
          <button className="action-btn secondary" onClick={onBack}>
            <Home size={18} />
            <span>返回首页</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompletionPage
