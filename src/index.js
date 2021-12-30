import Lightbox from './component.vue'

const install = function(Vue) {
  if (install.installed) return
  install.installed = true

  Vue.component('LightBox', Lightbox)
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(install) // eslint-disable-line
}

Lightbox.install = install

export default Lightbox
