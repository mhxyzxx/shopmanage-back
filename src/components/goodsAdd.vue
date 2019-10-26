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
