import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'

function CalendarPage({ stats, onBack }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  
  const getHeatLevel = (learned) => {
    if (!learned || learned === 0) return 0
    if (learned < 10) return 1
    if (learned < 20) return 2
    if (learned < 30) return 3
    return 4
  }
  
  const getMonthDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    let startDay = firstDay.getDay()
    startDay = startDay === 0 ? 6 : startDay - 1
    
    const days = []
    const todayStr = new Date().toISOString().split('T')[0]
    
    for (let i = 0; i < startDay; i++) {
      days.push({ day: '', empty: true })
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isToday = dateStr === todayStr
      const dayData = stats.dailyHistory?.[dateStr]
      const learned = dayData?.learned || 0
      const reviewed = dayData?.reviewed || 0
      const heatLevel = getHeatLevel(learned + reviewed)
      days.push({ day: d, dateStr, isToday, learned, reviewed, heatLevel, empty: false })
    }
    
    return days
  }
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDate(null)
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDate(null)
  }
  
  const totalDays = Object.keys(stats.dailyHistory || {}).filter(
    date => stats.dailyHistory[date]?.learned > 0
  ).length
  
  const monthDays = getMonthDays()
  const monthStats = monthDays.reduce((acc, d) => {
    if (!d.empty) {
      acc.totalLearned += d.learned || 0
      acc.totalReviewed += d.reviewed || 0
      if (d.learned > 0 || d.reviewed > 0) acc.studyDays++
    }
    return acc
  }, { totalLearned: 0, totalReviewed: 0, studyDays: 0 })
  
  const monthName = `${currentMonth.getFullYear()}年${String(currentMonth.getMonth() + 1).padStart(2, '0')}月`
  const selectedDayData = selectedDate ? stats.dailyHistory?.[selectedDate] : null
  
  return (
    <div className="calendar-page">
      <div className="calendar-page-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>日历</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="calendar-container">
        <div className="month-selector">
          <button className="month-nav" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <span className="month-name">{monthName}</span>
          <button className="month-nav" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="weekday-row">
          {['一', '二', '三', '四', '五', '六', '日'].map(d => (
            <span key={d} className="weekday-label">{d}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {monthDays.map((d, i) => (
            <div 
              key={i} 
              className={`cal-day ${d.empty ? 'empty' : ''} ${d.isToday ? 'today' : ''} level-${d.heatLevel || 0}`}
              onClick={() => !d.empty && setSelectedDate(d.dateStr)}
            >
              {d.isToday ? '今' : d.day}
            </div>
          ))}
        </div>

        <div className="cal-legend">
          <span>少</span>
          <div className="legend-boxes">
            <div className="legend-box level-0"></div>
            <div className="legend-box level-1"></div>
            <div className="legend-box level-2"></div>
            <div className="legend-box level-3"></div>
            <div className="legend-box level-4"></div>
          </div>
          <span>多</span>
        </div>

        {selectedDate && (
          <div className="day-detail">
            <div className="detail-header">
              <span>{selectedDate}</span>
              <button className="close-detail" onClick={() => setSelectedDate(null)}>
                <X size={16} />
              </button>
            </div>
            {selectedDayData ? (
              <div className="detail-content">
                <div className="detail-item">
                  <span>新学单词</span>
                  <strong>{selectedDayData.learned || 0}</strong>
                </div>
                <div className="detail-item">
                  <span>复习单词</span>
                  <strong>{selectedDayData.reviewed || 0}</strong>
                </div>
                <div className="detail-item">
                  <span>学习时长</span>
                  <strong>{Math.round((selectedDayData.time || 0) / 60)}分钟</strong>
                </div>
              </div>
            ) : (
              <div className="detail-empty">当天未学习</div>
            )}
          </div>
        )}

        </div>

      {/* 本月统计 - 独立板块 */}
      <div className="month-stats-card">
        <h3>本月统计</h3>
        <div className="stats-row">
          <div className="stat-item">
            <strong>{monthStats.studyDays}</strong>
            <span>学习天数</span>
          </div>
          <div className="stat-item">
            <strong>{monthStats.totalLearned}</strong>
            <span>新学单词</span>
          </div>
          <div className="stat-item">
            <strong>{monthStats.totalReviewed}</strong>
            <span>复习单词</span>
          </div>
        </div>
      </div>

      {/* 签到统计 - 独立板块 */}
      <div className="checkin-stats-card">
        <div className="checkin-item">
          <span className="label">连续签到</span>
          <div className="value">
            <strong>{stats.streak || 0}</strong>
            <span>天</span>
          </div>
        </div>
        <div className="checkin-item">
          <span className="label">累计签到</span>
          <div className="value">
            <strong>{totalDays}</strong>
            <span>天</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
