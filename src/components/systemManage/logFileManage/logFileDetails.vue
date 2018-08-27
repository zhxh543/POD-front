<template>
  <div id="logFileDetails">
    <el-dialog
      title="日志详情"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
        <el-form label-width="80px" class="dialog-form">
          <el-form-item
            label="日期">
            <span v-if="activeName=='operate'">{{detail.requestTime|formatDateTime}}</span>
            <span v-else>{{detail.date|formatDateTime}}</span>
          </el-form-item>
          <el-form-item
            label="用户名" v-if="activeName=='operate'">
            {{detail.username}}
          </el-form-item>
          <el-form-item
            label="请求方式" v-if="activeName=='operate'">
            {{detail.requestMethod}}
          </el-form-item>
          <el-form-item
            label="请求地址" v-if="activeName=='operate'">
            {{detail.requestUri}}
          </el-form-item>
          <el-form-item
            label="请求参数" v-if="activeName=='operate'">
            {{detail.requestParams}}
          </el-form-item>
          <el-form-item
            label="级别" v-if="activeName=='exception'">
            {{detail.level}}
          </el-form-item>
          <el-form-item
            label="内容" v-if="activeName=='exception'">
            {{detail.message}}
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "logFileDetails",
    props: ["activeName"],
    data() {
      return {
        dialogVisible: false,
        detail :""
      };
    },
    filters: {
      formatDateTime(d) {
        let date = new Date(d);;
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D;
      }
    },
    methods: {
      showModel (row){
          this.dialogVisible = true;
          this.detail = row
      },
      handleClose(done) {
        this.dialogVisible = false

      }
    }
  };
</script>
<style  lang="less" >
  #logFileDetails{
    .el-dialog__header {
      border-bottom: 1px solid #eeeeee;
       .el-dialog__title {
        font-size: 14px;
        color: #333333;
      }
    }
  }

</style>
