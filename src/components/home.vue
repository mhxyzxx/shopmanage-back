<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4" class="header-logo">
          <img src="@/assets/logo.jpg" alt="">
        </el-col>
        <el-col :span="19" class="header-middle">
          电商后台管理系统
        </el-col>
        <el-col :span="1">
          <a href="javascript:;" class="header-logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside
        class="aside"
        width="200px"
      >Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
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
.container {
  height: 100%;
}

.header {
  background-color: #E6E6E6;
}
.aside {
  background-color: pink;
}
.header .header-middle {
  text-align: center;
  line-height: 60px;
  color: #6FB286;;
  font-weight: 600;
}
.header .header-logout {
  text-decoration: none;
  line-height: 60px;
  color: #19ACCE;
}
.main {
  background-color: yellow;
}
</style>
