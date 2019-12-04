<template>
  <el-card class="add-goods-wrap">
    <!-- 面包屑 -->
    <comBread level1="商品管理" level2="商品列表"></comBread>
    <!-- 带关闭按钮的alert警告框 -->
    <el-alert class="alet-box" title="添加商品信息" type="info" center show-icon>
    </el-alert>
    <!-- 歩骤条组件
      注意：active控制的是当前完成了第几步，active有多个值，这里使用变量存储，又因组件需要一个数组类型，过隐藏转换成数值型
     -->
    <el-steps :active="active*1" align-center>
      <el-step title="商品信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页
    1. 默认active初始值和name的值都是1字符串类型的
    2. 点击5个tab--被选中的tab的name值赋值给v-model的值，此时active=5
    -->
    <el-form :model="form" label-position="top" label-width="100px" class="form-wrap">
      <el-tabs tab-position="left" v-model="active" @tab-click="changeTab()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 表单元素：级联选择器
            options是数据源
            selectOptions: []是数组类型的，放你所选中的option的value值
            :props="{ expandTrigger: 'hover' }"
             -->
            {{ selectOptions }}
            <el-cascader clearable v-model="selectOptions" :options="options" :props="defaultProp" @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2, i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item, i) in arrStatic" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 图片上传功能
          1. action: 服务器目录路径(全路径网址)
          2. header:{} 请求头
          3. :on-success fn 上传成功的回调函数
          4. :on-remove fn 移除照片的回调函数
          5. 为了跟上面保持统一，我们在外部也包裹一个<el-form-item></el-form-item>
          注意：
          1. action是全路径
             为什么？axiosAPI设置了baseURL--axios的请求就不用写了，而我们上传图片发送的请求并不是使用axios发送的
          2. headers
             我们知道任何非登录请求，都要授权(就是设置头部，加token)
             axios拦截器--config.headers['Authorization']='token'这是Axios里面设置请求头的--针对的是axios请求
             而我们需要写自己的请求头，如下：可参考element-ui组件中上传图片的一些参数说明
           -->
          <el-form-item>
            <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :on-success="handleSuccess"
              :on-remove="handleRemove" list-type="picture" :headers="headers">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item label="商品内容">
            <el-button class="add-btn" type="success" plain @click="addGoods()">添加商品</el-button>
            <!-- 使用组件，由官网API可知quill-editor是表单元素，可使用v-model绑定数据 -->
            <quillEditor class="quill-box" v-model="form.goods_introduce"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>

