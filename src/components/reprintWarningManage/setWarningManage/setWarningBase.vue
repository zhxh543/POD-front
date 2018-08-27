<template>
  <div id="reprintWarningBase">
    <div class="handle-block">
      <el-upload
        class="upload-demo fl"
        action="api/warning/basic/upload"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :show-file-list="false"
        multiple>
        <el-button type="primary">导入</el-button>
      </el-upload>
      <a :href="downloadUrl+'/importTemplate/WarningBasic.xlsx'" download class="el-button  el-button--primary ">下载模板</a>
    </div>
    <template>
      <el-table
        :data="tableData"
        stripe
        :v-loading="loading"
        style="width: 100%">
        <el-table-column
          fixed
          prop="code"
          width="250"
          label="预警分析字段值" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="预警分析字段说明" show-overflow-tooltip>

          <template slot-scope="scope">
            <span v-if="scope.row.memo"> {{scope.row.memo}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="left"
          width="180">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini"  @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="deleteData(scope.$index, tableData,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="page-block" >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"  :page-size="pageSize" v-if="total>pageSize"   @current-change="handleSizeChange">
      </el-pagination>
    </div>
    <p class="rds-remark" v-html="warningBaseDesc"></p>
    <el-dialog
      :title="'编辑'"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      width="540px"
      :before-close="handleClose">
      <el-form label-width="90px" class="examine-form" :model="baseForm" :rules="rules" ref="baseForm">
        <el-form-item label="字段值" prop="code">
          <el-input  v-model="baseForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label=" 字段说明"  prop="memo" >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入字段说明"
            v-model="baseForm.memo">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose" size="mini">取 消</el-button>
    <el-button type="primary" @click="submitForm('baseForm')" size="mini">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: "reprintWarningBase",
    data (){
      return {
        dialogVisible : false,//编辑
        tableData: [],//data
        page : 1,//当前页数
        pageSize : 10,//一次显示几条
        total : 0,//总条数
        loading :false,
        //编辑
        editId : "",//编辑id
        rules: {
          memo: [
            {required: true, message: '请输入字段说明', trigger: 'blur'},
            {min: 1, max: 201, message: '长度在 1 到 200 个字符', trigger: 'blur'}
          ],
        },
        baseForm:{
          "code" : "",
          "memo" : ""
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods : {
      //导入
      handleAvatarSuccess(res, file) {
        if(res.code===200){
          this.$message({
            message: "操作成功",
            type: 'success'
          });
          this.getData()
        }else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      },
      handleAvatarError (err, file, fileList) {
        var obj = JSON.parse(err.message);
        this.$message({
          message:obj.msg,
          type: 'error'
        });
      },
      // 获取状态列表
      getData () {
        let url = "/warning/basic"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
          "type" :this.activeName
        }
        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){
            this.tableData = res.data.records
            this.total = res.data.total
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      //分页
      handleSizeChange(val) {
        this.page = val
        this.getData()
      },
      // 删除
      deleteData (index,rows,data){
        let url = "/warning/basic/"+data.id

        this.$confirm('确认删除吗？',{
          lockScroll :false,
          type: 'warning'})
          .then(_ => {
            this.$ajax.delete(url,{}).then(res => {
              if(res.status === 200){
                if(res.data.code === 200){
                  if (index !== -1) {
                    rows.splice(index, 1)
                  }
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
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          })
          .catch(_ => {});



      },
      handleEdit (row){
        this.dialogVisible = true
        this.editId = row.id
        this.baseForm = {
          "id" : row.id,
          "code" : row.code,
          "memo" : row.memo
        }
      },
      //编辑－保存
      submitForm(formName) {
        let url = "/warning/basic/"+this.editId
        let param = this.baseForm
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.put(url,param).then(res => {
              if(res.status === 200){
                this.dialogVisible = false
                this.editId = ""
                this.baseForm = {}
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.getData()
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
      handleClick(row) {
        // console.log(row);
      },
      handleClose(done) {
        this.dialogVisible = false
      }
      },
  }

</script>

<style  lang="less" >
#reprintWarningBase{
  .upload-demo{margin-right: 15px}
  .handle-block{

    .el-down{padding: 9px 15px;font-size: 12px;}
  }
    .el-dialog__header{
      border-bottom: 1px solid #eeeeee;
         .el-dialog__title{font-size: 14px;color: #333333;}
     }
}
</style>
