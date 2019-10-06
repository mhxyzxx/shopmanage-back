import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import User from '@/components/user.vue'
import Right from '@/components/right.vue'
import Role from '@/components/roles.vue'
Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            name: 'home',
            component: Home,
            children: [{
                    path: '/user',
                    name: 'user',
                    component: User
                },
                {
                    path: '/right',
                    name: 'right',
                    component: Right
                },
                {
                    path: '/role',
                    name: 'role',
                    component: Role
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

export default router