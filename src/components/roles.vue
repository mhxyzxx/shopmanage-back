<template>
  <el-card class="box-card">
    <!-- 使用封装好的组件 -->
    <comBread level1="权限管理" level2="角色列表"></comBread>
    <!-- 添加角色按钮 -->
    <el-button type="primary" class="add-role" size="small">添加角色</el-button>
    <!-- 角色列表表格展示 -->
    <el-table height="330px" :data="rolesList" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row class="level1" v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag type="primary" closable @close="delRight(scope.row, item1)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRight(scope.row, item2)">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag type="warning" closable class="level3" v-for="(item3, i) in item2.children" :key="i" @close="delRight(scope.row, item3)">
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
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain @click.prevent="showdialogSetRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限-对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRight">
      <!--
      node-key="id" 要看treeList中有没有id
      :default-expanded-keys 也不能写死
        :default-checked-keys="[5]" 不能写死，因为每个角色它有哪些权限我们就让它选中，它是否是选中，你要根据网络请求去获取，所以，声明一个数组checkArr
        :props="defaultProps"
     -->
      <el-tree :data="treeList" ref="treeDom" show-checkbox node-key="id" default-expand-all :default-checked-keys="checkArr"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click.prevent="setRights()">确 定</el-button>
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
      rolesList: [],
      dialogFormVisibleRight: false,
      // 树形结构的数据
      treeList: [],
      checkArr: [],
      // expandArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      currentRoleId: -1

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
        this.rolesList = data
        // console.log(this.rolesList)
      } else {
        this.$message.error(msg)
      }
    },

    // 设置角色权限功能-->打开对话框及树形结构配置和展示
    async showdialogSetRights (role) {
      this.dialogFormVisibleRight = true
      this.currentRoleId = role.id // 获取当前角色id
      const res = await this.$http.get(`rights/tree`)
      console.log(res)
      const { data, meta: { msg, status } } = res.data
      if (status === 200) {
        this.treeList = data
        // console.log(this.treeList)
        // 默认展开所有节点，把所有节点的id都放到一个数组expandArr中即可。使用for循环嵌套
        // var temp = [];
        // this.treeList.forEach((item1) => {
        //   temp.push(item1.id)
        //   item1.children.forEach((item2) => {
        //     temp.push(item2.id)
        //     item2.children.forEach((item3) => {
        //       temp.push(item3.id)
        //     })
        //   })
        // })
        // this.expandArr = temp

        // 获取当前角色权限的id-->那么，就要先拿到当前角色的id
        var temp2 = []
        console.log(role)
        role.children.forEach((item1) => {
          // temp2.push(item1.id)
          item1.children.forEach((item2) => {
            // temp2.push(item2.id)
            item2.children.forEach((item3) => {
              temp2.push(item3.id)
            })
          })
        })
        // console.log(temp2)
        this.checkArr = temp2
      } else {
        this.$message.error(msg)
      }
    },
    // 分配角色权限功能
    // 取消当前角色的权限功能-->发送请求
    async setRights () {
      // 想要设置权限，要拿到: 获取全选节点的id--->getCheckedKeys和半选节点的id-->getHalfCheckedKeys
      // 首先想el-tree组件中是否提供方法来获取这两类节点
      // 1. 获取全选节点的id--->getCheckedKeys
      // 那么，该怎么调用该方法？
      // el-tree标签-->DOM元素.js方法
      // 在js中中操作DOM元素-->ref操作DOM:
      // 1. 给要操作的标签el-tree设置一个属性ref值
      // 2. 在js中通过this.$ref.ref值.js方法（）调用即可
      // console.log(this.$refs)
      const result = this.$refs.treeDom.getCheckedKeys()
      // console.log(result)

      // 2. 半选节点的id-->getHalfCheckedKeys
      const result2 = this.$refs.treeDom.getHalfCheckedKeys()
      // console.log(result2)
      const newRoleIdArr = [...result, ...result2]
      // console.log(newRoleIdArr)

      // 3.发送请求，设置权限
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, { rids: newRoleIdArr.join(',') })
      // console.log(res)
      const { meta: { msg, status } } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleRight = false
      } else {
        this.$message.error(msg)
      }
    },
    async delRight (role, right) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
      console.log(res)
      const { data, meta: { msg, status } } = res.data
      if (status === 200) {
        this.$message.success(msg)
        // this.getRolesList()
        // 取消权限成功后会返回，当前角色剩余的权限
        // 只更新当前的角色权限
        role.children = data
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style scope>
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
