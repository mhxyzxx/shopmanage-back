<template>
  <el-card class="box-card">
    <!-- 面包屑导航 ，因为其它组件也要使用，所以我们把它单独提取出来，作为公共的组件-->
    <!-- 使用封装好的组件 -->
    <comBread level1="权限管理" level2="权限列表"></comBread>
    <!-- 权限列表表格展示 -->
    <el-table height="330px" :data="rightList" style="width: 100%" class="right-table">
      <!-- 因前面的序号不是数组中的某一属性，prop值可以去掉了 -->
      <el-table-column type="index" label="#" width="120"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column prop="level" label="层级" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
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
      rightList: []
    }
  },
  created () {
    // 加载首屏数据
    this.getTableList()
  },
  methods: {
    async getTableList () {
      const res = await this.$http.get(`rights/list`)
      // console.log(res);
      const { data, meta: { msg, status } } = res.data
      if (status === 200) {
        this.rightList = data
      }
    }
  }
}
</script>

<style scope>
.box-card {
  height: 100%;
}
.box-card .right-table {
  margin-top: 20px;
}
</style>
