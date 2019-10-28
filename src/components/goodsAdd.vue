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
        <el-tab-pane name="3" label="商品属性">商品属性--</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片--</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容--</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>

</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      active: '1',
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: '',
        attrs: ''
      },
      // 级联使用的数据
      selectOptions: [1, 3, 6], // 默认选择三级分类
      options: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children', // key-value相同时，可以不写，见文档说明
        expandTrigger: 'hover'
      },
      // 动态参数数组
      arrDy: [],
      arrStatic: []
    }
  },
  created () {
    this.getGoodsCate();
  },
  methods: {
    // 获取三级商品分类的数据
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.options = data;
        console.log(this.options)
      }
    },
    handleChange (value) {
      console.log(value);
    },
    // 点击任何tab都会触发该事件
    async changeTab () {
      // 1. 如果点了第二个tab
      if (this.active === "2" || this.active === "3") {
        // 2. 如果没有选择三级分类，给出相应提示
        if (this.selectOptions.length !== 3) {
          // 提示
          this.$message.error('请先选择三级分类！')
          return;
        }
        // 获取静态数组
        if (this.active === "3") {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=only`);
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            console.log(this.arrStatic);
          }
        }
        // 获取动态参数数据
        if (this.active === "2") {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=many`);
          // console.log(res);
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrDy = data;
            console.log(this.arrDy);
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
              item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',');

              console.log(item.attr_vals);
            })
          }
        }
      }
    }
  }
}
</script>

<style>
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
</style>
