<template>
  <el-container class="container">
    <!-- 公共头部 -->
    <el-header class="header">
      <el-row>
        <el-col
          :span="4"
          class="header-logo"
        >
          <img
            src="@/assets/logo.jpg"
            alt=""
          >
        </el-col>
        <el-col
          :span="19"
          class="header-middle"
        >
          电商后台管理系统
        </el-col>
        <el-col :span="1">
          <a
            href="javascript:;"
            class="header-logout"
          >退出</a>
        </el-col>
      </el-row>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 公共侧边栏 -->
      <el-aside
        class="aside"
        width="200px"
      >
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :unique-opened=true
          :router=true
          @open="handleOpen"
          @close="handleClose"
        >
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </el-menu-item>
              <el-menu-item index="1-2">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 3-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
              </el-menu-item>
              <el-menu-item index="1-2">
                <i class="el-icon-menu"></i>
                <span>分类参数</span>
              </el-menu-item>
              <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                <span>商品分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>数据报表</span>
              </el-menu-item>
              <el-menu-item index="1-2">
                <i class="el-icon-menu"></i>
                选项2
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
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
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
.container {
  height: 100%;
}

.header {
  background-color: #e6e6e6;
}
.aside {
  background-color: pink;
}
.header .header-middle {
  text-align: center;
  line-height: 60px;
  color: #6fb286;
  font-weight: 600;
}
.header .header-logout {
  text-decoration: none;
  line-height: 60px;
  color: #19acce;
}
.main {
  background-color: yellow;
}
</style>
