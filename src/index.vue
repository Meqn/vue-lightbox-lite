<template>
<transition name="cool-lightbox-modal">
  <div
    v-if="isVisible"
    class="cool-lightbox"
    :class="lightboxClasses"
    :style="lightboxStyles">
    <div class="cool-lightbox-mask" :style="maskStyles"></div>
    <!-- 缩略图列表 -->
    <div v-if="gallery" class="cool-lightbox-thumbs">
      <div class="cool-lightbox-thumbs__list">
        <button
          type="button"
          v-for="(item, itemIndex) in items"
          :key="itemIndex"
          :class="{
            active: itemIndex === imgIndex,
            'is-video': checkIsVideo(itemIndex)
          }"
          @click="imgIndex = itemIndex"
          class="cool-lightbox__thumb">

          <svg v-if="checkIsVideo(itemIndex)" class="cool-lightbox__thumb__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6.5 5.4v13.2l11-6.6z"></path>
          </svg>

          <img :src="getItemThumb(itemIndex)" alt="" />
        </button>
      </div>
    </div>
    <!--/cool-lightbox-thumbs-->

    <div
      class="cool-lightbox-inner"
      :style="innerStyles">
      <!-- loading -->
      <div v-show="imageLoading" class="cool-lightbox-loading-wrapper">
        <slot name="loading"><div class="cool-lightbox-loading"></div></slot>
      </div>
      <!--/loading-wrapper-->
      <!-- 主体区域 -->
      <!-- 将点击关闭、滑动等事件绑定在该元素上, click 和 touch不能共存 -->
      <div
        class="cool-lightbox-main"
        @mousedown.stop="startSwipe"
        @mousemove.stop="continueSwipe"
        @mouseup.stop="endSwipe"
        @touchstart.prevent.stop="startSwipe"
        @touchmove.stop="continueSwipe"
        @touchend.prevent.stop="endSwipe"
        @click.stop="closeModal">
        <div ref="items" class="cool-lightbox-slide">
          <div v-if="getMediaType(imgIndex) === 'image'" ref="imgItem" key="image" :style="imgWrapperStyle" class="cool-lightbox-image">
            <transition name="cool-lightbox-slide-change" mode="out-in">
              <img
                v-load:image
                :data-src="currentItem.src"
                :srcset="currentItem.srcset"
                :sizes="currentItem.sizes"
                :key="imgIndex"
                draggable="false"
                :alt="currentItem.alt"

                @click.stop="zoomImage"
                @mousedown.stop="handleMouseDown($event)"
                @mouseup.stop="handleMouseUp($event)"
                @mousemove.stop="handleMouseMove($event)"
              />
            </transition>
          </div>
          <!--/imgs-slide-->
          <div v-else-if="getMediaType(imgIndex) === 'iframe'" ref="iframeItem" key="iframe" class="cool-lightbox-iframe">
            <transition name="cool-lightbox-slide-change" mode="out-in">
              <iframe
                v-load:iframe
                :data-src="currentItem.src"
                :key="currentItem.src"
                frameborder="0"
                allowfullscreen>
              </iframe>
            </transition>
          </div>
          <!--/cool-lightbox-iframe-->
          <div v-else ref="videoItem" key="video" class="cool-lightbox-video" :style="aspectRatioVideo">
            <transition name="cool-lightbox-slide-change" mode="out-in">
              <iframe
                v-if="getMediaType(imgIndex) === 'webVideo'"
                class="js-video"
                v-load:webVideo
                :data-src="currentItem.src"
                :key="currentItem.src"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
              <video
                v-else
                class="js-video"
                v-load:video
                :data-src="currentItem.src"
                :key="currentItem.src"
                controls=""
                controlslist="nodownload">
                <source :src="currentItem.src" :type="videoSourceType(imgIndex)">
                Sorry, your browser doesn't support embedded videos
              </video>
            </transition>
          </div>
          <!--/cool-lightbox-video-->
        </div>
        <!--/cool-lightbox-slide-->
      </div>
      <!--/cool-lightbox__wrapper-->

      <!-- 自动播放进度条 -->
      <div class="cool-lightbox-progressbar" :style="stylesInterval"></div>

      <!-- 导航 prev/next -->
      <template v-if="toolbar.includes('navigator')">
        <div
          v-show="(hasPreviousButton || loopData) && items.length > 1"
          class="cool-lightbox-navigation is-prev"
          :class="buttonsClasses"
          title="Previous"
          @click.stop="previous">
          <slot name="icon-previous"><Icon name="arrow-left" /></slot>
        </div>
        <div
          v-show="(hasNextButton || loopData) && items.length > 1"
          class="cool-lightbox-navigation is-next"
          :class="buttonsClasses"
          title="Next"
          @click.stop="next(false)">
          <slot name="icon-next"><Icon name="arrow-right" /></slot>
        </div>
      </template>
      <!--/cool-lightbox__navigation-->

      <!-- 工具栏 -->
      <div class="cool-lightbox-toolbar" :class="buttonsClasses">
        <div class="cool-lightbox-toolbar__counter">{{ imgIndex + 1 }} / {{ items.length }}</div>
        <div class="cool-lightbox-toolbar__buttons">
          <i v-if="this.slideshow && items.length > 1" title="Play slideshow" class="icon-btn" @click.stop="toggleSlide">
            <Icon :name="!isPlayingSlideShow ? 'play' : 'pause'" />
          </i>
          <i title="rotate-left" class="icon-btn" @click.stop="onRotate('left')">
            <Icon name="rotate-left" />
          </i>
          <i title="rotate-right" class="icon-btn" @click.stop="onRotate('right')">
            <Icon name="rotate-right" />
          </i>
          <i v-if="gallery && items.length > 1" @click.stop="showThumbs = !showThumbs" title="Show thumbnails" class="icon-btn">
            <Icon name="grid" />
          </i>
          <i v-if="fullScreen" @click.stop="toggleFullScreenMode" class="icon-btn" title="Fullscreen">
            <Icon :name="isFullScreenMode ? 'offscreen' : 'fullscreen'" />
          </i>
          <i v-if="download" class="icon-btn" title="download" @click.stop="onDownload">
            <Icon name="download" />
          </i>
          <i v-if="showClose" class="icon-btn" title="Close" @click.stop="close">
            <Icon name="close" />
          </i>
        </div>
      </div>
      <!--/cool-lightbox--toolbar-->

      <!-- 标题/描述 -->
      <transition name="cool-lightbox-modal">
        <div v-show="currentItem.title || currentItem.description" key="caption-block" class="cool-lightbox-caption">
          <transition name="cool-lightbox-slide-change" mode="out-in">
            <h6 class="caption-title" v-if="currentItem.title" key="title" v-html="currentItem.title"></h6>
          </transition>

          <transition name="cool-lightbox-slide-change" mode="out-in">
            <div class="caption-description" v-if="currentItem.description" key="description" v-html="currentItem.description"></div>
          </transition>
        </div>
        <!--/cool-lightbox-caption-->
      </transition>
    </div>
    <!--/cool-lightbox-inner-->
    <!-- 缩放区域 -->
    <transition name="cool-lightbox-modal">
      <div v-if="isZooming && useZoomBar" class="cool-lightbox-zoom">
        <svg height="469pt" class="cool-lightbox-zoom__icon" viewBox="0 -192 469.33333 469" width="469pt" 
          xmlns="http://www.w3.org/2000/svg"><path d="m437.332031.167969h-405.332031c-17.664062 
          0-32 14.335937-32 32v21.332031c0 17.664062 14.335938 32 32 32h405.332031c17.664063 0 32-14.335938 
          32-32v-21.332031c0-17.664063-14.335937-32-32-32zm0 0" fill="currentColor" />
        </svg>
        <input type="range" v-model="zoomBar" name="points" min="0" max="50" />
        <svg height="426.66667pt" class="cool-lightbox-zoom__icon" viewBox="0 0 426.66667 426.66667" width="426.66667pt" xmlns="http://www.w3.org/2000/svg">
          <path d="m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031 
          9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 
          11.777344 9.558594 21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 
          21.335938 11.777344 0 21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 
          21.335938-21.335938 0-11.773437-9.558594-21.332031-21.335938-21.332031zm0 0" fill="currentColor" />
        </svg>
      </div>
    </transition>

  </div>
  <!--/cool-lightbox-->
