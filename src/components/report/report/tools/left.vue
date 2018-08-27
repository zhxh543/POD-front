<template>
  <div class="el_box">
    <div class="el_name">选择数据集</div>
    <el-row class="collect_box">
      <el-col :span="8">
        <el-button @click="modal = true">选择数据集</el-button>
      </el-col>
      <el-col :span="16">
        <el-input type="text" disabled v-model="collect.name"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <div class="el_name">数据预览</div>
    </el-row>
    <el-row class="cl_table">
      <div :style="'overflow: auto;height:' + (height - 170) +'px'">
        <template v-if="keys.length > 0">
          <el-table :data="table" :header-row-class-name="'el_th'" stripe>
            <template v-for="(item,index) in keys">
              <el-table-column :prop="item" :label="item"></el-table-column>
            </template>
          </el-table>

          <el-row class="text-center">
            <el-pagination layout="prev, next"
                           :current-page="cPage.page"
                           :page-size="cPage.size"
                           :total="cPage.total"
                           @current-change="getTableData"
            ></el-pagination>
          </el-row>
        </template>
        <template v-else>
          <p class="tip-p">请选择数据集后进行数据预览！</p>
        </template>
      </div>
    </el-row>

    <el-dialog
      title="选择数据集"
      :visible.sync="modal"
      width="800px"
      center
      :before-close="handleClose"
    >
      <el-table :data="collectList" v-loading="tableLoading" :header-row-class-name="'el_th'" border>
        <el-table-column prop="name" label="数据集名称"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间">
          <template slot-scope="data">
            {{data.row.createdTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="id" :class-name="'text-center'" label="操作" width="100">
          <template slot-scope="data">
            <el-button size="mini" type="primary" plain @click="selCollect(data.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="collectList.length > 0">
        <el-col :span="24" class="text-center">
          <el-pagination layout="prev, pager, next"
                         :current-page="page.current"
                         :page-size="page.size"
                         :total="page.total"
                         @current-change="getCollectList"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "left",
    props: ['collect', 'table', 'keys', 'cPage'],
    data() {
      return {
        height: document.body.clientHeight - 205,
        modal: false,
        tableLoading: false,
        tableData: [],
        collectList: [],
        page: {
          current: 1,
          size: 5,
          total: 0
        }
      }
    },
    watch: {
      modal(val, olVal) {
        if (val)
          this.getCollectList(1);
        else {
          this.collectList = [];
          this.page.current = 1;
        }
      }
    },
    filters: {
      formatDateTime(d) {
        let date = new Date(d);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        return Y + M + D;
      }
    },
    methods: {
      getCollectList(page) {
        this.page.current = page;
        this.tableLoading = true;
        this.$ajax.get('/dataSet', {
          current: page,
          size: this.page.size,
          descs: 'createdTime'
        }).then(res => {
          this.tableLoading = false;
          if (res.status === 200) {
            this.page.total = res.data.total;
            this.collectList = res.data.records;
          }
        });
      },
      getTableData(page) {
        this.$emit('getCollectPageData', page);
      },
      selCollect(data) {
        this.collectName = data.name;
        this.$emit('selectCollect', data, true);
        this.modal = false;
      },
      handleClose() {
        this.modal = false;
      }
    }
  }
</script>
<style scoped>
  .collect_box button {
    width: 90%;
    line-height: 38px;
    padding: 0;
    height: 40px;
  }
</style>
