<template>
  <div id="validityDateParameter">
      <el-form  :rules="rulesLogistics" :model="logisticsForm" ref="logisticsForm" label-width="100px" class="examine-form">
        <el-form-item label="有效期" prop="hour" >
          <el-input v-model.trim="logisticsForm.hour" ></el-input>
          <span class="input-tag">小时</span>
        </el-form-item>
      </el-form>
      <div class="line"></div>
      <div class="form-submit ">
        <el-button  type="primary" @click="submitForm('logisticsForm')" :loading="loading">保存</el-button>
      </div>
  </div>
</template>

<script>
  // 正则验证
  import { validateNum } from '@/util/validate';
  export default {
    name: "validityDateParameter",
    data (){
      var validateHour = (rule, value, callback) => {
          if (!validateNum(value)) {
            callback(new Error('请输入正整数'));
          }else{
            callback();
          }
      };
      return {
        msg : "系统参数管理-接单有效期",
        loading: false,
        rulesLogistics :{
          hour: [
            { required: true, message: '请输入接单有效期', trigger: 'blur' },
            { validator: validateHour, trigger: 'blur' }
          ],
        },
        logisticsForm: {
          hour: "",
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods : {
      // 获取数据
      getData () {
        let url = "/receiveTimeout"
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.logisticsForm = res.data
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      submitForm(formName) {
        let url = "/receiveTimeout"
        let param = this.logisticsForm
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$ajax.post(url,param).then(res => {
              this.loading = false
              if(res.status === 200){
                this.$message({
                  message: "操作成功",
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
            console.log('表单错误!');
            return false;
          }
        });
      },
    },

  }
</script>

<style  lang="less" >
  #validityDateParameter{
    .input-tag{margin-left: 10px}
    .examine-form{
      padding: 18px 0 10px 0;
      width: 450px;
      .el-input{
        width: 200px;
        text-align: left;
      }
      p{
        color: #999999;font-size: 14px}
    }

  }

</style>
