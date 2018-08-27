<template>
  <div class="el_box report_box">
    <div class="top_tools top_save">
      <el-button size="small" @click="editModal = true">保存</el-button>
    </div>
    <el-container>
      <el-aside class="el_left" :style="'height:'+height+'px;min-height:'+height+'px;'">
        <v-left
          :table="tableData"
          :keys="pageKeys"
          :cPage="page"
          :collect="collect"

          @selectCollect="selectCollect"
          @getCollectPageData="getCollectPageData"
        ></v-left>
      </el-aside>
      <el-main class="el_main" id="elMain" :style="'height:'+height+'px;min-height:'+height+'px;'">
        <v-content
          :type="chartType"
          :table="mainData"
          :keys="mKeys"
          :draw="draw"

          @ondraw="drawLine"
          @getMainData="getMainData"
        ></v-content>
      </el-main>
      <el-aside class="el_right" :style="'height:'+height+'px;min-height:'+height+'px;'">
        <v-right :type="chartType"
                 :pieLine="pieLine"
                 :option="option"
                 :pieOption="pieOption"
                 :axis="axis"
                 :activeName="activeName"
                 :color="colorActive"
                 :draw="draw"

                 @changeX="changeX"
                 @changeY="changeY"
                 @change="changeType"
                 @activeChange="activeChange"
                 @changeAttr="changeAttr"
                 @colorSelect="colorSelect"
        ></v-right>
      </el-aside>

      <el-dialog
        title="保存报表"
        :visible.sync="editModal"
        width="800px"
        center
        :before-close="editClose"
      >
        <el-row :gutter="15">
          <el-col :span="4" class="tool_name">报表名称：</el-col>
          <el-col :span="20">
            <el-input type="text" placeholder="请输入报表名称" v-model.trim="chartMain.name"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="3" :offset="18">
            <el-button @click="editClose">取消</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" :disabled="!chartMain.name" :loading="updateLoading" @click="edit">保存</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
  import '@/assets/report/css/report.css'
  import vLeft from '@/components/report/report/tools/left.vue'
  import vContent from '@/components/report/report/tools/main.vue'
  import vRight from '@/components/report/report/tools/right.vue'

  export default {
    name: "report",
    props: ['chartObj', 'updateLoading'],
    data() {
      return {
        editModal: false,
        chartMain: this.chartObj,
        height: document.body.clientHeight - 205,
        colorActive: -1,
        option: {
          title: {
            show: true,
            text: "多系列柱图",
            textStyle: {
              color: "rgb(68, 68, 68)",
              fontStyle: "normal",
              fontWeight: "bold",
              fontFamily: "Microsoft YaHei",
              fontSize: 16
            },
            left: "left"
          },
          contextmenu: {
            drillthrough: {
              show: true
            }
          },
          tooltip: {
            show: true,
            customizeTip: "",
            trigger: "axis",
            formatter: "",
            backgroundColor: "rgba(0,0,0,.8)",
            axisPointer: {
              type: "shadow",
              shadowStyle: {
                color: "#000",
                opacity: 0.3
              }
            },
            textStyle: {
              color: "rgb(255, 255, 255)",
              fontStyle: "normal",
              fontWeight: "normal",
              fontFamily: "Microsoft YaHei",
              fontSize: 12
            }
          },
          legend: {
            type: 'scroll',
            itemWidth: 25,
            itemHeight: 14,
            itemGap: 10,
            show: true,
            left: "center",
            top: "bottom",
            orient: "horizontal",
            textStyle: {
              color: "rgb(68, 68, 68)",
              fontStyle: "normal",
              fontWeight: "normal",
              fontFamily: "Microsoft YaHei",
              fontSize: 12
            },
            multiColor: true,
            data: []
          },
          grid: {
            left: 20,
            top: 50,
            right: 50,
            bottom: 50,
            containLabel: true
          },
          xAxis: {
            position: "bottom",
            type: "category",
            name: "",
            nameLocation: "middle",
            boundaryGap: true,
            nameTextStyle: {
              color: "rgb(68, 68, 68)",
              fontStyle: "normal",
              fontWeight: "normal",
              fontFamily: "Microsoft YaHei",
              fontSize: 12
            },
            nameGap: 30,
            axisLine: {
              lineStyle: {
                color: "#0a5670",
                width: 1,
                type: "solid"
              }
            },
            axisTick: {
              lineStyle: {
                color: "#0a5670",
                width: 1,
                type: "solid"
              }
            },
            axisLabel: {
              interval: "auto",
              rotate: 0,
              formatter: null,
              textStyle: {
                color: "rgb(68, 68, 68)",
                fontStyle: "normal",
                fontWeight: "normal",
                fontFamily: "Microsoft YaHei",
                fontSize: 12
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#0a5670",
                width: 1,
                type: "solid",
                opacity: 0.7
              }
            }
          },
          yAxis: [
            {
              position: "left",
              type: "value",
              name: "",
              show: true,
              nameLocation: "end",
              nameTextStyle: {
                color: "rgb(68, 68, 68)",
                fontStyle: "normal",
                fontWeight: "normal",
                fontFamily: "Microsoft YaHei",
                fontSize: 12
              },
              nameGap: 15,
              min: null,
              max: null,
              axisLine: {
                lineStyle: {
                  color: "#0a5670",
                  width: 1,
                  type: "solid"
                }
              },
              axisTick: {
                lineStyle: {
                  color: "#0a5670",
                  width: 1,
                  type: "solid"
                }
              },
              axisLabel: {
                formatter: function (value, index) {
                  return value;
                },
                textStyle: {
                  color: "rgb(68, 68, 68)",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontFamily: "Microsoft YaHei",
                  fontSize: 12
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#0a5670",
                  width: 1,
                  type: "solid",
                  opacity: 0.7
                }
              }
            }
          ],
          series: []
        },
        /* 饼图option */
        pieOption: {
          title: {
            show: true,
            text: "传统饼图",
            textStyle: {
              color: "#000",
              fontWeight: "bold",
              fontFamily: "Microsoft YaHei",
              fontSize: 16
            },
            left: "left"
          },
          tooltip: {
            show: true,
            trigger: "item",
            backgroundColor: "rgba(10,10,10,0.7)",
            textStyle: {
              color: "#fff",
              fontStyle: "normal",
              fontWeight: "normal",
              fontFamily: "Microsoft YaHei",
              fontSize: 12
            }
          },
          legend: {
            type: 'scroll',
            itemWidth: 25,
            itemHeight: 14,
            itemGap: 10,
            show: true,
            left: "center",
            top: "bottom",
            orient: "horizontal",
            textStyle: {
              color: "#222",
              fontStyle: "normal",
              fontWeight: "normal",
              fontFamily: "Microsoft YaHei",
              fontSize: 12
            }
          },
          series: []
        },
        activeName: '1',
        line: {
          type: 'bar',
          step: false,
          stack: null
        },
        type: '',
        chartType: 'table',
        chart: null,
        ser: [],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'filter'
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'filter'
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter'
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'filter'
          }
        ],
        axis: {
          x: -1,
          y: [],
          data: []
        },
        pieLine: {
          type: "pie",
          seriesLayoutBy: 'column',
          data: [{
            name: 'Matcha Latte',
            value: 12
          }, {
            name: 'Milk Tea',
            value: 34
          }, {
            name: 'Cheese Cocoa',
            value: 24
          }, {
            name: 'Walnut Brownie',
            value: 64
          }, {
            name: 'Brownie',
            value: 34
          }],
          clockwise: true,
          avoidLabelOverlap: true,
          roseType: false,
          radius: ['0%', '70%'],
          label: {
            normal: {
              show: true,
              position: "outside",
              formatter: "{b}: {d}%",
              textStyle: {
                color: "#333",
                fontStyle: "normal",
                fontWeight: "normal",
                fontFamily: "Microsoft YaHei",
                fontSize: 12
              }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 10,
              length2: 10,
              smooth: 0.2,
              lineStyle: {
                width: 1,
                type: "solid"
              }
            }
          },
          itemStyle: {}
        },
        colors: [
          ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4'],
          ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
          ['#c1232b', '#b5c334', '#fcce10', '#e87c25', '#27727b', '#fe8463'],
          ['#44b7d3', '#e42b6d', '#f4e24e', '#fe9616', '#8aed35', '#ff69b4']
        ],
        tableData: [],
        keys: [],
        pageKeys: [],
        mKeys: [],
        source: {},
        mainData: [],
        page: {
          page: 1,
          size: 10,
          total: 0
        },
        collect: '',
        draw: false,
        chartKeys: [],
        series: [],
        pieSeries: [],
        oldFlag: false
      }
    },
    components: {
      vLeft,
      vContent,
      vRight
    },
    watch: {
      draw(val, olVal) {
        if (val) {
          if (this.chart) {
            if (this.type === 'pie')
              this.changePie(parseInt(this.chartType.split('-')[1]));
            else
              this.change(this.chartType.split('-'));
          } else {
            this.$nextTick(() => {
              this.drawLine(this.chartType);
            });
          }
        }
      },
      chartObj(val) {
        this.chartMain = val;
      }
    },
    methods: {
      selectCollect(data, flag) {
        this.collect = data;
        this.getCollectPageData(1);
        this.getMainData();
        this.$emit('selectCollect', data.id);
        this.getDatas(flag);
      },
      getDatas(flag) {
        this.$ajax.get('/dataSet/' + this.collect.id + '/data').then(res => {
          if (res.status === 200) {
            let keys = [];
            for (let key in res.data[0]) {
              if (key !== 'id' && key !== '_id') {
                keys.push(key);
              }
            }
            this.chartKeys = keys;
            this.source = {};
            res.data.forEach((item, index) => {
              keys.forEach((itm, idx) => {
                if (!this.source[itm])
                  this.source[itm] = [];
                this.source[itm].push(item[itm]);
              });
            });
            this.axis = {
              x: -1,
              y: [],
              data: []
            };
            if (!flag)
              this.axis = JSON.parse(this.chartMain.settings).axis;
            else
              keys.forEach((item, index) => {
                this.axis.data.push({
                  name: item,
                  y: false
                });
              });
            if (!this.chartMain.settings) {
              this.colorActive = -1;
              this.chart = null;
              this.chartType = 'table';
              this.type = 'table';
              this.changeX('false');
            }
            this.setSer();
            this.option.title.text = this.collect.name;
            this.pieOption.title.text = this.collect.name;
          }
        });
      },
      getCollectPageData(page) {
        this.page.page = page;
        this.$ajax.get('/dataSet/collection/' + this.collect.collectionName, {
          page: this.page.page - 1,
          size: this.page.size
        }).then(res => {
          if (res.status === 200) {
            this.tableData = res.data.content;
            this.page.total = res.data.totalElements;
            this.pageKeys = [];
            for (let key in res.data.content[0]) {
              if (key !== '_id' && key !== 'id') {
                this.pageKeys.push(key);
              }
            }
          }
        });
      },
      getMainData() {
        this.$ajax.get('/dataSet/' + this.collect.id + '/data').then(res => {
          if (res.status === 200) {
            this.mainData = res.data;
            this.mKeys = [];
            for (let key in res.data[0]) {
              if (key !== '_id' && key !== 'id') {
                this.mKeys.push(key);
              }
            }
          }
        });
      },

      /* 坐标选择 */
      changeX(name) {
        if (name === 'false') {
          this.option.xAxis['data'] = [];
        } else {
          this.axis.x = name;
          if (this.axis.y.indexOf(name) >= 0) {
            for (let i = 0; i < this.axis.data.length; i++) {
              if (this.axis.data[i].name === name)
                this.axis.data[i].y = false;
            }
            this.axis.y.splice(this.axis.y.indexOf(name), 1);
            this.axis.y.forEach((item, index) => {
              this.ser.push(this.source[item]);
            });
          }
          this.option.xAxis['data'] = this.source[name];
          this.setSer();
        }
      },
      changeY(data) {
        if (data.y) {
          this.axis.y.push(data.name);
          if (this.type === 'pie' && this.axis.y.length > 1) {
            this.$message.warning('饼图只能有一组Y轴参数!');
            this.axis.data.forEach((item, index) => {
              if (item.name === data.name) {
                item.y = false;
                this.axis.y.splice(this.axis.y.indexOf(data.name), 1);
              }
            });
          }
        } else
          this.axis.y.splice(this.axis.y.indexOf(data.name), 1);
        this.setSer();
      },

      setSer() {
        if (this.axis.x !== -1 && this.axis.y.length > 0) {
          this.draw = true;
          this.ser = [];
          this.axis.y.forEach((item, index) => {
            this.ser.push({
              name: item,
              data: this.source[item]
            });
          });
        } else {
          this.draw = false;
          this.ser = [];
          this.chart = null;
        }
        if (this.chart)
          if (this.type === 'pie')
            this.setPieData();
          else
            this.setData();
      },

      activeChange(arr) {
        this.activeName = arr;
      },
      drawLine(type) {
        let $this = this;
        this.$nextTick(() => {
          if (this.axis.x !== -1 && this.axis.y.length > 0) {
            document.getElementById('chart').style.width = document.getElementById('elMain').offsetWidth - 80 + 'px';
            document.getElementById('chart').style.height = document.getElementById('elMain').offsetHeight - 80 + 'px';
            this.chart = this.$echarts.init(document.getElementById('chart'));
            window.onresize = () => {
              if (type !== 'table') {
                document.getElementById('chart').style.width = document.getElementById('elMain').offsetWidth - 80 + 'px';
                document.getElementById('chart').style.height = document.getElementById('elMain').offsetHeight - 80 + 'px';
                $this.chart.resize();
              }
            };
            this.changeType(type);
            if (this.type === 'pie')
              this.setPieData();
            else
              this.setData();
          }
        });
      },
      setData() {
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.setOption(this.option, true);
            let series = [];
            if (this.ser.length > 0) {
              this.ser.forEach((item, index) => {
                let o = {
                  name: item.name,
                  areaStyle: this.line.areaStyle,
                  type: this.line.type,
                  step: this.line.step,
                  stack: this.line.stack,
                  data: item.data
                };
                series.push(o);
              });
              this.option.legend.data = this.axis.y;
              if (this.colorActive !== -1) {
                let i = 0, j = 0;
                series.forEach((item, index) => {
                  let n = index - j;
                  if (n >= 5) {
                    i++;
                    j = 6 * i;
                  }
                  item.color = this.colors[this.colorActive - 1][n];
                });
              }
            } else series = [];
            this.series = series;
            this.option.series = [];
            this.chart.setOption({
              series: series
            });
          } else this.drawLine(this.dataType);
        });
      },
      setPieData() {
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.setOption(this.pieOption, true);
            let series = [];
            if (this.oldFlag) {
              series = this.pieOption.series;
              this.oldFlag = false;
            } else {
              series = this.pieLine;
              series.data = [];
              let data = [], names = [];
              this.chartKeys.forEach((item, index) => {
                if (item === this.axis.x) {
                  names = this.source[item];
                }
              });
              for (let key in this.source) {
                if (key === this.axis.y[0])
                  data = this.source[key];
              }
              let i = 0, j = 0;
              names.forEach((item, index) => {
                if (this.colorActive !== -1) {
                  let n = index - j;
                  if (n >= 5) {
                    i++;
                    j = 6 * i;
                  }
                  series.data.push({
                    name: item,
                    value: data[index],
                    itemStyle: {
                      color: this.colors[this.colorActive - 1][n]
                    }
                  });
                } else
                  series.data.push({
                    name: item,
                    value: data[index]
                  });
              });
            }
            this.pieSeries = series;
            this.pieOption.series = [];
            this.chart.setOption({
              series: series
            });
          } else this.drawLine(this.dataType);
        });
      },
      changeType(type) {
        if (type === 'table') {
          this.type = 'table';
          this.chartType = 'table';
          this.chart = null;
        } else if (type) {
          this.chartType = type;
          this.type = type.split('-')[0];
          if (!this.chart) {
            this.drawLine(type);
          } else {
            this.setSer();
            if (this.draw)
              if (this.type === 'pie')
                this.changePie(parseInt(this.chartType.split('-')[1]));
              else
                this.change(this.chartType.split('-'));
          }
        }
      },
      /* 饼图 */
      changePie(param) {
        let settings = '';
        if (this.chartMain.settings)
          settings = JSON.parse(this.chartMain.settings);
        switch (param) {
          case 1:
            this.pieLine.roseType = false;
            let r1 = '0%';
            if (settings && settings.pieOption)
              r1 = settings.pieOption.series.radius[0];
            this.pieLine.radius[0] = r1;
            break;
          case 2:
            this.pieLine.roseType = false;
            let r2 = '40%';
            if (settings && settings.pieOption) {
              r2 = settings.pieOption.series.radius[0];
              if (r2 === '0%' || parseInt(r2.split('%')[0]) < 40)
                r2 = '40%';
            }
            this.pieLine.radius[0] = r2;
            break;
          case 3:
            this.pieLine.roseType = "radius";
            let r3 = '10%';
            if (settings && settings.pieOption) {
              r3 = settings.pieOption.series.radius[0];
              if (r3 === '0%')
                r3 = '10%';
            }
            this.pieLine.radius[0] = r3;
            break;
        }
        this.setPieData();
      },
      /* 柱状图、折线图 */
      change(param) {
        /* 是否为滚动 1、不滚动；2、滚动 */
        let v1 = parseInt(param[1]);
        /* 是否为堆积 1、不堆积；2、堆积 */
        let v2 = parseInt(param[2]);
        /* 是否为条形\面积 1、非条形\非面积；2、条形\面积 */
        let v3 = parseInt(param[3]);
        switch (v1) {
          case 1:
            if (this.option.dataZoom)
              delete this.option.dataZoom;
            break;
          case 2:
            this.option.dataZoom = this.dataZoom;
            break;
        }
        if (this.type === 'bar') {
          this.line.type = this.type;
          switch (v2) {
            case 1:
              this.line.stack = null;
              break;
            case 2:
              this.line.stack = '1';
              break;
          }
          switch (v3) {
            case 1:
              this.option.xAxis.boundaryGap = true;
              this.option.xAxis.type = 'category';
              this.option.yAxis[0].type = 'value';
              break;
            case 2:
              this.option.xAxis.boundaryGap = true;
              this.option.xAxis.type = 'value';
              this.option.yAxis[0].type = 'category';
              this.option.yAxis[0]['data'] = this.option.xAxis.data;
              break;
          }
        } else if (this.type === 'line') {
          this.option.xAxis.boundaryGap = true;
          this.option.xAxis.type = 'category';
          this.option.yAxis[0].type = 'value';
          this.line.type = this.type;
          if (v1 === 3) {
            if (this.option.dataZoom)
              delete this.option.dataZoom;
            this.option.xAxis.type = 'category';
            this.option.xAxis.boundaryGap = true;
            this.line.step = 'step';
            this.line.areaStyle = null;
          } else {
            this.line.step = null;
            this.line.stack = null;
            switch (v2) {
              case 1:
                this.option.xAxis.boundaryGap = false;
                this.line.areaStyle = null;
                break;
              case 2:
                this.option.xAxis.type = 'category';
                this.option.xAxis.boundaryGap = false;
                this.option.yAxis[0].type = 'value';
                this.line.stack = '1';
                this.line.areaStyle = null;
                break;
            }
            if (v3 === 2)
              this.line.areaStyle = {normal: {}};
          }
        }
        this.setData();
      },
      changeAttr(option, lineOption, line) {
        this.option = option;
        this.pieLine = line;
        this.pieOption = lineOption;
        if (this.type !== 'table' && this.chartType) {
          if (this.type === 'pie')
            this.setPieData();
          else
            this.setData();
        }
      },
      colorSelect(idx) {
        if (idx !== 0) {
          this.colorActive = idx;
          if (this.type === 'pie')
            this.setPieData();
          else
            this.setData();
        }
      },
      editClose() {
        this.editModal = false;
      },
      edit() {
        this.chartMain.settings = {
          chartType: this.chartType,
          axis: this.axis,
          colorActive: this.colorActive
        };
        if (this.type === 'pie') {
          this.chartMain.settings['pieOption'] = this.pieOption;
          this.chartMain.settings.pieOption.series = this.pieSeries;
        } else if (this.type !== 'table') {
          this.chartMain.settings['option'] = this.option;
          this.chartMain.settings.option.series = this.series;
        }
        if (!this.chartMain.dataSetId) {
          this.$message.warning('请正确配置报表参数！');
          return false;
        } else if (this.type !== 'table') {
          if (this.axis.x === -1 || this.axis.y.length < 1) {
            this.$message.warning('请正确配置报表参数！');
            return false;
          }
        }
        this.$emit('edit', this.chartMain.settings);
        if (!this.updateLoading) this.editModal = false;
      }
    },
    mounted() {
      if (this.chartMain.settings) {
        let $this = this;
        $this.oldFlag = true;
        let settings = JSON.parse(this.chartMain.settings);
        this.$ajax.get('/dataSet/' + this.chartMain.dataSetId).then(res => {
          if (res.status === 200) {
            $this.selectCollect(res.data, false);
            $this.chartType = settings.chartType;
            $this.type = settings.chartType.split('-')[0];
            $this.axis = settings.axis;
            $this.colorActive = settings.colorActive;
            if (settings.chartType.split('-')[0] === 'pie') {
              $this.pieOption = settings.pieOption;
              $this.pieLine = settings.pieOption.series;
              $this.draw = true;
            } else if (settings.chartType.split('-')[0] !== 'table') {
              $this.option = settings.option;
              $this.draw = true;
            } else
              $this.draw = false;
          }
        });
      }
    }
  }
</script>
