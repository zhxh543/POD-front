<template>
  <div id="reprintWarningParameter">
    <template>
        <!--竖tab-->
        <div class="parameter-tab">
          <el-tabs tab-position="left" v-model="findOneParams.code" >
            <el-tab-pane  :name="item.code" v-for="(item , index) in basicList" :key="index">
              <span slot="label" :class="{'colRed':!isAdd&&(findOneParams.memo==item.memo)}" v-text="item.memo" @click="handleClickCode(item.code,item.memo)"></span>
            </el-tab-pane>
            <el-tabs tab-position="left" v-model="findOneParams.typeFullName" @tab-click="handleClick">
            <el-tab-pane :label="item.value"  :name="item.key" v-for="(item,index) in specType" :key="index"></el-tab-pane>
            <!--表单-->
            <div class="parameter-block" >
              <el-form  :model="paramsForm" :rules="rules" ref="paramsForm" class="demo-form-inline" :label-position="'right'" :label-width="'100px'">
                <!--POD生产周期-->
                <div >
                  <el-form-item label="重印阈值" >
                    <el-input-number v-model="paramsForm.reprintThreshold" :min="0"  :max="9999999" :controls="false"></el-input-number>
                    <span class="input-tag">册</span>
                  </el-form-item>
                  <el-form-item label="备货周期">
                    <el-input-number v-model="paramsForm.stockCycle" :min="0"  :max="9999999" :controls="false"></el-input-number>
                    <span class="input-tag">月</span>
                  </el-form-item>
                  <el-form-item label="预警线" >
                    <template>
                      <el-checkbox v-model="paramsForm.enabledStock">
                        <label class="label-title">库存<</label>
                        <el-input-number v-model="paramsForm.stock" :min="0"  :max="9999999" :controls="false" class="check-input" :disabled="!paramsForm.enabledStock"></el-input-number>
                        <span class="input-tag">册</span>
                      </el-checkbox>
                      <el-checkbox v-model="paramsForm.enabledPn">
                        <label class="label-title">库存<</label>
                        <el-input-number v-model="paramsForm.printNum" :min="0"  :max="9999999" :controls="false" :disabled="!paramsForm.enabledPn"></el-input-number>
                        <span class="input-tag"> % * 一版一次印量</span>
                      </el-checkbox>
                      <el-checkbox v-model="paramsForm.enabledIr">
                        <label class="label-title">库存<</label>
                        <el-input-number v-model="paramsForm.includeRefunds" :min="0"  :max="9999999" :controls="false" :disabled="!paramsForm.enabledIr"></el-input-number>
                        <span class="input-tag">天 * 近90天日均净发货</span>
                      </el-checkbox>
                      <el-checkbox v-model="paramsForm.enabledEr">
                        <label class="label-title">库存<</label>
                        <el-input-number v-model="paramsForm.excludeRefunds" :min="0"  :max="9999999" :controls="false" :disabled="!paramsForm.enabledEr"></el-input-number>
                        <span class="input-tag"> 天 * 近90天日均毛发货</span>
                      </el-checkbox>
                    </template>
                  </el-form-item>
                </div>

                <div class="line"></div>
                <div class="form-submit ">
                  <el-button  type="primary" @click="submitForm('paramsForm')" :loading="loading" >保存</el-button>
                </div>
              </el-form>
            </div>
          </el-tabs>
            <!--表单-->
          </el-tabs>
        </div>
    </template>
    <p class="rds-remark" v-html="setWarningDesc"></p>
  </div>
</template>

