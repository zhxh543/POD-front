<template>
  <div id="factoryOrders">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="filter-search">
        <table border="0" >
          <tr >
            <td>搜索内容</td>
            <td>
                <el-input v-model.trim="keyword" placeholder="请输入订单号 书名 书号"  size="mini"></el-input>
                <el-button type="primary"  size="mini" class="fl" @click="page=1,getData">搜索</el-button>
            </td>
          </tr>
        </table>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          :v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed
            prop="delivery_num"
            label="订单号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.delivery_date | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="delivery_status"
            label="订单状态" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="220">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="openModel(scope.row.id)">订单详情</el-button>
              <el-button type="warning" plain size="mini" @click="openNum(scope.row.id,scope.row.express_num)">物流单号登记</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="page-block">
        <el-pagination
          background :current-page="page"
          layout="prev, pager, next"
          :total="total"  :page-size="pageSize" v-if="total>pageSize"   @current-change="handleSizeChange">
        </el-pagination>
      </div>
      <orderDetails ref="detail" ></orderDetails>
    </div>
    <el-dialog
      title="物流单号登记"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="40%">
      <el-form label-width="100px" class="dialog-form"  :rules="rulesExpress"  :model="expressForm" ref="expressForm" >
        <el-form-item label="物流单号" prop="expressNum">
          <el-input v-model.trim="expressForm.expressNum" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="logisticsNum('expressForm')" v-loading="expressloading" size="mini">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import orderDetails  from '@/components/logisticsManage/orderMange/orderDetails.vue'

  export default {
    name: "factoryOrders",
    data (){
      // 物流单号
      var checkExpNum = (rule, value, callback) => {
        let reg = /^\w+$/
        if (!value) {
          callback(new Error('请输入物流单号'));
        } else {
          if (!reg.test(value)) {
            callback(new Error('请输入字母、数字或下划线'));
          }else{
            callback();
          }
        }
      };
      return {
        msg : "厂发订单管理",
        crumbsList:[   //  面包屑
          {name:'厂发订单管理',url:{routerName:'logisticsManage',params:{name:'orderMange'}}},
        ],
        dialogVisible : false,
        expressForm : {
          expressNum: "",//物流单号
        },
        rulesExpress :{
          expressNum: [
            {  required: true,validator: checkExpNum, trigger: 'blur' }
          ],
        },
        changeId : "",//修改物流单号的id
        expressloading : false,//物流单号loading
        isOpen:true,//是否展开
        //列表
        tableData: [],//data
        keyword : "",//关键字
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false
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
    mounted() {
      this.getData();
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/factoryDelivery/findFactoryOrder"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "keyword" :this.keyword
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
      openNum(id,num){
        this.changeId = id
        this.expressForm.expressNum = num
        this.dialogVisible  = true
      },
      //物流单号
      logisticsNum (formName){
        let url = "/factoryDelivery/addExpressNum"
        let param = {
          "id":this.changeId,
          "expressNum" :this.expressForm.expressNum
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.expressloading = true
            this.$ajax.post(url,param).then(res => {
              this.expressloading = false
              if(res.status === 200){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.dialogVisible = false
                this.getData()
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          } else {
            this.loading = false
            console.log('表单错误!');
            return false;
          }
        });
      },
      openModel (id){
        this.$refs.detail.showModel(id)
      },
      handleClose(done) {
        this.changeId  = ""
        this.expressForm = {}
        this.dialogVisible = false
      }
    },
    components: {
      orderDetails,
    }
  }
</script>

<style  lang="less" >
  #factoryOrders{
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
    .el-dialog__header{
      border-bottom: 1px solid #eeeeee;
    }
    .el-input{
      width: 260px;
    }
    .el-dialog__title{font-size: 14px;color: #333333}
    .el-form-item__content{color: #666666;}
    .el-form-item__label{color: #333333;padding-right: 30px}
    .el-form-item{margin-bottom: 2px}

  }

</style>
