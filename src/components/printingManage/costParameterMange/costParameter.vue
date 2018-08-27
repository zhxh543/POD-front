<template>
  <div id="costParameter">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="top">
          <el-tab-pane label="POD印刷" name="POD"></el-tab-pane>
          <el-tab-pane label="传统印刷" name="TRADITION"></el-tab-pane>
          <el-tab-pane label="POD成本阈值" name="costThreshold"></el-tab-pane>
          <!--竖tab-->

          <!--阈值表单-->
          <div v-if="activeName=='costThreshold'">
            <costThreshold></costThreshold>
          </div>
          <div v-else class="parameter-tab">
            <el-tabs tab-position="left" v-model="parameterName" @tab-click="parameterClick">
              <el-tab-pane  :name="item.name"  v-for="(item,index) in tabList" :key="index">
                <span slot="label" >{{item.title}}</span>
              </el-tab-pane>

                <!--表单-->
                <div class="parameter-block" :style="(parameterName=='cycle') ? { margin:  '0' } :{ margin:  '0 48px' }" >
                  <el-form :inline="(parameterName=='cycle')" :model="formParameter" ref="formParameter" class="demo-form-inline" :label-position="'right'" :label-width="(parameterName=='cycle') ? '66px' :'100px'">
                    <!--POD生产周期-->
                    <div v-if="parameterName=='cycle'">
                      <el-form-item label="单色">
                        <el-input-number v-model="formParameter.cycleSingle" :min="0"  :max="9999999" :controls="false"></el-input-number>
                        <span class="input-tag">天</span>
                      </el-form-item>
                      <el-form-item label="双色">
                        <el-input-number v-model="formParameter.cycleDouble" :min="0"  :max="9999999" :controls="false"></el-input-number>
                        <span class="input-tag">天</span>
                      </el-form-item>
                      <el-form-item label="四色">
                        <el-input-number v-model="formParameter.cycleFour" :min="0" :max="9999999"  :controls="false"></el-input-number>
                        <span class="input-tag">天</span>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <div v-for="(ietm , index) in formParameter.arr" :key="index">
                        <el-form-item :label="(parameterName=='inset') ? '插页单位成本': '印张单位成本'" v-show="index==tabNum">
                          <label  class="label-title">&nbsp;&nbsp;&nbsp;&nbsp;每</label>
                          <el-input-number  :min="0"  :max="9999999" :controls="false" v-model="ietm.SheetCostAmount" ></el-input-number>
                          <label class="label-title">{{(parameterName=='inset') ? '插页': '印张'}}</label>
                          <el-input-number  :min="0"  :max="9999999" :controls="false" v-model="ietm.SheetCost" ></el-input-number>
                          <span class="input-tag">元</span>
                        </el-form-item>
                        <el-form-item label="册数单位成本" v-show="index==tabNum">
                          <label  class="label-title">&nbsp;&nbsp;&nbsp;&nbsp;每</label>
                          <el-input-number v-model="ietm.BookCostAmount" :min="0" :max="9999999" :controls="false"></el-input-number>
                          <label class="label-title">&nbsp;&nbsp;&nbsp;&nbsp;册</label>
                          <el-input-number v-model="ietm.BookCost" :min="0"  :max="9999999" :controls="false"></el-input-number>
                          <span class="input-tag">元</span>
                        </el-form-item>
                        <el-form-item label="固定成本" v-show="index==tabNum">
                          <label class="label-title">费用</label>
                          <el-input-number v-model="ietm.FixedCost" :min="0"  :max="9999999" :controls="false"></el-input-number>
                        </el-form-item>
                      </div>
                    </div>
                  </el-form>
                  <div class="line"></div>
                  <div class="form-submit ">
                    <!--<p :class="{'colRed': isSet(formParameter.arr[tabNum])}" v-if="tabNum==0">4564546</p>-->
                    <el-button  type="primary" @click="submitForm('formParameter')" :loading="loading">保存</el-button>
                  </div>
              </div>
            </el-tabs>

            <p class="rds-remark" v-if="activeName=='POD'" v-html="costPodDesc"></p>
            <p class="rds-remark" v-if="activeName=='TRADITION'" v-html="costTradDesc"></p>
          </div>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
  import costThreshold from '@/components/printingManage/costParameterMange/costThreshold.vue'
    export default {
        name: "costParameter",
      data (){
        return {
          msg : "印制成本参数",
          activeName: 'POD',//横着的选项卡
          parameterName : "cover",//竖着的选项卡
          crumbsList:[   //  面包屑
            {name:'印制成本参数',url:{routerName:'printingManage',params:{name:'costParameterMange'}}},
          ],
          tabList : [
            {"name": "cover","title":"封面印刷基础费用"},
            {"name": "textSingle","title":"正文印刷基础费用(单色)"},
            {"name": "textDouble","title":"正文印刷基础费用(双色)"},
            {"name": "textFour","title":"正文印刷基础费用(四色)"},
            {"name": "inset","title":"插页印刷基础费用"},
            {"name": "cycle","title":" 生产周期"},
          ],
          tabNum : 0,
          loading : false,
          formThreshold : {
            "volumeSingle" : "",
            "volumeDouble" : "",
            "volumeFour" : "",
          },
          formParameter: {
            arr:[
              {
                "BookCost" : "333",
                "BookCostAmount" : " ",
                "FixedCost" : "",
                "SheetCost" : "",
                "SheetCostAmount" : ""
              },
              {
                "BookCost" : "",
                "BookCostAmount" : " ",
                "FixedCost" : "",
                "SheetCost" : "",
                "SheetCostAmount" : ""
              },
              {
                "BookCost" : "",
                "BookCostAmount" : " ",
                "FixedCost" : "",
                "SheetCost" : "",
                "SheetCostAmount" : ""
              },
              {
                "BookCost" : "",
                "BookCostAmount" : " ",
                "FixedCost" : "",
                "SheetCost" : "",
                "SheetCostAmount" : ""
              },
              {
                "BookCost" : "",
                "BookCostAmount" : " ",
                "FixedCost" : "",
                "SheetCost" : "",
                "SheetCostAmount" : ""
              },
                ],
            "cycleSingle": '',
            "cycleDouble": '',
            "cycleFour": ''
          }
        }
      },
      mounted() {
        this.getData();
      },
      methods: {
        getThreshold (){

          let url = "/podCostThreshold"
          this.$ajax.get(url,{}).then(res => {
            if(res.status === 200){
                this.formThreshold = res.data
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        },
        // 获取数据
        getData () {
          let url = "/printCostProperties/"+this.activeName
          let param = {
            "type" :this.activeName,
          }
          this.$ajax.get(url,param).then(res => {
            if(res.status === 200){
              this.formParameter = {
                "cycleSingle": res.data.cycleSingle,
                "cycleDouble": res.data.cycleDouble,
                "cycleFour": res.data.cycleFour,
                arr:[
                  {
                    "BookCost" : res.data.coverBookCost,
                    "BookCostAmount" :res.data.coverBookCostAmount,
                    "FixedCost" : res.data.coverFixedCost,
                    "SheetCost" :res.data.coverSheetCost,
                    "SheetCostAmount" : res.data.coverSheetCostAmount
                  },
                  {
                    "BookCost" : res.data.textSingleBookCost,
                    "BookCostAmount" :res.data.textSingleBookCostAmount,
                    "FixedCost" : res.data.textSingleFixedCost,
                    "SheetCost" :res.data.textSingleSheetCost,
                    "SheetCostAmount" : res.data.textSingleSheetCostAmount
                  },
                  {
                    "BookCost" : res.data.textDoubleBookCost,
                    "BookCostAmount" :res.data.textDoubleBookCostAmount,
                    "FixedCost" : res.data.textDoubleFixedCost,
                    "SheetCost" :res.data.textDoubleSheetCost,
                    "SheetCostAmount" : res.data.textDoubleSheetCostAmount
                  },
                  {
                    "BookCost" : res.data.textFourBookCost,
                    "BookCostAmount" :res.data.textFourBookCostAmount,
                    "FixedCost" : res.data.textFourFixedCost,
                    "SheetCost" :res.data.textFourSheetCost,
                    "SheetCostAmount" : res.data.textFourSheetCostAmount
                  },
                  {
                    "BookCost" : res.data.insetBookCost,
                    "BookCostAmount" :res.data.insetBookCostAmount,
                    "FixedCost" : res.data.insetFixedCost,
                    "SheetCost" :res.data.insetSheetCost,
                    "SheetCostAmount" : res.data.insetSheetCostAmount
                  },
                ]

              }
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        },
        // 新增
        submitForm(formName) {
          let url = "/printCostProperties"
          let param = {
            "type":this.activeName,
            "coverBookCost" : this.formParameter.arr[0].BookCost,
            "coverBookCostAmount" : this.formParameter.arr[0].BookCostAmount,
            "coverFixedCost" : this.formParameter.arr[0].FixedCost,
            "coverSheetCost" : this.formParameter.arr[0].SheetCost,
            "coverSheetCostAmount" : this.formParameter.arr[0].SheetCostAmount,

            "textSingleBookCost" : this.formParameter.arr[1].BookCostAmount,
            "textSingleBookCostAmount" : this.formParameter.arr[1].BookCost,
            "textSingleFixedCost" : this.formParameter.arr[1].FixedCost,
            "textSingleSheetCost" : this.formParameter.arr[1].SheetCost,
            "textSingleSheetCostAmount" : this.formParameter.arr[1].SheetCostAmount,

            "textDoubleBookCost" : this.formParameter.arr[2].BookCost,
            "textDoubleBookCostAmount" : this.formParameter.arr[2].BookCostAmount,
            "textDoubleFixedCost" : this.formParameter.arr[2].FixedCost,
            "textDoubleSheetCost" : this.formParameter.arr[2].SheetCost,
            "textDoubleSheetCostAmount" : this.formParameter.arr[2].SheetCostAmount,

            "textFourBookCost" : this.formParameter.arr[3].BookCost,
            "textFourBookCostAmount" : this.formParameter.arr[3].BookCostAmount,
            "textFourFixedCost" : this.formParameter.arr[3].FixedCost,
            "textFourSheetCost" : this.formParameter.arr[3].SheetCost,
            "textFourSheetCostAmount" : this.formParameter.arr[3].SheetCostAmount,

            "insetBookCost" : this.formParameter.arr[4].BookCost,
            "insetBookCostAmount" : this.formParameter.arr[4].BookCostAmount,
            "insetFixedCost" : this.formParameter.arr[4].FixedCost,
            "insetSheetCost" : this.formParameter.arr[4].SheetCost,
            "insetSheetCostAmount" : this.formParameter.arr[4].SheetCostAmount,

            "cycleSingle": this.formParameter.cycleSingle,
            "cycleDouble": this.formParameter.cycleDouble,
            "cycleFour": this.formParameter.cycleFour

          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.loading = true
              this.$ajax.post(url,param).then(res => {
                if(res.status === 200){

                  this.$message({
                    message: res.data.msg,
                    type: 'success'
                  });
                  this.loading = false
                  // this.getData()
                }else{
                  this.loading = false
                  this.$message({
                    message: res.data.msg,
                    type: 'error'
                  });
                }
              });
            } else {
              console.log('表单错误!');
              return false;
            }
          });
        },
        //判断有没有设置
        isSet (data) {
          console.log("我是数据",data)
          let isSetValue = true
          for(var key in data){
            if(data[key]>0){
              isSetValue = false
            }
          }
          return isSetValue
        },
        parameterClick (tab, event){
          this.tabNum = tab.index
        },
        handleClick(tab, event) {
          if(this.activeName!='costThreshold'){
            this.getData()
          }
        }
      },
      components: {
        costThreshold
      }
    }
</script>

<style lang="less">
#costParameter{
  .parameter-tab{
    margin: 20px 0;
    padding-bottom: 10px;
  }
  .parameter-block{
    width: 100%;
    min-width: 620px;
    height: auto;
    display: block;
    overflow-x: auto!important;
  }
  .el-input{
    width: 90px;
  }
  .el-form-item__label{color: #333333}
  .label-title{margin: 0 20px 0 30px}
  .input-tag{margin-left:10px}
  .el-input-number{
    width: auto!important;
  }
}

</style>
