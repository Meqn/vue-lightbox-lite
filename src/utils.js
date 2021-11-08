const youtubeRegx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
const vimeoRegx = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\\-]+)?/i

export const isNumber = arg => !isNaN(parseFloat(arg)) && isFinite(arg)

export function isObject (arg) {
  return arg !== null && typeof arg === 'object'
}

export const randomStr = () => Math.floor(Math.random() * Date.now()).toString(36)

export function isMp4 (url) {
  if (url && typeof url === 'string') {
    const suffix = fileSuffix(url)
    return ['mp4', 'mov', 'webm', 'ogg', 'avi'].includes(suffix)
  }
  return false
}

export function isYoutube (url) {
  if (url && typeof url === 'string') {
    return youtubeRegx.test(url)
  }
  return false
}

export function isVimeo (url) {
  if (url && typeof url === 'string') {
    return vimeoRegx.test(url)
  }
  return false
}

export function isVideo (url) {
  return isMp4(url) || isYoutube(url) || isVimeo(url)
}

export function getYoutubeID (url) {
  if (url && typeof url === 'string') {
    const result = url.match(youtubeRegx)
    return result && result.length > 1 ? result[1] : null
  }
  return null
}

export function getYoutubeUrl (url, youtubeCookies = true) {
  const ytId = getYoutubeID(url)
  if (ytId) {
    // check if allows youtube cookies
    if (youtubeCookies) {
      return 'https://www.youtube.com/embed/' + ytId
    }
    return 'https://www.youtube-nocookie.com/embed/' + ytId
  }
  return null
}

export function getYoutubeThumb (url) {
  const ytId = getYoutubeID(url)
  if (ytId) {
    return 'https://img.youtube.com/vi/' + ytId + '/mqdefault.jpg'
  }
  return null
}

export function getVimeoID (url) {
  if (url && typeof url === 'string') {
    const result = url.match(vimeoRegx)
    return result && result.length > 1 ? result[1] : null
  }
  return null
}

export function getVimeoUrl (url) {
  const vimeoID = getVimeoID(url)
  if (vimeoID) {
    return '//player.vimeo.com/video/' + vimeoID + '?hd=1&show_title=1&show_byline=1&show_portrait=0&fullscreen=1'
  }
  return null
}

/**
 * 获取文件后缀
 * @param {*} fileSrc 
 * @returns 
 */
export function fileSuffix (fileSrc) {
  if (typeof fileSrc !== 'string') return ''
  const _path = fileSrc.split('?')[0]
  return _path.includes('.') ? _path.split('.').pop().toLocaleLowerCase() : ''
}

/**
 * 
 * @param {String} src 文件源
 * @returns 
 */
export function videoSourceType (src, { ext }) {
  const _ext = ext || fileSuffix(src)
  return _ext ? `video/${_ext}` : ''
}

export function closeFullscreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

export function fullScreenMode () {
  const el = document.documentElement
  if (el.requestFullscreen) {
    el.requestFullscreen()
    return true
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen()
    return true
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen()
    return true
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen()
    return true
  }
  console.warn('对不起，您的浏览器不支持全屏模式')
  return false
}

export function addFullscreenListener (listener) {
  document.addEventListener('fullscreenchange', listener)
  document.addEventListener('webkitfullscreenchange', listener)
  document.addEventListener('mozfullscreenchange', listener)
  document.addEventListener('msfullscreenchange', listener)
}
export function removeFullscreenListener (listener) {
  document.removeEventListener('fullscreenchange', listener)
  document.removeEventListener('webkitfullscreenchange', listener)
  document.removeEventListener('mozfullscreenchange', listener)
  document.removeEventListener('msfullscreenchange', listener)
}

/**
 * 匹配所有元素，同 Element.matches
 * @param {*} target 对比目标元素
 * @param {*} selector 选择器
 * @param {*} wrapper 选择器范围
 * @returns
 */
export function matchesDom (target, selector, wrapper) {
  if (!(target instanceof Element)) return false
  if (!(wrapper instanceof Element)) {
    wrapper = document
  }
  const selectorArr = Array.isArray(selector) ? selector : selector.split(',')
  const matches = selectorArr.reduce((a, c) => {
    const els = wrapper.querySelectorAll(c)
    a.push(...els)
    return a
  }, [])
  for (let i = 0, len = matches.length; i < len; i++) {
    if (matches[i] === target) return true
  }
  return false
}

export function loadImage (path, callback) {
  let img = new Image()
  img.onerror = function (error) {
    callback && callback(error)
    img.onerror = img = null
  }
  img.onload = function () {
    callback && callback(null, img)
    img.onload = img = null
  }
  img.src = path
  if (img.complete) {
    callback && callback(null, img)
    img.onerror = img.onload = img = null
  }
  return img
}

export function loadVideo (src, callback) {
  let video = document.createElement('video')
  video.onerror = function (error) {
    callback && callback(error)
    video.onerror = video = null
  }
  video.onloadeddata = function () {
    // width: video.videoWidth, height: video.videoHeight
    callback && callback(null, video)
    video.onloadeddata = video = null
  }
  video.src = src
  return video
}

export function loadIframe (src, callback) {
  let iframe = document.createElement('iframe')
  iframe.onerror = function (error) {
    callback && callback(error)
    iframe.onerror = iframe = null
  }
  iframe.onload = function () {
    callback && callback(null, iframe)
    iframe.onload = iframe = null
  }
  iframe.destroy = function () {
    if (iframe) {
      document.body.removeChild(iframe)
    }
  }
  iframe.setAttribute('style', 'width:0;height:0;opacity:0')
  iframe.setAttribute('src', src)
  document.body.appendChild(iframe)
  return iframe
}
