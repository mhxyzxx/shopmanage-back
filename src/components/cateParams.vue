<template>
  <el-card class="cate-wrap">
    <!-- 面包屑 -->
    <comBread level1="商品管理" level2="商品参数"></comBread>
    <!-- 带关闭按钮的alert警告框 -->
    <el-alert class="alet-box" title="注意：只允许为第三级分类设置参数" type="warning" show-icon>
    </el-alert>
    <!-- 级联选择器-商品分类选择组件 -->
    <el-form :model="form" label-position="left" label-width="120px" class="form-wrap">
      <el-form-item label="请选择商品分类">
        <!-- 表单元素：级联选择器
            options是数据源
            selectOptions: []是数组类型的，放你所选中的option的value值
            :props="{ expandTrigger: 'hover' }"
             -->
        {{ selectOptions }}
        <el-cascader expand-trigger='hover' :show-all-levels="false" clearable v-model="selectOptions" :options="options"
          :props="defaultProp" @change="handleChange"></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab切换组件 -->
    <el-tabs type="border-card" v-model="active" @tab-click="changeTab">
      <el-tab-pane name="1" label="动态参数">
        <!-- 按钮默认是不能点击的 -->
        <el-button type="primary" class="set-btn" size="small" disabled>设置动态参数</el-button>
        <!-- 带展开功能的表格 -->
        <el-table height="360px" border stripe :data="arrDy" style="width: 100%">
          <!-- 序号 -->
          <el-table-column type="expand" width="100">
            <template slot-scope="scope">
              <!-- 动态tag编辑标签 scope.row.attr_vals-->
              <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row, item)">
                {{item}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="100"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <el-button type="primary" class="set-btn" size="small" disabled>设置静态参数</el-button>
        <!-- 带展开功能的表格 -->
        <el-table height="360px" border stripe :data="arrStatic" style="width: 100%">
          <!-- 序号 -->
          <el-table-column type="index" label="#" width="120"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
          <el-table-column prop="attr_vals" label="属性值"> </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      form: {},
      // 级联使用的数据
      selectOptions: [],
      options: [],
      defaultProp: { // 配置项
        label: 'cat_name',
        value: 'cat_id',
        children: 'children' // key-value相同时，可以不写，见文档说明
        // expandTrigger: 'hover'
      },
      active: '1',
      // 动态数据
      arrDy: [],
      // 静态数据
      arrStatic: [],
      // 动态编辑tag数据
      // dynamicTags: ['标签一', '标签二', '标签三'],换成了我们自己的数组
      inputVisible: false,
      inputValue: ''
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 获取三级商品分类的数据
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3`)
      // console.log(res);
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.options = data
        // console.log(this.options)
      }
    },
    // 获取静态和动态参数方法的封装
    async getDyOrStatic () {
      if (this.selectOptions.length !== 3) {
        this.$message.warning('请选择三级分类！')
        if (this.active === '1') {
          this.arrDy = []
        }
        if (this.active === '2') {
          this.arrStatic = []
        }
        return
      }

      if (this.selectOptions.length === 3) {
        // 获取动态参数数据
        if (this.active === '1') {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=many`)
          console.log(res)
          const { meta: { msg, status }, data } = res.data
          if (status === 200) {
            this.arrDy = data
            console.log(this.arrDy)
            console.log('动态数据----')
            this.arrDy.forEach(item => {
              item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')
            })
          }
        }
        // 获取静态参数
        if (this.active === '2') {
          const res = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=only`)
          const { meta: { msg, status }, data } = res.data
          if (status === 200) {
            this.arrStatic = data
            console.log(this.arrStatic)
            console.log('静态数据----')
          }
        }
      }
    },
    // 显示的label一变化，他就会触发
    // 点击不同的label它就会触发
    handleChange () {
      // console.log('级联的change触发了---');
      // 获取静态和动态参数的请求
      this.getDyOrStatic()
    },
    // 点击tab时获取静态和动态的数据
    changeTab () {
      this.getDyOrStatic()
    },

    // 动态tag编辑标签相关方法
    // 1.添加某个属性功能
    async handleClose (obj, item) {
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1)
      // 400 ->msg:参数 attr_sel 类型必须是only 或 many
      // put修改我们需要两个条件：1.找到要修改的数据(分类id和att_id属性id)2.新数据(请求体)
      // 请求体：{attr_name： '', attr_sel: '', attr_vals: ''}
      // 注意：attr_vals数组提交的时候需要是字符串类型的，因为后台数据查询条件中都是字符串类型的，否则，会报错
      const res = await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${obj.attr_id}`, { attr_name: obj.attr_name, attr_sel: obj.attr_sel, attr_vals: obj.attr_vals.join(',') })
      console.log(res)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 2.添加某个属性功能
    async handleInputConfirm (obj) {
      let inputValue = this.inputValue
      if (inputValue) {
        obj.attr_vals.push(inputValue) // 重新修改了数组，是往数组中新添加了数据
        const res = await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${obj.attr_id}`, { attr_name: obj.attr_name, attr_sel: obj.attr_sel, attr_vals: obj.attr_vals.join(',') })
        console.log(res)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scope>
.cate-wrap {
  height: 100%;
}
.cate-wrap .alet-box {
  margin-top: 20px;
}
.cate-wrap .form-wrap {
  margin-top: 10px;
  height: auto;
}
.cate-wrap .set-btn {
  margin-bottom: 10px;
}
/* 动态编辑标签样式 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
