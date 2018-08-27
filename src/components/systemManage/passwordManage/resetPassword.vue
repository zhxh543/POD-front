<template>
  <div id="resetPassword">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block">
        <el-input v-model="userName" @keyup.native.enter="inquireFun" placeholder="请输入用户名"></el-input><el-button type="primary"  @click="inquireFun">查询</el-button>
      </div>
      <div v-if="userInfo">
        <el-form label-width="80px" class="password-form">
          <el-form-item label="用户名">{{userInfo.username}}</el-form-item>
          <el-form-item label="手机号">{{userInfo.mobile}}</el-form-item>
          <el-form-item label="真实姓名">{{userInfo.realName}}</el-form-item>
        </el-form>
        <div class="form-submit ">
          <el-button type="primary" @click="resetPasswordFun">重置密码</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import md5 from 'md5';
  export default {
    name: "resetPassword",
    data (){
      return {
        msg : "重置密码",
        crumbsList:[   //  面包屑
          {name:'重置密码',url:{routerName:'systemManage',params:{name:'passwordManage'}}},
        ],
        userName: '',
        userInfo: null
      }
    },
    mounted(){
    },
    methods: {
      // 查询用户信息
      inquireFun() {
        if(!this.userName) {
          this.$message.error('请输入用户名！');
          return false
        }
        this.$ajax.get('/admin/'+this.userName+'/details').then(res => {
          if(res.status == 200) {
            this.userInfo = res.data
            if(!res.data) {
              this.userName = ''
              this.$message.error('无此用户！');
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      // 重置密码
      resetPasswordFun() {
        let defPassword = 'rds123456!'
        this.$ajax.putSimple('/admin/'+this.userInfo.id+'/resetPwd', md5(defPassword)).then(res => {
          if(res.status == 200) {
            this.$alert('重置密码成功！<div>您的密码是：<strong style="color: red;">' + defPassword + '</strong></div><div>请妥善保管！</div>', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              center: true
            })
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  }
</script>

<style  lang="less" type="text/less">
  #resetPassword{
    .password-form{
      margin: 30px 0;
    }
    .el-input{
      width: 290px;
      margin-right: 10px;
    }
  }

</style>
