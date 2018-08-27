<template>
  <div class="page_left">
    <template v-for="(item,index) in list">
      <div class="page_line" :style="'height:'+item.height+'px;'">
        <template v-for="(itm,idx) in item.list">
          <div :class="'page_col col_'+itm.col">
            <div class="page_text" :class="['page_' + index,{'current':current === index}]" @click="pageActive(index)">
              <div class="edit_tools">
                <el-button type="success" size="mini" icon="el-icon-edit" title="编辑" circle v-if="itm.type === 'text'"
                           @click="editorOpen(index,idx)"></el-button>
                <el-button type="success" size="mini" icon="el-icon-delete" title="删除" circle
                           @click="deleteBox(index,idx)"></el-button>
              </div>
              <template v-if="!itm.type">
                <div class="page_tools" title="插入报表">
                  <span class="page_tools_btn active" @click="changeClose(index,idx)">
                    <i class="el-icon-info"></i>
                    <span>插入报表</span>
                  </span>
                  <span class="page_tools_btn" title="插入图片" @click="uploadImg(index,idx)">
                    <el-upload
                      action="/api/chartBook/upload"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                      :multiple="false"
                      :show-file-list="false"
                      :accept="'image/jpeg,image/png,image/gif'"
                    >
                      <i class="el-icon-picture"></i>
                      <span>插入图片</span>
                    </el-upload>
                  </span>
                  <span class="page_tools_btn" @click="editorOpen(index,idx)" title="插入文字">
                    <i class="el-icon-info"></i>
                    <span>插入文字</span>
                  </span>
                </div>
              </template>
              <template v-if="itm.type === 'chart'">
                <div v-if="itm.data !== 'none'" :id="'chart_' + index + '_' + idx" class="chart"
                     style="width:600px;height:500px;}"></div>
                <div v-if="itm.data === 'none'" class="page_area">该报表不存在或已删除！</div>
              </template>
              <template v-if="itm.type === 'table'">
                <el-table :data="itm.tableData.data" v-loading="loading"
                          :header-row-class-name="'el_th'" stripe>
                  <template v-for="(i,d) in itm.tableData.keys">
                    <el-table-column :prop="i" :label="i"></el-table-column>
                  </template>
                </el-table>
                <!--<el-row>-->
                <!--<el-col :span="24" class="text-center">-->
                <!--<el-pagination-->
                <!--layout="prev, pager, next"-->
                <!--:current-page="collect.page.current"-->
                <!--:page-size="collect.page.size"-->
                <!--:total="collect.page.total"-->
                <!--@current-change="getCollectList"-->
                <!--&gt;</el-pagination>-->
                <!--</el-col>-->
                <!--</el-row>-->
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
      <div class="page_hr" v-if="item.hr" @mousedown.left="doDown($event,item,index)"></div>
    </template>
  </div>
</template>

