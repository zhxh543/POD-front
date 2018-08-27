<template>
  <div id="factoryAdd">
    <el-dialog
      :title="editId ? '编辑工厂': '新增工厂'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="560px"
      :before-close="handleClose">
      <el-form label-width="80px" class="dialog-form"  :rules="rulesFactory"  :model="factoryValidateForm" ref="factoryValidateForm" >
        <el-form-item label="工厂名称" prop="name">
          <el-input v-model.trim="factoryValidateForm.name" placeholder="请输入工厂名称"></el-input>
        </el-form-item>
        <el-form-item label="工厂地址"  prop="address">
          <el-input v-model.trim="factoryValidateForm.address" placeholder="请输入工厂地址"></el-input>
        </el-form-item>
        <el-form-item label="联系人"  prop="contact" class="w-input">
          <el-input v-model.trim="factoryValidateForm.contact" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"  prop="phone"  class="w-input">
          <el-input v-model.trim="factoryValidateForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="类型"  prop="type">
          <template>
              <el-checkbox   v-model="factoryValidateForm.pod">POD印刷</el-checkbox>
              <el-checkbox  v-model="factoryValidateForm.tradition">传统印刷</el-checkbox>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('factoryValidateForm')" size="mini" :loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  // 正则验证手机号
  import { validateTelephone } from '@/util/validate';
  export default {
    name: "factoryAdd",
    data() {
      // 手机号验证方法
      var validateTel = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'));
        } else {
          if (!validateTelephone(value)) {
            callback(new Error('请输入有效手机号'));
          }else{
            callback();
          }
        }
      };
      // type验证方法
      var validateType = (rule, value, callback) => {

          if (!this.factoryValidateForm.pod && !this.factoryValidateForm.tradition) {
            callback(new Error('请至少选择一个类型'));
          }else{
            callback();
          }
      };
      return {
        dialogVisible: false,
        editId: "",//编辑id
        loading : false,
        factoryValidateForm : {
          name: "",
          address: "",
          contact : "",
          phone: "",
          pod : true,
          tradition : true,
        },
        rulesFactory :{
          name: [
            { required: true, message: '请输入工厂名称', trigger: 'blur' },
            { min: 1, max: 21, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入工厂地址', trigger: 'blur' },
            { min: 1, max: 101, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
            { min: 1, max: 21, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            {  required: true,validator: validateTel, trigger: 'blur' }
          ],
          type: [
            {  required: true,validator: validateType, trigger: 'change' }
          ],
        },
      };
    },
    methods: {
      showModel (id,rows){
        this.dialogVisible = true;
        console.log(this.factoryValidateForm.pod)
        if(id){//编辑
          this.editId = id
          this.factoryValidateForm = {
            id : rows.id,
            name : rows.name,
            address : rows.address,
            contact: rows.contact,
            phone: rows.phone,
            pod: rows.pod,
            tradition : rows.tradition
          }
        }
      },
      //新增
      submitForm(formName) {
        let url = "/factory"
        let param = this.factoryValidateForm
        let method = "post"
        this.loading = true
        if(this.editId){//编辑
          url = "/factory/"+this.editId
          method = "put"
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.update(url,param,method).then(res => {
              if(res.status === 200){
                this.loading = false
                this.factoryValidateForm = {
                  name: "",
                  address: "",
                  contact : "",
                  phone: "",
                  pod : true,
                  tradition : true,
                },
                this.editId = ""
                this.dialogVisible = false;
                this.$emit("loadData")
              }else{
                this.loading = false
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
      handleClose(done) {
        this.factoryValidateForm = {
          name: "",
            address: "",
            contact : "",
            phone: "",
            pod : true,
            tradition : true,
        },
        this.editId = ""
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #factoryAdd{
    .el-dialog__body{
      padding: 30px 30px 0 30px;
    }
    .w-input{
      .el-input{
        width: 156px;
      }
    }
  .el-dialog__header{border-bottom: 1px solid #eeeeee;
    .el-dialog__title{font-size: 14px;color: #333333;}
  }
  }

</style>
