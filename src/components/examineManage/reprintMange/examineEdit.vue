<template>
  <div id="examineEdit">
    <div  class="el_examine">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />

      <el-form  :rules="rulesExamine" :model="examineForm" ref="examineForm" label-width="150px" class="examine-form">
          <el-form-item label="重印审核印刷方式">
            <el-radio label="POD" v-model="examineForm.reprintAuditType">POD印刷</el-radio>
            <el-radio label="Tradition" v-model="examineForm.reprintAuditType">传统印刷</el-radio>
          </el-form-item>
          <el-form-item label="重印审核印刷数量" prop="reprintAuditNum">
            <el-input-number v-model.trim="examineForm.reprintAuditNum" :min="1"  :max="9999999" :controls="false"></el-input-number>
          </el-form-item>
        <el-form-item label="入库位置">
          <el-radio label="社库" v-model="examineForm.inboundLocation">社库</el-radio>
          <el-radio label="厂库"  v-model="examineForm.inboundLocation">厂库</el-radio>
        </el-form-item>
      </el-form>
      <div class="line"></div>
      <div class="form-submit ">
        <el-button  type="primary" @click="submitForm('examineForm')" :loading="loading">通过</el-button>
        <!--<el-button type="success" plain size="mini" @click="submitExamine(scope.row,'Pass')" :v-loading="examineLoading" :disabled="!(scope.row.auditStatus=='Apply')">通过</el-button>-->
        <el-button type="danger"  @click="submitReject('Deny')" :v-loading="examineLoading" >拒绝</el-button>
      </div>
      <div class="examine-echart">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="sx">
              <h3>最近</h3>
              <span @click="changeDays(30)" :class="{'is-checked':days==30}">30天</span>
              <span @click="changeDays(90)" :class="{'is-checked':days==90}">90天</span>
              <span @click="changeDays(180)" :class="{'is-checked':days==180}">180天</span>
            </div>
            <div class="grid-content bg-purple daysData">
            <div v-show="isHaveData" style="width: 100%">
              <div  v-loading="fhLoading">
                <div id="myChart" :style="{width:'100%',height: '300px'}"></div>
              </div>
            </div>
            <div style="text-align: center;padding: 100px" v-show="!isHaveData">暂无数据</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div  class="grid-content bg-purple ">
            <div v-show="isHaveData" style="width: 100%">
              <div v-loading="effectLoading">
                <div id="effectAnalysis" :style="{width:'100%',height: '300px'}"></div>
              </div>
            </div>
            <div style="text-align: center;padding: 100px" v-show="!isHaveData2">暂无数据</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog width="40%" title="拒绝理由" :visible.sync="dialogFormVisible"
               :before-close="handleClose">
      <el-form label-width="70px">
        <el-form-item label="拒绝理由"  >
          <el-input type="textarea" v-model.trim="denyReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="reasonReject" size="mini" :v-loading="examineLoading" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "examineEdit",
    data (){
      return {
        msg : "重印建议审核",
        isOpen:true,//是否展开
        crumbsList:[   //  面包屑
          {name:'重印建议审核',url:{routerName:'examineManage',params:{name:'reprintManage'}}},
          {name:'编辑',url:""},
        ],
        loading: false,
        myChart: '',
        isHaveData : true,//图表有没有数据
        myChart2: '',
        isHaveData2 : true,//图表有没有数据
        effectLoading : false,
        days:'30',
        fhLoading : false,
        rulesExamine :{
          "reprintAuditNum":
            { required: true, message: '请输入重印审核印刷数量', trigger: 'blur' },
        },
        bookId :"",
        examineForm: {
          id: "",
          inboundLocation: "社库",
          reprintAuditType: '',
          reprintAuditNum: "",
          auditStatus :'Pass',//通过

        },
        /*拒绝*/
        examineLoading : false,
        dialogFormVisible :false,
        denyReason : "",//拒绝理由
        rejectData :"",
        rejectDataValue :"",
      }
    },
    mounted() {
      let dataObj= JSON.parse(this.$route.query.obj)
      this.rejectData = dataObj
      this.examineForm.id = dataObj.id

      if(dataObj.inboundLocation){
        this.examineForm.inboundLocation = dataObj.inboundLocation
      }else {
        this.examineForm.inboundLocation = "社库"
      }
      if(dataObj.reprintAuditNum){
        this.examineForm.reprintAuditNum = dataObj.reprintAuditNum
      }else {
        this.examineForm.reprintAuditNum = dataObj.reprintNum
      }
      if(dataObj.reprintAuditType){
        this.examineForm.reprintAuditType = dataObj.reprintAuditType
      }else{
        this.examineForm.reprintAuditType = dataObj.reprintType
      }
      this.bookId = dataObj.bookId
      this.getExamineMonitor();
      this.effectAnalysis();
    },
    methods : {
      submitReject (value) {
        this.$confirm('确认执行拒绝吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.rejectDataValue = value
            this.dialogFormVisible  = true
          })
          .catch(_ => {});
      },
      reasonReject (){
        let url = "/order/"+this.rejectData.id
        let param = {
          "id":this.rejectData.id,
          "auditStatus" :this.rejectDataValue,
          "denyReason" :this.denyReason,
          "handle" : "重印建议审核"
        }
        this.examineLoading = true
        this.$ajax.put(url,param).then(res => {
          this.examineLoading = false
          if(res.status === 200){
            this.$message({
              message: "操作成功！",
              type: 'success'
            });
            this.dialogFormVisible = false
            this.rejectDataValue = ""
            this.denyReason = ""
            this.$router.go(-1)
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      // submitExamine (data,value) {
      //   let url = "/order/"+data.id
      //   let param = {
      //     "id":data.id,
      //     "auditStatus" :value,
      //     "handle" : "重印建议审核"
      //   }
      //   this.examineLoading = true
      //
      //   this.$confirm('确认通过吗？',{
      //     lockScroll :false,
      //     type: 'warning'})
      //     .then(_ => {
      //       this.$ajax.put(url,param).then(res => {
      //         this.examineLoading = false
      //         if(res.status === 200){
      //           this.$message({
      //             message: "操作成功！",
      //             type: 'success'
      //           });
      //           this.getData()
      //         }else{
      //           this.$message({
      //             message: res.data.msg,
      //             type: 'error'
      //           });
      //         }
      //       });
      //     })
      //     .catch(_ => {});
      // },
      handleClose(done) {
        this.denyReason = ""
        this.rejectDataValue = ""
        this.dialogFormVisible = false
      },
      submitForm(formName) {
        let url = "/order/"+this.examineForm.id
        let param = this.examineForm
        param.handle = "重印建议审核"
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.put(url,param).then(res => {
              if(res.status === 200){
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.loading = false
                this.$router.go(-1)
              }else{
                this.loading = false
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          } else {
            this.loading = false
            console.log('表单错误!');
            return false;
          }
        });
      },
      changeDays (value) {
        this.days=value
        this.getExamineMonitor()
      },
      getExamineMonitor() {
        let url = "/deliveryDetail/"+this.bookId
        let param = {
          "bookId":this.bookId,
          "days" :this.days,
        }
        var myChartX = []

        let myChartYData = []
        let myChartYAry0 = []

        this.fhLoading = true
        this.$ajax.get(url,param).then(res => {
          this.fhLoading = false
          if(res.status === 200){

            if(res.data.length>0){
              this.isHaveData = true
              res.data.forEach(function(item,index){
                myChartX.push(item.days)
                myChartYAry0.push(item['发货'])
                myChartYData[0] = {"name": "发货", color: '#30b8fe',type:'line',data:myChartYAry0}
              })

              this.$nextTick(function(){
                this.myChart = this.$echarts.init(document.getElementById('myChart'));
                this.myChart.setOption({
                  title: {
                    text: '发货',
                    textStyle: {
                      fontSize : 14,
                    }
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                  },
                  grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '60',
                    containLabel: true
                  },
                  toolbox: {
                    // feature: {
                    //   saveAsImage: {}
                    // }
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: myChartX
                  },
                  yAxis: {
                    type: 'value',
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
                })
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
      effectAnalysis() {

        let url = "/reprintAnalysis/"+this.bookId
        let param = {
          "bookId":this.bookId,
        }
        var labelRight = {
          normal: {
            position: 'right'
          }
        };
        var myChartX = []
        let dataText = ""
        let dataValue = ""

        let myChartYData = []

        this.effectLoading = true
        this.$ajax.get(url,param).then(res => {
          this.effectLoading = false
          if(res.status === 200){

            if(res.data.length>0){
              this.isHaveData2 = true
            res.data.forEach(function(item,index){
              if(item.days>0){
                dataValue = {value: item.days, label: labelRight}
              }else{
                dataValue = item.days
              }
              myChartX.push(dataValue)
              dataText = item.currentEditionTimes+'版'+(item.currentPrintTimes+1)+'次'
              myChartYData.push(dataText)
            })

              this.$nextTick(function(){
                // 基于准备好的dom，初始化echarts实例
                this.myChart2 = this.$echarts.init(document.getElementById('effectAnalysis'));
                // 绘制图表
                this.myChart2.setOption({
                  title: {
                    text: '重印效果分析',
                  },
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                  },
                  grid: {
                    top: 80,
                    bottom: 30
                  },
                  xAxis: {
                    type: 'value',
                    position: 'top',
                    splitLine: {lineStyle: {type: 'dashed'}},
                  },
                  yAxis: {
                    type: 'category',
                    axisLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    data: myChartYData
                  },
                  series: [
                    {
                      type: 'bar',
                      color: "#ffa71d",
                      label: {
                        normal: {
                          show: true,
                          formatter: '{b}'
                        }
                      },
                      data:myChartX
                    }
                  ]
                });
                window.onresize = this.myChart2.resize;
              })
            }else{
              this.isHaveData2 = false
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
  #examineEdit{
    .el-dialog__header{
      border-bottom: 1px solid #eeeeee;
      .el-dialog__title{font-size: 14px}
    }
    .el_examine {
      background: #ffffff;
      padding: 20px 0;
      border: 1px solid #d2dae9;
      min-height: 400px;
      height: 100%;
    }
    .examine-form{
      padding: 18px 0 0 0;
      .el-input-number .el-input__inner{
        text-align: left;
      }
    }
    .crumbs{margin: 0 20px}
    .examine-echart{
      padding: 20px 30px;
      border-top: 1px solid #e4e7ed;
      border-bottom: 1px solid #e4e7ed;
      background: #f8f8f8;
      .daysData{margin-top: 60px}
      .sx{
        float: right;
        /*padding:10px 40px;*/
        font-size: 12px;

        h3{font-size: 12px;float: left;
          line-height: 58px;}
        span{
          width: 42px;
          height: 42px;
          display: block;
          float: left;
          cursor: pointer;
          line-height: 40px;
          border: 1px solid #cccccc;
          border-radius: 40px;
          text-align: center;
          margin: 10px;
        }
      }
      .is-checked{
        background: #30b8fe;
        border-color: #30b8fe;
        color: #ffffff;
      }

      .grid-content{
        border: 1px solid #dddddd;
        padding: 20px;
        background: #ffffff;
      }
    }
  }

</style>
