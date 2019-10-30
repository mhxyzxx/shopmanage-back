<template>
  <el-card class="cate-wrap">
    <!-- 面包屑 -->
    <comBread level1="商品管理" level2="商品参数"></comBread>
    <!-- 带关闭按钮的alert警告框 -->
    <el-alert class="alet-box" title="注意：只允许为第三级分类设置参数" type="warning" show-icon>
    </el-alert>
    <el-form :model="form" label-position="left" label-width="120px" class="form-wrap">
      <!-- 级联选择器-商品分类选择组件 -->
      <el-form-item label="请选择商品分类">
        <!-- 表单元素：级联选择器
            options是数据源
            selectOptions: []是数组类型的，放你所选中的option的value值
            :props="{ expandTrigger: 'hover' }" 
             -->
        {{ selectOptions }}
        <el-cascader expand-trigger='hover' :show-all-levels="false" clearable v-model="selectOptions" :options="options" :props="defaultProp"
          @change="handleChange"></el-cascader>
      </el-form-item>
    </el-form>
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
        children: 'children', // key-value相同时，可以不写，见文档说明
        // expandTrigger: 'hover'
      },
    }
  },
  created () {
    this.getGoodsCate();
  },
  methods: {
    // 获取三级商品分类的数据
    async getGoodsCate () {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.options = data;
        console.log(this.options)
      }
    },
    // 显示的label一变化，他就会触发
    handleChange () {
      console.log('级联的change触发了---');
    }
  }
}
</script>

<style>
.cate-wrap {
  height: 100%;
}
.cate-wrap .alet-box {
  margin-top: 20px;
}
.cate-wrap .form-wrap {
  margin-top: 10px;
}
</style>
