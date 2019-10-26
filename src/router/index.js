import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import User from '@/components/user.vue'
import Right from '@/components/right.vue'
import Role from '@/components/roles.vue'
import GoodsList from '@/components/goodsList.vue'
import GoodAdd from '@/components/goodsAdd.vue'
import {
    Message
} from 'element-ui'
Vue.use(Router)

const router = new Router({
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
                    path: '/goodsadd', // 因是后台返回，这里必须是/goods
                    name: 'goodsadd',
                    component: GoodAdd
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
            //2. 有token --> next()
            next()
        }
    }
})

export default router