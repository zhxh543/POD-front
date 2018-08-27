<template>
  <div id="selectBooks">
    <el-dialog
      title="图书选择器"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <div class="search-book">
        <el-input v-model="keyword" placeholder="请输入书名 / ISBN号 "></el-input>  <el-button type="primary" @click="page=1,getData()">搜索</el-button>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="book_name"
            label="图书名称"
            width="480">
          </el-table-column>
          <el-table-column
            prop="isbn"
            label="ISBN号">
          </el-table-column>
          <el-table-column label="操作"
                           width="80">
            <template slot-scope="scope">
              <el-button type="primary" plain
                         size="small"
                         @click="selectBooks(scope.$index, scope.row)">选择</el-button>
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
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "selectBooks",
    data() {
      return {
        chooseBookData: {},//选择的图书信息
        dialogVisible: false,
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 6,//一次显示几条
        total : 0,//总条数
        loading : false,
        keyword:''
      }
    },
    mounted() {
    },
    methods: {
      // 获取列表
      getData () {
        let url = "/bookBase"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "keyword" : this.keyword
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
      /*显示弹窗*/
      showModel() {
        this.dialogVisible = true;
        this.getData()
      },
      handleClose(done) {
        this.dialogVisible = false;
        this.page = 1;
         this.pageSize = 6;
        this.keyword = "";
        this.chooseBookData = {}
        // this.tableData = []
      },
      //选择图书
      selectBooks(index, row) {
        this.chooseBookData.book_name = row.book_name
        this.chooseBookData.isbn = row.isbn
        this.chooseBookData.id = row.id
        this.changeBook()
      },
      //选择图书回填
      changeBook () {
        this.$emit("listChanged",this.chooseBookData)
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="less">
  #selectBooks {
    font-family: "Microsoft YaHei";
    .el-dialog__body{
      padding-bottom: 0px!important;
      .search-book{
        margin-bottom: 22px;
        height: 40px;
        .el-input{
          width: 89%;
          float: left;
        }
        button{
          width: 10%;
          float: right;
        }
      }
    }
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 20px;
      }
    }
  }
</style>
