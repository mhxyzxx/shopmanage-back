import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import User from '@/components/user.vue'
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
            }]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})

export default router