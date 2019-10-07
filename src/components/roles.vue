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
        type="expand"
        width="80"
      >
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row
            class="level1"
            v-for="(item1, i) in scope.row.children"
            :key="i"
          >
            <el-col :span="4">
              <el-tag
                type="primary"
                closable
                @close="delRight(scope.row, item1)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row
                class="level2"
                v-for="(item2, i) in item1.children"
                :key="i"
              >
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close="delRight(scope.row, item2)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    class="level3"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    @close="delRight(scope.row, item3)"
                  >
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 未分配权限给出相应提示信息 -->
          <el-row v-if="scope.row.children.length===0">
            <el-col class="tips-info">
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
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
      showdialogSetRights () {

      },
      // 取消当前角色的权限功能
      async delRight (role, right) {
        const res = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
        console.log(res);
        const { data, meta: { msg, status } } = res.data
        if (status === 200) {
          this.$message.success(msg)
          // this.getRolesList()
          // 取消权限成功后会返回，当前角色剩余的权限
          // 只更新当前的角色权限
          role.children = data;
        } else {
          this.$message.error(msg)
        }
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
.box-card .level1,
.box-card .level2 {
  margin-bottom: 10px;
}
.box-card .level3 {
  margin-right: 4px;
  margin-top: 5px;
}
.box-card .tips-info {
  text-align: center;
  color: red;
}
</style>
