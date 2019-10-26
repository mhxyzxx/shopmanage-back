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
        <el-input placeholder="请输入内容" v-model="query" class="input-text" clearable @clear="getAllUsers()">
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchUser()"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="primary" plain @click.prevent="showdialogForm()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格展示 -->
    <el-table height="250px" :data="listData" style="width: 100%">
      <!--
         id: 500
         username: "admin"
         email: "adsfad@qq.com"
         mobile: "12345678"
         create_time: 1486720211
         mg_state: true
         role_name: "主管"
           -->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
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
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="handleState(scope.row)" active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click.prevent="showdialogEdit(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain @click.prevent="showdialogSetRole(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click.prevent="deleteUser(scope.row.id)"></el-button>
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
    <el-pagination class="page-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框 -> 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 -> 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click.prevent="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 -> 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleSetRole">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="用户名">
          {{formdata.username}}
        </el-form-item>
        <el-form-item label="角色">
          {{selectVal}}
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option label="请选择" disabled :value="-1"></el-option>
            <!-- 将来获取角色数据 v-for遍历 -->
            <!-- 5个角色此时都有了自己的value,value就是角色id[30,31,34,39,40]
            如果selectVal的值，如30，如果30和上面的数组中的一个相等，页面上会显示对应的lable值 -->
            <el-option v-for="(item, i) in rolesArr" :key="i" :label="item.roleName" :value="item.id"></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSetRole = false">取 消</el-button>
        <el-button type="primary" @click=setRole()>确 定</el-button>
      </div>
    </el-dialog>
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
      total: -1, // 为了区分是自己初始化的值还是请求返回的值
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleSetRole: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editid: '',
      // 下拉框用的数据
      selectVal: -1,
      // currentUsername: '',
      rolesArr: [], // 角色数组
      currentRoleId: -1
    };
  },
  created () {
    this.getUsersList();
  },
  methods: {
    // 获取用户列表
    async getUsersList () {

      // 发送请求
      // query查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize 每页显示条数	不能为空
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // const res = await this.$http.get('users?query=' + this.query + '&pagenum=' + this.pagenum + '&pagesize=' + this.pagesize)
      // console.log(res)
      const { data, meta: { msg, status } } = res.data
      if (status === 200) {
        this.listData = data.users;
        this.total = data.total;

        // console.log(this.listData)
      }
    },

    // 分页相关功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      // 按照新的pagesize发送请求
      this.pagenum = 1;
      this.pagesize = val;
      this.getUsersList(); // 重新渲染列表
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      // 按照新的页码发送请求
      this.pagenum = val;
      this.getUsersList();
    },

    // 搜索用户功能
    searchUser () {
      this.pagenum = 1;
      // 按照关键字搜索，重新发送请求，渲染列表
      this.getUsersList();
    },

    // 搜索-->清空输入框时，获得所有用户
    getAllUsers () {
      this.getUsersList();
    },

    // 添加用户功能相关功能
    // 1. 点击添加按钮，显示对话框
    showdialogForm () {
      //  不要忘记再次打开对话框清空数据,你也可以一个一个的情况
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    // 2.点击确定按钮，发送请求
    async addUser () {
      // 发送请求
      const res = await this.$http.post('users', this.formdata);
      // console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 201) {
        // 添加成功：1. 关闭对话框 2.给出提示 3. 重新渲染表格
        this.dialogFormVisibleAdd = false;
        // 提示添加成功
        this.$message.success(msg);
        this.getUsersList();
      } else {
        this.$message.error(msg);
      }
    },

    // 删除用户功能
    deleteUser (userId) {
      // 删除用户给出相应的提示
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 根据对应的id删除对应的用户，需发送请求
        const res = await this.$http.delete(`users/${userId}`);
        // console.log(res);
        const { meta: { msg, status } } = res.data;
        if (status === 200) {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
          this.$message.success(msg);
          // 更新列表
          this.pagenum = 1;
          this.getUsersList();
        }

      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
        this.$message.info(msg);
      });
    },

    // 编辑用户相关功能
    // 1. 点击编辑按钮，显示编辑对话框
    showdialogEdit (user) {
      this.dialogFormVisibleEdit = true;
      // 显示编辑用户的信息
      this.formdata = user;
      this.editid = user.id;
    },
    // 2.点击确定按钮，发送请求
    async editUser () {
      // 发送请求
      // 找id-->user.id-->1. data有没有 2. 方法实参有没有
      // this.formdata上一步已经被user赋值，里面有对应的id
      // http://localhost:8888/api/private/v1/users/500 请求头的路径
      // 三种种方式如下：
      // const res = await this.$http.put(`users/${this.editid}`, this.formdata);
      // const res = await this.$http.put(`users/id=${this.editid}?email=${this.formdata.email}&mobile=${this.formdata.mobile}`)
      const res = await this.$http.put(`users/${this.formdata.id}`, this.formdata);
      // console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisibleEdit = false;
        this.getUsersList();
      } else {
        this.$message.error(msg);
      }
    },

    // 修改用户状态功能
    async handleState (user) {
      // console.log(user);
      // 发送请求 请求路径：users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      // console.log(res);
      const { meta: { status, msg } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },

    // 分配角色相关功能
    async showdialogSetRole (user) {
      // this.formdata.username = user.username; // 显示当前用户的用户名
      // 说明：我们这里也可以使用forddata的数据，但由于我们的分配角色跟添加，删除等功能都是独立的，这里我们给它单独提供一个数据
      // this.currentUsername = user.username;
      this.formdata = user;
      this.currentRoleId = user.id;
      // 回顾下拉框的特性：
      // 1. 默认显示请选择-->当v-model的数据值selectVal和option的请选择的value值相等，此时显示请选择
      // 2. 当选择某个option时，v-model的数据的值等于选中的lable的value值

      // 显示对话框
      this.dialogFormVisibleSetRole = true;
      // 发送请求角色列表的请求
      const res = await this.$http.get('roles');
      // console.log(res);
      const { meta, data } = res.data;
      if (meta.status === 200) {
        this.rolesArr = data;
      } else {
        this.$message.error(msg);
      }

      // 给下拉框v-model绑定的seletVal赋值
      // tis.selectVal = '当前用户的角色id-->看接口。我们之前的是用户id'
      // 查看接口中有个：根据用户id查角色id
      const resRoles = await this.$http.get(`users/${user.id}`);
      // console.log(resRoles);
      // 给下拉框v-model绑定selectVal赋值
      this.selectVal = resRoles.data.data.rid;

    },

    // 分配角色，发送请求
    async setRole () {

      const res = await this.$http.put(`users/${this.currentRoleId}/role`, { rid: this.selectVal });
      // console.log(res);
      const { meta, data } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        // 关闭对话框
        this.dialogFormVisibleSetRole = false;

      } else {
        this.$message.error(meta.msg);
      }
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
  margin-top: 10px;
}
</style>
