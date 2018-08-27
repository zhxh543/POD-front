<template>
  <div id="saleMonitor">
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
                </el-tooltip></span>isbn:{{bookData.isbn}} &nbsp;&nbsp;</div>
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
        msg : "销售监控",
        crumbsList:[   //  面包屑
          {name:'销售监控',url:{routerName:'operationMonitor',params:{name:'saleMonitorMange'}}},
        ],
        myChart: '',
        loading :false,
        bookId: null,
        bookData: "",
        isHaveData : true,//图表有没有数据

      }
    },
    mounted() {
      this.getSalesMonitor();
    },
    methods : {
      //选择图书回填
      getBookData (data){
        this.bookData  = data
        this.bookId = data.id
        this.getSalesMonitor()
      },
      //查看全部
      seeAll (){
        this.bookId = null
        this.bookData = ""
        this.getSalesMonitor()
      },
      //打开图书选择器
      openModel (){
        this.$refs.chooseBooks.showModel()
      },
      getSalesMonitor() {

        let url = "/delivery/getSalesMonitor"
        var myChartX = []
        let param = {
          "bookId":this.bookId,
        }
        let myChartYData = []
        let myChartYAry0 = []
        let myChartYAry1 = []
        let myChartYAry2 = []

        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){

            if(res.data.length>0){
              this.isHaveData = true
            res.data.forEach(function(item,index){
              myChartX.push(item.days)
              myChartYAry0.push(item['三大网店'])
              myChartYAry1.push(item['其他网店'])
              myChartYAry2.push(item['地面店'])
              myChartYData[0] = {"name": "三大网店",type:'line',data:myChartYAry0}
              myChartYData[1] = {"name": "其他网店",type:'line',data:myChartYAry1}
              myChartYData[2] = {"name": "地面店",type:'line',data:myChartYAry2}

            })
              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('myChart'));
                this.myChart.setOption({
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['三大网店','其他网店','地面店']
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    name: "册数",
                    type: 'value'
                  },
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
    },
    components: {
    selectBooks
  }

  }
</script>

<style  lang="less" >
  #saleMonitor{
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
