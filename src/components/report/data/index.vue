<template>
  <div class="el_content"
       v-loading="sLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div class="el_top_title">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList"/>
    </div>
    <div class="el_body">
      <component
        :is="current"
        :type="dataType"
        :collectList='collectList'
        :cPage="page"
        :database="source"
        :sourceList="sourceList"
        :testLoading="testLoading"
        :collect="collect"
        :uploadTool="uploadTool"
        :tableLoading="tableLoading"

        @nextStep="next"
        @selectSource="select"
        @editSource="updateSource"
        @deleteSource="deleteSource"
        @testSource="testSource"
        @selCSource="selCSource"
        @getUpload="getUpload"
        @changeCollectInfo="changeCollectInfo"
        @getCollectList="getCollectList"
        @deleteCollect="deleteCollect"
        @updateCollect="updateCollect"
        @changeMask="changeMask"
      ></component>
    </div>
  </div>
</template>
<script>
  import vIndex from '@/components/report/data/tools/index.vue'
  import vCollectStep1 from '@/components/report/data/tools/collect/step1.vue'
  import vCollectStep2 from '@/components/report/data/tools/collect/step2.vue'
  import vCollectStep3 from '@/components/report/data/tools/collect/step3.vue'
  import cEnd from '@/components/report/data/tools/collect/end.vue'
  import vSourceStep1 from '@/components/report/data/tools/source/step1.vue'
  import vSourceStep2 from '@/components/report/data/tools/source/step2.vue'
  import sEnd from '@/components/report/data/tools/source/end.vue'

  export default {
    name: 'index',
    data() {
      return {
        sLoading: false,
        crumbsList: [   //  面包屑
          {name: '数据管理', url: {routerName: 'report', params: {name: 'index', page: 'vIndex'}}},
        ],
        tableLoading: false,
        editLoading: false,
        current: 'vIndex',
        dataType: 0,
        testLoading: false,
        collectList: [],
        page: {
          page: 1,
          size: 10,
          total: 0
        },
        collect: {
          name: '',
          id: '',
          dataSourceId: '',
          statement: '',
          collectionName: ''
        },
        uploadTool: '',
        source: {
          id: '',
          name: '',
          dbType: '',
          host: '',
          port: 0,
          user: '',
          pwd: '',
          dbName: '',
          oracleType: ''
        },
        sourceList: []
      }
    },
    components: {
      vIndex,
      vCollectStep1,
      vCollectStep2,
      vCollectStep3,
      cEnd,
      vSourceStep1,
      vSourceStep2,
      sEnd
    },
    watch: {
      '$route'(to, f) {
        if (to.query.page !== f.query.page) {
          this.current = to.query.page;
        }
      },
      current(val, olVal) {
        if (val !== olVal) {
          this.$router.push({name: 'report', query: {name: 'index', page: this.current}});
        }
        switch (val) {
          case 'vIndex':
            this.crumbsList = [
              {name: '数据管理', url: {routerName: 'report', params: {name: 'index', page: 'vIndex'}}}
            ];
            this.reset();
            break;
          case 'vCollectStep1':
            this.crumbsList = [
              {name: '数据管理', url: {routerName: 'report', params: {name: 'index', page: 'vIndex'}}},
              {name: '配置数据集', url: ''}
            ];
            break;
          case 'vSourceStep1':
            this.crumbsList = [
              {name: '数据管理', url: {routerName: 'report', params: {name: 'index', page: 'vIndex'}}},
              {name: '配置数据源', url: ''}
            ];
            break;
        }
      }
    },
    methods: {
      changeMask(flag){
        this.sLoading = flag;
      },
      routeWatch() {
        let name = '', params = JSON.parse(JSON.stringify(this.$route.query));
        if (this.$route.query.page) {
          name = this.$route.query.page;
        } else {
          name = this.current;
          params.name = 'index';
          params.page = this.current;
        }
        if (name === 'vCollectStep1' || name === 'vCollectStep2' || name === 'vCollectStep3' || name === 'cEnd')
          name = 'vIndex';
        if (name === 'vSourceStep2' || name === 'sEnd')
          name = 'vSourceStep1';
        this.current = name;
        this.$router.push({name: 'report', query: params});
      },
      next(param) {
        if (param === 'sEdit') {
          this.editSource();
        }
        if (param === 'cEdit') {
          this.editCollect();
        } else if (param.indexOf('index') >= 0) {
          this.current = 'vIndex';
        } else if (param.indexOf('cEnd') >= 0) {
          this.current = 'cEnd';
        } else if (param.indexOf('sEnd') >= 0) {
          this.current = 'sEnd';
        } else if (param.indexOf('c') >= 0) {
          this.current = 'vCollectStep' + param.split('c')[1];
        } else if (param.indexOf('s') >= 0) {
          this.current = 'vSourceStep' + param.split('s')[1];
        }
      },
      select(index) {
        this.dataType = index;
        this.source.dbType = index;
        this.collect.dataSourceId = '';
        if (index === 'Oracle')
          this.source.oracleType = 'SID';
      },
      selCSource(data) {
        this.dataType = data.dbType;
        this.collect.dataSourceId = data.id;
      },
      getUpload(obj) {
        this.uploadTool = obj;
      },
      reset() {
        this.source = {
          id: '',
          name: '',
          dbType: '',
          host: '',
          port: 0,
          user: '',
          pwd: '',
          dbName: '',
          oracleType: ''
        };
        this.current = 'vIndex';
        this.dataType = 0;
        this.testLoading = false;
        this.collectList = [];
        this.collect = {
          name: '',
          id: '',
          dataSourceId: '',
          statement: '',
          collectionName: ''
        };
        this.uploadTool = '';
        this.source = {
          id: '',
          name: '',
          dbType: '',
          host: '',
          port: 0,
          user: '',
          pwd: '',
          dbName: '',
          oracleType: ''
        };
        this.page = {
          current: 1,
          size: 10,
          total: 0
        };
        this.sourceList = [];
        this.getList();
      },
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
      getList() {
        this.getCollectList(1);
        this.$ajax.get('/dataSource', {}).then(res => {
          if (res.status === 200)
            this.sourceList = res.data;
        });
      },
      testSource() {
        this.testLoading = true;
        if(!this.source.oracleType) {
          delete this.source.oracleType
        }
        this.$ajax.post('/dataSource/test', this.source).then((res) => {
          if (res.status === 200)
            this.$message.success(res.data.msg);
          else
            this.$message.error(res.data.msg);
          this.testLoading = false;
        });
      },
      updateSource(data) {
        this.source = data;
        this.dataType = data.dbType;
        this.current = 'vSourceStep2';
      },
      editSource() {
        if (this.source.oracleType === '')
          delete this.source.oracleType;
        if (this.source.id === '')
          delete this.source.id;
        if (this.source.id) {
          this.$ajax.put('/dataSource/' + this.source.id, this.source).then(res => {
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.reset();
            }
            else
              this.$message.error(res.data.msg);
          });
        } else
          this.$ajax.post('/dataSource', this.source).then(res => {
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.reset();
            }
            else
              this.$message.error(res.data.msg);
          });
      },
      deleteSource(data) {
        if (data) {
          this.$confirm('此操作将永久删除该数据源, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete('/dataSource/' + data.id).then(res => {
              if (res.status === 200) {
                this.$message.success(res.data.msg);
                this.reset();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          });
        }
      },
      changeCollectInfo(data) {
        this.collect = data;
      },
      editCollect() {
        this.editLoading = true;
        this.sLoading = true;
        if (this.collect.collectionName && !this.collect.dataSourceId) {
          this.$ajax.post('/dataSet', this.collect, {'Content-Type': 'application/x-www-form-urlencoded'}).then(res => {
            this.editLoading = false;
            this.sLoading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.reset();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else if (this.collect.id && this.collect.dataSourceId) {
          this.$ajax.put(`/dataSet/${this.collect.id}`, this.collect).then(res => {
            this.editLoading = false;
            this.sLoading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.reset();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$ajax.post('/dataSet', this.collect).then(res => {
            this.editLoading = false;
            this.sLoading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.reset();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      },
      deleteCollect(data) {
        if (data) {
          this.$confirm('此操作将永久删除该数据集, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete('/dataSet/' + data.id).then(res => {
              if (res.status === 200) {
                this.$message.success(res.data.msg);
                this.reset();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          });
        }
      },
      updateCollect(data) {
        this.collect = data;
        if (data.dataSourceId)
          this.current = 'vCollectStep3';
        else
          this.current = 'vCollectStep2';
        this.crumbsList = [
          {name: '数据管理', url: {routerName: 'report', params: {name: 'index', page: 'vIndex'}}},
          {name: '配置数据集', url: ''}
        ];
      }
    },
    mounted() {
      this.routeWatch();
      this.getList();
    }
  }
</script>
