import axios from 'axios'
import { Message } from 'element-ui'
const HttpServer = {}

HttpServer.install = function(Vue) {
    // 配置基础路径
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

    // this.$http.get(url)-->请求拦截器处理-->发送请求
    axios.interceptors.request.use(function(config) {
            // 在发送请求之前做些什么
            console.log('请求拦截器被触发了-----')

            // 所有请求发起之后，进行筛选，请求标识是不是login
            // 如果标识是login,不要请求头-->请求继续发起
            // 如果请求标识不是login,先设置头部，再发送请求
            if (config.url !== 'login') {
                const AUTH_TOKEN = localStorage.getItem('token')
                    // 这个是axios给你提供的设置的请求,也可以，我们也可使用config里面的headers进行设置
                    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN // 设置请求头
                config.headers['Authorization'] = AUTH_TOKEN // 设置请求头
                    // 也可以这样写config.headers.Authorization = token
            }

            // console.log(config)
            return config
        },
        function(error) {
            // 对于请求错误做些什么
            return Promise.reject(error)
        }
    );

    // 响应拦截器的处理
    // axios.interceptors.response.use(function(response) {
    //     // 对响应数据做点什么
    //     console.log('res响应拦截器---');
    //     // 统一处理status非200和201的情况--->给出提示
    //     const { meta: { msg, status }, data } = response.data;
    //     if (status !== 200 && status !== 201) {
    //         Message.warning(msg);
    //     }
    //     return response;
    // }, function(error) {
    //     // 对响应错误做点什么
    //     return Promise.reject(error);
    // });

    // 4. 添加实例方法
    // 给Vue实例的原型上添加成员(这是vue官网开发插件的第四种方式，挂载在原型上的)
    Vue.prototype.$http = axios
}
export default HttpServer