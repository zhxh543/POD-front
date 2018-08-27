<template>
  <div class="el_box">
    <el-row>
      <el-col :span="16">
        <el-steps :active="active" finish-status="success">
          <el-step title="已完成"></el-step>
          <el-step title="进行中"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row class="el_row">
      <el-col :span="24"><span class="data_title">数据源文件</span></el-col>
      <el-col :span="8">
        <el-upload ref="upload" class="upload_box"
                   action="/api/dataSet/upload"
                   :on-change="beforeUpload"
                   :on-success="uploadSuccess"
                   :on-error="uploadError"
                   :multiple="false"
                   :show-file-list="false">
          <el-input placeholder="选择上传文件" disabled v-model="fileName">
            <el-button type="primary" slot="append" plain>浏览</el-button>
          </el-input>
        </el-upload>
      </el-col>
      <!--<el-col :span="24">-->
      <!--<el-button type="primary" plain @click="submitUpload">确定</el-button>-->
      <!--</el-col>-->
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" :disabled="!info.collectionName" @click="next">下一步</el-button>
      </el-col>
    </el-row>
    <div class="data_preview">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :disabled="!info.collectionName" @click="dataReview(1)">数据预览</el-button>
          <!--<el-button type="primary">筛选</el-button>-->
        </el-col>
      </el-row>
      <el-row>
        <template v-if="keys.length > 0">
          <el-col :span="24">
            <el-table :data="tableData" v-loading="loading" :header-row-class-name="'el_th'" stripe>
              <template v-for="(item,index) in keys">
                <el-table-column :prop="item" :label="item" v-if="item!=='_id'&&item!=='id'"></el-table-column>
              </template>
            </el-table>
          </el-col>
          <el-col class="text-center" style="margin-top: 20px;">
            <el-pagination
              layout="prev, pager, next"
              :page-size="page.size"
              :current-page="page.page"
              :total="page.total"
              @current-change="dataReview"
            ></el-pagination>
          </el-col>
        </template>
        <el-col v-if="keys.length === 0">
          <p class="list_tip">暂无数据预览!</p>
        </el-col>
      </el-row>
    </div>
    <br/>
    <p class="rds-remark" v-html="'1、数据区域中不要有空行空列<br/>2、标题不能包括特殊符号<br/>'"></p>
  </div>
</template>

<script>
  import '@/assets/report/css/style.css'

  export default {
    name: "step2",
    props: ['collect', 'type'],
    data() {
      return {
        active: 1,
        accept: '',
        tableData: [],
        fileName: '',
        keys: [],
        info: this.collect,
        page: {
          page: 1,
          size: 10,
          total: 0
        },
        loading: false
      }
    },
    methods: {
      beforeUpload(file, fileList) {
        const isLt1M = file.size / 1024 / 1024 <= 1;
        if (this.type === 'excel' && (file.name.indexOf('.xls') > -1 || file.name.indexOf('.xlsx') > -1)) {
          this.fileName = file.name;
        } else if (this.type === 'csv' && file.name.indexOf('.csv') > -1) {
          this.fileName = file.name;
        } else {
          this.$message.warning('文件类型错误，请上传正确文件类型！');
          this.$refs['upload'].abort(file);
          this.$refs['upload'].clearFiles();
          this.fileName = '';
        }
        if (!isLt1M && this.fileName) {
          this.$message.error('文件大小不能超过 1MB!');
        }
        return isLt1M && this.fileName;
      },
      next() {
        this.$emit('nextStep', 'cEnd');
      },
      dataReview(page) {
        this.page.page = page - 1;
        this.loading = true;
        this.$emit('changeMask',true);
        this.$ajax.get('/dataSet/collection/' + this.collect.collectionName, this.page).then((res) => {
          this.loading = false;
          this.$emit('changeMask',false);
          if (res.status === 200) {
            this.page.total = res.data.totalElements;
            this.page.page = page;
            this.tableData = res.data.content;
            this.keys = [];
            for (let key in res.data.content[0]) {
              this.keys.push(key);
            }
          } else
            this.$message.error(res.data.msg);
        });
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 200) {
          this.info.collectionName = res.msg;
          if (!this.info.dataSourceId)
            delete this.info.dataSourceId;
          if (!this.info.statement)
            delete this.info.statement;
          this.$emit('changeCollectInfo', this.info);
        }
      },
      uploadError(err, file, fileList) {
        let error = err + '';
        error = JSON.parse(error.split('Error:')[1]);
        this.$message.error(error.msg);
      }
    }
  }
</script>
<style scoped>
  .list_tip {
    color: #c0c4cc;
    font-size: 14px;
    padding: 20px 0 0 10px;
    border-top: 1px solid #e4e7ed;
  }
</style>
