<template>
  <div id="warningAreaUpdate">
    <el-dialog
      :title="'修改'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="660px"
      :before-close="handleClose">
      <el-form label-width="140px" class="examine-form"   :rules="rulesUpdate" :model="updateForm" ref="updateForm" >
        <el-form-item label="重印建议印刷数量" prop="reprintNum">
          <el-input-number v-model="updateForm.reprintNum" :min="1"  :max="9999999" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="重印建议印刷方式 " prop="reprintType">
            <el-radio v-model="updateForm.reprintType" label="POD">POD印刷</el-radio>
            <el-radio v-model="updateForm.reprintType" label="Tradition">传统印刷</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('updateForm')" size="mini" :loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "warningAreaUpdate",
    data() {
      return {
        msg : "修改",
        dialogVisible: false,
        loading : false,
        rulesUpdate : {
          reprintNum: [
            { required: true, message: '请输入重印建议印刷数量', trigger: 'blur' },
          ],
          reprintType: [
            { required: true, message: '请选择重印建议印刷方式', trigger: 'blur' },
          ],
        },
        updateForm : {
          id : "",
          reprintNum: 1,
          reprintType : ""
        }
      };
    },
    mounted: function () {
    },
    methods: {
      showModel (row){
        this.dialogVisible = true;
        if(row){
          this.updateForm.id = row.id
          this.updateForm.reprintNum = row.reprintNum
          this.updateForm.reprintType = row.reprintType
        }
      },
      submitForm(formName) {
        let url = "/order/"+this.updateForm.id
        let param = this.updateForm
        param.handle = "重印区"
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.put(url,param).then(res => {
              if(res.status === 200){
                this.loading = false
                this.dialogVisible = false;
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.$refs['updateForm'].resetFields();
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
        this.$refs['updateForm'].resetFields();
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #warningAreaUpdate{
    .el-input-number{
      input{
        text-align: left;}
    }
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
    .el-select,.el-date-editor{width: 100%;}
    .el-dialog__header{border-bottom: 1px solid #eeeeee;
    .el-dialog__title{font-size: 14px;color: #333333;}
  }
  }

</style>
