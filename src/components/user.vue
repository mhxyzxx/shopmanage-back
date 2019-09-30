<template>
  <!-- 卡槽 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框及按钮 -->
    <el-row class="serch-box">
      <el-col>
        <!-- 搜索框 -->
        <el-input
          placeholder="请输入内容"
          v-model="input3"
          class="input-text"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          plain
        >主要按钮</el-button>
      </el-col>
    </el-row>
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
.box-card {
  height: 100%;
}
.serch-box {
margin-top: 12px;
}
.box-card .input-text {
  width: 300px;
}
</style>
