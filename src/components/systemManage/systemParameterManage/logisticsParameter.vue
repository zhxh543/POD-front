<template>
  <div id="logisticsParameter">
      <el-form  :rules="rulesLogistics" :model="logisticsForm" ref="logisticsForm" label-width="100px" class="examine-form">
          <el-form-item label="类型">
            <p>阿里云</p>
          </el-form-item>
        <el-form-item label="AppKey" prop="appkey">
          <el-input v-model="logisticsForm.appkey" placeholder="请输入AppKey"></el-input>
        </el-form-item>
        <el-form-item label="AppSecret" prop="appsecret">
          <el-input v-model="logisticsForm.appsecret" placeholder="请输入AppSecret"></el-input>
        </el-form-item>
        <el-form-item label="AppCode" prop="appcode">
          <el-input v-model="logisticsForm.appcode" placeholder="请输入AppCode"></el-input>
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
  import { validateLetter } from '@/util/validate';
  export default {
    name: "logisticsParameter",
    data (){
      var validateApp = (rule, value, callback) => {
          if (!validateLetter(value)) {
            callback(new Error('请输入:字母、数字或者下划线'));
          }else{
            callback();
          }
      };
      return {
        msg : "系统参数管理-物流参数",
        loading: false,
        rulesLogistics :{
          appkey: [
            { required: true, message: '请输入appkey', trigger: 'blur' },
            { validator: validateApp, trigger: 'blur' }
          ],
          appsecret: [
            { required: true, message: '请输入appsecret', trigger: 'blur' },
            { validator: validateApp, trigger: 'blur' }
          ],
          appcode: [
            { required: true, message: '请输入appcode', trigger: 'blur' },
            { validator: validateApp, trigger: 'blur' }
          ],
        },
        logisticsForm: {
          appkey: "",
          appsecret: '',
          appcode: ''
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods : {
      // 获取数据
      getData () {
        let url = "/logisticsParams"
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
        let url = "/logisticsParams"
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
  #logisticsParameter{
    .examine-form{
      padding: 18px 0 10px 0;
      width: 450px;
      .el-input-number .el-input__inner{
        text-align: left;
      }
      p{
        color: #999999;font-size: 14px}
    }

  }

</style>