<script>
  export default {
    name: "reprintWarningParameter",
    props : ["activeName"],
    data (){
      return {
        crumbsList:[   //  面包屑
          {name:'印制成本参数',url:{routerName:'printingManage',params:{name:'costParameter'}}},
        ],
        findOneParams : {
          code: '',
          memo: '',
          typeFullName: '非教材-新书-单色',
        },
        basicList : [],//获取预警分析基础(左侧菜单)
        specType : [
          {"value": "非教材-新书-单色","key":"非教材-新书-单色"},
          {"value": "非教材-新书-双色","key":"非教材-新书-双色"},
          {"value": "非教材-新书-四色","key":"非教材-新书-四色"},
          {"value": "非教材-再版书-单色","key":"非教材-再版书-单色"},
          {"value": "非教材-再版书-双色","key":"非教材-再版书-双色"},
          {"value": "非教材-再版书-四色","key":"非教材-再版书-四色"},
          {"value": "教材-新书-单色","key":"教材-新书-单色"},
          {"value": "教材-新书-双色","key":"教材-新书-双色"},
          {"value": "教材-新书-四色","key":"教材-新书-四色"},
          {"value": "教材-再版书-单色","key":"教材-再版书-单色"},
          {"value": "教材-再版书-双色","key":"教材-再版书-双色"},
          {"value": "教材-再版书-四色","key":"教材-再版书-四色"},
        ],
        paramsForm: {
          teaching : "",
          newBook : "",
          printColor : "",
          reprintThreshold : "",//重印阈值
          stockCycle : "",//备货周期
          stock : "",//库存
          printNum : "",//一版一次印量
          includeRefunds : "",//近90天日均净发货
          excludeRefunds : "",//近90天日均毛发货
          enabledStock:false,//	启用库存
          enabledPn :false,//	启用印量
          enabledIr:false,//启用净发货
          enabledEr :false,//	启用毛发货
          reprintType : this.activeName,
        },
        rules: {},
        isAdd  : true,//是否是新增，如果获取参数返回无数据是新增，否则是更新
        loading : false,//保存loading
      }
    },
    // watch: {//暂时 注释掉传统选项卡，不用点击更新所以暂时注释掉，
    //   'activeName': function (newValue, oldValue) {
    //     this.getBasicData();
    //   }
    // },
    mounted() {
      this.getBasicData();//获取预警分析基础(左侧菜单)
    },
    methods : {
      //获取预警分析基础(左侧菜单)
      getBasicData () {
        let url = "/warning/basic/findList"
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.basicList = res.data
            this.findOneParams.code = res.data[0].code
            this.findOneParams.memo = res.data[0].memo
            this.getParams()//获取一个重印预警参数设置
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //获取一个重印预警参数设置，如果有内容是编辑，如果没有内容是新增
      getParams () {
        let url = "/warning/params/findByOneWithParams/"
        let param = {
          "code":this.findOneParams.code,
          "typeFullName" :this.findOneParams.typeFullName,
          "reprintType":this.activeName
        }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            if(res.data){
              this.isAdd = true
              this.paramsForm = res.data
            }else {
              this.isAdd = false
              this.resetFields()//如果没有内容清空
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      resetFields () {
        this.paramsForm = {
          teaching : "",
            newBook : "",
            printColor : "",
            reprintThreshold : "",//重印阈值
            stockCycle : "",//备货周期
            stock : "",//库存
            printNum : "",//一版一次印量
            includeRefunds : "",//近90天日均净发货
            excludeRefunds : "",//近90天日均毛发货
            enabledStock:false,//	启用库存
            enabledPn :false,//	启用印量
            enabledIr:false,//启用净发货
            enabledEr :false,//	启用毛发货
            reprintType : this.activeName,
        }
      },
      //新增&编辑－保存
      submitForm(formName) {
        let url = "/warning/params"
        let method = 'post'
        let param = this.paramsForm
            param.basicCode =this.findOneParams.code
            param.basicMemo =this.findOneParams.memo
            param.typeFullName =this.findOneParams.typeFullName

         if(this.isAdd){//编辑
           url = "/warning/params/"+this.paramsForm.id
           method = 'put'
         }else{
           delete(param["newBook"]);
           delete(param["printColor"]);
           delete(param["teaching"]);
         }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$ajax.update(url,param,method).then(res => {
              if(res.status === 200){
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.loading = false
                this.getParams()
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
      handleClickCode(code,memo) {
        this.findOneParams.code = code
        this.findOneParams.memo = memo
        this.getParams()
      },
      handleClick(tab, event) {
        this.findOneParams.typeFullName = tab.label
        this.getParams()
      }
    },
  }

</script>

<style  lang="less" >
  #reprintWarningParameter{
    .el-tabs__header{
      /*height: 280px;*/
    }
    .el-tabs__nav-scroll{
      height: 480px;
    }
    .parameter-tab{
      margin: 20px 0;
      padding-bottom: 10px;
    }
    .parameter-block{
      width: 100%;
      /*min-width: 520px;*/
      height: auto;
      display: block;
      // overflow-x: auto!important;
    }
    .el-form-item{
      margin-bottom: 15px;
    }
    .el-input{
      width: 260px;
      .el-input__inner{
        text-align: left;
      }
    }
    .el-form-item__label,.el-checkbox{color: #333333}
    /*.label-title{margin: 0 5px}*/
    .input-tag{margin-left: 20px}
    .el-input-number{
      width: auto!important;
    }
    .el-checkbox{
      width: 100%;
      margin-bottom: 15px;
      .el-input{
        width: 110px;
      }
    }
    .form-submit {
       margin: 30px 15px;
     }
    .check-input{
      .el-input{
        width: 184px!important;}
    }
    .el-checkbox__label{padding-left: 20px!important;}
  }
</style>
