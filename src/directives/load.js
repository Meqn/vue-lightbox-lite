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
      const $el = loadMethods[arg](src, function (err, result) {
        try {
          ctx.changeLoading(false)
          if (arg !== 'video') el.src = src
          if (el) ctx.mediaLoaded(err, result)
          if ($el && $el.destroy) $el.destroy()
        } catch (error) {
          console.error(error)
        }
      })
      el.__vm_el__ = $el
    }
  },
  unbind (el) {
    // 存在改元素，则删除
    const $el = el.__vm_el__
    if ($el && $el.destroy) $el.destroy()
  }
}
