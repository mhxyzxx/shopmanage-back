<template>
  <el-card>
    <!-- 面包屑 -->
    <comBread level1="订单管理" level2="订单列表"></comBread>
    <!-- 表格渲染 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column label="下单时间" width="90">
        <template slot-scope="scope">{{scope.row.create_time|fmtdate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
          <el-button type="warning" icon="el-icon-location" circle size="mini" plain @click="showPlace(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗功能 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
          <el-cascader expand-trigger="hover" clearable :options="catlist" v-model="selectedOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 地图弹窗 -->
    <el-dialog title="快递信息" :visible.sync="dialogTableVisible" width="800px">
      <!-- 第二种写法放在弹窗中 -->
      <!-- 地图容器 -->
      <div id="container"></div>
    </el-dialog>
    <!-- 第一种写法 -->
    <!-- <div id="container"></div> -->
  </el-card>
</template>

<script>
import CityArr from '@/assets/city_data2017_element.js'
export default {
  name: 'order',
  data () {
    return {
      list: [],
      dialogFormVisible: false,
      dialogTableVisible: false,
      form: {
        address: ''
      },
      // 级联选择器要绑定的数据
      catlist: [],
      // 说明：如果props属性绑定的默认值defaultProp对象中的key-value是一样的。这个默认值defaultProp对象可以不写。
      // 由我们准备的后台数据可知是value,label,children和defaultProp对象的属性值是一样的，所以，这里可以省略不写。
      // defaultProp: {
      //   value: 'value',
      //   label: 'label',
      //   children: 'children'
      // },
      selectedOptions: []
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    // this.baiduMap() // 当地图不在弹窗的时候，在这里调用
  },
  methods: {
    async getData () {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=10`)
      // console.log(res);
      this.list = res.data.data.goods
    },
    showEditdia () {
      this.catlist = CityArr
      this.dialogFormVisible = true
    },
    showPlace () {
      this.dialogTableVisible = true
      // 当地图在弹窗里时，在这里使用$nextTick初始化地图插件即可
      this.$nextTick(() => {
        this.baiduMap()
      })
    },
    baiduMap () {
      var map = new BMap.Map('container') // 创建地图实例
      var point = new BMap.Point(116.404, 39.915) // 设置中心点坐标
      map.centerAndZoom(point, 15) // 添加初始化中心点及地图层级
    }
  }
}
</script>

<style scope>
#container {
  width: 100%;
  height: 500px;
}
</style>
