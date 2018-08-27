<template>
  <div id="printSpeedStateAdd">
    <el-dialog
      :title="editId ? '编辑印制进度状态': '新增印制进度状态'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="460px"
      :before-close="handleClose">
      <el-form label-width="80px" class="examine-form" :model="printSpeedForm"  :rules="rulesPrintSpeed" ref="printSpeedForm">
        <el-form-item label="进度名称" prop="name">
          <el-input v-model.trim="printSpeedForm.name" placeholder="请输入进度名称" :disabled="noHandle"></el-input>
        </el-form-item>
        <el-form-item label="进度序号" prop="rank">
          <el-input-number v-model.number="printSpeedForm.rank" :min="0"  :max="9999999" :controls="false"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('printSpeedForm')" size="mini" :loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "printSpeedStateAdd",
    props : ["activeName"],
    data() {
      return {
        msg : "新增&编辑印制进度状态",
        dialogVisible: false,
        editId: "",//编辑id
        loading : false,
        noHandle : false,
        rulesPrintSpeed :{
          name: [
            { required: true, message: '请输入进度名称', trigger: 'blur' },
            { min: 1, max: 21, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        },
        printSpeedForm : {
          name: "",
          rank : "",
          status: true,
          // type : this.activeName
        }
      };
    },
    methods: {
      showModel (id,rows){
        this.dialogVisible = true;
        if(id){//编辑
          this.editId = id
          this.printSpeedForm = {
            id : rows.id,
            name : rows.name,
            rank : rows.rank,
            status: rows.status,
            type : rows.type
          }
          if(this.printSpeedForm.id.length<2){
            this.noHandle = true
          }
        }
      },
      //新增
      submitForm(formName) {
        let url = "/progressMgmt"
        let param = this.printSpeedForm
        param.type = this.activeName//在data中获取不到值，改到新增加方法时候赋值
        let method = "post"
        this.loading = true
        if(this.editId){//编辑
          url = "/progressMgmt/"+this.editId
          method = "put"
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.update(url,param,method).then(res => {
              if(res.status === 200){
                this.loading = false
                this.editId = ""
                this.printSpeedForm = {
                  name: "",
                  rank : "",
                  status: true,
                  type : this.activeName
                }
                this.dialogVisible = false;

                this.noHandle = false
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
        this.editId = ""
        this.printSpeedForm = {
          name: "",
            rank : "",
            status: true,
            type : this.activeName
        }
        this.noHandle = false
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #printSpeedStateAdd{
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
    .el-input-number{width: 100%;
       .el-input__inner{
        text-align: left
      }}
    .el-dialog__header{border-bottom: 1px solid #eeeeee;
    .el-dialog__title{font-size: 14px;color: #333333;}
  }
  }

</style>
