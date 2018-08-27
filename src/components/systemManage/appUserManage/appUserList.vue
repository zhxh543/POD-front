<template>
  <div id="appUserList">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-button type="primary" class="fl"  @click="openModel()">新增应用用户</el-button>
        <el-upload
          class="upload-demo fl"
          action="api/admin/import"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :show-file-list="false"
          multiple>
          <el-button type="primary">导入应用用户</el-button>
        </el-upload>
        <a :href="downloadUrl+'/importTemplate/ImportAppUser.xlsx'" download class="el-button  el-button--primary">下载模板</a>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed
            prop="username"
            width="130"
            label="登录名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="realName"
            label="真实姓名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="appName"
            label="所属应用" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="roleNames"
            label="系统角色" show-overflow-tooltip>
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
            width="250">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.accountNonLocked"
                :disabled="switchDisabled"
                @change="handleAble(scope.row.accountNonLocked,scope.row)">
              </el-switch>
              <el-button type="warning" plain size="mini" @click="changeView('appUserEmpower',scope.row.id)">数据权限</el-button>
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)">编辑</el-button>
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
      <p class="rds-remark" v-html="appUserDesc"></p>
      <appUserAdd  ref="add" @loadData="getData()"></appUserAdd>
    </div>
  </div>
</template>

<script>

  import appUserAdd  from '@/components/systemManage/appUserManage/appUserAdd.vue'
  import appUserEmpower  from '@/components/systemManage/appUserManage/appUserEmpower.vue'

  export default {
    name: "appUserList",
    data (){
      return {
        msg : "应用用户",
        crumbsList:[   //  面包屑
          {name:'应用用户',url:{routerName:'systemManage',params:{name:'appUserManage'}}},
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
      this.getData();
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/admin"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "appUser": true
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
      changeView(data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "systemManage", query: { name: "appUserManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "systemManage", query: { name: "appUserManage",com: data, id: id}})
        }else{
          this.$router.push({name: "systemManage", query: { name: "appUserManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'systemManage', query: {name: 'appUserManage'}});
      },
      openModel (row){
        if(row){
          this.$refs.add.showModel(row)
        }else{
          this.$refs.add.showModel()
        }
      },
      //导入
      handleAvatarSuccess(res, file) {
        // console.log(res)
        if(res.code===200){
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getData()
        }
      },
      handleAvatarError (err, file, fileList) {
        var obj = JSON.parse(err.message);
        this.$message({
          message:obj.msg,
          type: 'error'
        });
      },
    },
    components: {
      appUserAdd,
      appUserEmpower

    }

  }
</script>

<style  lang="less" >
  #appUserList{
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
      .el-button{margin-right: 15px}
    }
    .el-switch{
      margin-right: 25px;
    }
    .handle-block{

      .el-down{padding: 9px 15px;font-size: 12px;}
      .el-button{
        width: 124px!important;
      }
    }
  }

</style>