</transition>
<!--/transition-->
</template>

<script>
import './index.scss'
/* eslint-disable */
import AutoplayVideo from "./directives/autoplay"
import LoadMedia from './directives/load'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import Icon from './Icon.vue'
import {
  fullScreenMode,
  closeFullscreen,
  addFullscreenListener,
  removeFullscreenListener,
  matchesDom,
  randomStr,
  isObject,
  isNumber,
  isMp4,
  isVideo,
  isYoutube,
  isVimeo,
  getVimeoUrl,
  getYoutubeUrl,
  getYoutubeThumb,
  fileSuffix,
  videoSourceType
} from './utils'

export default {
  name: 'CoolViewer',
  components: {
    Icon
  },
  directives: {
    autoplay: AutoplayVideo,
    load: LoadMedia
  },
  props: {
    index: Number,
    items: {
      type: Array,
      required: true,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    slideshow: {
      type: Boolean,
      default: true,
    },
    slideBarColor: {
      type: String,
      default: '#fa4242',
    },
    slideDuration: {
      type: Number,
      default: 3500,
    },
    useZoomBar: Boolean,
    overlayColor: {
      type: String,
      default: 'rgba(30, 30, 30, .9)'
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
    gallery: Boolean,
    fullScreen: Boolean,
    download: Boolean,
    showClose: {
      type: Boolean,
      default: true,
    },
    thumbsPosition: {
      type: String,
      validtor(val) {
        return ['right', 'bottom'].includes(val)
      },
      default: 'right',
    },
    youtubeCookies: {
      type: Boolean,
      default: true,
    },
    enableWheelEvent: Boolean,
    disableZoom: Boolean,
    enableScrollLock: {
      type: Boolean,
      default: true,
    },
    // 点击关闭
    clickOutsideHide: Boolean,
    toolbar: {
      type: Array,
      default: () => ['navigator', 'slide', 'close', 'counter', 'rotate']
    }
  },
  data() {
    return {
      // swipe data
      initialMouseX: 0,
      initialMouseY: 0,
      endMouseX: 0,
      endMouseY: 0,
      swipeType: null,
      IsSwipping: false,
      isDraggingSwipe: false,

      // use for mouse wheel
      prevTime: 0,

      // swipe effect
      xSwipeWrapper: 0,
      ySwipeWrapper: 0,
      swipeAnimation: null,
      swipeInterval: null,
      lightboxInnerWidth: null,

      // styles data
      isVisible: false,
      imgIndex: this.index,
      paddingBottom: false,
      imageLoading: false,
      showThumbs: false,
      isFullScreenMode: false,

      // aspect ratio videos
      aspectRatioVideo: {
        width: 'auto',
        height: 'auto',
      },

      // props to bind styles
      buttonsVisible: true,
      scale: 1,
      top: 0,
      left: 0,
      lastX: 0,
      lastY: 0,
      isDraging: false,
      canZoom: true,
      isZooming: false,
      transition: 'all .3s ease',
      zoomBar: 0,

      // slideshow playing data
      isPlayingSlideShow: false,
      intervalProgress: null,
      loopData: false,
      stylesInterval: {
        'display': 'block'
      },
      // id
      viewerStyleId: 'cool-style-' + randomStr()
    };
  },
  computed: {
    // get item
    currentItem() {
      const item = this.getItem(this.imgIndex)
      if (item) {
        const videoSrc = this.getVideoUrl(this.imgIndex)
        videoSrc && (item.src = videoSrc)
        return item
      }
      return null
    },
    // Images wrapper styles to use drag and zoom
    imgWrapperStyle() {
      return {
        top: '50%',
        left: '50%',
        transition: this.transition,
      }
    },
    // lightbox styles
    lightboxStyles() {
      return { 
        'z-index': this.zIndex
      }
    },
    maskStyles() {
      const oStyle = {}
      if (this.overlayColor) {
        oStyle['background-color'] = this.overlayColor
      }
      return oStyle
    },
    innerStyles() {
      return {
        'padding-bottom': this.paddingBottom + 'px',
      }
    },
    // Lightbox classes
    lightboxClasses() {
      let classesReturn = [
        { 'cool-lightbox--can-zoom': this.canZoom && !this.disableZoom },
        { 'cool-lightbox--zoom-disabled': this.disableZoom},
        { 'cool-lightbox--is-zooming': this.isZooming },
        { 'cool-lightbox--show-thumbs': this.showThumbs },
        { 'cool-lightbox--is-swipping': this.isDraggingSwipe }
      ]
      let classString = 'cool-lightbox--thumbs-' + this.thumbsPosition
      classesReturn.push(classString)

      return classesReturn
    },
    // Buttons classes
    buttonsClasses() {
      return {
        'hidden': !this.buttonsVisible,
      }
    },
    // check if the slide has next element
    hasNextButton() {
      return (this.imgIndex + 1 < this.items.length)
    },
    // check if the slide has previous element 
    hasPreviousButton() {
      return (this.imgIndex - 1 >= 0)
    },
    // check if the slide has next element
    hasNext() {
      return (this.imgIndex + 1 < this.items.length)
    },
    // check if the slide has previous element 
    hasPrevious() {
      return (this.imgIndex - 1 >= 0)
    }
  },
  watch: {
    zoomBar(val, prev) {
      if(this.isZooming) {
        const item = this.$refs.imgItem
        const newZoom = 1.6 + val / 10
        item.style.transform = 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d('+newZoom+', '+newZoom+', '+newZoom+')';
      }
    },
    showThumbs(val) {
      // let widthGalleryBlock = 212;
      let swipeAnimation = 'all .3s ease'
      /* if(window.innerWidth < 767) {
        widthGalleryBlock = 102
        swipeAnimation = null
      }

      if (this.thumbsPosition === 'bottom') {
        widthGalleryBlock = 0;
      } */

      this.swipeAnimation = swipeAnimation
      /* 
      if(val) {
        this.xSwipeWrapper = -this.imgIndex*(window.innerWidth - widthGalleryBlock) - 30*this.imgIndex
      } else {
        this.xSwipeWrapper = -this.imgIndex*window.innerWidth - 30*this.imgIndex
      } */

      setTimeout(() => {
        this.swipeAnimation = null
      }, 300)
    },
    index(val, prev) {
      console.log('wathch index ', val, prev)
      // 加入`isVisible`判断，防止外界更改index后重新初始化
      if (isNumber(val) && !this.isVisible) {
        this.$_initial(val)
      }
    },
    imgIndex: {
      immediate: true,
      handler(val, prev) {
        console.log('wathch imgIndex ', val, prev)
        if (val !== this.index) {
          this.$emit('update:index', val)
        }
        // 切换预览
        if(val !== null) {
          const item = this.getItem(val)
          this.changeLoading(false)

          if(val !== prev) {
            if (!isYoutube(item.src) && !isVimeo(item.src)) {
              this.$_stopVideos()
            }
          }
          // 非<video>的加载
          if (!isMp4(item.src)) {
            this.changeLoading(true)
          }

          // add caption padding to Lightbox wrapper
          this.$_addCaptionPadding()
        }
        // when animation is loaded
        this.$nextTick(() => {
          // reset zoom
          this.resetZoom()
          // reset swipe type
          this.swipeType = null
          this.ySwipeWrapper = 0

        })
      }
    }, 
  },
  mounted() {
    // document.body.appendChild(this.$el)
    if (isNumber(this.index)) {
      this.$_initial(this.index)
    }
    addFullscreenListener.call(this, this.fullScreenListener)
    // this.$on('hook:beforeDestroy', removeFullscreenListener.bind(this, this.fullScreenListener))
  },
  beforeDestroy () {
    if (this.enableScrollLock) {
      this.$_removeCompensateForScrollbar()
      enableBodyScroll(this.$el)
    }
    removeFullscreenListener.call(this, this.fullScreenListener)
  },

  methods: {
    $_stopVideos() {
      this.$nextTick(() => {
        const videos = this.$el.querySelectorAll('.js-video')
        const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2)
        if(videos.length > 0) {
          Array.prototype.forEach.call(videos, video => {
            const type = video.tagName
            
            if(type === 'IFRAME') {
              var iframeSrc = video.src
              return video.src = iframeSrc
            }

            if(isVideoPlaying(video)) {
              return video.pause()
            }

          })
        }
      })
    },
    /* setAutoplay(index) {
      const item = this.getItem(index)
      return item && item.autoplay
    }, */
    /**
     * 🚨 待清除，用 overflow: hidden 代替
     */
    $_removeCompensateForScrollbar() {
      document.body.classList.remove('compensate-for-scrollbar')
      const noscrollStyle = document.getElementById(this.viewerStyleId)
      if (noscrollStyle !== null) {
        noscrollStyle.remove()
      }
    },
    $_setCompensateForScrollbar() {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (!isMobile && (document.body.scrollHeight > window.innerHeight)) {
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
          <style id="${this.viewerStyleId}" type="text/css">
          .compensate-for-scrollbar{margin-right: ${window.innerWidth - document.documentElement.clientWidth}px}
          </style>
        `)
        document.body.classList.add('compensate-for-scrollbar')
      }
    },
    toggleFullScreenMode() {
      if(this.isFullScreenMode) {
        closeFullscreen()
      } else {
        fullScreenMode()
      }
    },
    fullScreenListener() {
      this.isFullScreenMode = !this.isFullScreenMode
    },
    // check if event is arrow button or toolbar button
    $_checkOutOfSwipe(event) {
      if (event.type.includes('mouse')) {
        const elements = [
          '.cool-lightbox-video video',
          '.cool-lightbox-video iframe',
          '.cool-lightbox-iframe iframe'
        ]
        return matchesDom(event.target, elements, event.currentTarget)
      }
      return false
    },
    // start swipe event
    startSwipe(event) {
      if(this.isZooming) {
        return false
      }

      // check if is some button
      if(this.$_checkOutOfSwipe(event)) {
        return false
      }

      // clear interval
      clearInterval(this.swipeInterval)
      this.swipeAnimation = null

      // starts swipe
      this.isDraggingSwipe = true
      this.initialMouseX = this.$_getMouseXPosFromEvent(event)
      this.initialMouseY = this.$_getMouseYPosFromEvent(event)
    },

    // continue swipe event
    continueSwipe(event) {
      if(this.isDraggingSwipe) {
        this.IsSwipping = true
        const currentPosX = this.$_getMouseXPosFromEvent(event)
        const currentPosY = this.$_getMouseYPosFromEvent(event)
        // const windowWidth = this.lightboxInnerWidth

        // diffs
        const diffX = Math.abs(currentPosX - this.initialMouseX)
        const diffY = Math.abs(currentPosY - this.initialMouseY)

        // swipe type
        if(this.swipeType == null) {
          if(diffY > 5 || diffX > 5) {
            if(diffY > diffX) {
              this.swipeType = 'v'
            } else {
              this.swipeType = 'h'
            }
          }
        }
        /* 
        // swipe
        if(this.swipeType == 'h') {
          // swipe wrapper
          this.xSwipeWrapper = -(windowWidth*this.imgIndex) + currentPosX - this.initialMouseX - 30*this.imgIndex

        } else {
          this.ySwipeWrapper = currentPosY - this.initialMouseY
        }
        */
        // mobile caseS
        if(event.type === 'touchmove') {
          this.endMouseX = this.$_getMouseXPosFromEvent(event);
          this.endMouseY = this.$_getMouseYPosFromEvent(event);
        }
      }
    },

    // end swipe event
    endSwipe(event) {
      if(this.$_checkOutOfSwipe(event) && this.initialMouseX === 0) {
        return false;
      }

      // event check is dragging and swipe
      const self = this
      const swipeType = this.swipeType
      this.isDraggingSwipe = false
      
      // horizontal swipe type
      if(this.initialMouseX === 0 && swipeType == 'h') {
        return false
      }

      // touch end fixes
      if(event.type !== 'touchend') {
        this.endMouseX = this.$_getMouseXPosFromEvent(event);
        this.endMouseY = this.$_getMouseYPosFromEvent(event);
      } else {
        if(this.endMouseX === 0) {
          return;
        }
      }

      // check if is dragged 
      if(
        ((this.endMouseX - this.initialMouseX === 0) && swipeType == 'h') || 
        this.isZooming ||
        ((this.endMouseY - this.initialMouseY === 0) && swipeType == 'v')
      ) {
        return;
      } 
      
      // set swipe animation
      // this.$_setSwipeAnimation()

      // reset swipe data
      setTimeout(function() {
        self.IsSwipping = false
        self.initialMouseX = 0
        self.endMouseX = 0
      }, 10)

      // type of swipe
      if(this.swipeType === 'h') {

        // if the swipe is to the right
        if((this.endMouseX - this.initialMouseX) < -40) {
          return this.changeIndexToNext()
        } 

        // if the swipe is to the left
        if((this.endMouseX - this.initialMouseX) > 40) {
          return this.changeIndexToPrev();
        }
      }


      if(this.swipeType === 'v') {
        const diffY = Math.abs(this.endMouseY - this.initialMouseY)

        // diff Y
        if(diffY >= 90) {
          this.close()
        } else {
          this.ySwipeWrapper = 0
        }
      } 
      
      this.swipeType = null
      /* const windowWidth = this.lightboxInnerWidth

      this.xSwipeWrapper = -this.imgIndex*windowWidth - 30*this.imgIndex */
    },

    // function that return x position from event
    $_getMouseXPosFromEvent(event) {
      if(event.type.indexOf('mouse') !== -1){
        return event.clientX;
      }
      return event.touches[0].clientX;
    },
    
    // function that return Y position from event
    $_getMouseYPosFromEvent(event) {
      if(event.type.indexOf('mouse') !== -1){
        return event.clientY;
      }
      return event.touches[0].clientY;
    },

    // toggle play slideshow event
    toggleSlide() {
      if(!this.slideshow) {
        return false
      }

      if(!this.hasNext && !this.loopData) {
        return false
      }
      this.isPlayingSlideShow = !this.isPlayingSlideShow

      // if is playing move if not stop it
      if(this.isPlayingSlideShow) {
        this.move()
      } else {
        this.stopSlideShow()
      }
    },

    // stop slideshow
    stopSlideShow() {
      this.isPlayingSlideShow = false
      clearInterval(this.intervalProgress);
      this.stylesInterval = {
        'transform': 'scaleX(0)',
        'transition': 'none',
      }
    },

    // move event in zoom
    move() {
      const self = this
      this.progressWidth = 100;
      this.intervalProgress = setInterval(frame, this.slideDuration + 90);
      
      this.stylesInterval = {
        'transform': 'scaleX(1)',
        'background': this.slideBarColor,
        'transition-duration': this.slideDuration+'ms',
      }
      function frame() {
        self.stylesInterval = {
          'transform': 'scaleX(0)',
          'transition': 'none',
        }
        self.next(true)

        if(!self.hasNext && !self.loopData) {
          self.stopSlideShow()
        } else {
          setTimeout(function() {
            self.stylesInterval = {
              'transform': 'scaleX(1)',
              'background': self.slideBarColor,
              'transition-duration': self.slideDuration+'ms',
            }
          }, 50)
        }
      }
    },
    // check if is allowed to drag
    $_checkMouseEventPropButton(button) {
      if (!this.isZooming) return false
      // mouse left btn click
      return button === 0
    },

    // handle mouse down event
    handleMouseDown(e) {
      if (!this.$_checkMouseEventPropButton(e.button)) return
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.isDraging = true
      e.stopPropagation()
    },

    // handle mouse up event
    handleMouseUp(e) {
      if (!this.$_checkMouseEventPropButton(e.button)) return
      this.isDraging = false
      this.lastX = this.lastY = 0

      // Fix drag zoom out
      const thisContext = this
      setTimeout(function() {
        thisContext.canZoom = true
      }, 100)
    },

    // handle mouse move event
    handleMouseMove(e) {
      if (!this.$_checkMouseEventPropButton(e.button)) return
      if (this.isDraging) {
        this.top = this.top - this.lastY + e.clientY
        this.left = this.left - this.lastX + e.clientX
        this.lastX = e.clientX
        this.lastY = e.clientY
        this.canZoom = false
        
        const item = e.target.parentNode.nodeName === 'PICTURE'
          ? e.target.parentNode.parentNode
          : e.target.parentNode
        const newZoom = 1.6 + this.zoomBar/10;
        item.style.transform  = 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d('+newZoom+', '+newZoom+', '+newZoom+')';
      }
      e.stopPropagation()
    },

    // zoom image event
    zoomImage() {
      if(this.disableZoom) return false
      if(window.innerWidth < 700) return false
      if(!this.canZoom) return false
      if(this.IsSwipping) return false

      // item zoom
      let item = this.$refs.imgItem
      // zoom variables
      const isZooming = this.isZooming
      // Is zooming check
      if(isZooming) {
        if(!this.isDraging) { 
          this.isZooming = false
          this.zoomBar = 0
        }
      } else {
        this.isZooming = true
      }
      // check if is zooming
      if(this.isZooming) {
        this.stopSlideShow()
        // add scale
        item.style.transform  = 'translate3d(calc(-50%), calc(-50%), 0px) scale3d(1.6, 1.6, 1.6)'
        // hide buttons
        this.buttonsVisible = false
        // fix drag transition problems
        setTimeout(() => {
          this.transition = 'all .0s ease'
        }, 100)
      } else {
        // show buttons 
        this.buttonsVisible = true
        this.resetZoom()
      }
    },

    // Reset zoom data
    resetZoom() {
      this.scale = 1
      this.left = 0
      this.top = 0
      this.zoomBar = 0
      this.isZooming = false
      this.swipeType = null
      this.transition = 'all .3s ease'

      // only if index is not null
      const item = this.$refs.imgItem
      if(this.imgIndex != null && item) {

        // reset styles
        if(this.disableZoom) {
          item.style.transform  = 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px)';
        } else {
          item.style.transform  = 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d(1, 1, 1)';
        }

        this.initialMouseX = 0
        if(window.innerWidth >= 700) {
          this.buttonsVisible = true
        }
      }
    },
    setAspectRatio() {
      //
    },
    // Aspect Ratio responsive video
    $_setAspectRatioVideo() {
      this.$nextTick(() => {
        const $el = this.$el.querySelector('.cool-lightbox-main')
        const { width, height } = $el.getBoundingClientRect()
        const ratio = 16 / 9
        if ((width / height) > ratio) {
          this.aspectRatioVideo = {
            width: `${Math.floor(height * ratio)}px`,
            height: `${Math.floor(height)}px`
          }
        } else {
          this.aspectRatioVideo = {
            width: `${Math.floor(width)}px`,
            height: `${Math.floor(width / ratio)}px`
          }
        }
      })

      /* 
      const thisContext = this
      let el = this.$el.querySelector('.cool-lightbox-inner')

      let computedStyle = getComputedStyle(el)
      if(window.innerWidth < 1440) {

        let width = el.clientWidth;
        let height = Math.round((width/16)*9);

        this.aspectRatioVideo.height = height+'px'
        this.aspectRatioVideo.width = width+'px'

      } else {
        
        setTimeout(function() {
          let height = el.clientHeight;
          height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

          let width = (height/9)*16

          thisContext.aspectRatioVideo.height = height+'px'
          thisContext.aspectRatioVideo.width = width+'px'
        }, 150)

      } */
    },

    $_wheelEvent(event) {
      const delay = 350;
      const currentTime = new Date().getTime();
      let direction = event.deltaY > 0 ? 'top' : 'down';

      if (currentTime - this.prevTime < delay) return;

      this.prevTime = currentTime;

      switch (direction) {
        case 'top':
          return this.changeIndexToPrev();
          break;
        case 'down':
          return this.changeIndexToNext();
      }
    },

    // set lightbox inner width
    /* $_setLightboxInnerWidth() {
      let el = this.$el.querySelector('.cool-lightbox-inner');
      let width = el.clientWidth
      this.lightboxInnerWidth = width
    }, */

    // x position on resize event
    /* $_xPositionOnResize() {
      this.$_setLightboxInnerWidth()
      const index = this.imgIndex

      // set x position
      this.xSwipeWrapper = -index*this.lightboxInnerWidth-30*index
    }, */

    // set swipe animation
    /* $_setSwipeAnimation() {
      const self = this
      clearInterval(this.swipeInterval)
      this.swipeAnimation = null

      // animation swipe
      this.swipeAnimation = 'all .3s ease';
      this.swipeInterval = setInterval(interval, 330);

      function interval() {
        self.swipeAnimation = null
      }
    }, */

    // caption size 
    $_addCaptionPadding() {
      this.$nextTick(() => {
        if(this.currentItem.title || this.currentItem.descripcion) {
          const el = this.$el.querySelector('.cool-lightbox-caption');
          if(el) {
            this.paddingBottom = el.offsetHeight
          } 
        } else {
          this.paddingBottom = 0
        }
      })
    },
    // =======================================================================================
    $_initial(index) {
      // swipe type
      this.swipeType = null
      this.initialMouseY = 0
      this.ySwipeWrapper = 0

      this.isVisible = true
      this.imgIndex = index
      
      // set loop from data
      this.loopData = this.loop
      
      // add events listener
      window.addEventListener('keydown', this.eventListener)

      // add wheel event
      if(this.enableWheelEvent) {
        window.addEventListener('wheel', this.$_wheelEvent)
      }

      if (this.enableScrollLock) {
        setTimeout(() => {
          this.$_setCompensateForScrollbar()
          disableBodyScroll(this.$el)
        }, 50)
      }

      setTimeout(() => {
        this.$emit('open', this.imgIndex)
      }, 5)
    },
    open(index) {
      if (this.isVisible && isNumber(this.imgIndex)) {
        if (index !== this.imgIndex) {
          this.change(index)
        }
      } else {
        this.$_initial(index)
      }
    },
    // close event
    close() {
      // hide and stop slideshow
      this.isVisible = false
      this.imgIndex = null
      this.stopSlideShow()
      this.resetZoom()
      this.showThumbs = false

      this.$emit('close')

      // set starts X to 0
      this.startsX = 0
      this.initialMouseY = 0
      // reset swipe type
      this.swipeType = null
      this.ySwipeWrapper = 0

      // clear interval
      clearInterval(this.swipeInterval)
      this.swipeAnimation = null

      // finish swipe
      this.isDraggingSwipe = false
      this.isZooming = true

      // remove events listener
      window.removeEventListener('keydown', this.eventListener)

      if (this.enableScrollLock) {
        this.$_removeCompensateForScrollbar()
        enableBodyScroll(this.$el)
      }

      // remove resize event
      // window.removeEventListener('resize', this.$_xPositionOnResize)
      
      // remove wheel event
      if(this.enableWheelEvent) {
        window.removeEventListener('wheel', this.$_wheelEvent)
      }
    },
    closeModal(event) {
      if (!this.clickOutsideHide) return false
      // 加载中
      if (this.imageLoading) return false
      if(this.IsSwipping) return false

      const elements = [
        'img',
        'video',
        'iframe',
        'picture',
        'source',
        'svg',
        'path'
      ]
      // 如果点击元素包含 elements，则不关闭
      // 使用`event.currentTarget`，将检测区域缩到最小
      if (!matchesDom(event.target, elements, event.currentTarget)) {
        this.close()
      }
    },

    // next slide event
    next(isFromSlideshow = false) {
      if(this.isZooming) {
        return false;
      }

      if(!isFromSlideshow) {
        this.stopSlideShow()
      }

      // this.$_setSwipeAnimation()

      this.changeIndexToNext()
    },

    // prev slide event
    previous(isFromSlideshow = false) {
      if(this.isZooming) {
        return false;
      }
      
      if(!isFromSlideshow) {
        this.stopSlideShow()
      }
      
      // this.$_setSwipeAnimation()

      this.changeIndexToPrev();
    },

    // change to next index
    changeIndexToNext() {
      if(this.hasNext) {
        this.change(this.imgIndex + 1)
      } else {
        // only if has loop prop
        if(this.loopData) {
          this.change(0)
        }
      }
    },

    // change to prev index
    changeIndexToPrev() {
      if(this.hasPrevious) {
        this.change(this.imgIndex - 1)
      } else {
        // only if has loop prop
        if(this.loopData) {
          this.change(this.items.length - 1)
        }
      }
    },
    // index change
    change(index) {
      this.imgIndex = index
      this.$emit('change', index)

      setTimeout(() => {
        this.$emit('change-end', index)
      }, 400)
    },
    // check if the image is cached
    /* $_is_cached(src) {
      var image = new Image()
      image.src = src
      return image.complete
    }, */
    // image loaded event
    /* imageLoaded() {
      this.imageLoading = false
    }, */
    getItem(index) {
      try {
        const item = this.items[index]
        if (item) {
          return isObject(item) ? item : { src: item }
        }
        return {}
      } catch (error) {
        return {}
      }
    },
    checkIsVideo(index) {
      const item = this.getItem(index)
      const { mediaType, src } = item
      return mediaType ? ['video', 'webVideo'].includes(mediaType) : isVideo(src)
    },
    // get item media type
    getMediaType(index) {
      const item = this.getItem(index)
      const { mediaType, src } = item
      if (mediaType) return mediaType

      if (isYoutube(src) || isVimeo(src)) return 'webVideo'
      if (isMp4(src)) return 'video'

      const iframeTpye = ['pdf']
      if (iframeTpye.includes(fileSuffix(src))) return 'iframe'

      return 'image'
    },
    // get item thumbnail
    getItemThumb(index) {
      const item = this.getItem(index)
      const { src, thumb } = item
      if (thumb) {
        return thumb
      } else if (isYoutube(src)) {
        return getYoutubeThumb(src) || src
      } else {
        return src
      }
    },
    getVideoUrl(index) {
      const item = this.getItem(index)
      if (item && this.checkIsVideo(index)) {
        const { src } = item

        const youtubeUrl = getYoutubeUrl(src, this.youtubeCookies)
        if (youtubeUrl) return youtubeUrl
        
        const vimeoUrl = getVimeoUrl(src)
        if (vimeoUrl) return vimeoUrl

        return src
      }
      return null
    },
    // if is video get extension
    videoSourceType(index) {
      const { src, ext } = this.getItem(index)
      return videoSourceType(src, { ext })
    },

    // arrows and escape events
    eventListener(e) {
      switch (e.keyCode) {
        case 39:
          return this.next()
        case 37:
          return this.previous()
        case 38:
        case 40:
        case ' ':
          return e.preventDefault()
        case 27:
          return this.close()
      }
    },
    changeLoading(val) {
      console.log('change loading ', val)
      this.imageLoading = val
    },
    mediaLoaded(err, file) {
      this.$_setAspectRatioVideo()
    }
  }
}
</script>