<script>
  import '@/assets/report/css/review.css'

  export default {
    name: "left",
    props: ['type', 'list', 'editActive', 'contentFlag', 'current'],
    data() {
      return {
        flexType: this.type.split('-'),
        moveFlag: false,
        y: null,
        startY: null,
        loading: false,
        index: -1,
        idx: -1
      }
    },
    watch: {
      type(val) {
        this.flexType = val.split('-');
        this.flexSet();
      },
      contentFlag(val) {
        if (this.index !== -1 && this.idx !== -1) {
          if (this.list[this.index].list[this.idx].type === 'chart')
            this.setChartsDiv();
          else
            this.getCollectId();
          this.$emit('changeContent', false);
        }
      },
      list(val) {
        this.setChartsDiv();
      }
    },
    methods: {
      pageActive(index) {
        this.$emit('pageActive', index);
      },
      uploadImg(index, idx) {
        this.$emit('editChange', index, idx);
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 200) {
          this.$emit('editSave', res.data, true);
        }
      },
      uploadError(err, file, fileList) {
        let error = err + '';
        error = JSON.parse(error.split('Error:')[1]);
        this.$message.error(error.msg);
      },
      setChartsDiv() {
        if ($('.chart').length > 0) {
          for (let i = 0; i < $('.chart').length; i++) {
            let id = $('.chart').eq(i).attr('id');
            this.$echarts.init(document.getElementById(id)).dispose();
          }
        }
        this.list.forEach((item, index) => {
          item.list.forEach((itm, idx) => {
            if (itm.type === 'chart' || itm.type === 'table') {
              this.$ajax.get('/chart/' + itm.data).then(res => {
                if (res.status === 200) {
                  let setting = JSON.parse(res.data.settings);
                  let chartType = setting.chartType;
                  if (chartType === 'table') {
                    itm.type = 'table';
                    if (res.data.dataSetId)
                      this.getCollectList(index, idx, res.data.dataSetId);
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
                    } else
                      itm.data = 'none';
                  }
                }
              });
            }
          });
        });
      },
      getCollectId() {
        let page = this.list[this.index].list[this.idx];
        this.$ajax.get('/chart/' + page.data).then(res => {
          if (res.status === 200) {
            let setting = JSON.parse(res.data.settings);
            let chartType = setting.chartType;
            if (chartType === 'table') {
              page.type = 'table';
              if (res.data.dataSetId)
                this.getCollectList(this.index, this.idx, res.data.dataSetId);
            }
          }
        });
      },
      getCollectList(index, idx, id) {
        this.loading = true;
        this.$ajax.get('/dataSet/' + id + '/data').then(res => {
          if (res.status === 200) {
            this.loading = false;
            this.list[index].list[idx].tableData.data = res.data;
            this.list[index].list[idx].tableData.keys = [];
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
      flexSet() {
        if ($('.chart').length > 0) {
          for (let i = 0; i < $('.chart').length; i++) {
            let id = $('.chart').eq(i).attr('id');
            this.$echarts.init(document.getElementById(id)).dispose();
          }
        }
        this.$emit('flexSet', this.flexType);
      },
      /* 鼠标移动 */
      onMove(flag, data, index) {
        let $this = this;
        $(document).mousemove(function (el) {
          if ($this.moveFlag && data) {
            if (flag) {
              data.height = data.height + (el.pageY - $this.startY);
              flag = false;
            } else {
              if ($this.y === null)
                $this.y = el.pageY;
              data.height = data.height + (el.pageY - $this.y);
              $this.y = el.pageY;
            }
            if (data.height < 100)
              data.height = 100;

            let chart = $('.page_' + index + ' .chart');
            if (chart.length > 0) {
              for (let i = 0; i < chart.length; i++) {
                let id = $(chart[i]).attr('id');
                let c = $this.$echarts.init(document.getElementById(id));
                document.getElementById(id).style.height = data.height - 30 + 'px';
                c.resize();
              }
            }
          }
        });
      },
      /* 鼠标抬起 */
      onUp() {
        let $this = this;
        $(document).mouseup(function (el) {
          $this.moveFlag = false;
          $this.y = null;
          $(this).unbind('mousemove');
          if (document.all) {
            document.onselectstart = function () {
              return true;
            };
          }
          document.onselectstart = new Function('event.returnValue=true;');
        });
      },
      /* 鼠标点下 */
      doDown(el, data, index) {
        this.startY = el.pageY;
        this.moveFlag = true;
        if (document.all) {
          document.onselectstart = function () {
            return false;
          };
        }
        document.onselectstart = new Function('event.returnValue=false;');
        this.onMove(true, data, index);
      },

      changeClose(index, idx) {
        this.index = index;
        this.idx = idx;
        this.$emit('setFlexIndex', index, idx);
        this.$emit('changeClose', true);
      },
      editorOpen(index, idx) {
        this.$emit('editorOpen', true, index, idx);
      },
      deleteBox(index, idx) {
        if (this.list[index].list[idx].type === 'chart' && this.list[index].list[idx].data !== 'none')
          this.$echarts.init(document.getElementById('chart_' + index + '_' + idx)).dispose();
        this.$emit('deleteBox', index, idx);
      }
    },
    mounted() {
      this.onUp();
      if (this.list.length < 1)
        this.flexSet();
      this.setChartsDiv();
    }
  }
</script>
