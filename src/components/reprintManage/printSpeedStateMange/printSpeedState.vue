<template>
  <div id="printSpeedState">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="POD印制进度状态" name="POD"></el-tab-pane>
        <el-tab-pane label="传统印制进度状态" name="Tradition"></el-tab-pane>
      </el-tabs>
      <div class="handle-block">
        <el-button type="primary" @click="openModel()">新增印制进度状态</el-button>
      </div>
      <template>
        <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="状态名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="rank"
            label="进度序号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="状态" show-overflow-tooltip>

            <template slot-scope="scope">
              <span v-if="scope.row.status==true">启用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="230">
            <template slot-scope="scope">
              <el-switch
                :disabled="(switchDisabled||(scope.row.id.length<2))"
                @change="handleAble(scope.row.status,scope.row)"
                v-model="scope.row.status">
              </el-switch>
              <el-button type="primary" plain size="mini" @click="openModel(scope.row.id, scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="deleteData(scope.$index, scope.row,tableData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="page-block" >
        <el-pagination
        background
        layout="prev, pager, next"
        :total="total"  :page-size="pageSize" v-if="total>pageSize"   @current-change="handleSizeChange">
      </el-pagination>
      </div>
    </div>
    <printSpeedStateAdd  ref="add" :active-name="activeName" @loadData="getData()"></printSpeedStateAdd>

  </div>
</template>

<script>
import printSpeedStateAdd  from '@/components/reprintManage/printSpeedStateMange/printSpeedStateAdd.vue'

export default {
    name: "printSpeedState",
    data (){
      return {
        msg : "印制进度状态",
        crumbsList:[   //  面包屑
          {name:'印制进度状态',url:{routerName:'reprintManage',params:{name:'printSpeedStateMange'}}},
        ],
        isOpen:true,//是否展开
        activeName : "POD",
        tableData: [],//data
        loading : false,//列表加载中
        switchDisabled : false,//启用停用时，防重复提交
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
      }
    },
  mounted() {
    this.getData();
  },
    methods : {
      // 获取状态列表
      getData () {
        this.loading = true
        let url = "/progressMgmt"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "type" :this.activeName
         }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
              this.tableData = res.data.records
              this.total = res.data.total
              this.loading = false
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
            this.loading = false
          }
        });
      },
      //分页
      handleSizeChange(val) {
        this.page = val
        this.getData()
      },
      handleAble (status,rows) {
        this.switchDisabled = true
        let url = "/progressMgmt/"+rows.id
        let param = {
          name : rows.name,
          status : status,
          type : this.activeName
        }
        this.$ajax.put(url,param).then(res => {
          if(res.status === 200){
            this.switchDisabled = false
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getData()
          }else{
            this.switchDisabled = false
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      openModel (id,rows){
        if(id){
          this.$refs.add.showModel(id,rows)
        }else{
          this.$refs.add.showModel()
        }
      },
      // 删除
      deleteData (index,data,rows){
        let url = "/progressMgmt/"+data.id

        this.$confirm('确认删除吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.$ajax.delete(url,{}).then(res => {
              if(res.status === 200){
                if (index !== -1) {
                  rows.splice(index, 1)
                }
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          })
          .catch(_ => {});


      },
      handleClick(row) {
        this.getData();
      }
    },
    components: {
      printSpeedStateAdd,
    }
  }
</script>

<style  lang="less" >
  #printSpeedState{
    .el-tabs__header{margin-bottom: 0px}
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 20px;
      }
    }
    .handle-block{
      .el-button{
        width: 155px;
      }
    }
    .el-switch{
      margin-right: 25px;
    }
  }

</style>
