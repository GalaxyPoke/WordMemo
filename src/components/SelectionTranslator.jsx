import { useState, useEffect, useCallback, useRef } from 'react'
import { Volume2, BookPlus, X, Loader2 } from 'lucide-react'
import { translateText } from './StudyTools'
import { fetchWordDetails, playWordAudio } from '../services/dictionaryApi'

/**
 * 划词翻译组件
 * 选中文字后自动弹出翻译浮窗
 */
export function SelectionTranslator({ paperId, onAddToVocabulary }) {
  const [popup, setPopup] = useState(null)
  const [loading, setLoading] = useState(false)
  const popupRef = useRef(null)
  const isMouseDownRef = useRef(false)

  // 检测是否为单词（只包含字母、连字符、撇号）
  const isWord = (text) => /^[a-zA-Z'-]+$/.test(text.trim())

  // 处理文字选中
  const handleSelection = useCallback(async () => {
    // 如果鼠标还在按下状态，不处理
    if (isMouseDownRef.current) return

    const selection = window.getSelection()
    const text = selection?.toString().trim()

    // 没有选中文字或选中的是空白
    if (!text || text.length === 0) {
      return
    }

    // 忽略太长的文本（超过500字符）
    if (text.length > 500) {
      return
    }

    // 检查选区是否在弹窗内部，如果是则不处理
    if (popupRef.current && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (popupRef.current.contains(range.commonAncestorContainer)) {
        return
      }
    }

    // 获取选区位置
    if (selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // 计算弹窗位置（在选中文字下方）
    const x = rect.left + window.scrollX
    const y = rect.bottom + window.scrollY + 8

    // 显示加载状态
    setPopup({
      x,
      y,
      text,
      isWord: isWord(text),
      translation: null,
      wordDetails: null,
      rect
    })
    setLoading(true)

    try {
      if (isWord(text) && text.length <= 30) {
        // 单词：同时获取词典详情和翻译
        const [wordDetails, translation] = await Promise.all([
          fetchWordDetails(text),
          translateText(text)
        ])

        setPopup(prev => prev ? {
          ...prev,
          wordDetails,
          translation
        } : null)
      } else {
        // 句子/短语：只获取翻译
        const translation = await translateText(text)
        setPopup(prev => prev ? {
          ...prev,
          translation
        } : null)
      }
    } catch (error) {
      console.error('翻译失败:', error)
      setPopup(prev => prev ? {
        ...prev,
        translation: '翻译失败，请重试'
      } : null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 关闭弹窗
  const closePopup = useCallback(() => {
    setPopup(null)
    setLoading(false)
  }, [])

  // 添加到生词本
  const handleAddToVocabulary = useCallback(() => {
    if (!popup) return

    const word = popup.text
    const meaning = popup.wordDetails?.meanings?.[0]?.definition || popup.translation || ''

    // 保存到 localStorage
    const saved = localStorage.getItem(`vocabulary_${paperId}`)
    const words = saved ? JSON.parse(saved) : []
    
    // 检查是否已存在
    if (words.some(w => w.word.toLowerCase() === word.toLowerCase())) {
      alert('该单词已在生词本中')
      return
    }

    const newWord = {
      id: Date.now(),
      word: word,
      meaning: meaning,
      phonetic: popup.wordDetails?.phonetic || '',
      addedAt: new Date().toISOString()
    }
    words.push(newWord)
    localStorage.setItem(`vocabulary_${paperId}`, JSON.stringify(words))

    // 回调通知父组件
    if (onAddToVocabulary) {
      onAddToVocabulary(newWord)
    }

    // 显示成功提示
    setPopup(prev => prev ? { ...prev, added: true } : null)
    setTimeout(() => closePopup(), 800)
  }, [popup, paperId, onAddToVocabulary, closePopup])

  // 播放发音
  const handlePlayAudio = useCallback(() => {
    if (popup?.wordDetails?.audioUrl) {
      playWordAudio(popup.wordDetails.audioUrl)
    }
  }, [popup])

  // 监听鼠标事件
  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDownRef.current = true
    }

    const handleMouseUp = () => {
      isMouseDownRef.current = false
      // 延迟处理，确保选区已经稳定
      setTimeout(handleSelection, 10)
    }

    // 点击弹窗外部关闭
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        // 检查是否有新的选区
        const selection = window.getSelection()
        if (!selection || !selection.toString().trim()) {
          closePopup()
        }
      }
    }

    // ESC 键关闭
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePopup()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSelection, closePopup])

  // 调整弹窗位置，防止超出视口
  const getAdjustedPosition = () => {
    if (!popup) return { left: 0, top: 0 }

    let left = popup.x
    let top = popup.y

    // 获取视口尺寸
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY

    // 弹窗预估尺寸
    const popupWidth = 320
    const popupHeight = popup.isWord ? 200 : 120

    // 水平方向调整
    if (left + popupWidth > viewportWidth - 20) {
      left = viewportWidth - popupWidth - 20
    }
    if (left < 20) {
      left = 20
    }

    // 垂直方向调整：如果下方空间不够，显示在上方
    if (top + popupHeight > scrollY + viewportHeight - 20) {
      top = popup.rect.top + scrollY - popupHeight - 8
    }

    return { left, top }
  }

  if (!popup) return null

  const position = getAdjustedPosition()

  return (
    <div
      ref={popupRef}
      className="selection-translator-popup"
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        zIndex: 9999
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 关闭按钮 */}
      <button className="st-close-btn" onClick={closePopup}>
        <X size={14} />
      </button>

      {/* 原文 */}
      <div className="st-original">
        <span className="st-text">{popup.text}</span>
        {popup.wordDetails?.phonetic && (
          <span className="st-phonetic">{popup.wordDetails.phonetic}</span>
        )}
        {popup.wordDetails?.audioUrl && (
          <button className="st-audio-btn" onClick={handlePlayAudio}>
            <Volume2 size={16} />
          </button>
        )}
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="st-loading">
          <Loader2 size={16} className="st-spinner" />
          <span>翻译中...</span>
        </div>
      )}

      {/* 翻译结果 */}
      {!loading && popup.translation && (
        <div className="st-translation">
          {popup.translation}
        </div>
      )}

      {/* 单词详情 */}
      {!loading && popup.wordDetails && (
        <div className="st-word-details">
          {popup.wordDetails.meanings?.slice(0, 2).map((m, i) => (
            <div key={i} className="st-meaning">
              <span className="st-pos">{m.pos}</span>
              <span className="st-def">{m.definition}</span>
            </div>
          ))}
        </div>
      )}

      {/* 添加成功提示 */}
      {popup.added && (
        <div className="st-added-tip">✓ 已添加到生词本</div>
      )}

      {/* 操作按钮 */}
      {!loading && !popup.added && (
        <div className="st-actions">
          <button className="st-action-btn" onClick={handleAddToVocabulary}>
            <BookPlus size={14} />
            <span>加入生词本</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default SelectionTranslator
