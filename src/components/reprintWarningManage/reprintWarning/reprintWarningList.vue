<template>
  <div id="reprintWarningList">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple grid-tree">
            <p class="grid-title"><el-button type="primary" size="mini" @click="getData" :disabled="!(basicdId.length>0)">筛选</el-button></p>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="basicdId" @change="handleCheckChange">
              <el-checkbox v-for="item in basicList" :label="item.id" :key="item.id">{{item.memo}}</el-checkbox>
            </el-checkbox-group>
        </div>
        </el-col>
        <!--右侧-->
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <template>
              <el-table
                :data="tableData"
                :v-loading="loading"
                @row-click="clickCol"
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
                  prop="price"
                  label="定价" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="suggestReprintTypeValue"
                  label="重印建议方式" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="suggestReprintNum"
                  label="重印建议数量" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="bookSortName"
                  label="图书分类" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="departmentName"
                  label="出版中心" show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </template>
            <div class="page-block" >
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"  :page-size="pageSize" v-if="total>pageSize"   @current-change="handleSizeChange">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <div class="handle-input" >
       书号<el-input v-model.trim="bookNum" placeholder="请输入书号" disabled></el-input>
        <el-button type="primary" @click="openModel" :loading="searchLoading">图书选择</el-button>
        <span class="handle-title">重印数</span>
        <el-input-number v-model.number="reprintNum" placeholder="请输入内容" :min="0"  :max="9999999" :controls="false"></el-input-number>
        <el-button type="primary" @click="addReprint" :loading="reprintLoading" :disabled="noInfo">加入重印区</el-button>
        <span style="margin-left: 5px;color: #999999">重印建议计算数量：{{reprinSuggesttNum}}</span>
          <el-button type="warning" @click="changePage('warningAreaManage')">重印区</el-button>
      </div>
      <div class="line"></div>
      <div class="bookDetail">
        <h3>图书基本情况</h3>
        <div class="bookDesc">
          <el-row :gutter="20">
            <el-col :span="6"><em>书号：</em>
                <el-tooltip :content="bookDetail.isbn" placement="top">
                 <span v-text="bookDetail.isbn"></span>
                </el-tooltip>
            </el-col>
            <el-col :span="6"><em>书名：</em>
              <el-tooltip :content="bookDetail.bookName" placement="top">
                <span v-text="bookDetail.bookName"></span>
              </el-tooltip>
            </el-col>
            <el-col :span="6"><em>定价：</em>
              <span v-text="'￥'+bookDetail.price" v-if="bookDetail.price"></span>
              <span v-else>-</span>
            </el-col>
            <el-col :span="6"><em>作者：</em>
              <el-tooltip :content="bookDetail.author" placement="top">
                <span v-text="bookDetail.author"></span>
              </el-tooltip>
             </el-col>
            <el-col :span="6"><em>首版时间： </em>
              <span v-if="bookDetail.firstPrintDate">{{bookDetail.firstPrintDate|formatDateTime}}</span>
              <span v-else>-</span>
            </el-col>
          </el-row>
        </div>
        <div class="line"></div>
        <h3>图书库存/销售情况</h3>
        <div class="bookDesc">
          <el-row :gutter="20">
            <el-col :span="6"><em>可供库存：</em><span v-text="bookDetail.availableBookNum"></span></el-col>
            <el-col :span="6"><em>实际库存：</em><span v-text="bookDetail.actualBookNum"></span></el-col>
            <el-col :span="6"><em>月均毛发：</em><span v-text="bookDetail.monthlyExRefunds"></span></el-col>
            <el-col :span="6"><em>月均净发：</em><span v-text="bookDetail.monthlyInRefunds"></span></el-col>
            <el-col :span="6"><em>月均销售：</em><span v-text="bookDetail.monthlySales"></span></el-col>
            <el-col :span="6"><em>预定数量：</em><span v-text="bookDetail.bookNum"></span></el-col>
            <el-col :span="6"><em>开卷最近月销售：</em><span v-text="bookDetail.openbookNum"></span></el-col>
            <el-col :span="6"><em>网店近30天销售：</em><span v-text="bookDetail.storeNum"></span></el-col>
            <el-col :span="6"><em>门店近30天销售：</em><span v-text="bookDetail.libraryNum"></span></el-col>
            <el-col :span="6"><em>馆配近30天数量：</em><span v-text="bookDetail.libraryNum"></span></el-col>
          </el-row>
        </div>
        <div class="line"></div>
        <h3>末次重印情况</h3>
        <div class="bookDesc">
          <el-row :gutter="20">
            <el-col :span="6"><em>末次重印印次：</em><span v-text="bookDetail.lastReprintPrintTimes"></span></el-col>
            <el-col :span="6"><em>末次重印提交时间：</em>
              <span v-if="bookDetail.lastReprintSubDate">{{bookDetail.lastReprintSubDate|formatDateTime}}</span>
              <span v-else>-</span>
            </el-col>
            <el-col :span="6"><em>末次重印/工单状态：</em><span v-text="bookDetail.lastReprintStatus"></span></el-col>
            <el-col :span="6"><em>末次重印册数：</em><span v-text="bookDetail.lastReprintNum"></span></el-col>
            <el-col :span="6"><em>末次重印方式：</em><span v-text="bookDetail.lastReprintType"></span></el-col>
          </el-row>
        </div>
        <div class="line"></div>
      </div>
      <!--表格-->
      <div v-if="bookNumData.length" :v-loading="bookNumLoading">
        <template >
          <el-table
            :data="bookNumData"
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="label"
              width="150"
              align = "center"
              header-align = "left"
              label-class-name="colum-pl"
              label="日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label-class-name="thClass">
              <el-table-column :label="item.days" align="center" v-for="(item,index) in bookNumColumn" :key="index">
                <template slot-scope="scope">
                  <span v-text="scope.row.data[index]"></span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </div>

      <div v-show="isHaveData" style="width: 100%">
        <div class="reprint-echarts"  >
          <div id="analyse" :style="{width:'100%',height: '580px'}" v-loading="echartsLoading"></div>
        </div>
      </div>
      <!--網店-->
      <div v-show="isShopSale" style="width: 100%">
        <div class="reprint-echarts"  v-loading="shopSaleLoading">
          <div id="shopSale" :style="{width:'100%',height: '580px'}" ></div>
        </div>
      </div>
      <!--BookSale-->
      <div v-show="isBookSale" style="width: 100%">
        <div class="reprint-echarts"  v-loading="bookSaleLoading">
          <div id="bookSale" :style="{width:'100%',height: '580px'}" ></div>
        </div>
      </div>
      <!--BookTh -->
      <div v-show="isBookTh" style="width: 100%">
        <div class="reprint-echarts"  v-loading="bookThLoading">
          <div id="bookTh" :style="{width:'100%',height: '580px'}" ></div>
        </div>
      </div>
      <!--customer -->
      <div v-show="isCustomer" style="width: 100%">
        <div class="reprint-echarts"  v-loading="customerLoading">
          <div id="customer" :style="{width:'100%',height: '580px'}" ></div>
        </div>
      </div>
      <!--<div  style="text-align: center;padding: 100px" v-show="!isHaveData">暂无数据</div>-->
    </div>
    <selectBooks ref="chooseBooks" @listChanged="getBookData($event)" ></selectBooks>
  </div>
