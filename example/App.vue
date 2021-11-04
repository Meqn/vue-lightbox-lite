<template>
<div id="app">
  <h1>Viewer-Lite</h1>
  <div class="item-list">
    <img
      style="width:100px;height:100px;"
      v-for="(item, key) in items"
      :key="key"
      :src="item"
      alt=""
      @click="handleOpen(key)"
    >
  </div>

  <Viewer
    ref="view"
    :items="items"
    :index.sync="itemIndex"
    :slideshow="true"
    :gallery="true"
    :fullScreen="true"
    download
    clickOutsideHide
    :useZoomBar="true"
    :disableZoom="false"
    thumbsPosition="right"
    @open="onOpen"
    @close="onClose"
  />
</div>
</template>

<script>
import Viewer from '../src/index.vue'
export default {
  name: 'App',
  components: {
    Viewer
  },
  data () {
    return {
      itemIndex: null,
      items: [
        {
          src: 'http://test-static-huariot-com.oss-cn-hangzhou.aliyuncs.com/material_upload/1634894586473_1vl2wewu.jpg',
          title: '这里是图片的大标题',
          description: '图片内容介绍...图片内容介绍图片内容介绍图片内容介绍图片内容介绍图片内容介绍图片内容介绍'
        },
        'http://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:*',
        'https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
        {
          src: 'https://vue-cool-lightbox.lucaspulliese.com/video.mp4',
          autoplay: true
        },
        {
          src: 'https://www.youtube.com/watch?v=d0tU18Ybcvk',
          autoplay: true,
          title: '这里是图片的大标题',
          description: '图片内容介绍...图片内容介绍图片内容介绍图片内容介绍图片内容介绍图片内容介绍图片内容介绍'
        },
        'http://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/1635146506840/170efa78-f67e-4367-b807-13860727ae60.pdf',
        {
          src: 'http://test-static-huariot-com.oss-cn-hangzhou.aliyuncs.com/material_upload/1634894456554_jqyw8jh0.mp4',
          thumb: 'http://test-static-huariot-com.oss-cn-hangzhou.aliyuncs.com/material_upload/1634894456554_jqyw8jh0.mp4?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast',
        },
        {
          src: 'http://www.zaiont.com',
          mediaType: 'iframe'
        },
        {
          src: 'https://github.dev/lucaspulliese/vue-cool-lightbox/blob/master/src/components/CoolLightBox.vue',
          mediaType: 'iframe'
        }
      ]
    }
  },
  methods: {
    handleResize(val, el) {
      console.log('resize : ', val, el)
    },
    handleResize2(val, el) {
      console.log('v-resize : ', val)
    },
    onViewPlay() {
      this.$refs['view'].open(5)
    },
    handleOpen(index, num) {
      this.itemIndex = index
    },
    onOpen(a) {
      console.log('event open', a)
    },
    onClose(a) {
      console.log('event close', a)
      this.index = a
      // this.showView = false
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  width: 100%; height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.item-list{
  display: flex;
}
</style>
