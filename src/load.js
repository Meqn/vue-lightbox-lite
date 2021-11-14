import { loadImage, loadIframe, loadVideo } from './utils'

/**
 * 设置为自动播放地址
 * @param {*} url url
 * @returns {string}
 */
function setAutoplay(url) {
  const urlArr = url.split('?')
  if (urlArr.length > 1) {
    const urlParams = urlArr[1].split('&').reduce((acc, item) => {
      const itemArr = item.split('=')
      acc[itemArr[0]] = itemArr[1]
      return acc
    }, {})
    if (urlParams.autoplay !== '1') urlParams.autoplay = 1
    return urlArr[0] + '?' + Object.keys(urlParams).map(key => `${key}=${urlParams[key]}`).join('&')
  } else {
    return url + '?autoplay=1'
  }
}

function loadMedia(type) {
  const methods = {
    image: loadImage,
    video: loadVideo,
    webVideo: loadIframe,
    iframe: loadIframe
  }
  return methods[type]
}

export default {
  inserted (el, { arg }, vnode) {
    const ctx = vnode.context
    const { src, autoplay } = el.dataset
    let _src = src
    const loadMethod = loadMedia(arg)

    if (arg && loadMethod) {
      // loading时隐藏元素
      el.style.visibility = 'hidden'
      // reset rotate 此处是loading状态，重置rotate最佳
      ctx.resetRotate()

      // set autoplay
      if (autoplay && (arg === 'video' || arg === 'webVideo')) {
        if (el.tagName === 'VIDEO') {
          el.muted = true
          el.autoplay = true
        } else {
          _src = setAutoplay(src)
        }
      }

      // $el 用于销毁load时插入的DOM
      // load file
      const $el = loadMethod(_src, function (err, result) {
        // loading后显示元素
        el.style.visibility = 'visible'
        try {
          // 设置 loading = false
          ctx.changeLoading(false)
          // laoding完成回调
          if (el) {
            ctx.mediaLoaded(err, {
              width: result.width || result.videoWidth,
              height: result.height || result.videoHeight,
              type: arg,
              file: result
            })
          }
          el.src = _src
          if ($el && $el.destroy) $el.destroy()
        } catch (error) {
          console.error(error)
        }
      })
      el.__vm_el__ = $el
    }
  },
  unbind (el) {
    // 销毁插入的元素
    const $el = el.__vm_el__
    if ($el && $el.destroy) $el.destroy()
  }
}
