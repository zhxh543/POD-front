<template>
  <div id="login">
    <div class="login-ruleForm">
      <!--<img src="../login/images/logo.png" class="login-logo">-->
      <p class="login-logo"> 重印印数决策支撑系统</p>
    <el-form :model="formLogin" status-icon :rules="ruleLogin" ref="formLogin" >
      <el-form-item  prop="username">
        <el-input v-model.trim="formLogin.username" auto-complete="off"  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item  prop="password">
        <el-input type="password" v-model.trim="formLogin.password" auto-complete="off"  placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item  class="login-code" prop="captcha">
        <el-input v-model.trim="formLogin.captcha" @keyup.native.enter="submitForm('formLogin')"  placeholder="请输入验证码"></el-input>
        <img :src="'/api/kaptcha'+random" @click="changeRandom">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formLogin')">登录</el-button>
      </el-form-item>
        <span v-if="isError" v-text="errorMsg" class="errorMsg"></span>
    </el-form>
    </div>
    <p class="bq">中国工信出版传媒集团   Copyright©2018</p>
  </div>
</template>

<script>

  import  md5 from 'md5';
  export default {
      name: "login",
    data() {
      var checkValidate = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }
        callback();
      };
      return {
        isError : false,
        errorMsg : "",
        random : "",//随机数
        formLogin: {
          username: '',
          password: '',
          captcha: ''
        },
        ruleLogin: {
          username: [
            { required: true, message: '用户名不能为空',trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空',trigger: 'blur'}
          ],
          captcha: [
            { required: true, message: '验证码不能为空',trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.changeRandom();//火狐浏览器退出重新登录时没有刷新验证码，进入页面重新加载一下
    },
    methods: {
      changeRandom (){
        this.random = "?num="+Math.random();
      },
      submitForm(formName) {
        let url = "/login"
        let param = this.formLogin
        let userName = ""
        this.$refs[formName].validate((valid) => {
          if (valid) {
            param.password = md5(param.password)
            this.$ajax.login(url,param).then(res => {
              if(res.status === 200){
                this.errorMsg = ""
                localStorage.setItem('isLogin', true);//在浏览器里面记录登录状态
                if(res.data.realName){
                  userName = res.data.realName
                }else {
                  userName = res.data.username
                }
                localStorage.setItem('userName', userName);
                this.$router.push({name: "index"});
              }else{
                this.changeRandom()
                this.formLogin.captcha = ''
                this.formLogin.password = ''
                this.isError = true
                this.errorMsg = res.data.msg
              }
            });
          } else {
            console.log('表单错误!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style  lang="less" type="text/less">
#login{
  width: 100%;
  height: 100vh;
  display: block;
  padding-top: calc(~"50vh - 200px");
  /*padding-top: 228px;*/
  background: url("../login/images/login-bg.jpg") center no-repeat;
  background-size: 100% 100%;
  .login-logo{
    /*width: 106px;*/
    width: 250px;
    height: 42px;
    /*height: 72px;*/
    display: block;
    margin: 20px auto;
    font-size: 22px;
    font-weight: bold;
    line-height: 42px;
    color: #333333;
    text-align: center;
  }
  .login-ruleForm{
    width: 400px;
    height: 400px;
    margin:auto;
    background: #fff;
    padding: 30px;
    .errorMsg{
      color: #ff0000;
    }
    .el-button {
      width: 100%;
    }
    .login-code{
      .el-input{
        width: 130px;
        float: left;
      }
      img{
        float: left;
        width: 112px;
        height: 42px;
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }
  .bq{
    width: 50%;
    color: #fff;
    display: block;
    margin: 40px auto;
    text-align: center;
  }
}
</style>
