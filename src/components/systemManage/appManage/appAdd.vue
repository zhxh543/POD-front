<template>
  <div id="appAdd">
    <el-dialog
      :title="editId ? '编辑应用': '新增应用'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="574px"
      :before-close="handleClose">
      <el-form label-width="120px" class="dialog-form" :rules="rulesAppAdd" :model="appAddForm" ref="appAddForm" >
        <el-form-item label="应用名称" prop="name">
          <el-input v-model.trim="appAddForm.name" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="关联工厂"  prop="factoryId">
          <template>
            <el-select v-model="appAddForm.factoryId" placeholder="请选择">
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="RDS AppID"  v-if="editId">
          <el-input v-model="appAddForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="RDS AppSecret"  v-if="editId">
          <el-input v-model="secret" :disabled="true" ></el-input><i @click="changeSecret" class="el-icon-refresh w-refresh"></i>
        </el-form-item>
        <el-form-item label=" 公众号"  prop="appName" >
          <el-input v-model.trim="appAddForm.appName" placeholder="请输入公众号"></el-input>
        </el-form-item>
        <el-form-item label=" AppID"  prop="appId" >
          <el-input v-model.trim="appAddForm.appId" placeholder="请输入AppID"></el-input>
        </el-form-item>
        <el-form-item label=" AppSecret"  prop="appSecret">
          <el-input v-model.trim="appAddForm.appSecret" placeholder="请输入AppSecret"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('appAddForm')" size="mini" v-loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  // 正则验证
  import { validateLetter } from '@/util/validate';
  export default {
    name: "appAdd",
    data() {
      var validateApp = (rule, value, callback) => {
        if(value.length>0){
          if (!validateLetter(value)) {
            callback(new Error('请输入:字母、数字或者下划线'));
          }else{
            callback();
          }
        }else{
          callback();
        }
      };
      return {
        dialogVisible: false,
        editId: "",//编辑id
        factoryList: [],
        loading: false,
        secret : "",
        rulesAppAdd :{
          name: [
            { required: true, message: '请输入应用名称', trigger: 'blur' },
            { min: 1, max: 21, message: '最多可输入20个字', trigger: 'blur' }
          ],
          appName: [
          { required: false, message: '请输入appName', trigger: 'blur' },
          { min: 1, max: 41, message: '最多可输入40个字', trigger: 'blur' }
         ],
          appSecret: [
          { required: false, message: '请输入appSecret', trigger: 'blur' },
          // { min: 1, max: 41, message: '最多可输入40个字', trigger: 'blur' },
          { validator: validateApp, trigger: 'blur' }
          ],
          appId: [
          { required: false, message: '请输入appId', trigger: 'blur' },
          // { min: 1, max: 41, message: '最多可输入40个字', trigger: 'blur' },
          { validator: validateApp, trigger: 'blur' }
         ],
          factoryId: [
            { required: false, message: '请选择所属工厂', trigger: 'change' }
          ],
        },
        appAddForm : {
          name: "",
          factoryId: null,
          appId : "",
          appName: "",
          appSecret : ""
        }
      };
    },
    methods: {
      changeSecret (){
        let url = "/app/"+this.appAddForm.id+"/reset"
        let param = {
            "id" : this.appAddForm.id
        }
        this.$ajax.put(url,param).then(res => {
          if(res.status === 200){
            this.secret = res.data.data
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
      },
      showModel (row){
        this.dialogVisible = true;
        if(row){
          this.editId = row.id
          this.appAddForm.name = row.name
          this.appAddForm.factoryId = row.factoryId
          this.appAddForm.appId = row.appId
          this.appAddForm.appName = row.appName
          this.appAddForm.appSecret = row.appSecret
          this.appAddForm.id = row.id
          this.secret = row.secret
        }
        this.getFactory()
      },
      // 获取工厂
      getFactory () {
        let conut = 0
        let url = "/factory"
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.factoryList = res.data
            res.data.forEach((item, index) => {//循环工厂，如果列表中有工厂id就+1，如果count＝0就清空
              if(this.appAddForm.factoryId==item.id){
                conut += 1
              }
            });
            if(conut==0){
              this.appAddForm.factoryId = null
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      submitForm(formName) {
        let url = "/app/"
        let param = this.appAddForm
        let mathod = "post"
        if(this.editId){
          url = "/app/"+this.editId
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
                this.appAddForm = {
                  name: "",
                  factoryId: null,
                  appId : "",
                  appName: "",
                  appSecret : ""
                }
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
        this.appAddForm = {
             name: "",
            factoryId: null,
            appId : "",
            appName: "",
            appSecret : ""
        }
        this.editId = ""
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #appAdd{
    .el-dialog__body{
      padding: 30px 40px 0 30px;
    }
    .w-refresh{
      float: right;
      margin-right: -25px;
      margin-top: 15px;
      font-size: 16px;
      cursor: pointer;
    }
    .el-select{width: 100%;}
    .el-select-dropdown__item{
      span{
        padding: 0 10px!important;
      }
    }
    .el-dialog__header{border-bottom: 1px solid #eeeeee;
    .el-dialog__title{font-size: 14px;color: #333333;}
  }
  }

</style>
