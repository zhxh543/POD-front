<template>
  <div id="systemModule">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-button type="primary"  @click="changeView('moduleAdd',null,null)">新增模块</el-button>
      </div>
      <template>
        <el-table  v-loading="loading" :data="tableData" :row-class-name="getRowClass" @expand-change="getSecondList" stripe style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table class="second-level" :data="props.row.children" :index="props.row.$index" style="width: 100%">
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="功能模块" prop="name"></el-table-column>
                <el-table-column label="路径" prop="url"></el-table-column>
                <el-table-column label="序号" prop="sort"></el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.enabled==true">启用</span>
                    <span v-else>停用</span>
                  </template>
                </el-table-column>
                <el-table-column label="功能描述" prop="description"></el-table-column>
                <el-table-column label="操作" width="260">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enabled"
                      :disabled="switchDisabled"
                      @change="handleAble(scope.row.enabled,scope.row)">
                    </el-switch>
                    <el-button size="mini" type="primary" plain class="tab-btn"
                               @click="changeView('moduleAdd',scope.row.id)">编辑
                    </el-button>
                    <el-button type="danger" plain size="mini" @click="deleteData(scope.$index, scope.row,props.row.children)" >删除</el-button>

                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="功能模块" prop="name"></el-table-column>
          <el-table-column label="路径" prop="url"></el-table-column>
          <el-table-column label="序号" prop="sort"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.enabled==true">启用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column label="功能描述" prop="description"></el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="switchDisabled"
                @change="handleAble(scope.row.enabled,scope.row)">
              </el-switch>
              <el-button size="mini" type="primary" plain class="tab-btn"
                         @click="changeView('moduleAdd',scope.row.id)">编辑
              </el-button>
              <el-button type="danger" plain size="mini" @click="deleteData(scope.$index, scope.row,tableData)" >删除</el-button>
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
  </div>
</template>

<script>

  export default {
    name: "systemModule",
    data (){
      return {
        msg : "系统模块管理",
        crumbsList:[   //  面包屑
          {name:'系统模块管理',url:{routerName:'systemManage',params:{name:'systemModuleManage'}}},
        ],
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        switchDisabled : false,
      }
    },
    mounted: function () {
      this.getRoute()
      this.getData()
    },
    methods : {
      // 获取列表
      getData () {
        let url = "/resource"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
        }
        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){
            res.data.records.forEach(function (item) {
              item.children = []
            })
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
      // 删除
      deleteData (index,data,rows){
        let url = "/resource/"+data.id
        let param = {
          "id":data.id,
        }
        this.$confirm('确认删除吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.$ajax.delete(url,param).then(res => {
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
      /*给table的行赋index*/
      getRowClass({row, rowIndex}) {
        row.index = rowIndex;
      },
      handleAble (status,rows) {
        this.switchDisabled = true
        let url = "/resource/"+rows.id+"/"+status
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
      getSecondList(row, expandedRows) {
        let index = row.index;
        let url = "/resource"
        let param = {
          "id":row.id,
        }
        let _this = this
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            _this.tableData[index].children = res.data.records
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      /*跳转页面*/
      changeView (data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "systemManage", query: { name: "systemModuleManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "systemManage", query: { name: "systemModuleManage",com: data, id: id}})
        }else{
          this.$router.push({name: "systemManage", query: { name: "systemModuleManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'systemManage', query: {name: 'systemModuleManage'}});
      },
    }
  }
</script>

<style  lang="less" >
  #systemModule{
    .el-table thead th{
      background: #f0f0f0!important;
    }
  .el-table .cell {
      padding-left: 25px;
    }
    .handle-block{
      padding: 12px 0;
    }
    .el-switch{
      margin: 0 25px;
    }

    .second-level {
      &:before {
        height: 0;
      }
      .el-table__header-wrapper {
        display: none;
      }
      .el-table__row:last-child {
        td {
          border-bottom: 0 !important;
        }
      }
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0;
    }
  }

</style>
