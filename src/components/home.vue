<template>
  <el-container class="container">
    <el-header class="header">Header</el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
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
  background-color: red;
}
.aside {
  background-color: pink;
}
.main {
  background-color: yellow;
}
</style>
