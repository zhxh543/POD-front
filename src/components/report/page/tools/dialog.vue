<template>
  <div class="report_dialog">
    <el-dialog
      title="报表选择"
      :visible.sync="modal"
      width="1050px"
      center
      :before-close="handleClose"
    >
      <el-row>
        <div class="left">
          <el-table :data="list.data" :header-row-class-name="'el_th'" stripe>
            <el-table-column prop="name" label="报表名称"></el-table-column>
            <el-table-column prop="createdTime" label="创建时间">
              <template slot-scope="data">
                {{data.row.createdTime | formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" width="150">
              <template slot-scope="data">
                <el-button size="mini" type="info" plain @click="review(data.row)">预览</el-button>
                <el-button size="mini" type="info" plain @click="selectCollect(data.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row v-if="list.data.length > 0">
            <el-col :span="24" class="text-center">
              <el-pagination
                layout="prev, pager, next"
                :current-page="list.page.current"
                :page-size="list.page.size"
                :total="list.page.total"
                @current-change="getList"
              ></el-pagination>
            </el-col>
          </el-row>
        </div>
        <div class="right">
          <template v-if="!chart && collect.data.length === 0">
            <p class="tip">点击左侧列表进行数据预览！</p>
          </template>
          <template v-if="chartFlag">
            <div id="chart" style="width:600px;height:500px;}"></div>
          </template>
          <template v-if="!chartFlag && collect.data.length > 0">
            <p class="table_name" v-html="tableName"></p>
            <el-table :data="collect.data" v-loading="loading" :header-row-class-name="'el_th'" stripe>
              <template v-for="(item,index) in keys">
                <el-table-column :prop="item" :label="item"></el-table-column>
              </template>
            </el-table>
            <el-row>
              <el-col :span="24" class="text-center">
                <el-pagination
                  layout="prev, pager, next"
                  :current-page="collect.page.current"
                  :page-size="collect.page.size"
                  :total="collect.page.total"
                  @current-change="getCollectList"
                ></el-pagination>
              </el-col>
            </el-row>
          </template>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'vDialog',
    props: ['modal'],
    data() {
      return {
        tableName: '',
        list: {
          page: {
            current: 1,
            size: 7,
            total: 0
          },
          data: []
        },
        chart: null,
        collect: {
          collectionName: '',
          page: {
            current: 1,
            size: 8,
            total: 0
          },
          data: []
        },
        chartFlag: false,
        keys: [],
        loading: false
      };
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
    mounted() {
      this.reset();
      this.getList(1);
    },
    methods: {
      selectCollect(data) {
        this.$emit('selectCollect', data);
        this.handleClose();
      },
      review(row) {
        let setting = JSON.parse(row.settings);
        if (setting.chartType.split('-')[0] === 'pie') {
          this.chartFlag = true;
          setting.pieOption.title.text = row.name;
          this.tableName = '';
          this.setCharts(setting.pieOption);
        } else if (setting.chartType.split('-')[0] === 'table')
          this.$ajax.get('/dataSet/' + row.dataSetId).then(res => {
            if (res.status === 200) {
              this.tableName = row.name;
              this.chartFlag = false;
              this.chart = null;
              this.collect.collectionName = res.data.collectionName;
              this.getCollectList(1);
            }
          });
        else {
          this.chartFlag = true;
          setting.option.title.text = row.name;
          this.tableName = '';
          this.setCharts(setting.option);
        }
      },
      getCollectList(page) {
        this.collect.page.current = page;
        this.loading = true;
        this.$ajax.get('/dataSet/collection/' + this.collect.collectionName, this.collect.page).then(res => {
          if (res.status === 200) {
            this.loading = false;
            this.collect.page.total = res.data.totalElements;
            this.collect.data = res.data.content;
            this.keys = [];
            for (let key in res.data.content[0]) {
              if (key !== 'id' && key !== '_id') {
                this.keys.push(key);
              }
            }
          }
        });
      },
      getList(page) {
        this.list.page.current = page;
        this.$ajax.get('/chart', {
          current: page,
          size: this.list.page.size,
          descs: 'createdTime'
        }).then(res => {
          if (res.status === 200) {
            this.list.page.total = res.data.total;
            this.list.data = res.data.records;
          }
        });
      },
      setCharts(option) {
        if (option) {
          this.$nextTick(() => {
            if (this.chart)
              this.chart.setOption(option, true);
            else
              this.chart = this.$echarts.init(document.getElementById('chart'));
            this.chart.setOption(option);
          });
        }
      },
      handleClose() {
        this.$emit('dialogClose', false);
      },
      reset() {
        this.list = {
          page: {
            current: 1,
            size: 7,
            total: 0
          },
          data: []
        };
        this.chart = null
      }
    }
  };
</script>
<style scoped lang="less" type="text/less">
  .left {
    height: 500px;
    width: 400px;
    float: left;
    overflow-y: auto;
  }

  .right {
    height: 500px;
    float: left;
    width: 600px;
    border: 1px solid #cccccc;
    overflow-y: auto;
  }

  .tip {
    padding: 10px 20px;
  }

  .table_name {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    padding: 0 5px 10px;
  }
</style>
