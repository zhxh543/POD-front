<template>
  <div id="systemParameter">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />

      <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="top">
        <el-tab-pane label="物流参数" name="logistics"></el-tab-pane>
        <el-tab-pane label="接单有效期" name="validityDate"></el-tab-pane>
      </el-tabs>
      <logisticsParameter   v-if="activeName=='logistics'"></logisticsParameter>
      <validityDateParameter   v-if="activeName=='validityDate'"></validityDateParameter>
    </div>
  </div>
</template>
<script>
  import logisticsParameter  from '@/components/systemManage/systemParameterManage/logisticsParameter.vue'
  import validityDateParameter  from '@/components/systemManage/systemParameterManage/validityDateParameter.vue'

  export default {
    name: "systemParameter",
    data (){
      return {
        msg : "系统参数管理",
        crumbsList:[   //  面包屑
          {name:'系统参数管理',url:{routerName:'systemManage',params:{name:'systemParameterManage'}}},
        ],
        activeName : "logistics"
      }
    },
    mounted: function () {
      this.getRoute()
    },
    methods : {
      /*跳转页面*/
      changeView (data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "systemManage", query: { name: "systemParameterManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "systemManage", query: { name: "systemParameterManage",com: data, id: id}})
        }else{
          this.$router.push({name: "systemManage", query: { name: "systemParameterManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'systemManage', query: {name: 'systemParameterManage'}});
      },
      openModel (id){
        if(id){
          this.$refs.add.showModel(id)
        }else{
          this.$refs.add.showModel()
        }
      },
      handleClick(row) {
        // console.log(row);
      }
    },
    components: {
      logisticsParameter,
      validityDateParameter
    }
  }
</script>

<style  lang="less" >
  #systemParameter{
    .el-table thead th{
      background: #f0f0f0!important;
    }
  .el-table .cell {
      padding-left: 25px;
    }
    .handle-block{
      padding: 12px 0;
    }
    .el-switch{
      margin-right: 25px;
    }
    .handle-block{
      .el-button{
        width: 125px;
      }
    }
    .second-level {
      &:before {
        height: 0;
      }
      .el-table__header-wrapper {
        display: none;
      }
      .el-table__row:last-child {
        td {
          border-bottom: 0 !important;
        }
      }
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0;
    }
  }

</style>
