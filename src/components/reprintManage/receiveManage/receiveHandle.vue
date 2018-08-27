<template>
  <div id="receiveHandle">
    <el-dialog
      title="接单"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose">
      <el-form label-width="130px" class="dialog-form" :rules="rulesHandle" :model="handleForm" ref="handleForm">
        <el-form-item
          label="预计入库时间" prop="inboundTime">
          <el-date-picker
            v-model="inboundTime"
            type="date"
            @focus= "changeData(inboundTime)"
            @change="changeData(inboundTime)"
            :clearable = "false"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('handleForm')" size="mini" :loading="loading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "receiveHandle",
    data() {
      return {
        msg: "处理",
        dialogVisible: false,
        loading : false,
        inboundTime: "",
        rulesHandle : {
          inboundTime: [
            { required: true, message: '请选择预计入库时间', trigger: 'blur' },
          ],
        },
        isTure : true,//兼容ie 在第一次操作时把标记改成false,如果isTure是false就用dom给input val赋值，
        handleForm :{
          "id" : "",
          "inboundTime" : "",
          "exchangeStatus" :"Apply",
        },
      };
    },
    methods: {
      formatDateTime(d) {
        let date = new Date(d);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return Y + M + D;
      },
      changeData(value){
        this.handleForm.inboundTime = value
      },
      showModel (row){
        this.dialogVisible = true;
        if(row){
          this.handleForm.id = row.id
          // this.inboundTime = row.receiveSuggestTime
          // this.handleForm.inboundTime = row.receiveSuggestTime

          this.changeTimeData(row.receiveSuggestTime)
          this.$forceUpdate()
        }
      },
      changeTimeData (time){
        let _self = this
        let isIe  = false //如果是ie就不操作数据回填

        if (!!window.ActiveXObject || "ActiveXObject" in window){
          isIe = true
        } else{
          isIe = false
        }
        if (_self.isTure) {
          _self.isTure = false;
          _self.inboundTime = time
          _self.handleForm.inboundTime = time
        }else{
          if(!isIe){//谷歌（非ie）浏览器
            _self.inboundTime = time
            _self.handleForm.inboundTime = time
          }else {//ie浏览器
            $('#receiveHandle .el-input--prefix .el-input__inner').val(_self.formatDateTime(time));
            // _self.inboundTime = time
            // _self.handleForm.inboundTime = time
          }
        }

      },
      submitForm(formName) {
        let url = "/order/"+this.handleForm.id
        let param = this.handleForm

        param.handle = "接单"
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.put(url,param).then(res => {
              if(res.status === 200){
                this.loading = false
                this.$message({
                  message: "操作成功！",
                  type: 'success'
                });
                this.handleForm = {}
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
        this.handleForm = {}
        this.inboundTime = ""
        this.dialogVisible = false
      },
    }
  };
</script>
<style  lang="less" >
  #receiveHandle{
    .el-table tr td,.el-table tr th{
      &:first-child{
        padding-left: 0px;
      }
    }
    .el-dialog__header{
      border-bottom: 1px solid #eeeeee;
    }
    .el-select{
      width: 100%;
    }
    .el-dialog__body{
      padding: 30px 30px 10px 30px;
    }
    .el-dialog__title{font-size: 14px;color: #333333}
    .el-form-item__content{color: #666666;}
    .el-form-item__label{color: #333333;padding-right: 30px}
    .el-form-item{margin-bottom: 10px}
  }
</style>
