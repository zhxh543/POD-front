<template>
  <div class="review">
    <template v-for="(item,index) in list">
      <div class="page_line" :style="'height:'+item.height+'px;'">
        <template v-for="(itm,idx) in item.list" v-if="itm.type !== ''">
          <div :class="'page_col col_'+itm.col">
            <div class="page_text" :class="'page_' + index">
              <template v-if="itm.type === 'chart'">
                <div v-if="itm.data !== 'none'" :id="'chart_' + index + '_' + idx" class="chart"
                     style="width:600px;height:500px;}"></div>
                <div v-if="itm.data === 'none'" class="page_area">该报表不存在或已删除！</div>
              </template>
              <template v-if="itm.type === 'table'">
                <el-table :data="itm.tableData.data" v-loading="loading" :header-row-class-name="'el_th'" stripe>
                  <template v-for="(item,index) in itm.tableData.keys">
                    <el-table-column :prop="item" :label="item"></el-table-column>
                  </template>
                </el-table>
              </template>
              <template v-if="itm.type === 'text'">
                <div class="page_area" v-html="itm.data"></div>
              </template>
              <template v-if="itm.type === 'image'">
                <div class="page_area text-center">
                  <div class="page_img"><img :src="itm.data" alt=""></div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  import '@/assets/report/css/review.css'
  import '@/assets/vue-html5-editor/css/style.css'

  export default {
    name: "review",
    data() {
      return {
        flexType: '',
        list: [],
        loading: false
      }
    },
    methods: {
      getSettings(id, time) {
        if (id && time) {
          this.$ajax.get(`/chartBook/${id}/${time}`).then(res => {
            if (res.status === 200)
              this.setMain(JSON.parse(res.data.settings));
            else
              this.$message.error(res.data.msg);
          });
        } else if (localStorage.getItem('settings'))
          this.setMain(JSON.parse(localStorage.getItem('settings')));
      },
      setMain(settings) {
        this.flexType = settings.flexType;
        this.list = settings.pageList;
        this.setChartsDiv();
      },
      setChartsDiv() {
        this.list.forEach((item, index) => {
          item.list.forEach((itm, idx) => {
            if (itm.type === 'chart' || itm.type === 'table') {
              this.$ajax.get('/chart/' + itm.data).then(res => {
                if (res.status === 200) {
                  let setting = JSON.parse(res.data.settings);
                  let chartType = setting.chartType;
                  if (chartType === 'table') {
                    itm.type = 'table';
                    itm.tableData = {
                      id: res.data.dataSetId,
                      data: [],
                      keys: []
                    };
                    this.getCollectList(index, idx);
                  } else {
                    itm.type = 'chart';
                    if (res.data) {
                      let option = '';
                      if (setting.chartType.split('-')[0] === 'pie')
                        option = setting.pieOption;
                      else
                        option = setting.option;
                      if (res.data.name)
                        option.title.text = res.data.name;
                      this.setCharts('chart_' + index + '_' + idx, option);
                    }
                  }
                }
              });
            }
          });
        });
      },
      getCollectList(index, idx) {
        this.loading = true;
        this.$ajax.get('/dataSet/' + this.list[index].list[idx].tableData.id + '/data').then(res => {
          if (res.status === 200) {
            this.loading = false;
            this.list[index].list[idx].tableData.data = res.data;
            for (let key in res.data[0]) {
              if (key !== 'id' && key !== '_id') {
                this.list[index].list[idx].tableData.keys.push(key);
              }
            }
          }
        });
      },
      setCharts(id, option) {
        this.$nextTick(() => {
          document.getElementById(id).style.width = $('#' + id).parent('.page_text').width() - 20 + 'px';
          document.getElementById(id).style.height = $('#' + id).parent('.page_text').height() - 30 + 'px';
          let chart = this.$echarts.init(document.getElementById(id));
          window.onresize = () => {
            document.getElementById(id).style.width = $('#' + id).parent('.page_text').width() - 20 + 'px';
            document.getElementById(id).style.height = $('#' + id).parent('.page_text').height() - 30 + 'px';
            chart.resize();
          };
          chart.setOption(option);
        });
      },
    },
    mounted() {
      $('body').css('background-color', '#fff');
      this.getSettings(this.$route.query.id, this.$route.query.v);
    }
  }
</script>
