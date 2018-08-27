<template>
  <div id="systemMessage">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="'未读（'+unReadNum+'）'" name="false"></el-tab-pane>
          <el-tab-pane :label="'已读（'+readNum+'）'" name="true"></el-tab-pane>
          <div class="newsList">
            <ul>
              <li v-for="(item,index) in tableData" :key="index">
                <p><em v-html="item.title"></em><span>{{item.createdTime |formatDateTime}}</span></p>
                <p><span v-html="item.content"></span>
                </p>
              </li>
            </ul>
          </div>
        </el-tabs>
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
    name: "systemMessage",
    data (){
      return {
        msg : "站内消息",
        crumbsList:[   //  面包屑
          {name:'站内消息',url:{routerName:'newsManage',params:{name:'systemMessageManage'}}},
        ],
        activeName: 'false',
        readNum : 0,//已读数量
        unReadNum : 0,//未读数量
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
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
      this.getRoute()
      this.getNum();
      this.getData();
    },
    methods : {
      // 获取数量
      getNum () {
        let url = "/message/stats"
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.readNum = res.data.hasRead
            this.unReadNum = res.data.notRead
            this.$nextTick(function (){
              if(res.data.notRead==0){
                $("#isReadId").css("display","none");
                // var obj=document.getElementById("isReadId");
                // obj.style.display="none";
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
      // 获取列表
      getData () {
        let url = "/message"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "descs" :"createdTime",
           "hasRead" :this.activeName
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
        if(this.activeName=='false'){
          if(val>this.page){
            val = val-1
          }
        }
        this.page = val
        this.getNum();
        this.getData()
      },
      /*跳转页面*/
      changeView (data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "newsManage", query: { name: "systemMessageManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "newsManage", query: { name: "systemMessageManage",com: data, id: id}})
        }else{
          this.$router.push({name: "newsManage", query: { name: "systemMessageManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'newsManage', query: {name: 'systemMessageManage'}});
      },
      handleClick(row) {
        this.page = 1
        this.getNum();
        this.getData()
      }
    },
    components: {
    }
  }
</script>

<style  lang="less" >
  #systemMessage{
    .el-tabs__header{
      margin-bottom: 0px;
    }
   .newsList{
     ul li{
       padding: 25px 0;
       border-bottom: 1px solid #e4e7ed;
       em{font-style:normal;margin-right: 30px;font-weight: bold}
       p{
         color: #666666;
         line-height: 24px;
         margin: 5px 0;
         font-size: 14px;
         span{color: #999999}
       }
     }
   }
  }

</style>
