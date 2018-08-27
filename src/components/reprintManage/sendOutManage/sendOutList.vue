<template>
  <div id="sendOutList">
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
            <td>派单状态</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(orderStatus==null)}" @click="orderStatus=null">全部</span>
                <span :class="{'tag-active':(orderStatus=='未处理')}" @click="orderStatus='未处理'">未派单</span>
                <span :class="{'tag-active':(orderStatus=='派单')}" @click="orderStatus='派单'">已派单</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <template >
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed="left"  width="180px"
            prop="isbn"
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
            label="重印建议审核时间" width="130px"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.reprintSuggestAuditTime"> {{scope.row.reprintSuggestAuditTime |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="重印派单时间"  width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.reprintDispatchTime"> {{scope.row.reprintDispatchTime |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="预计入库时间"  width="100px" show-overflow-tooltip>
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
            prop="exchangeStatusValue"
            label="生产工单审核"  width="130px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="180">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)" :disabled="!(scope.row.exchangeStatus=='Pending'||scope.row.exchangeStatus=='Deny')">处理</el-button>
              <el-button type="warning" plain size="mini" @click="submitExamine(scope.row)" :v-loading="examineLoading" :disabled="!(scope.row.exchangeStatus=='Pending'||scope.row.exchangeStatus=='Deny')">提交审核</el-button>
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
    <reprintHandle ref="handle" @loadData="getData()"></reprintHandle>
  </div>
</template>

<script>

  import reprintHandle  from '@/components/reprintManage/sendOutManage/reprintHandle.vue'

  export default {
    name: "sendOutList",
    data (){
      return {
        msg : "派单管理",
        crumbsList:[   //  面包屑
          {name:'派单管理',url:{routerName:'reprintManage',params:{name:'sendOutManage'}}},
        ],
        isOpen:true,//是否展开
        //列表
        keyword: "",
        orderStatus : "未处理",
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
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
    mounted() {
      this.getData();
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/order"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "orderStatus": this.orderStatus,
          "keyword":this.keyword,
          "handle" : "派单"
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
      openModel (row){
        this.$refs.handle.showModel(row)
      },
      submitExamine (data) {
        let url = "/order/"+data.id
        let param = {
          "id":data.id,
          "handle":"派单",
          "exchangeStatus" :"Apply",
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
    reprintHandle,
  }
  }
</script>

<style  lang="less" >
  #sendOutList{
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
