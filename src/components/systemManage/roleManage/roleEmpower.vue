<template>
  <div id="roleEmpower">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block"></div>
      <template>
        <!--审核管理-->
        <div  v-for="(list,index) in modelList" v-loading="loading">
          <el-checkbox :indeterminate="list.isIndeterminate" v-model="list.isCheckAll" @change="handleCheckAll(list,index)">{{list.name}}</el-checkbox>
          <div class="checkbox-group">
            <el-checkbox-group v-model="selectData" @change="handleChange()">
              <el-checkbox v-for="(item,indx) in list.children" :label="item.id" :key="item.id" border @change="appendParentId(list.children,item.parentId,item.id,index,modelList)"><span>{{item.name}}</span></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>
      <div class="form-submit ">
        <el-button  type="primary" @click="submitForm()" v-loading="saveLoading">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
      name: "roleEmpower",
      data (){
        return {
          msg : "授权",
          crumbsList:[   //  面包屑
            {name:'角色权限管理',url:{routerName:'systemManage',params:{name:'roleManage'}}},
            {name:'授权',url:""},
          ],
          userId: this.$route.query.id,//roleCode
          selectData: [],//保存选择的角色id
          modelList: [],//全部角色
          loading: false,
          saveLoading : false

        }
      },
      mounted(){
        this.getEmpower()
      },
      methods: {
        // 获取
        getEmpower () {
          let url = "/role/"+this.userId
          this.$ajax.get(url,{}).then(res => {
            if(res.status === 200){
              this.selectData = res.data.resourceIds
              this.getModelData(res.data.resourceIds)
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        },
        // 获取列表
        getModelData (data) {
          let url = "/resource"
          this.loading = true
          let checkedCount = 0;//当前数组中选中的个数
          this.$ajax.get(url,{}).then(res => {
            this.loading = false
            if(res.status === 200){
              this.modelList = res.data
              res.data.forEach(function (item) {
                checkedCount = 0
                item.children.forEach(function (childItem) {//当前行与选中的数组对比，如果有重复，把父id加上
                  if(data.indexOf(childItem.id)>-1){
                    checkedCount += 1;//计算选中的个数
                  }

                })
                if(checkedCount==item.children.length){//全选
                  item.isCheckAll=true;
                  item.isIndeterminate=false;
                }

                if(checkedCount==0){//全不选
                  item.isCheckAll=false;
                  item.isIndeterminate=false;
                }
                if(checkedCount!=0){
                  if((checkedCount>0&&checkedCount<item.children.length)){//不确定
                    item.isCheckAll=false;
                    item.isIndeterminate=true;
                  }
                }
                if(!item.children.length){
                //真对一级菜单下没有二级的时候，如果有当前id就全选
                if(data.indexOf(item.id)>-1){
                  item.isCheckAll=true;
                }
                }
              })
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        },
        appendParentId (row,pid,id,pindex,allData){
          //当前数组，父id,当前id，父index
          let  data = this.selectData
          let checkedCount = 0;//当前数组中选中的个数
          row.forEach(function (item) {//当前行与选中的数组对比，如果有重复，把父id加上
            if(data.indexOf(item.id)>-1){
              checkedCount += 1;//计算选中的个数
            }
          })
          if((checkedCount>0&&checkedCount<row.length)&&(checkedCount!=0)){//不确定
            allData[pindex].isCheckAll=false;
            allData[pindex].isIndeterminate=true;
            if(!(data.indexOf(pid)>-1)){
              data.push(pid)
            }
          }else if(checkedCount==row.length){//全选
            allData[pindex].isCheckAll=true;
            allData[pindex].isIndeterminate=false;
            if(!(data.indexOf(pid)>-1)){
              data.push(pid)
            }
          }
          if(checkedCount==0){//全不选
            allData[pindex].isCheckAll=false;
            allData[pindex].isIndeterminate=false;
            data.splice(data.indexOf(pid), 1);
          }
        },
        submitForm() {
          let url = "/role/"+this.userId+"/grant"
          let param = this.selectData
          // this.findeAllSelected()
          this.saveLoading = true
          this.$ajax.put(url,param).then(res => {
            this.saveLoading = false
            if(res.status === 200){
              this.$message({
                message: "操作成功",
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
        handleChange(value) {
        },
        handleCheckAll(row,index) {
          let isCheck = row.isCheckAll
          let id = row.id
          let  data = this.selectData
          let childrenData = row.children
          let isIn = row.isIndeterminate
          if(isCheck){//如果全选，把这个id加进去（先判断如果没有）
            if(!(data.indexOf(id)>-1)){
              data.push(id)
            }
            this.modelList[index].isIndeterminate = false
            childrenData.forEach(function (item) {//循环子菜单，删除加上菜单
              if(!(data.indexOf(item.id)>-1)){//如果没有就加上
                data.push(item.id);
              }
            })
          }else{
            //如果不全选，把id去掉，并且下面的二级全去掉
            data.splice(data.indexOf(id), 1);
            childrenData.forEach(function (item) {//循环子菜单，删除子菜单
              if(data.indexOf(item.id)>-1){//如果有就删了
                data.splice(data.indexOf(item.id), 1);
              }
            })
          }
        },
      },
    components: {
    }
    }
</script>

<style  lang="less" type="text/less">
#roleEmpower{
  .form-submit{
    margin: 30px 0;
  }
  .check-title{margin-top: 20px}
  .checkbox-group{
    margin: 20px 0;
    .el-checkbox__inner{
      display: none;
    }
  }
  .el-checkbox{margin-right: 20px;margin-bottom: 20px}
  .el-checkbox+.el-checkbox{margin-left: 0}
}

</style>
