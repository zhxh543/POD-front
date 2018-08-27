<template>
  <div id="printCheckIn">
    <el-dialog
      :title="'进度登记'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="460px"
      :before-close="handleClose">
      <el-form label-width="80px" class="examine-form"   :rules="rulesCheckIn" :model="checkInForm" ref="checkInForm" >
        <el-form-item label="进度状态" prop="progressMgmtId">
          <el-select v-model="checkInForm.progressMgmtId" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              value-format="timestamp"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进度日期" prop="updateDate">
          <el-date-picker
            v-model="checkInForm.updateDate"
            type="date"
            value-format="timestamp"
            placeholder="选择日期"  >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('checkInForm')" size="mini" :loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "printCheckIn",
    data() {
      return {
        msg : "进度登记",
        dialogVisible: false,
        loading : false,
        statusList: [],//印制进度状态列表
        type : "",
        rulesCheckIn : {
          progressMgmtId: [
            { required: true, message: '请输入进度状态', trigger: 'blur' },
          ],
          updateDate: [
            { required: true, message: '请输入进度日期', trigger: 'blur' },
          ],
        },
        checkInForm : {
          orderId : "",
          progressMgmtId: "",
          updateDate : ""
        }
      };
    },
    mounted: function () {
    },
    methods: {
      // 获取列表
      getStatusData () {
        let url = "/progressMgmt/findListByType"
        let param = {
          "type":this.type,
        }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            this.statusList = res.data
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
          this.type = row.reprintAuditType
          this.checkInForm.orderId = row.id
          this.getStatusData();
        }
      },
      submitForm(formName) {
        let url = "/reprint/optRecord"
        let param = this.checkInForm
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.post(url,param).then(res => {
              if(res.status === 200){
                this.loading = false
                this.dialogVisible = false;
                this.$refs['checkInForm'].resetFields();
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
        this.$refs['checkInForm'].resetFields();
        this.dialogVisible = false
      }
    }
  };
</script>
<style  lang="less" >
  #printCheckIn{
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
