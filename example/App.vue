<template>
<div id="app">
  <article id="article">
    <h1>Debug Faster in JavaScript!</h1>
    <section>
      <p>
        <q>“If debugging is the process of removing bugs, then programming must be the process of putting them in,” said late computer scientist Edsger W. Dijkstra.</q>
      </p>
      <p>That’s funny because it is true! Though not intentionally, we introduce bugs while we code. Sometimes, even a bug-free code can start failing when some of the parameters related change. Even a simple aspect of rolling it out to different geography can confound the code. It works on Chrome — great! But it fails on Internet Explorer (I know, no one uses it but, what if someone opens it by mistake).</p>
      <p>Anyway, the bottom line is a developer should know how to debug the code. Most great developers are excellent at debugging. All debugging requires is a good grasp of basics and critical thinking skills. However, we can have some methodologies in place and use some cool tools to aid debugging. The purpose of this article is to go over a few strategies and gloss over some tools that help our life easier.</p>
      <p>Before diving into the strategies of debugging in Javascript, let’s see what’s an error.</p>
      <p>In any program, when the code does not work as expected, it produces incorrect results or no result resulting in an error. But how does an error occur? Many sources introduce errors into a program. Here are a few: requirement gathering, architecture/design, coding. Understanding the origin of an error is important but, it is not resourceful in the debugging process.</p>
      <p>For the context of this document, we will focus on the classification based on the types.</p>
      <h3>Types of Errors</h3>
      <p>Syntax Errors are the errors caught generally by the compiler and reported via error messages. The messages indicate what is causing the error.</p>
      <p>As you can see in this example, the editor displays the error message with what caused the error.</p>
      <p>Logical Errors: These errors occur either the algorithm or its implementation is incorrect. In these cases, the programmer must re-think the logic for the algorithm or the algorithm itself. This time with corner cases in mind to ensure all scenarios are covered, more on this later.</p>
      <p>Typos and other simple errors: A missing parentheses or misspelled keywords are undetected by the compiler and, these are easily fixable once identified. But identifying them, well, we can write a novel on that. Many programmers can tell stories about sleepless nights due to typos. There are some guard rails we can use to avoid as much as possible.</p>
      <h3>Strategies to debug an error</h3>
      <p>Some strategies can help locate the error and figure out the symptoms that are causing it. Keep in mind that there is no size fits all!! However, one good rule of thumb is to insert some debugging artifacts into the code. Writing the code with an emphasis on debugging is beneficial in two folds.</p>
      <p>
        <q>It helps with debugging in case of errors.</q>
        <q>We are less likely to introduce coding errors.</q>
        <q>So let’s discuss what tools are at our disposal for debugging that we can code into our program.</q>
      </p>
      <h4>console.error()</h4>
      <p>This method is used for testing purposes and used in HTML an error message in the console. By placing console.error() at the right places in your code, you can identify what part of the code is throwing the error.</p>
      <h4>console.warn()</h4>
      <p>console.warn() is used to write a warning message in the console. This method will not interrupt the code and, developers can use this code to give a warning for any user action.</p>
      <h4>console.table()</h4>
      <p>Sometimes you are dealing with some complex objects and, instead of scrolling through the list, this method displays the data in the tabular form!</p>
      <h4>Back-Tracking the problem</h4>
      <p>One option is to start tracking the error at the specified line of the code and work all the up to the start could help solve the error.</p>
      <h4>Debugger</h4>
      <p>Another tool you can use to debug the error is by invoking the debugger statement. When the execution reaches this statement, the execution stops at this point.</p>
      <p>With Debugger, you can also set breakpoints. When the code reaches the breakpoint, execution stops. We can go over multiple functions, variables and program expressions during the execution will give all the information about the code.</p>
      <h4>Insert console.log() wherever possible</h4>
      <p>Inserting console.log() in the code gives a clear idea of what the code is executing. It helps to identify if a variable is returning undefined or the expected value.</p>
      <h4>Testing out the code as you progress</h4>
      <p>This strategy is helpful when you are writing more than ten lines of code!!! It helps to break down the process of creating a web page. You can test out the fragments of code which becomes much easier to resolve the errors. It makes life easier to write the code and becomes easier to debug. With fragmented code, the developer does not become overwhelmed with the long list of errors.</p>
      <h4>Write test cases to test out the logic of the code (Assertions)</h4>
      <p>Assertions are conditions you can place on any of the data types at any point in the code.</p>
      <p>If the condition evaluates to 0 or false, the assertion throws an error or warning.</p>
      <p>With assertions, we can identify where the code stopped as soon as the assertion fails. In most cases, it is likely we can infer which part of the code is causing the problem. One of the methods you can also use for the assertion is console.assert() method.</p>
      <p><q>Some other strategies help with the debugging:</q></p>
      <ol>
        <li>The error might not be where you are expecting it to be. You probably might have spent enough time on one piece of code. Focussing on other parts of code might help to identify the problem.</li>
        <li>Explaining your code to yourself or others can help with identifying where the problem is. It’s called rubber ducking.</li>
        <li>Divide and conquer. First, identify the part of the code which is working correctly. Using that as the baseline, try to debug in steps till you zero down on the problem.</li>
        <li></li>
      </ol>
      <p>So that is all I have. I will keep updating this document as and when I find new bugs that give me sleepless nights. Of course, with learnings and new ways to debug the code.</p>
      <p><strong>via:</strong> https://javascript.plainenglish.io/debug-faster-in-javascript-26d2ad3942d9</p>
    </section>
  </article>
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
    theme="dark"
    v-if="itemIndex !== null"
    ref="view"
    container="#article"
    :items="items"
    :index.sync="itemIndex"
    :show-gallery="false"
    useZoomBar
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
          src: 'https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80',
          srcset: 'https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=387&amp;q=80 387w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=687&amp;q=80 687w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=774&amp;q=80 774w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=987&amp;q=80 987w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1287&amp;q=80 1287w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1374&amp;q=80 1374w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1587&amp;q=80 1587w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1887&amp;q=80 1887w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1974&amp;q=80 1974w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2187&amp;q=80 2187w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2487&amp;q=80 2487w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2574&amp;q=80 2574w, https://images.unsplash.com/photo-1635988936044-66298f617d29?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2618&amp;q=80 2618w',
          sizes: '(max-width: 767px) 100vw, (max-width: 419px) min(100%, 387px), (max-height: 756px) min(100%, 387px), (min-aspect-ratio: 2618/3927) calc((calc(100vh - 175px)) * 0.666667), calc(100vw - 32px)'
        },
        'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/MaterialMangerApp-iOS-Video/23362/202111041811492052.mp4',
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
  font-size: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
article{
  // display: none;
  position: relative;
  max-width: 992px;
  margin: 0 auto;
  font-size: 1.2em;
  text-align: justify;
  h1{
    text-align: center;
  }
  section{
    padding: 0 2em 2em;
  }
  p{
    text-indent: 1em;
  }
}

.item-list{
  display: flex;
  flex-wrap: wrap;
}
</style>
