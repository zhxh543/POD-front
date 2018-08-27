<template>
  <div id="otherImportData">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-upload
          class="upload-demo fl"
          action="api/import/other"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :show-file-list="false"
          multiple>
          <el-button type="primary">导入</el-button>
        </el-upload>
        <a :href="downloadUrl+'/importTemplate/Other.xlsx'" download class="el-button  el-button--primary ">下载模板</a>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%" v-loading="loading">
          <el-table-column
            prop="isbn"
            label="ISBN" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookName"
            label="书名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookNum"
            label="册数" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.formDate |formatDateTime}}
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
      <p class="rds-remark" v-html="importDesc"></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "otherImportData",
    data (){
      return {
        msg : "其他数据导入",
        crumbsList:[   //  面包屑
          {name:'其他数据导入',url:{routerName:'importManage',params:{name:'otherImportManage'}}},
        ],
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
      }
    },
    mounted() {
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
        let url = "/import/other"
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
      //导入
      handleAvatarSuccess(res, file) {
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

  }
</script>

<style  lang="less" >
  #otherImportData{
    .upload-demo{margin-right: 15px}
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .handle-block{
      .el-down{padding: 9px 15px;font-size: 12px;}
      .el-down{height:33px;
      }
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 20px;
      }
    }
  }

</style>
