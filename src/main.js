import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.css'
import App from './App'
import ComBread from '@/components/comBread.vue'
import HttpServer from '@/http.js'
import router from './router'
import moment from 'moment'

// 所有的Vue插件都是这样使用的
// 希望这样用
// 把不是Vue插件axios变成Vue插件
// Vue.use(axios)
// 我们可以去Vue官网查看编写插件的API文档
Vue.use(HttpServer)

Vue.use(ElementUI)
Vue.config.productionTip = false

// 全局过滤器，处理日期格式
// 这个全局过滤器没有设置自己的参数，参数是在函数里面传的
Vue.filter('fmtdate', v => {
  return moment(v).format('YYYY-MM-DD')
})

// 注册全局公共组件
// Vue.component('comBread', ComBread);
// 也可以使用下面的写法
Vue.component(ComBread.name, ComBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
