<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <comBread level1="商品管理" level2="商品分类"></comBread>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 (表单元素) -->
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{ selectedOptions }}
          <el-cascader expand-trigger="hover" change-on-select clearable :options="caslist" v-model="selectedOptions"
            :props="defaultProp"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="400" :data="list" style="width: 100%">
      <!-- levelKey->当前自己的层级
          childKey->子级数据的key名->children
          parentKey->父级数据的key名
          treeKey->每个节点唯一的标识id
          这几个值都来源于list数据
       -->
      <el-tree-grid prop="cat_name" width="120" label="分类名称" treeKey="cat_id" parentKey="cat_pid" childKey="children"
        levelKey="cat_level">
      </el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid'
export default {
  name: 'GoodsCate',
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      formLabelWidth: '140px',
      //  级联选择器要用的数据
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  components: {
    ElTreeGrid
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 添加分类 - 发送请求
    async addCate () {
      // 分析：添加分类的三种情况是不一样的，所以，要分三种情况：
      // 经分析知：cat_name是v-model绑定的值，是最新的，不需要改，变动的是cat_pid和cat_level
      // 三种情况：
      // 一级->如果级联的数组为空->cat_pid=0 cat_level=0
      if (this.selectedOptions.length === 0) {
        this.form.cat_level = 0
        this.form.cat_pid = 0
      }
      // 二级->如果级联的数组长度为1->cat_pid=上一级的id(this.selectoption[0]) cat_level=1
      if (this.selectedOptions.length === 1) {
        this.form.cat_level = 1
        this.form.cat_pid = this.selectedOptions[0]
      }
      // 三级->如果级联的数组长度为2->cat_pid=上一级的id(this.selectoption[1]) cat_level=2
      if (this.selectedOptions.length === 2) {
        this.form.cat_level = 2
        this.form.cat_pid = this.selectedOptions[1]
      }
      const res = await this.$http.post(`categories`, this.form)
      console.log(res)
      const {
        meta: { status }
      } = res.data
      if (status === 201) {
        this.dialogFormVisibleAdd = false
        this.getGoodsCate()
      }
    },
    // 添加分类- 显示对话框
    async addGoodsCate () {
      // 获取两级分类的数据
      const res = await this.$http.get(`categories?type=2`)
      this.caslist = res.data.data
      console.log(this.caslist)

      this.dialogFormVisibleAdd = true
    },
    // 获取所有分类
    async getGoodsCate () {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      // console.log(res)
      this.list = res.data.data.result
      // console.log(this.list);
      this.total = res.data.data.total
    },
    // 分页的相关方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsCate()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // this.pagenum = 2 = val
      this.pagenum = val
      this.getGoodsCate()
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>
