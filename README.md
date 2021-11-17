# vue-lightbox-lite

A lightweight image, video and iframe lightbox gallery component for Vue. Supports slide, zoom, rotation, autoplay, captions  and so on, based on [Vue-cool-lightbox](https://github.com/lucaspulliese/vue-cool-lightbox).

轻量级的图片/视频 预览器，支持自动播放、旋转、缩放、全屏、键盘及手势滑动切换等。

![default screenshot](https://cdn.jsdelivr.net/gh/Meqn/vue-lightbox-lite/src/assets/screen_default.jpg)

![light screenshot](https://cdn.jsdelivr.net/gh/Meqn/vue-lightbox-lite/src/assets/screen_light.jpg)

## Features
1. No external dependencies.
2. Fully responsive.
3. autoplay slides that play or pause
4. Full screen support.
5. Multiple zoom levels.
6. Rotate images.
7. YouTube Vimeo and html5 videos Support.
8. Keyboard Navigation for desktop.
9. And many more.


## Installation

```bash
npm install vue-lightbox-lite

# 或

yarn add vue-lightbox-lite
```

## Usage

### 1. Fully import

In main.js:
```js
// main.js
import VueLightbox from 'vue-lightbox-lite'
import 'vue-lightbox-lite/dist/index.css'

Vue.use(VueLightbox)
```

In `component.vue`
```html
<template>
<div class="lightbox">
  <ul class="list">
    <li v-for="(item, key) in list" :key="key" @click="index = key">link - {{ key }}</li>
  </ul>

  <LightBox
    :index="index"
    :items="list"
  />
</div>
</template>

<script>
export default {
  data() {
    return {
      index: null,
      list: [
        'http://www.domain.com/image.jpg',
        'http://www.domain.com/video.mp4',
        {
          src: 'http://www.domain.com/playgame/',
          mediaType: 'video',
          ext: 'webm',
          title: '',
          description: ''
        },
        'https://www.youtube.com/watch?v=d0tU18Ybcvk',
        {
          src: 'https://www.youtube.com/watch?v=d0tU18Ybcvk',
          mediaType: 'webVideo'
        },
        {
          src: 'http://www.domain.com/file.pdf',
          mediaType: 'iframe'
        }
      ]
    }
  }
}
</script>
```

### 2. On demand

In Single File Components

```html
<template>
<div class="lightbox">
  <button @click="index = 0">preview</button>

  <Viewer
    :index="index"
    :items="list"
  />
</div>
</template>

<script>
import VueLightbox from 'vue-lightbox-lite'
import 'vue-lightbox-lite/dist/index.css'

export default {
  component: {
    Viewer: VueLightbox.component
  },
  data() {
    return {
      index: null,
      list: [
        'http://www.domain.com/image.jpg',
        'http://www.domain.com/video.mp4',
        'http://www.domain.com/file.pdf'
      ]
    }
  }
}
</script>
```


## API


### Items attributes
| Name        | Type           | Default | Description                                         |
| ----------- | -------------- | ------- | --------------------------------------------------- |
| src         | String         |         | Url of the image/video/iframe                       |
| mediaType   | String         | `image` | media type,  `image`, `video`, `webVideo`, `iframe` |
| ext         | String         |         | e.g. `mp4`, `ogg`, `webm`, `pdf`                    |
| thumb       | String         |         |                                                     |
| alt         | String         |         |                                                     |
| srcset      | String         |         |                                                     |
| sizes       | String         |         |                                                     |
| title       | String         |         |                                                     |
| description | String         |         |                                                     |
| width       | String\|Number | `auto`  | Control width, `video` & `iframe`                   |
| height      | String\|Number | `auto`  |                                                     |
| maxWidth    | String\|Number | `auto`  |                                                     |
| maxHeight   | String\|Number | `auto`  |                                                     |


### props

| Name             | Type                    | Default                          | Description                                                  |
| ---------------- | ----------------------- | -------------------------------- | ------------------------------------------------------------ |
| index            | Number                  | null                             | Index of items to open                                       |
| items            | Array<Object \| String> |                                  | Array of images/videos                                       |
| container        | Element \| String       | `document.body`                  |                                                              |
| theme            | String                  | `dark`                           | `dark`, `light`                                              |
| customClass      | String                  |                                  |                                                              |
| zIndex           | Number                  | `9999`                           |                                                              |
| highColor        | String                  | `#fa4242`                        | progressbar color and thumbnails border-color                |
| overlayColor     | String                  |                                  |                                                              |
| navigator        | Boolean                 | `true`                           |                                                              |
| toolbar          | Array<String>           |                                  | toolbar: `counter`, `zoom`, `slide`, `rotate`, `gallery`, `fullscreen`, `download`, `close` |
| loop             | Boolean                 | `true`                           |                                                              |
| slideDuration    | Number                  | `3500`                           |                                                              |
| showGallery      | Boolean                 | `false`                          |                                                              |
| galleryPosition  | String                  |                                  | `right`, `bottom`                                            |
| video            | Object                  | `{autoplay: false, raito: 16/9}` | video parameter，`autoplay`, `width`,`height`,`maxWidth`,`maxHeight` |
| iframe           | Object                  |                                  | `width`,`height`,`maxWidth`,`maxHeight`                      |
| enableWheelEvent | Boolean                 | `false`                          |                                                              |
| enableScrollLock | Boolean                 | `true`                           |                                                              |
| clickOutsideHide | Boolean                 | `true`                           |                                                              |




### Slots
- `loading`
- `icon-previous`
- `icon-next`

### Events

- `open(index: number)`
- `close`
- `change(index: number)`
- `change-end(index: number)`


### Methods

- `open(index)`
- `close()`
- `previous()`
- `next()`
- `change(index)`

