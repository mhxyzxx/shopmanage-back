<template>
  <el-card class="cate-wrap">
    <!-- 面包屑 -->
    <comBread level1="商品管理" level2="商品参数"></comBread>
    <!-- 带关闭按钮的alert警告框 -->
    <el-alert class="alet-box" title="添加商品信息" type="warning" show-icon>
    </el-alert>
  </el-card>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {

    }
  }
}
</script>

<style>
.cate-wrap {
  height: 100%;
}
.cate-wrap .alet-box {
  margin-top: 20px;
}
</style>