</template>

<script>
  import selectBooks from '@/Components/common/bookSelector';   // 图书选择器

  export default {
    name: "reprintWarningList",
    data (){
      return {
        msg : "重印预警管理",
        crumbsList:[   //  面包屑
          {name:'重印预警管理',url:{routerName:'reprintWarningManage',params:{name:'reprintWarning'}}},
        ],
        //左侧筛选
        basicList: [],
        basicdId: [],//选择的id的集合
        basicAllList : [],//全部id集合
        checkAll: false,
        isIndeterminate: false,
        //右侧列表
        warningBasicCode: "",//筛选id字符串集合
        count: 1,
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 5,//一次显示几条
        total : 0,//总条数
        loading : false,
        //中间-根据书号查询图书详情
        bookNum: "",//
        bookLoading : false,
        bookDetail : "",//图书信息
        searchLoading : false,//搜索防重复提交
        noInfo : true,//没有查询出图书信息标示,默认没有信息（true）,如果查出信息（false）
        //加入重印区
        reprinSuggesttNum: 0,//重印建议计算数量
        reprintNum: 0,//重印数
        reprintLoading : false,//加入重印区防重复提交
        //册数
        bookId : "",
        bookNumData : [],//册数数据
        bookNumColumn : [],//册数表头
        bookNumLoading : false,
        //总分析
        myChart: '',
        isHaveData : false,//图表有没有数据
        echartsLoading :false,//总分析
        isShopSale : false,//网店有没有数据
        shopSaleLoading: false,//网店
        isBookSale : false,//BookSale有没有数据
        bookSaleLoading: false,//BookSale
        isBookTh : false,//BookSale有没有数据
        bookThLoading: false,//BookSale
        isCustomer : false,//Customer有没有数据
        customerLoading: false,//Customer


        }
    },
    mounted() {
      this.getLoadNode()
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
      //打开图书选择器
      openModel (){
        this.$refs.chooseBooks.showModel()
      },
      //选择图书回填
      getBookData (data){
        // this.bookData  = data
        this.bookNum = data.id
        this.getBookDeatil()
      },
      getLoadNode () {
        let url = "/warning/basic/findList"
        let arry = []
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.basicList = res.data
            res.data.forEach(function(item,index){
              arry.push(item.id)
            })
            this.basicAllList = arry
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      handleCheckAllChange(val) {
        this.basicdId = val ? this.basicAllList : [];
        this.isIndeterminate = false;
      },
      handleCheckChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.basicAllList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.basicAllList.length;
      },
      // 获取列表
      getData () {
        this.warningBasicCode = this.basicdId.join(",");

        let url = "/warning"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "warningBasicCode" : this.warningBasicCode
        }
        this.loading = true
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            this.tableData = res.data.records
            this.total = res.data.total
            this.loading = false
          }else{
            this.loading = false
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
      reprintCount (num){
        let strNum = num.toString() //字符串num
        let middleNum = 0//结果值
        let bigNum = 0//大于100的大数
        let smNum = 0//大于100的小数
        let bigCuont = 0//大于100的两位判断结果值

        //如果数量小于100，如果大于100
        //如果小于100
        let intNum = parseInt(num) //数字num
        if(intNum<100){
          if((0<intNum)&&(intNum<24)){
            middleNum = 0
          }else if((25<intNum)&&(intNum<74)){
            middleNum = 50
          }else if((75<intNum)&&(intNum<99)){
            middleNum = 100
          }
        }else {
           bigNum = parseInt(strNum.slice(0,parseInt(strNum.length)-2)*100)
           smNum=parseInt(strNum.slice(parseInt(strNum.length)-2));

            if((0<smNum)&&(smNum<24)){
              bigCuont = 0
            }else if((25<smNum)&&(smNum<74)){
              bigCuont = 50
            }else if((75<smNum)&&(smNum<99)){
              bigCuont = 100
            }
          middleNum = bigNum + bigCuont
        }
        return middleNum
      },
      //点击一行时，搜索图书信息
      clickCol (row){
        if(row.bookId){//如果有书号，可执行查询图书信息,2018.06.29改为bookId
          this.bookNum  = row.bookId
          this.reprintNum =  this.reprintCount(row.suggestReprintNum)
          this.reprinSuggesttNum = row.suggestReprintNum
          this.getBookDeatil()
        }else{//如果没有书号不执行
          this.$message({
            message: "该条信息没有书号，请输入书号查询",
            type: 'warning'
          });
        }
      },
      //Customer
      CustomerData() {
        let url = "/delivery/getCustomerStockAnaylsis"
        var myChartX = []
        let param = {
          "bookId":this.bookId,
        }
        let myChartYData = []
        let myChartYAry0 = []
        let myChartYAry1 = []
        let myChartYAry2 = []
        let myChartYAry3 = []

        this.customerLoading = true;
        this.$ajax.get(url,param).then(res => {
          this.customerLoading = false;
          if(res.status === 200){
            if(res.data.length>0){
              this.isCustomer = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['地面库存'])
                myChartYAry1.push(item['地面销售'])
                myChartYAry2.push(item['网店库存'])
                myChartYAry3.push(item['网店销售'])
                myChartYData[0] = {"name": "地面库存",type:'line',data:myChartYAry0}
                myChartYData[1] = {"name": "地面销售",type:'line',data:myChartYAry1}
                myChartYData[2] = {"name": "网店库存",type:'line',data:myChartYAry2}
                myChartYData[3] = {"name": "网店销售",type:'line',data:myChartYAry3}

              })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('customer'));
                this.myChart.setOption({
                  title: {
                    text: '客户库存',
                    textStyle: {
                      fontSize : 14,
                    },
                    left: 'left'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['地面库存','地面销售','网店库存','网店销售']
                  },
                  grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '60',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    type: 'value'
                  },
                  dataZoom: [
                    {
                      type: 'slider',
                      show: true,
                      xAxisIndex: [0],
                      start: 1,
                      dataBackground: {

                      },
                      handleStyle: {
                        color: '#30b8fe',
                        // shadowColor: '#30b8fe',
                        borderColor: '#30b8fe',
                      },
                      start: 0,
                      end: 100
                    },
                  ],
                  series: myChartYData
                });
                window.onresize = this.myChart.resize;
              })
            }else{
              this.isCustomer = false
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //BookTh
      BookThData() {
        let url = "/delivery/getBookThAnaylsis"
        var myChartX = []
        let param = {
          "bookId":this.bookId,
        }
        let myChartYData = []
        let myChartYAry0 = []
        let myChartYAry1 = []
        let myChartYAry2 = []
        let myChartYAry3 = []

        this.bookThLoading = true;
        this.$ajax.get(url,param).then(res => {
          this.bookThLoading = false;
          if(res.status === 200){
            if(res.data.length>0){
              this.isBookTh = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['其它'])
                myChartYAry1.push(item['图书馆'])
                myChartYAry2.push(item['教材'])
                myChartYAry3.push(item['网店'])
                myChartYData[0] = {"name": "其它",type:'line',data:myChartYAry0}
                myChartYData[1] = {"name": "图书馆",type:'line',data:myChartYAry1}
                myChartYData[2] = {"name": "教材",type:'line',data:myChartYAry2}
                myChartYData[3] = {"name": "网店",type:'line',data:myChartYAry3}

              })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('bookTh'));
                this.myChart.setOption({
                  title: {
                    text: '图书添货',
                    textStyle: {
                      fontSize : 14,
                    },
                    left: 'left'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['其它','图书馆','教材','网店']
                  },
                  grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '60',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    type: 'value'
                  },
                  dataZoom: [
                    {
                      type: 'slider',
                      show: true,
                      xAxisIndex: [0],
                      start: 1,
                      dataBackground: {

                      },
                      handleStyle: {
                        color: '#30b8fe',
                        // shadowColor: '#30b8fe',
                        borderColor: '#30b8fe',
                      },
                      start: 0,
                      end: 100
                    },
                  ],
                  series: myChartYData
                });
                window.onresize = this.myChart.resize;
              })
            }else{
              this.isBookTh = false
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //网店BookTh
      shopSaleData() {
        let url = "/delivery/getNetShopSaleAnaylsis"
        var myChartX = []
        let param = {
          "bookId":this.bookId,
        }
        let myChartYData = []
        let myChartYAry0 = []
        let myChartYAry1 = []
        let myChartYAry2 = []
        let myChartYAry3 = []

        this.shopSaleLoading = true;
        this.$ajax.get(url,param).then(res => {
          this.shopSaleLoading = false;
          if(res.status === 200){
            if(res.data.length>0){
              this.isShopSale = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['亚马逊'])
                myChartYAry1.push(item['京东'])
                myChartYAry2.push(item['其它网店'])
                myChartYAry3.push(item['当当'])
                myChartYData[0] = {"name": "亚马逊",type:'line',data:myChartYAry0}
                myChartYData[1] = {"name": "京东",type:'line',data:myChartYAry1}
                myChartYData[2] = {"name": "其它网店",type:'line',data:myChartYAry2}
                myChartYData[3] = {"name": "当当",type:'line',data:myChartYAry3}

              })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('shopSale'));
                this.myChart.setOption({
                  title: {
                    text: '网店',
                    textStyle: {
                      fontSize : 14,
                    },
                    left: 'left'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['亚马逊','京东','其它网店','当当']
                  },
                  grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '60',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    type: 'value'
                  },
                  dataZoom: [
                    {
                      type: 'slider',
                      show: true,
                      xAxisIndex: [0],
                      start: 1,
                      dataBackground: {

                      },
                      handleStyle: {
                        color: '#30b8fe',
                        // shadowColor: '#30b8fe',
                        borderColor: '#30b8fe',
                      },
                      start: 0,
                      end: 100
                    },
                  ],
                  series: myChartYData
                });
                window.onresize = this.myChart.resize;
              })
            }else{
              this.isShopSale = false
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //bookSale
      bookSaleData() {
        let url = "/delivery/getBookSaleAnaylsis"
        var myChartX = []
        let param = {
          "bookId":this.bookId,
        }
        let myChartYData = []
        let myChartYAry0 = []
        let myChartYAry1 = []
        let myChartYAry2 = []

        this.bookSaleLoading = true;
        this.$ajax.get(url,param).then(res => {
          this.bookSaleLoading = false;
          if(res.status === 200){
            if(res.data.length>0){
              this.isBookSale = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['三大网店'])
                myChartYAry1.push(item['其它网店'])
                myChartYAry2.push(item['地面店'])
                myChartYData[0] = {"name": "三大网店",type:'line',data:myChartYAry0}
                myChartYData[1] = {"name": "其它网店",type:'line',data:myChartYAry1}
                myChartYData[2] = {"name": "地面店",type:'line',data:myChartYAry2}

              })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('bookSale'));
                this.myChart.setOption({
                  title: {
                    text: '图书销售',
                    textStyle: {
                      fontSize : 14,
                    },
                    left: 'left'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['三大网店','其它网店','地面店',]
                  },
                  grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '60',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    type: 'value'
                  },
                  dataZoom: [
                    {
                      type: 'slider',
                      show: true,
                      xAxisIndex: [0],
                      start: 1,
                      dataBackground: {

                      },
                      handleStyle: {
                        color: '#30b8fe',
                        // shadowColor: '#30b8fe',
                        borderColor: '#30b8fe',
                      },
                      start: 0,
                      end: 100
                    },
                  ],
                  series: myChartYData
                });
                window.onresize = this.myChart.resize;
              })
            }else{
              this.isBookSale = false
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      analysisData() {
        let url = "/delivery/getTotalAnaylsis"
        var myChartX = []
        let param = {
          "bookId":this.bookId,
        }
        let myChartYData = []
        let myChartYAry0 = []
        let myChartYAry1 = []
        let myChartYAry2 = []
        let myChartYAry3 = []
        let myChartYAry4 = []

        this.echartsLoading = true
        this.$ajax.get(url,param).then(res => {
          this.echartsLoading = false
          if(res.status === 200){
            if(res.data.length>0){
              this.isHaveData = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['入库'])
                myChartYAry1.push(item['库存'])
                myChartYAry2.push(item['添货'])
                myChartYAry3.push(item['退货'])
                myChartYAry4.push(item['销售'])
                myChartYData[0] = {"name": "入库",type:'line',data:myChartYAry0}
                myChartYData[1] = {"name": "库存",type:'line',data:myChartYAry1}
                myChartYData[2] = {"name": "添货",type:'line',data:myChartYAry2}
                myChartYData[3] = {"name": "退货",type:'line',data:myChartYAry3}
                myChartYData[4] = {"name": "销售",type:'line',data:myChartYAry4}

              })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('analyse'));
                this.myChart.setOption({
                  title: {
                    text: '总分析',
                    textStyle: {
                      fontSize : 14,
                    },
                    left: 'left'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['入库','库存','添货','退货','销售']
                  },
                  grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '60',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    type: 'value'
                  },
                  dataZoom: [
                    {
                      type: 'slider',
                      show: true,
                      xAxisIndex: [0],
                      start: 1,
                      dataBackground: {

                      },
                      handleStyle: {
                        color: '#30b8fe',
                        // shadowColor: '#30b8fe',
                        borderColor: '#30b8fe',
                      },
                      start: 0,
                      end: 100
                    },
                  ],
                  series: myChartYData
                });
                window.onresize = this.myChart.resize;
              })
            }else{
              this.isHaveData = false
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //中间-根据书号查询图书详情
      getBookDeatil () {
        let url = "/bookCases/"+this.bookNum
        this.searchLoading = true
        if(this.bookNum){
          this.bookLoading = true
          this.$ajax.get(url,{}).then(res => {
            this.bookLoading = false
            if(res.status === 200){
              if(res.data.code){//如果没有查出来本书信息，显示提示
                this.noInfo = true//没有查询出信息标示
                this.searchLoading = false
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }else{
                this.noInfo = false
                this.searchLoading = false
                this.bookDetail = res.data
                this.bookId = res.data.bookId
                this.getBookNumData ()//查询出来信息再执行查询册数
                this.analysisData();//获取总分析
                this.shopSaleData();//网店
                this.bookSaleData();//bookSale
                this.BookThData();//图书添货
                this.CustomerData();//客户库存
              }
            }else{
              this.noInfo = false
              this.searchLoading = false
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        }else {
          this.searchLoading = false
          this.$message({
            message: "请输入书号",
            type: 'warning'
          });
        }
      },
      //中间-根据书号查询图书册数
      getBookNumData () {
        let url = "/delivery/getBookNumbers"
        let param = {
          "bookId":this.bookId,
        }
        let bookNumArry = []
        let bookNumArry1 = []
        let bookNumArry2 = []
        let bookNumArry3 = []
        let bookNumArry4 = []
        let bookNumArry5 = []
        let bookNumObj= ""
        this.bookNumLoading = true
        this.$ajax.get(url,param).then(res => {
          this.bookNumLoading = false
          if(res.status === 200){
            // this.bookNumData = res.data
            this.bookNumColumn = res.data
            res.data.forEach(function(item,index){
              bookNumArry1.push(item['开卷册数'])
              bookNumArry2.push(item['添货册数'])
              bookNumArry3.push(item['网店册数'])
              bookNumArry4.push(item['退货册数'])
              bookNumArry5.push(item['门店册数'])
              bookNumObj = {"label": "地面店",type:'line',data:bookNumArry1}
              bookNumArry[0] = {"label": "开卷册数",data:bookNumArry1}
              bookNumArry[1] = {"label": "添货册数",data:bookNumArry2}
              bookNumArry[2] = {"label": "网店册数",data:bookNumArry3}
              bookNumArry[3] = {"label": "退货册数",data:bookNumArry4}
              bookNumArry[4] = {"label": "门店册数",data:bookNumArry5}
            })
            this.bookNumData = bookNumArry
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //中间-加入重印区
      addReprint () {
        let url = "/order/addReprintArea/"+this.bookNum
        let param = {
          "reprintNum" :this.reprintNum,
        }

        if(!this.bookNum){
          this.$message({
            message: "请输入书号",
            type: 'warning'
          });
        }else if(!this.reprintNum||this.reprintNum<=0){
          this.$message({
            message: "请输入大于0的重印数",
            type: 'warning'
          });
        }else{
          this.reprintLoading = true
          this.$ajax.post(url,param, {'Content-Type': 'application/x-www-form-urlencoded'}).then(res => {
            this.reprintLoading = false
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
        }
      },
      //跳转重印区按钮
      changePage (page) {
        this.$router.push({name: "reprintWarningManage", query: { name: "warningAreaManage"}})
      },
    },
    components: {
      selectBooks
    }
  }
</script>

<style  lang="less" >
  #reprintWarningList{
    .thClass{
      display: none;
    }
    .bookDetail{
      line-height: 32px;
      color: #333333;
      font-size: 14px;
      h3{
        font-size: 16px;
        font-weight: bold;
      }
      .bookDesc{
        width: 960px;
        margin: 12px 0;
        em{font-style:normal;float: left}
        span{
          max-width: 160px;
          width: auto;
          float: left;
          display:block; overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 10px;
          color: #999999;
        }
      }
    }
    .colum-pl{
      padding-left: 24px;
    }
    .el-table thead th{
      background: #f0f0f0!important;
    }
    .el-table::before{
      height: 0px;
    }
    .reprint-echarts{
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #d2dae9;
    }
    .grid-content{
      height: 380px;
    }
    .grid-title{
      text-align: right;
    }
    .grid-tree{
      padding: 15px;
      overflow-y: auto;
      height: 350px;
      border: 1px solid #d2dae9;
      .el-checkbox-group{margin-right: 0}
      .el-checkbox+.el-checkbox{
        margin-right: 0px;
      }
    }
    .handle-input{
      min-height: 40px!important;
      margin-bottom: 30px;
      .el-input-number{
        width: 120px;
        .el-input__inner{
          text-align: left;
        }
        .el-input{
          width: 100px;
          margin: 0 15px;
        }
      }
      .el-input{
        width: 120px;
        margin: 0 10px;
      }
      .handle-title{padding-left:20px}
    }
    .fixed-table{
      margin-bottom: 55px;
      color: #666666;
      border: 1px solid #d2dae9;
      border-radius: 4px;
      table{
        width: 100%;
        border: 0px;
        .table-title{
          width: 98px;
          text-align: right;
          background: #f5f5f5;
        }
        tr{
          td{
            font-size: 14px;
            height: 52px;
            vertical-align:middle;
            padding:0 15px;
            line-height: 16px;
            border-right: 1px solid #d2dae9;
            border-bottom: 1px solid #d2dae9;
            .col-red{
              color: #ff0000;
            }
            &:last-child{border-right: 0px;}
          }
          &:last-child{
            td{
              border-bottom: 0px;
            }
          }
        }
      }
    }
    .line{margin: 30px 0}
    .el-table {border-bottom: none}
    .page-block{margin: 20px auto}
    .el-checkbox{
      width: 100%;
      padding: 5px;margin-right: 0px;
    }
  }

</style>
