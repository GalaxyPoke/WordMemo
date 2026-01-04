// 壁纸管理工具

const BING_API = '/api/bing/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'

// 转换图片为base64
async function convertToBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    console.warn('图片转base64失败:', e)
    return null
  }
}

// 获取Bing每日壁纸
export async function fetchBingWallpaper() {
  const today = new Date().toDateString()
  const cacheKey = 'bing_wallpaper_cache'
  
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { date, url, base64 } = JSON.parse(cached)
      if (date === today && base64) {
        return base64
      }
      if (date === today && url) {
        return url
      }
    }
    
    const response = await fetch(BING_API)
    if (response.ok) {
      const data = await response.json()
      if (data.images && data.images[0]) {
        const wallpaperUrl = 'https://www.bing.com' + data.images[0].url
        
        localStorage.setItem(cacheKey, JSON.stringify({ date: today, url: wallpaperUrl }))
        
        convertToBase64(wallpaperUrl).then(base64 => {
          if (base64) {
            localStorage.setItem(cacheKey, JSON.stringify({ date: today, url: wallpaperUrl, base64 }))
          }
        })
        
        return wallpaperUrl
      }
    }
  } catch (e) {
    console.warn('Bing壁纸获取失败:', e)
  }
  
  // 备用壁纸
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return `https://picsum.photos/id/${(dayOfYear % 1000) + 1}/1920/1080`
}

// 从缓存获取壁纸
export function getCachedWallpaper() {
  try {
    const cached = localStorage.getItem('bing_wallpaper_cache')
    if (cached) {
      const { date, base64, url } = JSON.parse(cached)
      const today = new Date().toDateString()
      if (date === today && (base64 || url)) {
        return base64 || url
      }
    }
  } catch (e) {}
  return ''
}

// 设置全局壁纸CSS变量
export function setGlobalWallpaper(url) {
  if (url) {
    document.documentElement.style.setProperty('--global-wallpaper', `url(${url})`)
  }
}
