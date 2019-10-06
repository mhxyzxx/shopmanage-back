<template>
  <el-card class="box-card">
    <!-- 使用封装好的组件 -->
    <comBread
      level1="权限管理"
      level2="角色列表"
    ></comBread>
    <!-- 添加角色按钮 -->
    <el-button
      type="primary"
      class="add-role"
      size="small"
    >添加角色</el-button>
    <!-- 角色列表表格展示 -->
    <el-table
      height="330px"
      :data="rolesList"
      style="width: 100%"
    >

      <el-table-column
        type="index"
        label="#"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="200"
      ></el-table-column>

      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
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
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click.prevent="showdialogSetRights(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  export default {
    components: {

    },
    data () {
      return {
        rolesList: []
      }
    },
    created () {
      // 获取首屏数据
      this.getRolesList()
    },
    methods: {
      // 获取角色列表数据
      async getRolesList () {
        const res = await this.$http.get('roles')
        console.log(res)
        const { data, meta: { msg, status } } = res.data
        if (status === 200) {
          this.rolesList = data;
          // console.log(this.rolesList);
        } else {
          this.$message.error(msg);
        }

      },

      // 设置角色权限功能
      showdialogSetRights() {

      }
    }
  }
</script>

<style>
.box-card {
  height: 100%;
}
.box-card .add-role {
  margin-top: 20px;
}
</style>
