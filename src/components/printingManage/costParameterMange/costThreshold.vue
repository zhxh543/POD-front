<template>
  <div id="cost-threshold">
    <el-form  :model="formThreshold" ref="formThreshold" :label-position="'right'" :label-width="'70px'">
    <el-form-item label="单色">
      <el-input-number v-model="formThreshold.volumeSingle" :min="0" :max="9999999"  :controls="false"></el-input-number>
    </el-form-item>
    <el-form-item label="双色">
      <el-input-number v-model="formThreshold.volumeDouble" :min="0"  :max="9999999" :controls="false"></el-input-number>
    </el-form-item>
    <el-form-item label="四色">
      <el-input-number v-model="formThreshold.volumeFour" :min="0" :max="9999999" :controls="false"></el-input-number>
    </el-form-item>
  </el-form>
    <div class="line"></div>
    <div class="form-submit ">
      <!--<p :class="{'colRed': isSet(formParameter.arr[tabNum])}" v-if="tabNum==0">4564546</p>-->
      <el-button  type="primary" @click="submitForm('formThreshold')" :loading="loading">保存</el-button>
    </div>

    <p class="rds-remark" v-html="costThresholdDesc"></p>
  </div>
</template>

<script>
    export default {
        name: "cost-threshold",
      data (){
        return {
          loading:false,
          formThreshold : {
            "volumeSingle" : "",
              "volumeDouble" : "",
              "volumeFour" : "",
          }
         }
        },
      methods: {
        getThreshold() {

          let url = "/podCostThreshold"
          this.$ajax.get(url, {}).then(res => {
            if (res.status === 200) {
              this.formThreshold = res.data
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        },
        //新增
        submitForm(formName) {
          let url = "/podCostThreshold"
          let param = this.formThreshold
          this.loading = true
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$ajax.post(url,param).then(res => {
                this.loading = false
                if(res.status === 200){
                  this.$message({
                    message: res.data.msg,
                    type: 'success'
                  });
                }else{
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
      },
      mounted() {
        this.getThreshold();
      },
    }
</script>

<style scoped>

</style>
