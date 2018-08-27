<template>
  <div id="printSpeed">
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
            </td>
          </tr>
        </table>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          min-width="1400px">
          <el-table-column
            fixed width="180px"
            prop="isbn"
            label="ISBN" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookName" width="250px"
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
          <!--<el-table-column-->
            <!--label="下单时间" show-overflow-tooltip>-->
            <!--<template slot-scope="scope">-->
              <!--<span v-if="scope.row.reprintCreateTime"> {{scope.row.reprintCreateTime |formatDateTime}}</span>-->
              <!--<span v-else>-</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            width="130"
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
            label="进度状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="250"
                trigger="hover">
                <el-table :data="scope.row.recordsChildren">
                  <el-table-column property="progressMgmtValue" label="进度名称"></el-table-column>
                  <el-table-column label="日期">
                    <template slot-scope="scopeChild">
                      <span v-if="scopeChild.row.updateDate"> {{scopeChild.row.updateDate |formatDateTime}}</span>
                      <span v-else>-</span>
                    </template></el-table-column>
                </el-table>
                <span slot="reference" class="col-blue">{{scope.row.progressMgmt}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="110">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="openModel(scope.row)">进度登记</el-button>
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
    <printCheckIn  ref="checkIn" @loadData="getData()"></printCheckIn>
  </div>
</template>

<script>

  import printCheckIn  from '@/components/reprintManage/printSpeedMange/printCheckIn.vue'
  export default {
    name: "printSpeed",
    data (){
      return {
        msg : "印制进度登记",
        crumbsList:[   //  面包屑
          {name:'印制进度登记',url:{routerName:'reprintManage',params:{name:'printSpeedMange'}}},
        ],
        isOpen:true,//是否展开
        //列表
        keyword  : "",
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
        let url = "/order"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "keyword":this.keyword,
          "handle" : "印制进度"
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
        if(row){
          this.$refs.checkIn.showModel(row)
        }else{
          this.$refs.checkIn.showModel()
        }
      },
    },
    components: {
      printCheckIn,
    }

  }
</script>

<style  lang="less" >
  #printSpeed{
    .col-blue{
      color: #30b8fe;
    }
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
    .el-switch{
      margin: 0 25px;
    }
  }

</style>
