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
            <el-button class="login-btn" type="primary">登录</el-button>
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
  }
}
</script>

<style>
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
