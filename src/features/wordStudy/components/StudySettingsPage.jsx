import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

function StudySettingsPage({ settings, onSave, onBack }) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSave(newSettings)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>学习设置</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>每日目标</h3>
          <div className="setting-item">
            <span>每日新学单词</span>
            <div className="number-input">
              <button onClick={() => handleChange('dailyNew', Math.max(5, localSettings.dailyNew - 5))}>-</button>
              <span>{localSettings.dailyNew}</span>
              <button onClick={() => handleChange('dailyNew', Math.min(100, localSettings.dailyNew + 5))}>+</button>
            </div>
          </div>
          <div className="setting-item">
            <span>每日复习单词</span>
            <div className="number-input">
              <button onClick={() => handleChange('dailyReview', Math.max(10, localSettings.dailyReview - 10))}>-</button>
              <span>{localSettings.dailyReview}</span>
              <button onClick={() => handleChange('dailyReview', Math.min(200, localSettings.dailyReview + 10))}>+</button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>学习模式</h3>
          <div className="setting-item">
            <span>自动播放发音</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={localSettings.autoPlay} 
                onChange={(e) => handleChange('autoPlay', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>显示音标</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={localSettings.showPhonetic} 
                onChange={(e) => handleChange('showPhonetic', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>显示例句</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={localSettings.showExample} 
                onChange={(e) => handleChange('showExample', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudySettingsPage
