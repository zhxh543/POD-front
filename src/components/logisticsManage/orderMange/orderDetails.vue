<template>
  <div id="orderDetails">
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="890px"
      :before-close="handleClose">
        <el-form label-width="100px" class="dialog-form" v-loading="loading">
          <el-form-item
            label="订单ID">
            <span v-text="orderDetail.deliveryNum" v-if="orderDetail.deliveryNum"></span>
            <span v-else>暂无数据</span>
          </el-form-item>
          <el-form-item
            label="收货地址">
            <span v-text="orderDetail.consigneeAddress" v-if="orderDetail.consigneeAddress"></span>
            <span v-else>暂无数据</span>
          </el-form-item>
          <el-form-item
            label="订单状态">
            <span v-text="orderDetail.deliveryStatus" v-if="orderDetail.deliveryStatus"></span>
            <span v-else>暂无数据</span>
          </el-form-item>
          <el-form-item
            label="物流单号">
            <span v-text="orderDetail.expressNum" v-if="orderDetail.expressNum"></span>
            <span v-else>暂无数据</span>
          </el-form-item>
          <el-form-item
            label="物流跟踪" >
            <div class="logisticsRecord" v-show="logisticsTotal>0">
              <ul>
                <li v-for="(item,index) in logisticsData" :key=index  v-if="index<logisticsNum">
                  <p v-text="item.time" ></p>
                  <p v-text="item.context" ></p>
                </li>
              </ul>
              <div v-if="logisticsNum==2"><i class="el-icon-arrow-down" @click="logisticsNum=logisticsTotal"></i></div>
              <div v-else><i class="el-icon-arrow-up" @click="logisticsNum=2"></i></div>
            </div>
            <div v-show="logisticsTotal==0">暂无数据</div>
          </el-form-item>
      </el-form>
        <el-table
        :data="tableData"
        stripe
        v-loading="tableLoading"
        style="width: 100%">
        <el-table-column
          fixed
          align="left"
          width="180"
          label="ISBN" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="detail-img">
            <!--<img :src="scope.row.pic_path" >-->
            <span v-text="scope.row.isbn"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="book_name"
          label="书名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="book_num"
          label="订购册数" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "orderDetails",
    data() {
      return {
        dialogVisible: false,
        id : "",
        loading : false,
        orderDetail : {},//订单详情
        tableData: [],//商品列表
        tableLoading : false,
        logisticsNum: 2,//物流显示条数
        logisticsTotal: 0,
        logisticsData: []//物流列表
      };
    },
    methods: {
      showModel (id){
          this.dialogVisible = true;
          this.id = id
          this.getData()
      },
      // 获取列表
      getData () {
        let url = "/factoryDelivery/"+this.id
        this.loading = true
        this.$ajax.get(url,{}).then(res => {
          this.loading = false
          if(res.status === 200){
            this.orderDetail = res.data
            this.getLogistics(res.data.expressNum)
            this.getGoodsData(res.data.id)
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      getGoodsData (deliveryId){
        let url = "/factoryDelivery/findDetail/"+deliveryId
        this.tableLoading = true
        let param = {
          "deliveryId":deliveryId,
        }
        this.$ajax.get(url,{}).then(res => {
          this.tableLoading = false
          if(res.status === 200){
            this.tableData = res.data
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      getLogistics (orderNum){
        let url = "/logisticsParams/logistics/"+orderNum
        // this.loading = true

        let param = {
          "orderNum":orderNum,
        }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            if(res.data.showapi_res_body){
              this.logisticsData = res.data.showapi_res_body.data
              if(res.data.showapi_res_body.data){
                this.logisticsTotal = this.logisticsData.length
              }
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      handleClose(done) {
        this.orderDetail = {}
        this.logisticsData = []
        this.tableData  = []
        this.id = ""
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #orderDetails{
    .dialog-form{margin-bottom: 35px}
    .logisticsRecord{
      width: 100%;
      padding: 20px 15px;
      line-height: 32px;
      background: #f5f5f5;
      text-align: left;
      div{
        text-align: center;
        i{cursor: pointer;font-size: 16px}
      }
    }
    .detail-img{
      img{
        width: 45px;
        height: 63px;
        float: left;
        margin-right: 30px;
      }
      span{
        float: left;
        line-height: 60px;
      }
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 0px;
      }
    }

  }

</style>
