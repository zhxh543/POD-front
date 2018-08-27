<template>
  <div id="setWarning">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="预警分析基础设置" name="first"></el-tab-pane>
          <el-tab-pane label="重印预警参数值设置" name="POD"></el-tab-pane>
          <!--<el-tab-pane label="传统重印预警参数值设置" name="Tradition"></el-tab-pane>-->
        </el-tabs>
      </template>
      <setWarningBase v-if="activeName=='first'" ></setWarningBase>
      <setWarningParameter v-if="activeName!='first'" :active-name="activeName"></setWarningParameter>
    </div>
  </div>
</template>

<script>
  import setWarningBase from '@/components/reprintWarningManage/setWarningManage/setWarningBase.vue'
  import setWarningParameter from '@/components/reprintWarningManage/setWarningManage/setWarningParameter.vue'
  export default {
    name: "setWarning",
    data (){
      return {
        msg : "预警参数设置",
        crumbsList:[   //  面包屑
          {name:'预警参数设置',url:{routerName:'reprintWarningManage',params:{name:'setWarningManage'}}},
        ],
        activeName: 'first',
      }
    },
    methods : {
      handleClick() {
      }
    },
    components: {
      setWarningBase,
      setWarningParameter
    }

  }
</script>

<style  lang="less" >
  #setWarning{
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 20px;
      }
    }
    .handle-block{
      padding: 15px 0;
    }
  }

</style>
