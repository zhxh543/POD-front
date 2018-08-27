<template>
  <div class="top">
    <a class="logo" href="/">
      <!--<img src="./img/logo.png" alt="logo">-->
      重印印数决策支撑系统
    </a>
    <span v-if="updateTime" class="updateTime">(同步更新时间：{{updateTime}})</span>
    <ul>
      <li>
      </li>
      <li @click="changeView('newsManage','systemMessageManage')">
        <i class="el-icon-bell"></i>
        <sub v-if="isRead" id="isReadId">&nbsp;</sub>
      </li>
      <li>
        <el-popover
          placement="bottom"
          trigger="hover">
          <div class="userMenu">
            <p @click="dialogVisible = true">修改密码</p>
            <p @click="weChatBinding">微信绑定</p>
            <!--@click="changeView('logisticsManage','inventoryManage')"-->

            <p @click="dialogTheme = true">主题</p>
            <p @click="logOut">退出</p>
          </div>
          <span slot="reference" class="userName" v-text="userName"></span>
        </el-popover>
      </li>
    </ul>
    <div id="changePass">
          <el-dialog
          title="修改密码"
          :visible.sync="dialogVisible"
          width="580px"
          :before-close="handleClose">
          <el-form :model="formPassWord" status-icon :rules="rules2" ref="formPassWord" label-width="70px" class="pass-ruleForm">
            <el-form-item label="原密码" prop="oldPwd">
              <el-input v-model.trim="formPassWord.oldPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password" >
              <el-input v-model.trim="formPassWord.password" type="password"></el-input>
              <!--type="password"-->
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model.trim="formPassWord.checkPass" type="password"></el-input>
            </el-form-item>
            <p class="rds-remark" v-html="'密码由字母、数字和特殊字符组合，至少8位。特殊字符包括 ~!@#$%^&*_'"></p>
              <div style="text-align: center;margin-top: 20px">
              <el-button @click="handleClose"  size="small">取消</el-button>
              <el-button type="primary"   size="small" @click="submitForm('formPassWord')">确定</el-button>
                <!--@click="submitForm('formPassWord')"-->
              </div>
          </el-form>
        </el-dialog>

      <el-dialog
        title="主题"
        :visible.sync="dialogTheme"
        width="380px">

          <div class="changeTheme" >
            <el-form label-width="80px">
              <el-form-item label="主题颜色:">
                <div class="changeCole">
                  <span class="themDefault" @click="themeColor='default',changeTheme('default')" :class="(themeColor=='default') ? 'changeCole-active': ''"><img src="./img/themeDef.png"></span>
                  <span class="themBlue"  @click="themeColor='blue',changeTheme('blue')" :class="(themeColor=='blue') ? 'changeCole-active': ''"> </span>
                  <span class="themGreen"  @click="themeColor='green',changeTheme('green')" :class="(themeColor=='green') ? 'changeCole-active': ''"> </span>
                  <span class="themBlack"   @click="themeColor='black',changeTheme('black')" :class="(themeColor=='black') ? 'changeCole-active': ''"> </span>
                </div>
              </el-form-item>
              <el-form-item label="字体大小:">
                <el-radio-group v-model="fontSize" @change="changeFontSize(fontSize)">
                  <el-radio label="12">小</el-radio>
                  <el-radio label="14">中</el-radio>
                  <el-radio label="16">大</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: center;margin-top: 20px">
            <el-button @click="dialogTheme = false"  size="small">取消</el-button>
            <el-button type="primary"   size="small" @click="submitTheme()">确定</el-button>
            <!--@click="submitForm('formPassWord')"-->
          </div>
      </el-dialog>
        <el-dialog
          title="微信绑定"
          :visible.sync="dialogWeChat"
          width="380px"
          :before-close="handleCloseWeChat">
          <div class="weChatImg">
            <p v-if="weChatUrl">请用微信扫一扫！</p>
            <img :src="weChatUrl" v-if="weChatUrl">
            <span v-else v-text="weChatText"></span>
            <p v-show="isBinding" style="color: #ff0000">已绑定，扫码将覆盖原绑定微信号！</p>
          </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
  // 正则验证密码强度
  import { validatePassLevel } from '@/util/validate';
  import md5 from 'md5';
  var QRCode = require('qrcode')

  export default {
    name: 'top',
    data() {
      var checkOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('原密码不能为空'));
        }else {
          callback();
        }

      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'));
        } else {
          if (!validatePassLevel(value)) {
            callback(new Error('请输入:字母+数字+特殊字符格式密码'));
          }else{
            callback();
          }
        }
      };
      var validatecCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.formPassWord.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dialogTheme : false,//主题窗口
        themeColor  : "default",//皮肤颜色
        fontSize : "12",//字体大小
        updateTime : "",//同步更新时间
        dialogVisible : false,
        dialogWeChat : false,
        weChatUrl : "",
        weChatText : "",
        isBinding : false,//微信是否已绑定
        userName: "",
        formPassWord: {
          password: '',
          checkPass: '',
          oldPwd: ''
        },
        rules2: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatecCheckPass, trigger: 'blur' }
          ],
          oldPwd: [
            { validator: checkOldPass, trigger: 'blur' }
          ]
        },
        isRead: false
      };
    },
  mounted: function () {
    this.getMessageStatus()
    this.getTimeData()//获取同步更新时间
    this.userName = localStorage.getItem("userName")
  },
    watch: {
      'isRead': function (newValue, oldValue) {
      }
    },
    methods: {
    getTimeData(){
      let url = "/home/data"
      this.$ajax.get(url, {}).then(res => {
        if (res.status === 200) {
          this.updateTime = res.data.synDate
          if(res.data.userStyle.theme){
            this.themeColor = res.data.userStyle.theme
            $("#skin").attr("href","static/css/"+this.themeColor+".css");
          }
          if(res.data.userStyle.fontSize){
            this.fontSize = res.data.userStyle.fontSize
            $("#fontSize").attr("href","static/css/fontsize-"+this.fontSize+".css");
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      });
    },
    changeFontSize(val){
      // 改变字体大小
        $("#fontSize").attr("href","static/css/fontsize-"+val+".css");
    },
      //改变主题颜色
    changeTheme (val) {
      $("#skin").attr("href","static/css/"+val+".css");
    },
      submitTheme() {
        let url = "/userStyle"
        let param = {
          theme: this.themeColor,
          fontSize: this.fontSize
        }
        this.$ajax.post(url,param).then(res => {
          if(res.status === 200){
            this.dialogTheme = false
            this.$message({
              message: "修改成功！",
              type: 'success'
            });
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
    // 已读未读消息统计
    getMessageStatus() {
      this.$ajax.get('/message/stats').then(res => {
        if(res.status == 200) {
          this.isRead = res.data.notRead
          this.$nextTick(function (){
          if(res.data.notRead>0){
          //   var obj=document.getElementById("isReadId");
          // obj.style.display="block";
            $("#isReadId").css("display","block");
          }
          })
        }
      })
    },
    //微信绑定
    weChatBinding (){
      let url = "/weChat/authenticateUrl"
      let _this = this
      this.$ajax.get(url,{}).then(res => {
        if(res.status === 200){
          this.dialogWeChat  = true
          this.isBinding = res.data.bind
          QRCode.toDataURL(res.data.url, function (err, codeUrl) {
            _this.weChatUrl = codeUrl
          })
        }else{
          this.weChatText = res.data.msg
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      });
    },
    handleCloseWeChat(done) {
      this.dialogWeChat = false
    },
    //退出
    logOut() {
      let url = "/logout"
          this.$ajax.get(url,{}).then(res => {
            if(res.status === 200){
              localStorage.setItem('isLogin', false);//在浏览器里面记录退出状态
              localStorage.setItem('userName', "");
              this.$router.push({name: "login"});
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
      });
    },
    /*跳转页面*/
    changeView(page,name,com) {
      this.$router.push({name: page, query: { name: name,com: com}})
    },
    handleClose(done) {
      this.$refs['formPassWord'].resetFields();
      this.dialogVisible = false
    },
    submitForm(formName) {
      let url = "/admin/changePwd"
      let param = {
        oldPwd: md5(this.formPassWord.oldPwd),
        password: md5(this.formPassWord.password)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.put(url,param).then(res => {
            if(res.status === 200){
              this.dialogVisible = false
              this.$message({
                message: "修改密码成功！",
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .top {
    width: 100%;
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    color: #ffffff;
    /*color: #b7b7b7;*/
    .logo {
      color: #ffffff;
      padding-left: 20px;
      font-size: 16px;
      display: block;
      float: left;
      img {
        width: auto;
        height: 100%;
        margin: 0 40px;
      }
    }
    .updateTime{
      float: left;
      margin-left: 15px;
      font-size: 12px;
      line-height: 100px;
    }
    ul {
      float: right;
      overflow: hidden;
      li {
        float: left;
        padding: 0 35px;
        font-size: 30px;
        /*border-left: 1px solid #333333;*/
        position: relative;
        i{cursor: pointer}
        img {
          width: 48px;
          height: 48px;
          border-radius: 100%;
        }
        sub {
          display: block;
          width: 12px;
          height: 12px;
          text-align: center;
          background: #ff0000;
          border-radius: 100%;
          position: absolute;
          right: 35px;
          top: 30px;
        }
      }
    }
  }
  .userName{
    font-size: 18px;
    cursor: pointer;
  }
  .userMenu{
    p{
      line-height: 30px;
      cursor: pointer;
      padding-left: 10px;
    }
  }
</style>

<style  lang="less">

  .changeCole{
    span{
      width: 32px;
      height: 32px;
      border: 1px solid #eeeeee;
      display: block;
      float: left;
      margin: 3px;
      opacity:0.5;
      cursor: pointer;
      img{
        /*width: 42px;*/
        margin-top: -12px;
      }
    }
    .changeCole-active{
      opacity:1;
      border: 1px solid #8f8f8f;
    }
    .themDefault{
      background: #30b8fe;
    }
    .themGreen{
      background: #28C195;
    }
    .themBlack{
      background: #373737;
    }
    .themBlue{
      background: #30b8fe;
    }

  }
  .changeTheme{
    padding-right: 10px;
    /*p{*/
      /*line-height: 30px;*/
      /*cursor: pointer;*/
    /*}*/
    /*.pop-active{*/
      /*background: #eee;*/
    /*}*/
  }
  #changePass{
    .el-dialog__header {
      height: 60px;
      line-height: 60px;
      padding:0 0 0 20px!important;
      border-bottom: 1px solid #eeeeee;
      .el-dialog__title {
        font-size: 14px;
        color: #333333;
      }
    }
    .weChatImg{
      margin: auto;
      padding: 20px 50px 50px 50px;
      text-align: center;
      img{
        width: 200px;
        height: 200px;
        margin: 20px;
        border: 1px solid #eeeeee;
      }
      span{
        color: #ff0000;
      }
    }
  }
</style>
