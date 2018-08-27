<template>
  <div id="appUserAdd">
    <el-dialog
      :title="editId ? '编辑应用用户': '新增应用用户'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="580px"
      :before-close="handleClose">
      <el-form label-width="90px" class="dialog-form" :rules="rulesAppUser" :model="appUserForm" ref="appUserForm" >
        <el-form-item label="用户名"  prop="username" >
        <el-input v-model.trim="appUserForm.username"  placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
        <el-input  v-model.trim="appUserForm.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
        <el-form-item label="真实姓名"  prop="realName" >
          <el-input v-model.trim="appUserForm.realName"  placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属应用"  prop="appId">
          <template>
            <el-select v-model="appUserForm.appId" placeholder="选择应用">
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label=" 预置角色"  prop="roleIds" >
          <template>
            <el-checkbox-group v-model="appUserForm.roleIds">
              <el-checkbox :label="item.id" v-for="(item,index) in roleList" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-form>

      <p class="rds-remark" v-html="defPwdDesc"></p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('appUserForm')" size="mini" v-loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  // 正则验证
  import { validateTelephone ,validateUserName ,validateRealName } from '@/util/validate';
  import  md5 from 'md5';
  export default {
    name: "appUserAdd",
    data() {
      var validateTele = (rule, value, callback) => {
        if(value){
          if (!validateTelephone(value)) {
            callback(new Error('请输入有效手机号！'));
          }else{
            callback();
          }
        }else {
          callback();
        }
      };
      var validateUserN = (rule, value, callback) => {
        if (!validateUserName(value)) {
          callback(new Error('请输入用户名！'));
        }else{
          callback();
        }
      };
      var validateRealN = (rule, value, callback) => {
        if (validateRealName(value)) {
          callback(new Error('请输入真实姓名！'));
        }else{
          callback();
        }
      };
      return {
        dialogVisible: false,
        editId: "",//编辑id
        loading : false,
        rulesAppUser :{
          mobile: [
            { required: false, message: '请输入有效手机号', trigger: 'blur' },
            { validator: validateTele, trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { validator: validateUserN, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { validator: validateRealN, trigger: 'blur' }
          ],
          appId: [
            { required: true, message: '请选择所属应用', trigger: 'change' }
          ],
          roleIds: [
            { type: 'array', required: true, message: '请至少选择一个预置角色', trigger: 'change' }
          ]
        },
        appUserForm : {
          username: "",
          mobile: null,
          realName: "",
          appId : "",
          roleIds: []
        },
        //applist
        appList : [],
        //rolelist
        roleList : []
      };
    },
    mounted: function () {
    },
    methods: {
      // 获取app列表
      getAppData () {
        let url = "/app"
        this.loading = true
        this.$ajax.get(url,{}).then(res => {
          this.loading = false
          if(res.status === 200){
            this.appList = res.data
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      // rolelist
      getRoleData () {
        let url = "/role"
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.roleList = res.data
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      showModel (row){
        this.getAppData();
        this.getRoleData();
        this.dialogVisible = true;
        let roleArry = []
        if(row){
          this.editId = row.id
          this.appUserForm = {
             "id":row.id,
             "mobile":row.mobile,
            "realName": row.realName,
            "username": row.username,
            "appId" : row.appId,
            "roleIds": row.roleIds,
          }
        }
      },
      submitForm(formName) {
        let url = "/admin/"
        let param = this.appUserForm
        let mathod = "post"
        let defPassword = "rds123456!"
        param.password = md5(defPassword)//默认密码"rds123456!"的md5 32位加密
        if(this.editId){
          url = "/admin/"+this.appUserForm.id
          mathod = "put"
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$ajax.update(url,param,mathod).then(res => {
              this.loading = false
              if(res.status === 200){
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.appUserForm = {
                  username: "",
                    mobile: null,
                    realName: "",
                    appId : "",
                    roleIds: []
                },
                this.editId  = ""
                this.dialogVisible = false
                this.$emit("loadData")
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
      handleClose(done) {
        this.editId  = ""
        this.appUserForm = {
          username: "",
          mobile: null,
          realName: "",
          appId : "",
          roleIds: []
        },
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #appUserAdd{
    .el-dialog__body{
      padding: 30px 40px 0 30px;
    }
    .el-checkbox-group{margin-right: -10px!important;}
    .w-refresh{
      float: right;
      margin-right: -25px;
      margin-top: 15px;
      font-size: 16px;
      cursor: pointer;
    }
    .el-input{
      width: 235px;
    }
    .el-select{width: 100%;}
    .el-dialog__header{border-bottom: 1px solid #eeeeee;
    .el-dialog__title{font-size: 14px;color: #333333;}
  }
  }

</style>
