<template>
  <!-- 注意为了方面调整样式在最外部包了一个div -->
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 之前:异步操作的结果必须出现.then方法里面-->嵌套
    // 现在希望: 让异步代码看起来像同步, 好处: 没有函数嵌套
    // 解决办法：Es7的新特性 async,await
    async handleLogin () {
      const res = await this.$http.post('login', this.formdata)
      // console.log(res)
      // const { data: { data: {token}, meta: { msg, status } } } = res
      const { data: { data, meta: { msg, status } } } = res
      if (status === 200) {
        // this.$message({
        //   message: msg,
        //   type: 'success'
        // })
        // 保存token值

        if (data.data !== 'null') {
          // console.log('33333')
          localStorage.setItem('token', data.token)
        }
        // 登录成功后，跳到主页
        // 渲染home.vue组件-->改标识---js改标识
        this.$router.push({
          name: 'home'
        })
      }
      // .then之后其实在处理异步请求的结果
      // .then((res) => {
      //   console.log(res)
      //   const { data: { data, meta: { msg, status } } } = res
      //   if (status == 200) {
      //     // this.$message({
      //     //   message: msg,
      //     //   type: 'success'
      //     // })
      //     // 登录成功后，跳到主页
      //     // 渲染home.vue组件-->改标识---js改标识
      //     this.$router.push({
      //       name: 'home'
      //     })
      //   } else {
      //     this.$message.error(msg)
      //   }
      // })
    }
  }
}
</script>

<style scope>
.login-wrap {
  /* 注意: 百分比布局 父元素height，要给它的父元素设置百分比才会生效，要找到它的直接父元素 */
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #ffffff;
  border-radius: 5px;
  /* 开发 */
  width: 400px;
  padding: 30px;
  /* box-sizing: content-box; */
}
.login-btn {
  width: 100%;
}
</style>
