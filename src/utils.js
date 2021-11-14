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

export function getYoutubeUrl (url) {
  const ytId = getYoutubeID(url)
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=0&mute=1&controls=1&rel=0`
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
    return `https://player.vimeo.com/video/${vimeoID}?autoplay=0&muted=1&byline=0&portrait=0&fullscreen=1`
  }
  return null
}

/**
 * 获取文件类型
 * @param {*} url 文件url
 * @param {*} ext 文件类型
 * @returns
 */
export function getMediaType ({ src, mediaType }) {
  if (['image', 'video', 'webVideo', 'iframe'].includes(mediaType)) {
    return mediaType
  } else {
    if (isYoutube(src) || isVimeo(src)) {
      return 'webVideo'
    }

    const type = mediaType || fileSuffix(src)
    if (['mp4', 'mov', 'webm', 'ogg', 'avi'].includes(type)) {
      return 'video'
    } else if (['pdf'].includes(type)) {
      return 'iframe'
    } else {
      return 'image'
    }
  }
}

export function getMediaThumb({ src, thumb, mediaType }) {
  if (thumb) return thumb

  const defaultPic = ''
  const type = getMediaType({ src, mediaType })

  if (type === 'image') return src
  if (type === 'video' || type === 'webVideo') {
    const ytId = getYoutubeID(src)
    if (ytId) {
      return 'https://img.youtube.com/vi/' + ytId + '/mqdefault.jpg'
    }

    const vimeoId = getVimeoID(src)
    if (vimeoId) {
      // https://i.vimeocdn.com/video/17892962_320.jpg
      return `https://vumbnail.com/${vimeoId}.jpg`
    }

    if (src.includes('.aliyuncs.com')) {
      return src.split('?')[0] + '?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast'
    }
  }
  return defaultPic
}

export function getVideoUrl (url) {
  const youtubeUrl = getYoutubeUrl(url)
  if (youtubeUrl) return youtubeUrl

  const vimeoUrl = getVimeoUrl(url)
  if (vimeoUrl) return vimeoUrl

  return url
}

/**
 * 获取文件后缀
 * @param {*} fileSrc 文件url
 * @returns {string}
 */
export function fileSuffix (fileSrc) {
  if (typeof fileSrc !== 'string') return ''
  const _path = fileSrc.split('?')[0]
  return _path.includes('.') ? _path.split('.').pop().toLocaleLowerCase() : ''
}

/**
 * 视频 sourceType
 * @param {string} src 文件地址
 * @param {object} param1 扩展参数
 * @returns {string}
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
  console.warn('Sorry, your browser does not support fullscreen mode!')
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

/**
 * 加载image
 * @param {string} src image url
 * @param {function} callback callback
 * @returns {Image}
 */
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

/**
 * 加载video
 * @param {string} src video url
 * @param {function} callback callback
 * @returns {video}
 */
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

/**
 * 加载iframe
 * @param {string} src iframe url
 * @param {function} callback callback
 * @returns {iframe}
 */
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
      iframe.destroy = null
    }
  }
  iframe.setAttribute('style', 'width:0;height:0;position:absolute;left:-99999em')
  iframe.setAttribute('src', src)
  document.body.appendChild(iframe)
  return iframe
}