</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      active: '1',
      // 表单参数说明：
      // goods_cat 是以','分割的分类列表，不能为空，但我们是数组[1,2,3]--它要的是"1,2,3"
      // pics 上传的图片临时路径(对象) 可以为空
      // pics的类型可以是以下几种情况：
      // 1. pics: tmp_path 人家说明是对象了，所以这种情况不可能，那么pics要么是是数组或对象，判断可能是临时路径是对象，那么pics就是数组了,又接口API文档可知是数组
      // 2. pics: {tmp_path: ?}
      // 3. pics容器:--> {tmp_path: ?}
      // pics: [{tmp_path: 临时路径}]
      // attrs 商品的参数(数组) 可以为空，attrs它是来源于静态参数和动态参数
      // attrs经分析可知：attrs：[{"attr_id":？, "attr_value":？}]-->?的来源是arrDy和arrStatic中每个对象的attr_id和attr_value
      // 我们需要把动态参数和静态参数中所需要的值取出来，然后构造出它想要的数据格式
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 级联使用的数据
      selectOptions: [1, 3, 6], // 默认选择三级分类
      options: [],
      defaultProp: { // 配置项
        label: 'cat_name',
        value: 'cat_id',
        children: 'children', // key-value相同时，可以不写，见文档说明
        expandTrigger: 'hover'
      },
      // 动态参数数组
      arrDy: [],
      arrStatic: [],
      // 设置头部参数
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 获取三级商品分类的数据
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3`)
      console.log(res)
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    handleChange (value) {
      console.log(value)
    },
    // 点击任何tab都会触发该事件
    async changeTab () {
      // 1. 如果点了第二个tab
      if (this.active === '2' || this.active === '3') {
        // 2. 如果没有选择三级分类，给出相应提示
        if (this.selectOptions.length !== 3) {
          // 提示
          this.$message.error('请先选择三级分类！')
          if (this.active === '2') {
            this.arrDy = [] // 清空数组
          } else {
            this.arrStatic = [] // 清空数组
          }
          return
        }
        // 获取静态数组
        if (this.active === '3') {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=only`)
          const { meta: { msg, status }, data } = res.data
          if (status === 200) {
            this.arrStatic = data
            console.log(this.arrStatic)
          }
        }
        // 获取动态参数数据
        if (this.active === '2') {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=many`)
          // console.log(res);
          const { meta: { msg, status }, data } = res.data
          if (status === 200) {
            this.arrDy = data
            console.log(this.arrDy)
            // this.arrDy中的attr_vals是字符串，并不是我们想要的结果，我们需要的是一个数组
            // "abc, def, efef" -> [abc, def, efef]
            this.arrDy.forEach(item => {
              // 为了避免后台返回的字符串中有空格，要先处理下空格 " a,b,d  "
              // 这样还不行，要是后台返回""空字符串，"".split(',')是会报错的，所以要判断下
              // 如果 ""怎么做
              // 如果不是""-->split(',')
              // if (item.attr_vals.trim().length === 0) {
              //   // 如果是空字符串的话，是不能够遍历的，否则会报错，所以，我们给它一个空数组
              //   item.attr_vals = [];
              // } else {
              //   item.attr_vals = item.attr_vals.trim().split(',');
              // }
              // 以上判断还可改写为三元表达式
              item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')

              console.log(item.attr_vals)
            })
          }
        }
      }
    },

    // 图片上传方法
    handleRemove (file, fileList) {
      // console.log('Remove----');
      // console.log(file);
      // console.log(fileList);
      // 临时路径  file.response.data.tmp_path;
      // 组件中上传图片的方法：后台返回上传成功，其实是假的，它会把图片放在你服务器的临时路径里。
      // 而真正的上传是你填完表单后，点击“添加商品”按钮后提交

      // findIndex 能遍历、能返回条件return a>b、能返回符合条件的索引（是Es6新增的API）
      const Index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path // 看你每个元素的路径是否等于当前选中的文件的路径
      })

      this.form.pics.splice(Index, 1)
      // console.log(this.form.pics)
    },
    handleSuccess (response, file, fileList) {
      // console.log('Success----');
      // console.log(response);
      // 临时路径  file.response.data.tmp_path;
      this.form.pics.push({
        pic: response.data.tmp_path
      })
      // console.log(this.form.pics)
    },

    // 添加商品
    async addGoods () {
      // 发送请求前，根据接口的参数先处理下要提交的参数
      // 1. 处理goods_cat
      this.form.goods_cat = this.selectOptions.join(',')

      // 2. 处理pics,经分析它默认是个空数组，里面放的是临时路径，所以你要在有临时路径的地方(handleSuccess,handleRemove)给它赋值
      // 在this.form.pics-->图片上传方法中使用splice和push处理

      // 3. 处理attrs [{"attr_id":？, "attr_value":？}]
      // 动态参数数组( 能遍历、能返回数组(你写啥它就会返回啥) （map方法）)
      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      // console.log(arr1);
      // 知识补充：除了上面简便方法外，也可使用如下方法：
      // const arr1 = [];
      // const obj1 = { attr_id: "", attr_value: "" };
      // this.arrDy.forEach(item => {
      //   obj1.attr_id = item.attr_id;
      //   obj1.attr_value = item.attr_vals;
      //   arr1.push(obj1)
      // })

      // 静态数据
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      // console.log(arr2);
      // 合并数组
      this.form.attrs = [...arr1, ...arr2]
      // console.log(this.form.attrs);

      // 发送请求
      const res = await this.$http.post(`goods`, this.form)
      const { meta: { msg, status }, data } = res.data
      console.log(res)
      if (status === 201) {
        // 添加成功的提示
        this.$message.success(msg)
        // 回到列表页
        this.$router.push({
          name: 'goods'
        })
      } else {
        // 添加失败的提示
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style scope>
.add-goods-wrap {
  height: 100%;
}
.add-goods-wrap .alet-box {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form-wrap {
  height: 350px;
  overflow: auto;
}
.form-wrap .add-btn {
  margin-bottom: 5px;
}
/* 富文本编辑的默认高度 */
.ql-editor .ql-blank {
  min-height: 200px;
}
</style>
