<template>
  <div id="factoryData">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-button type="primary"  @click="openModel()">新增工厂</el-button>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="厂名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="address"
            label="厂址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="contact"
            label="联系人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="typeDesc"
            label="类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="220">
            <template slot-scope="scope">
              <el-switch
                :disabled="switchDisabled"
                @change="handleAble(scope.row.enabled,scope.row)"
                v-model="scope.row.enabled">
            </el-switch>
              <el-button type="primary" plain size="mini" @click="openModel(scope.row.id, scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="deleteData(scope.$index, scope.row,tableData)">删除</el-button>
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
      <factoryAdd  ref="add" @loadData="getData()"></factoryAdd>
    </div>
  </div>
</template>

<script>

  import factoryAdd  from '@/components/printingManage/factoryDataMange/factoryAdd.vue'
  export default {
    name: "factoryData",
    data (){
      return {
        msg : "工厂数据管理",
        crumbsList:[   //  面包屑
          {name:'工厂数据管理',url:{routerName:'printingManage',params:{name:'factoryDataMange'}}},
        ],
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        switchDisabled : false,//启用停用时，防重复提交
      }
    },
    mounted() {
      this.getData();
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/factory"
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
      handleAble (status,rows) {
        this.switchDisabled = true
        let url = "/factory/"+rows.id+"/"+status
        let param = {
          id : rows.id,
          enabled : status,
        }
        this.$ajax.put(url,param).then(res => {
          if(res.status === 200){
            this.switchDisabled = false
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getData()
          }else{
            this.switchDisabled = false
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      openModel (id,rows){
        if(id){
          this.$refs.add.showModel(id,rows)
        }else{
          this.$refs.add.showModel()
        }
      },
      // 删除
      deleteData (index,data,rows){
        let url = "/factory/"+data.id

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
      handleClick(row) {
        // console.log(row);
      }
    },
    components: {
      factoryAdd,
    }

  }
</script>

<style  lang="less" >
  #factoryData{
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
      margin-right: 25px;
    }
  }

</style>
