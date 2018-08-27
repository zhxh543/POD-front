<template>
  <div id="systemUserAdd">
    <el-dialog
      :title="editId ? '编辑系统用户': '新增系统用户'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="540px"
      :before-close="handleClose">
      <el-form label-width="80px" class="examine-form" :rules="rulesSystemUser" :model="systemUserForm" ref="systemUserForm" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="systemUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.trim="systemUserForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model.trim="systemUserForm.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
      </el-form>
      <p class="rds-remark" v-html="defPwdDesc"></p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('systemUserForm')" size="mini" :loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  // 正则验证

  import  md5 from 'md5';
  import { validateTelephone ,validateUserName ,validateRealName } from '@/util/validate';
  export default {
    name: "systemUserAdd",
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
        msg : "新增&编辑系统用户",
        dialogVisible: false,
        editId: "",//编辑id
        loading : false,
        rulesSystemUser :{
          mobile: [
            { required: false, message: '请输入手机号', trigger: 'blur' },
            { validator: validateTele, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { validator: validateRealN, trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { validator: validateUserN, trigger: 'blur' }
          ],
        },
        systemUserForm : {
          mobile: null,
          realName: "",
          username: "",
        }
      };
    },
    methods: {
      showModel (row){
        this.dialogVisible = true;
        if(row){
          this.editId = row.id
          this.systemUserForm.id =row.id
          this.systemUserForm.mobile =row.mobile
          this.systemUserForm.realName =row.realName
          this.systemUserForm.username =row.username
        }
      },
      submitForm(formName) {
        let url = "/admin/"
        let param = this.systemUserForm
        let defPassword = "rds123456!"

        param.password = md5(defPassword)//默认密码"rds123456!"的md5 32位加密
        let mathod = "post"
        if(this.editId){
          url = "/admin/"+this.systemUserForm.id
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
                this.systemUserForm = {}
                this.editId = ""
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
        this.editId = ""
        this.systemUserForm = {}
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #systemUserAdd{
    .el-dialog__body{
      padding: 30px 40px 0 20px;
    }
    .w-refresh{
      float: right;
      margin-right: -25px;
      margin-top: 15px;
      font-size: 16px;
      cursor: pointer;
    }
    .el-select{width: 100%;}
    .el-dialog__header{border-bottom: 1px solid #eeeeee;
    .el-dialog__title{font-size: 14px;color: #333333;}
  }
  }

</style>
