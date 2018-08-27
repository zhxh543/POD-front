<template>
  <div id="reprintSuggest">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="filter-search">
        <table border="0" >
          <tr >
            <td>搜索内容</td>
            <td>
              <el-input v-model="keyword" placeholder="请输入书名 书号"  size="mini"></el-input>
              <el-button type="primary"   size="mini" class="fl" @click="page=1,getData()" :disabled="isSearch">搜索</el-button>
              <el-button type="info" plain size="mini" class="fr" @click="isOpen =!isOpen">
                {{isOpen?"收起":"展开"}}
                <i :class="isOpen ? 'el-icon-arrow-up':'el-icon-arrow-down'" class="el-icon right"></i>
              </el-button>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印建议印刷数量</td>
            <td>
              <!--<el-input-number v-model.trim="reprintNum" :min="0" :controls="false"></el-input-number>-->
              <el-input v-model.trim="reprintNum" placeholder="请输入数量"  size="mini" @change="checkIsNum(reprintNum,'oneError')"></el-input>
              <span v-show="oneError" class="errorText">请输入正整数</span>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印建议印刷方式</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(reprintType=='')}" @click="reprintType=''">全部</span>
                <span :class="{'tag-active':(reprintType=='POD')}" @click="reprintType='POD'">POD</span>
                <span :class="{'tag-active':(reprintType=='Tradition')}" @click="reprintType='Tradition'">传统印刷</span>
              </div>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印建议时间</td>
            <td>
              <el-date-picker
                v-model="reprintCreateTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"  size="mini">
              </el-date-picker>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印审核印刷数量</td>
            <td>
              <el-input v-model.trim="reprintAuditNum" placeholder="请输入数量"  size="mini" @change="checkIsNum(reprintAuditNum,'oneError2')"></el-input>
              <span v-show="oneError2" class="errorText">请输入正整数</span>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印审核印刷方式</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(reprintAuditType=='')}" @click="reprintAuditType=''">全部</span>
                <span :class="{'tag-active':(reprintAuditType=='POD')}" @click="reprintAuditType='POD'">POD</span>
                <span :class="{'tag-active':(reprintAuditType=='Tradition')}" @click="reprintAuditType='Tradition'">传统印刷</span>
              </div>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印审核时间</td>
            <td>
              <el-date-picker
                v-model="reprintAuditTime"

                type="date"
                value-format="timestamp"
                placeholder="选择日期"  size="mini">
              </el-date-picker>
            </td>
          </tr>
          <tr v-if="isOpen">
            <td>重印建议状态</td>
            <td>
              <div class="tag">
                <span :class="{'tag-active':(auditStatus=='')}" @click="auditStatus=''">全部</span>
                <span :class="{'tag-active':(auditStatus=='Apply')}" @click="auditStatus='Apply'">待审核</span>
                <span :class="{'tag-active':(auditStatus=='Pass')}" @click="auditStatus='Pass'">审核通过</span>
                <span :class="{'tag-active':(auditStatus=='Deny')}" @click="auditStatus='Deny'">审核拒绝</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <template>
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed
            prop="isbn" width="180px"
            label="ISBN" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookName"
            label="书名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column width="100px"
            label="首版时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.firstPrintDate"> {{scope.row.firstPrintDate |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="前次印刷时间"  width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.lastPrintDate"> {{scope.row.lastPrintDate |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="currentEditionTimes"
            label="前次版次" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="lastPrintNum"
            label="前次版次印刷数量"  width="130px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookingNum"
            label="预定数据" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintNum"
            label="重印建议印刷数量" width="130px"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintTypeValue"
            label="重印建议印刷方式" width="130px"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="podCost"
            label="POD印刷成本"  width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="traditionCost"
            label="传统印刷成本" width="100px"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="重印建议时间"  width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.reprintCreateTime"> {{scope.row.reprintCreateTime |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="auditStatusValue"
            label="重印建议状态" width="130px"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintAuditNum"
            label="重印审核印刷数量"  width="130px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reprintAuditTypeValue"
            label="重印审核印刷方式" width="130px"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="inboundLocation"
            label="入库位置"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="重印审核时间"  width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.reprintAuditTime"> {{scope.row.reprintAuditTime |formatDateTime}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="拒绝理由"  width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.denyReason"> {{scope.row.denyReason }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="left"
            width="100">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="changeView('examineEdit',scope.row.id,scope.row)" :disabled="!(scope.row.auditStatus=='Apply')">审核</el-button>
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
    name: "reprintSuggest",
    data (){
      return {
        msg : "重印建议审核",
        isOpen:true,//是否展开
        crumbsList:[   //  面包屑
          {name:'重印建议审核',url:{routerName:'examineManage',params:{name:'reprintManage'}}},
        ],
        //列表
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading : false,
        isSearch : false,//是否能搜索
        oneError : false,
        oneError2 : false,
        reprintType : "",
        auditStatus : "Apply",
        keyword : "",
        reprintNum : "",
        reprintCreateTime : "",
        reprintAuditNum : "",
        reprintAuditType : "",
        reprintAuditTime : "",
      }
    },
    mounted: function () {
      this.getRoute()
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
      checkIsNum (value,text){
        let photoReg = /^[0-9]\d*$/;//正整数
          if(value.length==0){
            this.isSearch  = false
            this.oneError = false
            this.oneError2 = false
        }else {
            if (!photoReg.test(value)) {
              if(text=='oneError'){
                this.oneError = true
              }else{
                this.oneError2 = true
              }
              this.isSearch  = true
            }else {
              this.oneError = false
              this.oneError2 = false
              this.isSearch  = false
            }
          }
      },
      // 获取列表
      getData () {
        let url = "/order"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "reprintType":this.reprintType,
          "auditStatus" :this.auditStatus,
          "keyword":this.keyword,
          "reprintNum" :this.reprintNum,
          "reprintCreateTime":this.reprintCreateTime,
          "reprintAuditNum" :this.reprintAuditNum,
          "reprintAuditType":this.reprintAuditType,
          "reprintAuditTime" :this.reprintAuditTime,
          "handle" : "重印建议审核"
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
      /*跳转页面*/
      changeView(data,id,obj) {//跳页，传值方法：目的页：data;对象：obj;id:id，
        if(obj){
          var objStr=JSON.stringify(obj);
          this.$router.push({name: "examineManage", query: { name: "reprintManage",com: data, obj: objStr}})
        }else if(id){
          this.$router.push({name: "examineManage", query: { name: "reprintManage",com: data, id: id}})
        }else{
          this.$router.push({name: "examineManage", query: { name: "reprintManage",com: data}})
        }
      },
      /*进入页面、刷新页面时，路由定位*/
      getRoute() {
        this.$router.push({name: 'examineManage', query: {name: 'reprintManage'}});
      }
    },
  }
</script>

<style  lang="less" >
  #reprintSuggest{
    .errorText{
      color: #ff0000; margin-left: 10px
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
      padding: 12px 0;
    }
    .el-switch{
      margin: 0 25px;
    }
  }

</style>
