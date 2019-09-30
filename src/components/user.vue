<template>
  <!-- 卡槽 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框及按钮 -->
    <el-row class="serch-box">
      <el-col>
        <!-- 搜索框 -->
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="input-text"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          plain
        >主要按钮</el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-table
      :data="listData"
      style="width: 100%"
    >
      <!--
         id: 500
         username: "admin"
         email: "adsfad@qq.com"
         mobile: "12345678"
         create_time: 1486720211
         mg_state: true
         role_name: "主管"
           -->
      <el-table-column
        prop="id"
        label="#"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="140"
      ></el-table-column>
      <!-- 日期格式处理->过滤器->2类(全局和局部，这里使用全局，以便其他文件使用) + 3步
fmtata的使用:
1. v-bind:
2.{{msg | fmtdate}}
分析过程：
思路1： 尝试prop="create_time|fmtdate  不行"
<el-table-column prop="create_time|fmtdate" label="创建日期" width="140"></el-table-column>
 思路2：
 <el-table-column prop="create_time" label="创建日期" width="140">
   {{create_time|fmtdate}}
 </el-table-column>
 思路3：
 前提：下面这个单元格的内容不是prop的值create_time的值-日期
 1. 给单元格内容外层加template
 2.给template设置slot-scope
 3.slot-scope的值会自动绑定外层数据结构，这里是el-table的data的值lsitData
 4.在内容位置写listData.row自动取出数组lsit中每个对象，其中row是固定写法
注意：如果值不是prop控制的话，这个属性可以在标签上去掉
 -->
      <el-table-column
        label="创建日期"
        width="140"
      >
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="140"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能
      @size-change 每页条数发生改变时，会触发
      @current-change 页码改变时(当前第1页，点击第2页时触发)
      :current-page 当前显示第几页 页码
      :page-sizes 每页条数的不同情况的数组
      :page-size 每页显示的条数
      layout="total, sizes, prev, pager, next, jumper" 附加功能
      :total 一共多少条
     -->
    <el-pagination
      class="page-box"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
  export default {
    components: {

    },
    data () {
      return {
        query: '',
        pagenum: 1,
        pagesize: 2,
        listData: [],
        total: -1 // 为了区分是自己初始化的值还是请求返回的值

      };
    },
    created () {
      this.getUsersList();
    },
    methods: {
      // 获取用户列表
      async getUsersList () {
        const AUTH_TOKEN = localStorage.getItem('token')
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN // 设置请求头
        // 发送请求
        // query查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize 每页显示条数	不能为空
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        // const res = await this.$http.get('users?query=' + this.query + '&pagenum=' + this.pagenum + '&pagesize=' + this.pagesize)
        console.log(res)
        const { data, meta: { msg, status } } = res.data
        if (status === 200) {
          this.listData = data.users;
          this.total = data.total;

          console.log(this.listData)
        }
      },

      // 分页相关功能
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`);
        // 按照新的pagesize发送请求
        this.pagenum = 1;
        this.pagesize = val;
        this.getUsersList(); // 重新渲染列表
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`);
        // 按照新的页码发送请求
        this.pagenum = val;
        this.getUsersList();
      }
    }
  }
</script>

<style>
.box-card {
  height: 100%;
}
.serch-box {
  margin-top: 12px;
}
.box-card .input-text {
  width: 300px;
}
.box-card .page-box {
  margin-top: 20px;
}
</style>
