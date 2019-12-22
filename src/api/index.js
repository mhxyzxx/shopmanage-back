/**
 * 公共的接口封装
 * 我们不建议直接在每一个业务中去直接请求具体的请求路径
 * 我们建议把每一个请求都封装一下
 *     1. 如果接口变了，我们直接找到封装的位置修改即可
 *     2. 可以重用
 *     3. 便于维护
 */
// 引入封装好的axios
import Http from '@/http.js'

/**
 * 用户登录
 */
// export const login = data => request({
//   method: 'POST',
//   url: '/login',
//   data: { // POST 参数
//     username: data.username,
//     password: data.password
//   }
// }).then(res => res.data)

/**
 * 文件上传
 */
export const upload = files => {
  const fomData = new FormData()
  fomData.append('file', files[0])
  Http.post('upload', fomData).then(res => res.data)
}
