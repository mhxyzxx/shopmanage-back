<template>
  <el-container class="container">
    <!-- 公共头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="4" class="header-logo">
          <img src="@/assets/logo.jpg" alt="">
        </el-col>
        <el-col :span="19" class="header-middle">
          电商后台管理系统
        </el-col>
        <el-col :span="1">
          <a href="javascript:;" class="header-logout" @click.prevent="handleLoginOut">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 公共侧边栏 -->
      <el-aside class="aside" width="200px">
        <el-menu :default-active="$route.name" class="el-menu-vertical-demo sider-menu" :unique-opened=true :router=true @select="menuFn">
          <!-- 1 -->
          <el-submenu :index="item1.order+''" v-for="(item1, i) in menusArr" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.path+''" v-for="(item2, i) in item1.children" :key="i">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 2 -->
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="role">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </el-menu-item>
              <el-menu-item index="right">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <!-- 3 -->
          <!-- <el-submenu index="3">
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
          </el-submenu> -->
          <!-- 4 -->
          <!-- <el-submenu index="4">
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
          </el-submenu> -->
          <!-- 5 -->
          <!-- <el-submenu index="5">
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
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main class="main">
        <!-- 展示对应的内容 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      menusArr: []
    }
  },
  created () {
    // 渲染首屏数据时，加载左侧菜单
    this.getMenus()
  },
  // 下面这段代码不用写了，已经在路由配置文件中添加了路由导航守卫里了
  // beforeMount () {
  //   // 进入首页权限验证
  //   // 思路：入股用户没登录->if(!token)->改标识this.$router.push->显示login.vue
  //   // 如果登录了->if(token)->继续渲染home.vue
  //   // 代码位置：什么情况下？执行if else?-->组件渲染完成-->Vue加载完组件后
  //   // 应该在组件加载之前判断token是否存在，所以可以在beforeMount()或者是beforeCreate()
  //   if (!localStorage.getItem('token')) {
  //     this.$router.push({
  //       name: 'login'
  //     })
  //     // 并给出提示信息
  //     this.$message.warning('请先登录')
  //   }
  // },
  // mounted () {
  //   this.$router.push({
  //     name: 'home'
  //   })
  // },
  methods: {
    menuFn (index, indexPath) {
      console.log(index) // users
      console.log(indexPath) // [1, users]
      // 也可以直接使用路由配置对象中的参数，它跟上面获取的最新的值是一样的效果
      // 以上两个参数，其实在我们的路由配置中是有的，所以，我们可直接使用路由配置中的参数
      // 获取当前点击的路由数据
      // 注意：使用:default-active="$route.name",前提是路由配置中name和path是一样的。
      console.log(this.$route.name)
      // 注意：我们在菜单栏上绑定的事件menuFn根本没有用上。是因为，它的那两个参数跟我们路由配置对象中的
      // 参数是一样的效果，所以，没必要用。如果用，可以把它重新赋值给一个值也行
      // this.a = index
      // 或者也可以直接赋值给路由配置对象
      // this.$route.params.abc = index // 然后在上面的菜单上绑定该属性即可 :default-active="$route.params.abc"
    },
    // 动态导航功能
    async getMenus () {
      const res = await this.$http.get(`menus`)
      // console.log(res)
      const { data, meta: { msg, status } } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.menusArr = data
      }
    },
    // 处理退出登录
    handleLoginOut () {
      // 1. 清除toekn
      localStorage.clear()
      // 2. 跳转登录页
      this.$router.push({
        name: 'login'
      })
      // 给出相应提示
      this.$message.warning('退出成功')
    }

  }
}
</script>

<style scope>
.container {
  height: 100%;
}

.header {
  background-color: #e6e6e6;
}

.aside .sider-menu {
  height: 100%;
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
