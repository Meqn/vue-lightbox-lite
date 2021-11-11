import { loadImage, loadIframe, loadVideo } from '../utils'

export default {
  inserted (el, { arg }, vnode) {
    const ctx = vnode.context
    const { src } = el.dataset

    const loadMethods = {
      image: loadImage,
      video: loadVideo,
      webVideo: loadIframe,
      iframe: loadIframe
    }

    if (arg && loadMethods[arg]) {
      // ⚠️ reset rotate 此处处于loading状态，重置rotate最佳
      ctx.resetRotate()
      // $el 用于销毁load时插入的DOM
      const $el = loadMethods[arg](src, function (err, result) {
        try {
          ctx.changeLoading(false)
          if (el) {
            ctx.mediaLoaded(err, result)
          }
          if (arg === 'video') {
            const $source = el.querySelector('source')
            if ($source) $source.setAttribute('src', src)
          } else {
            el.src = src
          }
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
