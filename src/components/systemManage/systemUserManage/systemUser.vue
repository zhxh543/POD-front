<template>
  <div id="systemUser">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-button type="primary"  @click="openModel()">新增系统用户</el-button>
      </div>
      <template>
        <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          style="width: 100%">
          <el-table-column
            fixed
            prop="username"
            label="登录名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="realName"
            label="真实姓名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="用户状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.accountNonLocked==true">正常</span>
              <span v-else>锁定</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="170">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.accountNonLocked"
                :disabled="switchDisabled"
                @change="handleAble(scope.row.accountNonLocked,scope.row)">
              </el-switch>
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)">编辑</el-button>
              <!--<el-button @click="deleteData(scope.$index, scope.row,tableData)" type="text" size="small">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="page-block">
        <el-pagination
          background :current-page="page"
          layout="prev, pager, next"
          :total="total"  :page-size="pageSize" v-if="total>pageSize"  @current-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>

    <systemUserAdd  ref="add" @loadData="getData()"></systemUserAdd>
  </div>
</template>
<script>
  import systemUserAdd  from '@/components/systemManage/systemUserManage/systemUserAdd.vue'

  export default {
    name: "systemUser",
    data (){
      return {
        msg : "系统用户",
        crumbsList:[   //  面包屑
          {name:'系统用户',url:{routerName:'systemManage',params:{name:'systemUserManage'}}},
        ],
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        switchDisabled : false
      }
    },
    mounted: function () {
      this.getRoute()
      this.getData();
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/admin"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "appUser": false
        }
        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){
            this.tableData = res.data.records
            this.total = res.data.total
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
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
        let url = "/admin/"+rows.id+"/lock/"+!status
        let param = {
          id : rows.id,
          locked : !status,
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
      /*跳转页面*/
      changeView (data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "systemManage", query: { name: "systemUserManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "systemManage", query: { name: "systemUserManage",com: data, id: id}})
        }else{
          this.$router.push({name: "systemManage", query: { name: "systemUserManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'systemManage', query: {name: 'systemUserManage'}});
      },
      openModel (row){
        if(row){
          this.$refs.add.showModel(row)
        }else{
          this.$refs.add.showModel()
        }
      },
      // 删除
      // deleteData (index,data,rows){
      //   let url = "/progressMgmt/"+data.id
      //
      //   this.$ajax.delete(url,{}).then(res => {
      //     if(res.status === 200){
      //       if (index !== -1) {
      //         rows.splice(index, 1)
      //       }
      //       this.$message({
      //         message: "操作成功！",
      //         type: 'success'
      //       });
      //     }else{
      //       this.$message({
      //         message: res.data.msg,
      //         type: 'error'
      //       });
      //     }
      //   });
      // },
      handleClick(row) {
        console.log(row);
      }
    },
    components: {
      systemUserAdd,
    }
  }
</script>

<style  lang="less" >
  #systemUser{
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
