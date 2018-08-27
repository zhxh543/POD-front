<template>
  <div id="roleAdd">
    <el-dialog
      :title="editId ? '编辑角色': '新增角色'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="540px"
      :before-close="handleClose">
      <el-form label-width="100px" class="examine-form" :rules="rulesRoleAdd" :model="roleAddForm" ref="roleAddForm" >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleAddForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label=" 角色描述"  prop="remark" >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
            v-model="roleAddForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('roleAddForm')" size="mini" v-loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "roleAdd",
    data() {
      return {
        msg : "新增&编辑角色",
        dialogVisible: false,
        editId: "",//编辑id
        rulesRoleAdd :{
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 21, message: '最多可输入20个字', trigger: 'blur' }
          ],
          remark: [
            { required: false, message: '请输入角色描述', trigger: 'blur' },
            { min: 1, max: 201, message: '最多可输入200个字', trigger: 'blur' }
          ],
        },
        roleAddForm : {
          name: "",
          remark: "",
        },
        loading:false
      };
    },
    methods: {
      showModel (row){
        this.dialogVisible = true;
        if(row){
          this.editId = row.id
          this.roleAddForm.name = row.name
          this.roleAddForm.remark = row.remark
          this.roleAddForm.id = row.id
        }
      },
      submitForm(formName) {
        let url = "/role/"
        let param = this.roleAddForm
        let mathod = "post"
        if(this.editId){
          url = "/role/"+this.editId
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
                this.editId  = ""
                this.roleAddForm = {}
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
        this.roleAddForm = {}
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #roleAdd{
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
