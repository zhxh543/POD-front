<template>
  <div id="logFile">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="操作日志" name="operate"></el-tab-pane>
        <el-tab-pane label="异常日志" name="exception"></el-tab-pane>
      <div class="handle-block">
        <el-button type="primary" @click="handleClick">刷新</el-button>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed
            label="日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="activeName=='operate'">{{scope.row.requestTime|formatDateTime}}</span>
              <span v-else>{{scope.row.date|formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="message"
            label="内容" show-overflow-tooltip v-if="activeName=='exception'">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名" show-overflow-tooltip v-if="activeName=='operate'">
          </el-table-column>
          <el-table-column
            prop="requestMethod"
            label="请求方式" show-overflow-tooltip v-if="activeName=='operate'">
          </el-table-column>
          <el-table-column
            prop="requestUri"
            label="请求地址" show-overflow-tooltip v-if="activeName=='operate'">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="300">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)">查看</el-button>
             </template>
          </el-table-column>
        </el-table>
      </template>
      </el-tabs>
      <div class="page-block">
        <el-pagination
          background
          :current-page="page"
          layout="prev, pager, next"
          :total="total"  :page-size="pageSize" v-if="total>pageSize"  @current-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
    <logFileDetail  ref="add" :active-name="activeName"></logFileDetail>
  </div>
</template>
<script>

  import logFileDetail from '@/components/systemManage/logFileManage/logFileDetails.vue'
  export default {
    name: "logFile",
    data (){
      return {
        msg : "日志列表",
        crumbsList:[   //  面包屑
          {name:'日志列表',url:{routerName:'systemManage',params:{name:'logFileManage'}}},
        ],
        activeName : "operate",
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        sort : "_id,desc"
      }
    },
    mounted: function () {
      this.getRoute()
      this.getData();
    },
    filters: {
      formatDateTime(d) {
        let date = new Date(d);;
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D;
      }
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/log/operate"
        if(this.activeName=='exception'){
          url = "/log/exception"
        }
        let param = {
          "page":(this.page-1),
          "size" :this.pageSize,
          "sort" : this.sort
        }
        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){
            this.tableData = res.data.content
            this.total = res.data.totalElements
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
      /*跳转页面*/
      changeView (data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "systemManage", query: { name: "logFileManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "systemManage", query: { name: "logFileManage",com: data, id: id}})
        }else{
          this.$router.push({name: "systemManage", query: { name: "logFileManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'systemManage', query: {name: 'logFileManage'}});
      },
      openModel (row){
        if(row){
          this.$refs.add.showModel(row)
        }
      },
      handleClick(row) {
        this.page = 0
        this.getData()
      }
    },
    components: {
      logFileDetail,
    }
  }
</script>

<style  lang="less" >
  #logFile{
    .el-table thead th{
      background: #f0f0f0!important;
    }
  .el-table .cell {
      padding-left: 25px;
    }
    .handle-block{
      padding: 12px 0;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0;
    }
  }

</style>
