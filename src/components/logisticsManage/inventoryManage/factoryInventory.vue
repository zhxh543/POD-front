<template>
  <div id="factoryInventory">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="filter-search">
        <table border="0" >
          <tr >
            <td>搜索内容</td>
            <td>
              <el-input v-model.trim="keyword" placeholder="请输入书名 书号"  size="mini"></el-input>
              <el-button type="primary"  size="mini" class="fl" @click="page=1,getData">搜索</el-button>
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
            label="入库时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.inboundTime | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="120">
            <template slot-scope="scope">
              <el-button type="warning" plain size="mini" @click="orderRemind(scope.row.id)">发货提醒</el-button>
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
    </div>
  </div>
</template>

<script>
  export default {
    name: "factoryInventory",
    data (){
      return {
        msg : "工厂库存管理",
        crumbsList:[   //  面包屑
          {name:'工厂库存管理',url:{routerName:'logisticsManage',params:{name:'inventoryManage'}}},
        ],
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
      orderRemind (id){
        let url = "/order/deliveryRemind/"+id
        let param = {
          "id":id,
        }
        this.$ajax.post(url,param).then(res => {
          if(res.status === 200){
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
      },
      // 获取列表
      getData () {
        let url = "/order/getFactoryStock"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "descs" :"inboundTime",
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
      handleClick(row) {
        console.log(row);
      }
    },

  }
</script>

<style  lang="less" >
  #factoryInventory{
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
    .el-switch{
      margin: 0 25px;
    }
  }

</style>
