<template>
  <div id="produceWorkList">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="filter-search">
        <table border="0" >
          <tr >
            <td>搜索内容</td>
            <td>
                <el-input v-model="keyword" placeholder="请输入书名 书号"  size="mini"></el-input>
                <el-button type="primary"   size="mini" class="fl"  @click="page=1,getData()">搜索</el-button>

                <el-button type="info" plain size="mini" class="fr" @click="isOpen =!isOpen">
                  {{isOpen?"收起":"展开"}}
                  <i :class="isOpen ? 'el-icon-arrow-up':'el-icon-arrow-down'" class="el-icon right"></i>
                </el-button>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印方式</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(reprintType=='')}" @click="reprintType=''">全部</span>
                <span :class="{'tag-active':(reprintType=='POD')}" @click="reprintType='POD'">POD</span>
                <span :class="{'tag-active':(reprintType=='Tradition')}" @click="reprintType='Tradition'">传统印刷</span>
              </div>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>审核状态</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(auditStatus=='')}" @click="auditStatus=''">全部</span>
                <span :class="{'tag-active':(auditStatus=='Apply')}" @click="auditStatus='Apply'">待审核</span>
                <span :class="{'tag-active':(auditStatus=='Pass')}" @click="auditStatus='Pass'">审核通过</span>
                <!--<span :class="{'tag-active':(auditStatus=='Deny')}" @click="auditStatus='Deny'">审核拒绝</span>-->
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
            label="书名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintAuditNum"
            label="重印数量" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintAuditTypeValue"
            label="重印方式" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintFactory"
            label="重印工厂" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="派单/接单时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus=='派单'">
              <span v-if="scope.row.reprintDispatchTime"> {{scope.row.reprintDispatchTime |formatDateTime}}</span>
              <span v-else>-</span>
              </div>
              <div v-else>
                <span v-if="scope.row.reprintRecieveTime"> {{scope.row.reprintRecieveTime |formatDateTime}}</span>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="130"
            label="预计入库时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.inboundTime"> {{scope.row.inboundTime |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inboundLocation"
            label="入库位置" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button type="success" plain size="mini" @click="submitExamine(scope.row,'Pass')" :v-loading="examineLoading" :disabled="(scope.row.exchangeStatus  =='Pass'||scope.row.exchangeStatus  =='Deny')">通过</el-button>
              <el-button type="danger" plain size="mini" @click="submitReject(scope.row,'Deny')" :v-loading="examineLoading" :disabled="(scope.row.exchangeStatus  =='Pass'||scope.row.exchangeStatus  =='Deny')">拒绝</el-button>
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
      <el-dialog width="40%" title="拒绝理由" :visible.sync="dialogFormVisible"  :before-close="handleClose">
        <el-form label-width="70px">
          <el-form-item label="拒绝理由"  >
            <el-input type="textarea" v-model.trim="denyReason"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" @click="reasonReject" size="mini" :v-loading="examineLoading" >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "produceWorkList",
    data (){
      return {
        msg : "生产工单审核",
        crumbsList:[   //  面包屑
          {name:'生产工单审核',url:{routerName:'examineManage',params:{name:'produceManage'}}},
        ],
        isOpen:true,//是否展开
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        examineLoading : false,
        reprintType : "",
        auditStatus : "Apply",
        keyword : "",
        reprintNum : "",
        reprintCreateTime : "",
        reprintAuditNum : "",
        reprintAuditType : "",
        reprintAuditTime : "",
        dialogFormVisible :false,
        denyReason : "",//拒绝理由
        rejectData :"",
        rejectDataValue :""
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
          "reprintAuditType":this.reprintType,
          "exchangeStatus" :this.auditStatus,
          "keyword":this.keyword,
          "reprintNum" :this.reprintNum,
          "reprintCreateTime":this.reprintCreateTime,
          "reprintAuditNum" :this.reprintAuditNum,
          "reprintAuditTime" :this.reprintAuditTime,
          "handle" : "生产工单审核"
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
      submitExamine (data,value) {
        let url = "/order/"+data.id
        let param = {
          "id":data.id,
          "exchangeStatus" :value,
          "handle" : "生产工单审核"
        }
        this.examineLoading = true
        this.$confirm('确认通过吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.$ajax.put(url,param).then(res => {
              this.examineLoading = false
              if(res.status === 200){
                this.$message({
                  message: "操作成功！",
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
      },
      submitReject (data,value) {
        this.$confirm('确认拒绝吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.rejectData = data
            this.rejectDataValue = value
            this.dialogFormVisible  = true
          })
          .catch(_ => {});
      },
      reasonReject (){
        let url = "/order/"+this.rejectData.id
        let param = {
          "id":this.rejectData.id,
           "exchangeStatus" :this.rejectDataValue,
           "exchangeDenyReason" :this.denyReason,
           "handle" : "生产工单审核"
        }
        this.examineLoading = true
        this.$ajax.put(url,param).then(res => {
          this.examineLoading = false
          if(res.status === 200){
            this.$message({
              message: "操作成功！",
              type: 'success'
            });
            this.dialogFormVisible = false
            this.rejectData = ""
            this.rejectDataValue = ""
            this.denyReason = ""
            this.getData()
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      handleClose(done) {
        this.denyReason = ""
        this.rejectData = ""
        this.rejectDataValue = ""
        this.dialogFormVisible = false
      }
    },
  }
</script>

<style  lang="less" >
  #produceWorkList{
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 40px;
      }
    }
    .el-dialog__header{
      border-bottom: 1px solid #eeeeee;
      .el-dialog__title{font-size: 14px}
    }
    .handle-block{
      padding: 12px 0;
    }
    .el-switch{
      margin: 0 25px;
    }
  }

</style>
