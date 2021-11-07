import { isYoutube } from '../utils'
export default {
  inserted: (el) => {
    function autoplayVideo () {
      const tagName = el.tagName
      const { autoplay, src } = el.dataset.autoplay
      if (autoplay) {
        if (tagName === 'VIDEO') {
          el.muted = true
          el.autoplay = true
          return
        }

        if (tagName === 'IFRAME') {
          let muted = 'muted'
          if (isYoutube(src)) {
            muted = 'mute'
          }
          if (window.URL) {
            const url = new URL(src)
            // append autoplay
            url.searchParams.append(muted, 1)
            url.searchParams.append('autoplay', 1)

            el.src = url.href
          } else {
            el.src = src + '&muted=1&autoplay=1'
          }
        }
      }
    }
    autoplayVideo()
  }
}
