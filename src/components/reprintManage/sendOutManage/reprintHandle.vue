<template>
  <div id="reprintHandle">
    <el-dialog
      title="处理"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose">
      <el-form label-width="130px" class="dialog-form" :rules="rulesHandle" :model="handleForm" ref="handleForm">
        <el-form-item
          label="重印工厂" prop="reprintFtyId">
          <template>
            <el-select v-model="handleForm.reprintFtyId" placeholder="请选择">
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <div  style="width: 100%" @click="handleForm.reprintFactory=item.name">{{item.name}}</div>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="inboundTime"
          label="预计入库时间">
          <div id="changeTime">
          <el-date-picker
            v-model="inboundTime"
            type="date"
            @focus= "changeData(inboundTime)"
            @change="changeData(inboundTime)"
            value-format="timestamp"
            placeholder="选择日期">
            <!--value-format="timestamp"-->
          </el-date-picker>
          </div>
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
    name: "reprintHandle",
    data() {
      return {
        msg: "处理",
        dialogVisible: false,
        loading : false,
        test  : "",
        factoryList: [],
        type : "",//请求工厂的类型
        inboundTime: "",
        rulesHandle : {
          reprintFtyId: [
            { required: true, message: '请选择重印工厂', trigger: 'blur' },
          ],
          inboundTime: [
            { required: true, message: '请选择预计入库时间', trigger: 'blur' },
          ],
        },
        isTure : true,//兼容ie 在第一次操作时把标记改成false,如果isTure是false就用dom给input val赋值，
        handleForm :{
          id : "",
          reprintFtyId : "",
          reprintFactory: "",
          inboundTime : ""
        },
      };
    },
    mounted() {
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
      // 获取列表
      getFactoryData () {
        let url = "/factory"
        let param = {}
        if(this.type=="POD"){
          param.pod = true
        }else {
          param.tradition = true
        }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            this.factoryList = res.data
            // this.handleForm.reprintFtyId = res.data[0].id
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      showModel (row){
        let _self = this

        this.dialogVisible = true;

        if(row){
          this.handleForm.id = row.id
          if(row.reprintFtyId){
            this.handleForm.reprintFtyId = row.reprintFtyId
            this.handleForm.reprintFactory = row.reprintFactory
          }
          if(row.inboundTime){//如果有预计入库时间就显示，没有就显示后台给的
              this.changeTimeData(row.inboundTime)
          }else {
              this.changeTimeData(row.receiveSuggestTime)
          }

          this.$forceUpdate()
          this.type = row.reprintAuditType.toUpperCase()
          this.getFactoryData();

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
            $('#reprintHandle .el-input--prefix .el-input__inner').val(_self.formatDateTime(time));
            // _self.inboundTime = time
            // _self.handleForm.inboundTime = time
          }
        }

      },
      submitForm(formName) {
        let url = "/order/"+this.handleForm.id
        let param = this.handleForm
            param.handle = "处理"
          this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.put(url,param).then(res => {
              if(res.status === 200){
                this.$message({
                  message: "操作成功！",
                  type: 'success'
                });
                this.loading = false
                this.handleForm = {}
                this.inboundTime = ""
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
  #reprintHandle{
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
    /*.el-form-item{margin-bottom: 10px}*/
  }
  .el-select-dropdown__item{
    padding-left: 10px!important;
    div{
      width: 100%;
      display: block;
      padding: 0 20px!important;
    }
  }
</style>
