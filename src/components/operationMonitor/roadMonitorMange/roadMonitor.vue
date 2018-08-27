<template>
  <div id="roadMonitor">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div v-show="isHaveData" style="width: 100%">
        <div class="monitor-echart"  >
          <div id="myChart" :style="{width:'100%',height: '500px'}"  v-loading="loading"  ></div>
        </div>
      </div>
      <div  style="text-align: center;padding: 100px" v-show="!isHaveData">暂无数据</div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "roadMonitor",
    data (){
      return {
        msg : "在途监控",
        crumbsList:[   //  面包屑
          {name:'在途监控',url:{routerName:'operationMonitor',params:{name:'roadMonitorMange'}}},
        ],
        isHaveData : true,//图表有没有数据
        myChart: '',
        loading:false
      }
    },
    mounted() {
      this.getRoadMonitor();
    },
    methods : {
      getRoadMonitor() {
        let url = "/monitorOnpassage/getOnpassageNum"

        var myChartX = []
        let myChartY = []

        this.loading = true
        this.$ajax.get(url,{}).then(res => {
          this.loading = false
          if(res.status === 200){
            if(res.data.length>0){
              this.isHaveData = true
              res.data.forEach(function(item){
                myChartX.push(item.days)
                myChartY.push(item.在途监控)
              })

              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('myChart'));
                this.myChart.setOption({
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data:['在途监控']
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
                  series: [
                    {
                      name:'在途监控',
                      type:'line',
                      stack: '总量',
                      data:myChartY
                    },
                  ]
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
  }
</script>

<style  lang="less" >
  #roadMonitor{
    .monitor-echart{
      width: 100%;
      height: auto;
      display: block;
      padding: 10px 30px
    }
  }

</style>
