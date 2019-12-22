<template>
  <!-- 富文本容器 -->
  <div ref="editor" style="text-align:left"></div>
</template>

<script>
import E from 'wangeditor' // 富文本编辑器
// import { upload } from '@/api/index'

export default {
  name: 'RichTextEditor',
  props: ['content'],
  data () {
    return {
      editorContent: ''
    }
  },

  /**
   * 凡是涉及到在初始化的时候需要操作 DOM 的时候，必须写到 mounted 中
   * 因为被 Vue 管理的模板只有在 mounted 挂载完成之后才可以获取到 DOM
   * 记住：只有 mounted 挂载完成之后，才可以通过 this.$refs.xxx 获取到 DOM 元素
   */
  mounted () {
    // 操作 DOM 初始化富文本编辑器
    // this.$refs.editor 就是编辑器容器 DOM 节点
    var _this = this
    var editor = new E(this.$refs.editor)

    // 配置服务器端地址,这里可以先写为空，因为必须有这个配置项才会看到那个上传本地图片的功能，因为这里还不需要发送请求，
    // 发送请求的是下面axios中的upload接口
    editor.customConfig.uploadImgServer = ''

    editor.customConfig.customUploadImg = (files, insert) => {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      // 这个是采用封装过的upload接口，然后发送请求的方法。因这里我并没封装接口，所以，采用下面的发送请求的方法，效果是一样的
      // const { data, meta } = upload(files)
      // if (meta.status === 200) {
      //   insert(`http://localhost:8888/${data.tmp_path}`)
      // }
      const fomData = new FormData()
      fomData.append('file', files[0])
      _this.$http.post('upload', fomData).then(res => {
        console.log(res.data)
        insert(`http://localhost:8888/${res.data.data.tmp_path}`)
      })

      // 上传代码返回结果之后，将图片插入到编辑器中
      // 调用该方法，生成 img 标签，src 指向传递的 imgUrl
      // imgUrl？是上传到服务器的服务端图片访问路径，一个 Web 访问路径 http://xxxx.jpg
      // insert('http://img.redocn.com/201808/20180817/20180817_3beb7f1d22ca9c33139biwRzfgXcizir.png')
    }

    // // 自定义 fileName
    // editor.customConfig.uploadFileName = 'file'

    // // 配置请求上传自定义请求头：添加 token
    // editor.customConfig.uploadImgHeaders = {
    //   Authorization: getToken()
    // }

    // 当编辑器中的内容发生改变的时候，将数据同步到了 Vue 组件中的  formData.goods_introduce 中了
    editor.customConfig.onchange = (html) => {
      // 第三种方式：
      // props 数据是单向的，不会将修改传导给父组件绑定的数据,规则就是这样
      // this.content = '456'

      // 我们还是要使用发布自定义事件的方式来修改子组件，从而影响父组件。
      // 参考文档：https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
      // 这里必须是发布 update:props属性名 事件
      this.$emit('update:content', html)

      // 第二种方式：把富文本编辑的内容，传到外部使用(使用子传父，自定义函数的方式来传递参数)
      // 发布自定义事件
      // 可以传参
      // this.$emit('editor-change', html)

      // 第一种方式：把文本编辑器的内容赋值给它内部使用
      // this.editorContent = html
    }

    // 创建生成
    editor.create()
  }
}
</script>

<style>
</style>
