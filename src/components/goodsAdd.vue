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
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane name="1" label="商品信息">商品信息</el-tab-pane>
      <el-tab-pane name="2" label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      active: '1'
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
</style>
