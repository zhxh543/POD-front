<template>
  <div class="el_box">
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="next('main')">新建页面</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="mainList.data" :header-row-class-name="'el_th'" stripe>
          <el-table-column prop="name" label="页面名称"></el-table-column>
          <el-table-column prop="createdTime" label="创建时间">
            <template slot-scope="data">
              {{data.row.createdTime | formatDateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="open" label="发布状态">
            <template slot-scope="data">
              {{data.row.open | formatPublish}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="450">
            <template slot-scope="data">
              <el-button size="mini" plain @click="review(data.row)">预览</el-button>
              <el-button size="mini" type="primary" plain @click="editMain(data.row)">编辑</el-button>
              <el-button size="mini" type="danger" plain @click="deletePage(data.row)">删除</el-button>
              <el-button size="mini" type="success" plain @click="editPublish(data.row)">发布状态</el-button>
              <el-button size="mini" plain @click="urlAddress(data.row)">查看地址</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="mainList.data.length > 0">
      <el-col :span="24" class="text-center">
        <el-pagination
          layout="prev, pager, next"
          :current-page="mainList.page.current"
          :page-size="mainList.page.size"
          :total="mainList.page.total"
          @current-change="getMainList"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      title="更改发布状态"
      :visible.sync="modal"
      width="800px"
      center
      :before-close="close"
    >
      <el-row :gutter="15">
        <el-col :span="4" class="tool_name">页面名称：</el-col>
        <el-col :span="20" style="line-height:40px;">
          <p v-html="row.name"></p>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="4" class="tool_name">发布状态：</el-col>
        <el-col :span="20">
          <el-row :gutter="20" class="el_row_default">
            <el-col :span="6">
              <el-radio v-model="row.open" label="-1">不发布</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio v-model="row.open" label="0">站内发布</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio v-model="row.open" label="1">公开发布</el-radio>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top: 20px;">
        <el-col :span="3" :offset="18" class="text-right">
          <el-button @click="close">取消</el-button>
        </el-col>
        <el-col :span="3" class="text-right">
          <el-button type="primary" :loading="loading" @click="updatePublish">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['mainList'],
    data() {
      return {
        modal: false,
        row: '',
        loading: false,
        url: this.$ajax.getUrl() + '/#/reportView?code='
      }
    },
    filters: {
      formatDateTime(d) {
        let date = new Date(d);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return Y + M + D;
      },
      formatPublish(val) {
        let text = '未发布';
        if (val === 0)
          text = '站内发布';
        if (val === 1)
          text = '公开发布';
        return text;
      }
    },
    methods: {
      next(param) {
        this.$emit('nextStep', param);
      },
      getMainList(page) {
        this.$emit('getMainList', page);
      },
      deletePage(data) {
        this.$emit('deletePage', data);
      },
      editMain(data) {
        this.$emit('editMain', data);
      },
      review(data) {
        this.$emit('review', data);
      },
      editPublish(data) {
        this.row = {
          id: data.id,
          name: data.name,
          open: data.open + ''
        };
        this.modal = true;
      },
      urlAddress(data) {
        let text = '页面发布后生成页面地址，请调整发布状态！';
        console.log(data.code);
        if (data.code)
          text = `页面地址为：${this.url}${data.code}`;
        this.$alert(text, '页面地址', {
          confirmButtonText: '关闭',
          callback: action => {
            return false;
          }
        });
      },
      updatePublish() {
        let open = parseInt(this.row.open);
        let text = "未发布";
        if (open === 0)
          text = '站内发布';
        if (open === 1)
          text = '公开发布';
        this.loading = true;
        if (this.row.id) {
          this.$confirm(`您确定修改页面:<span style="color:red;">${this.row.name}</span>的发布状态为:<span style="color:red;">${text}</span>吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.$ajax.put(`/chartBook/${this.row.id}/${open}`).then(res => {
              this.loading = false;
              if (res.data.code === 200) {
                this.close();
                this.$message.success(res.data.msg);
                this.getMainList(1);
              } else
                this.$message.error(res.data.msg);
            });
          }).catch(() => {
            this.loading = false;
            return false;
          });
        }
      },
      close() {
        this.modal = false;
        this.row = '';
      }
    }
  }
</script>
