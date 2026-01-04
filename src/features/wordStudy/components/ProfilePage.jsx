import { ArrowLeft, ChevronRight, Settings, Palette, BarChart3 } from 'lucide-react'

function ProfilePage({ stats, progress, onBack, onNavigate }) {
  const totalLearned = stats.totalLearned || 0
  const totalReviewed = stats.totalReviewed || 0
  const streak = stats.streak || 0
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>个人中心</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="profile-user">
        <div className="user-avatar">
          <span>U</span>
        </div>
        <div className="user-info">
          <h2>学习者</h2>
          <p>坚持学习第 {streak} 天</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <strong>{totalLearned}</strong>
          <span>已学单词</span>
        </div>
        <div className="stat-card">
          <strong>{totalReviewed}</strong>
          <span>复习次数</span>
        </div>
        <div className="stat-card">
          <strong>{streak}</strong>
          <span>连续天数</span>
        </div>
      </div>

      <div className="settings-menu">
        <div className="menu-item" onClick={() => { console.log('点击外观'); onNavigate('appearance') }}>
          <Palette size={20} className="menu-icon" />
          <span>外观 & 沉浸场景</span>
          <ChevronRight size={18} className="menu-arrow" />
        </div>
        <div className="menu-item" onClick={() => { console.log('点击学习设置'); onNavigate('study-settings') }}>
          <Settings size={20} className="menu-icon" />
          <span>学习设置</span>
          <ChevronRight size={18} className="menu-arrow" />
        </div>
        <div className="menu-item" onClick={() => { console.log('点击学习统计'); onNavigate('more') }}>
          <BarChart3 size={20} className="menu-icon" />
          <span>学习统计</span>
          <ChevronRight size={18} className="menu-arrow" />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
