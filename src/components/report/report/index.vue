<template>
  <div class="el_content">
    <div class="el_top_title">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList"/>
    </div>
    <div class="el_body">
      <component
        :is="current"
        :chartObj="chartObj"
        :chartList="chartList"
        :listLoading="listLoading"
        :updateLoading="updateLoading"
        :chartPage="chartPage"

        @nextStep="next"
        @getChartList="getChartList"
        @selectCollect="selectCollect"
        @edit="edit"
        @deleteCollect="deleteCollect"
        @updateView="updateView"
      ></component>
    </div>
  </div>
</template>
<script>
  import vIndex from '@/components/report/report/page.vue'
  import vReport from '@/components/report/report/report.vue'

  export default {
    name: 'index',
    data() {
      return {
        crumbsList: [   //  面包屑
          {name: '报表管理', url: {routerName: 'report', params: {name: 'setting', page: 'vIndex'}}},
        ],
        current: 'vIndex',
        chartList: [],
        chartPage: {
          current: 1,
          size: 10,
          total: 0
        },
        listLoading: false,
        updateLoading: false,
        chartObj: {
          id: '',
          name: '',
          dataSetId: '',
          settings: ''
        }
      }
    },
    components: {
      vIndex,
      vReport
    },
    watch: {
      '$route'(to, f) {
        if (to.query.page !== f.query.page) {
          this.current = to.query.page;
        }
      },
      current(val, olVal) {
        if (val !== olVal) {
          this.$router.push({name: 'report', query: {name: 'setting', page: this.current}});
        }
        switch (val) {
          case 'vIndex':
            this.crumbsList = [
              {name: '报表管理', url: {routerName: 'report', params: {name: 'setting', page: 'vIndex'}}}
            ];
            this.getChartList(1);
            break;
          case 'vReport':
            this.crumbsList = [
              {name: '报表管理', url: {routerName: 'report', params: {name: 'setting', page: 'vIndex'}}},
              {name: '配置报表', url: ''}
            ];
            break;
        }
      }
    },
    methods: {
      routeWatch() {
        let name = '', params = JSON.parse(JSON.stringify(this.$route.query));
        if (this.$route.query.page) {
          name = this.$route.query.page;
        } else {
          name = this.current;
          params.name = 'setting';
          params.page = this.current;
        }
        this.current = name;
        this.$router.push({name: 'report', query: params});
      },
      reset() {
        this.chartObj = {
          id: '',
          name: '',
          dataSetId: '',
          settings: ''
        };
      },
      next(param) {
        if (param.indexOf('index') >= 0) {
          this.current = 'vIndex';
        } else if (param.indexOf('report') >= 0) {
          this.current = 'vReport';
          this.reset();
        }
      },
      getChartList(page) {
        this.chartPage.current = page;
        this.listLoading = true;
        this.$ajax.get('chart', {
          current: page,
          size: this.chartPage.size,
          descs: 'createdTime'
        }).then(res => {
          this.listLoading = false;
          if (res.status === 200) {
            this.chartPage.total = res.data.total;
            this.chartList = res.data.records;
          }
        });
      },
      selectCollect(id) {
        this.chartObj.dataSetId = id;
      },
      edit(settings) {
        let method = 'post', url = '/chart';
        if (this.chartObj.id) {
          url = '/chart/' + this.chartObj.id;
          method = 'put';
        } else
          delete this.chartObj.id;
        this.chartObj.settings = JSON.stringify(settings);
        this.updateLoading = true;
        this.$ajax.update(url, this.chartObj, method).then(res => {
          this.updateLoading = false;
          if (res.status === 200) {
            this.$message.success(res.data.msg);
            this.modal = false;
            this.current = 'vIndex';
          } else
            this.$message.error(res.data.msg);
        });
      },
      deleteCollect(id) {
        if (id) {
          this.$confirm('此操作将永久删除该报表信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete('/chart/' + id).then(res => {
              if (res.status === 200) {
                this.$message.success(res.data.msg);
                this.getChartList(1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
          }).catch(() => {
            return false;
          });
        }
      },
      updateView(id) {
        if (id) {
          this.$ajax.get('/chart/' + id).then(res => {
            if (res.status === 200) {
              this.chartObj = {
                name: res.data.name,
                id: res.data.id,
                dataSetId: res.data.dataSetId,
                settings: res.data.settings
              };
              this.current = 'vReport';
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      }
    },
    mounted() {
      this.routeWatch();
      this.getChartList(1);
    }
  }
</script>
