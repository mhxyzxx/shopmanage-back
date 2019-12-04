<template>
  <!-- 公共的面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
// 封装的技巧,回忆封装的函数
// 1. 重复代码我们称之为函数体
// 2. 变化的量-->使用形参
export default {
  name: 'ComBread', // 导出组件的名字
  components: {

  },
  data () {
    return {
      // level1: '权限管理',
      // level2: '权限列表'
      // 这样写的缺点是：只能当前组件自己用。其它组件不能使用
    }
  },
  // 前提： data中的数据特点：值只能来源于本身，而我们公共的组件的值是有使用者来决定的，所以
  // 数据的声明的值是来源于外部的，此时数据声明不能写在data中。应该把数据声明写在选项props
  // 选项props的特点：
  // 1. props的值可以是字符串数组
  // 2. props中的的数据level1和2用法跟data一样，可以使用{{}} 插值语法
  // 3.props中的数据是数据的声明
  // 4.props中的数据将来就是组件的属性-->也就是自定义标签的属性<abc level1=""></abc>
  // 5.props中的数据将来使用组件时通过属性进行赋值<abc level1="权限管理"></abc>
  props: ['level1', 'level2']
}
</script>

<style>
</style>
