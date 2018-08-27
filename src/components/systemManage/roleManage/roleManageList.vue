<template>
  <div id="roleManageList">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-button type="primary"  @click="openModel()">新增角色</el-button>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed
            prop="id"
            label="角色ID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="角色描述" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="角色状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.enabled==true">启用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="300">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="switchDisabled"
                @change="handleAble(scope.row.enabled,scope.row)">
              </el-switch>
              <el-button type="warning" plain size="mini" @click="changeView('roleEmpower',scope.row.id)">权限</el-button>
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)" :disabled="scope.row.builtIn" >编辑</el-button>
              <el-button type="danger" plain size="mini" :disabled="scope.row.builtIn" @click="deleteData(scope.$index, scope.row,tableData)" >删除</el-button>
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
      <roleAdd  ref="add" @loadData="getData()"></roleAdd>
    </div>
  </div>
</template>

<script>

  import roleAdd  from '@/components/systemManage/roleManage/roleAdd.vue'

  export default {
    name: "roleManageList",
    data (){
      return {
        msg : "角色权限管理",
        crumbsList:[   //  面包屑
          {name:'角色权限管理',url:{routerName:'systemManage',params:{name:'roleManage'}}},
        ],
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        switchDisabled : false,
      }
    },
    mounted: function () {
      this.getRoute()
      this.getData()
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/role"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
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
        let url = "/role/"+rows.id+"/"+status
        let param = {
          id : rows.id,
          enabled : status,
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
      changeView(data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "systemManage", query: { name: "roleManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "systemManage", query: { name: "roleManage",com: data, id: id}})
        }else{
          this.$router.push({name: "systemManage", query: { name: "roleManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'systemManage', query: {name: 'roleManage'}});
      },
      openModel (row){
        if(row){
          this.$refs.add.showModel(row)
        }else{
          this.$refs.add.showModel()
        }
      },
      // 删除
      deleteData (index,data,rows){
        let url = "/role/"+data.id
        let param = {
          "id":data.id,
        }
        this.$confirm('确认删除吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.$ajax.delete(url,param).then(res => {
              if(res.status === 200){
                if (index !== -1) {
                  rows.splice(index, 1)
                }
                this.$message({
                  message: "操作成功！",
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
    },
    components: {
      roleAdd,
    }
  }
</script>

<style  lang="less" >
  #roleManageList{
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 20px;
      }
    }
    .handle-block{
      padding: 12px 0;
    }
    .el-switch{margin-right: 20px;
    }
  }

</style>
