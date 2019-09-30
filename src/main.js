import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.css'
import App from './App'
import router from './router'
import axios from 'axios'
import moment from 'moment'
// 配置基础路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

// 全局过滤器，处理日期格式
Vue.filter('fmtdate', v => {
        return moment(v).format('YYYY-MM-DD')
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})