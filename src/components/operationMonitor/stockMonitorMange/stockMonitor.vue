<template>
  <div id="stockMonitor">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="filter-search">
        <table border="0" >
          <tr >
            <td>选择图书</td>
            <td>
              <div class="el-input el-input--mini" v-if="bookData"><span class="bookName">书名：
                <el-tooltip :content="bookData.book_name" placement="top">
                 <span v-text="bookData.book_name"></span>
                </el-tooltip></span>isbn:{{bookData.isbn}} &nbsp;&nbsp;
              </div>
              <el-button type="primary"  size="mini" class="fl"  @click="openModel">选择图书</el-button>
              <el-button type="primary"  size="mini" class="fl"  @click="seeAll">查看全部</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="isHaveData" style="width: 100%">
      <div class="monitor-echart"  >
        <div id="myChart" :style="{width:'100%',height: '500px'}"  v-loading="loading"  ></div>
      </div>
      </div>
      <div  style="text-align: center;padding: 100px" v-show="!isHaveData">暂无数据</div>
      <selectBooks ref="chooseBooks" @listChanged="getBookData($event)" ></selectBooks>
    </div>
  </div>
</template>

<script>
  import selectBooks from '@/Components/common/bookSelector';   // 图书选择器
  export default {
    name: "stockMonitor",
    data (){
      return {
        msg : "库存监控",
        crumbsList:[   //  面包屑
          {name:'库存监控',url:{routerName:'operationMonitor',params:{name:'stockMonitorMange'}}},
        ],
        isHaveData : true,//图表有没有数据
        myChart: '',
        loading:false,
        bookId: null,
        bookData: "",
      }
    },
    mounted() {
      this.getStockMonitor();
    },
    methods : {
      //选择图书回填
      getBookData (data){
        this.bookData  = data
        this.bookId = data.id
        this.getStockMonitor()
      },
      //查看全部
      seeAll (){
        this.bookId = null
        this.bookData = ""
        this.getStockMonitor()
      },
      //打开图书选择器
      openModel (){
        this.$refs.chooseBooks.showModel()
      },
      getStockMonitor() {

        let url = "/cmnyOutStock/getStockMonitor"
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

        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){
            if(res.data.length>0){
              this.isHaveData = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['其他库存'])
                myChartYAry1.push(item['出版社库存'])
                myChartYAry2.push(item['工厂库存'])
                myChartYAry3.push(item['线下库存'])
                myChartYAry4.push(item['网店库存'])
                myChartYData[0] = {"name": "其他库存",type:'line',data:myChartYAry0}
                myChartYData[1] = {"name": "出版社库存",type:'line',data:myChartYAry1}
                myChartYData[2] = {"name": "工厂库存",type:'line',data:myChartYAry2}
                myChartYData[3] = {"name": "线下库存",type:'line',data:myChartYAry3}
                myChartYData[4] = {"name": "网店库存",type:'line',data:myChartYAry4}
              })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('myChart'));
                this.myChart.setOption({
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['其他库存','出版社库存','工厂库存','线下库存','网店库存']
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                  },
                  yAxis: {
                    name: "册数",
                    type: 'value'
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  series: myChartYData
                });
                window.onresize = this.myChart.resize();
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
    },
    components: {
      selectBooks
    }
  }
</script>

<style  lang="less" >
  #stockMonitor{
    .filter-search table tr .el-input{
      width: auto!important;
    }
    .bookName{
      max-width: 400px;
      overflow: hidden;
      margin-right: 20px;
      height: 28px;
      float: left;
      display: block;
    }
      .monitor-echart{
        width: 100%;
        height: auto;
        display: block;
        padding: 10px 30px
    }
  }

</style>
