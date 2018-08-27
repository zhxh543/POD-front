<template>
  <div id="warningArea">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="filter-search">
        <table border="0" >
          <tr >
            <td>搜索内容</td>
            <td>
              <el-input v-model="keyword" placeholder="请输入书名 书号"  size="mini"></el-input>
              <el-button type="primary"   size="mini" class="fl" @click="page=1,getData()">搜索</el-button>

              <el-button type="info" plain size="mini" class="fr" @click="isOpen =!isOpen">
                {{isOpen?"收起":"展开"}}
                <i :class="isOpen ? 'el-icon-arrow-up':'el-icon-arrow-down'" class="el-icon right"></i>
              </el-button>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印建议方式</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(reprintType=='')}" @click="reprintType=''">全部</span>
                <span :class="{'tag-active':(reprintType=='POD')}" @click="reprintType='POD'">POD</span>
                <span :class="{'tag-active':(reprintType=='Tradition')}" @click="reprintType='Tradition'">传统印刷</span>
              </div>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印建议状态</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(auditStatus=='')}" @click="auditStatus=''">全部</span>
                <span :class="{'tag-active':(auditStatus=='Pending')}" @click="auditStatus='Pending'">待处理</span>
                <span :class="{'tag-active':(auditStatus=='Apply')}" @click="auditStatus='Apply'">待审核</span>
                <span :class="{'tag-active':(auditStatus=='Pass')}" @click="auditStatus='Pass'">审核通过</span>
                <span :class="{'tag-active':(auditStatus=='Deny')}" @click="auditStatus='Deny'">审核拒绝</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            fixed
            prop="isbn"
            width="180"
            label="ISBN" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookName"
            label="书名" width="180px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="首版时间" width="130px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.firstPrintDate"> {{scope.row.firstPrintDate |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="前次印刷时间"  width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.lastPrintDate"> {{scope.row.lastPrintDate |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="currentEditionTimes"
            label="前次版次" width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="lastPrintNum"
            label="前次版次印刷数量" width="130px"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintTypeValue"
            label="重印建议印刷方式" width="130px"  show-overflow-tooltip>
          </el-table-column>
            <el-table-column
              prop="reprintNum"
              label="重印建议印刷数量" width="130px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="260">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)" :disabled="!(scope.row.auditStatus=='Pending')">编辑</el-button>
              <el-button type="warning" plain size="mini" @click="submitExamine(scope.row)" :v-loading="examineLoading" :disabled="!(scope.row.auditStatus=='Pending')">提交审核</el-button>
              <el-button type="danger" plain size="mini" @click="deleteData(scope.$index, scope.row,tableData)" :disabled="!(scope.row.auditStatus=='Pending')">删除</el-button>
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
      <warningUpdate ref="update" @loadData="getData()"></warningUpdate>
    </div>
  </div>
</template>

<script>
  import warningUpdate  from '@/components/reprintWarningManage/warningAreaManage/warningAreaUpdate.vue'

  export default {
    name: "warningArea",
    data (){
      return {
        msg : "重印区",
        crumbsList:[   //  面包屑
          {name:'重印区',url:{routerName:'reprintWarningManage',params:{name:'warningAreaManage'}}},
        ],
        isOpen:true,//是否展开
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,

        reprintType : "",
        auditStatus : "Pending",
        keyword : "",
        reprintNum : "",
        reprintCreateTime : "",
        reprintAuditNum : "",
        reprintAuditType : "",
        reprintAuditTime : "",
        examineLoading : false
      }
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
    mounted: function () {
      this.getData();
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/order"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "reprintType":this.reprintType,
          "auditStatus" :this.auditStatus,
          "keyword":this.keyword,
          // "reprintNum" :this.reprintNum,
          "reprintCreateTime":this.reprintCreateTime,
          // "reprintAuditNum" :this.reprintAuditNum,
          "reprintAuditType":this.reprintAuditType,
          "reprintAuditTime" :this.reprintAuditTime,
          "handle" : "重印区"
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
      openModel (data){
        this.$refs.update.showModel(data)
      },
      // 删除
      deleteData (index,data,rows){
        let url = "/order/"+data.id

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
      submitExamine (data) {
        let url = "/order/"+data.id
        let param = {
          "id":data.id,
          "auditStatus" :"Apply",
          "handle":"重印区审核"
        }
        this.examineLoading = true

        this.$confirm('确认提交审核吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.$ajax.put(url,param).then(res => {
              this.examineLoading = false
              if(res.status === 200){
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.getData()
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          })
          .catch(_ => {});
      }
    },
    components: {
      warningUpdate,
    }
  }
</script>

<style  lang="less" >
  #warningArea{
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
