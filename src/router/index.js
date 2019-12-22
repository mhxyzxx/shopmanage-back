import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
// 按需加载
const Login = () => import('@/components/login.vue')
const Home = () => import('@/components/home.vue')
const User = () => import('@/components/user.vue')
const Right = () => import('@/components/right.vue')
const Role = () => import('@/components/roles.vue')
const GoodsList = () => import('@/components/goodsList.vue')
const GoodAdd = () => import('@/components/goodsAdd.vue')
const CateParams = () => import('@/components/cateParams.vue')
const GoodsCate = () => import('@/components/goodsCate.vue')
const Order = () => import('@/components/order.vue')
const Reports = () => import('@/components/reports.vue')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    children: [{
      path: '/users',
      name: 'users',
      component: User
    },
    {
      path: '/rights',
      name: 'rights',
      component: Right
    },
    {
      path: '/roles',
      name: 'roles',
      component: Role
    },
    {
      path: '/goods', // 因是后台返回，这里必须是/goods
      name: 'goods',
      component: GoodsList
    },
    {
      path: '/goodsadd', // 不是后台返回，这里可以自己随便写
      name: 'goodsadd',
      component: GoodAdd
    },
    {
      path: '/params', // 因是后台返回，这里必须是/params
      name: 'params',
      component: CateParams
    },
    {
      path: '/categories', // 因是后台返回，这里必须是/params
      name: 'categories',
      component: GoodsCate
    },
    {
      path: '/orders', // 因是后台返回，这里必须是/params
      name: 'orders',
      component: Order
    },
    {
      path: '/reports', // 因是后台返回，这里必须是/reports
      name: 'reports',
      component: Reports
    }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
  ]
})

// 路由导航守卫(保安)
// 任何路由标识变化-->会来到路由配置-->它会自动来到路由守卫-->渲染组件
/**
 * to---> 要去的路由配置对象(name)
 * from---> 当前的路由配置对象(name)
 * next---> 方法next()-->让路由配置继续生效
 */
router.beforeEach((to, from, next) => {
  // console.log('路由守卫执行---')
  // console.log(to)
  // console.log(from)
  // next()
  // 如果要是login-->next
  // 如果不是login,1. 判断是否有token,如果没有就去登录，如果有就next
  if (to.name === 'login') {
    next()
  } else {
    // 1.!token --> 去登录
    const token = localStorage.getItem('token')
    if (!token) {
      // 并给出提示信息
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
    } else {
      // 2. 有token --> next()
      next()
    }
  }
})

export default router
