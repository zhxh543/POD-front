<template>
  <div class="el_box report_right">
    <el-collapse v-model.trim="active" accordion @change="activeChange">
      <el-collapse-item title="展现方式" name="1" class="c_box_1">
        <div class="row_name">表格</div>
        <el-row :gutter="5">
          <el-col :span="8" class="view_item" :class="{active:type==='table'}">
            <div @click="changeType('table')">
              <img src="@/assets/report/img/1.jpg" title="数据表格">
            </div>
          </el-col>
        </el-row>
        <div class="row_name">柱状图</div>
        <el-row :gutter="5">
          <el-col :span="8" class="view_item" :class="{active:type==='bar-1-1-1'}">
            <div @click="changeType('bar-1-1-1')">
              <img src="@/assets/report/img/2.jpg" title="多系列柱状图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='bar-2-1-1'}">
            <div @click="changeType('bar-2-1-1')">
              <img src="@/assets/report/img/3.jpg" title="滚动多系列柱状图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='bar-1-2-1'}">
            <div @click="changeType('bar-1-2-1')">
              <img src="@/assets/report/img/4.jpg" title="堆积柱状图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='bar-2-2-1'}">
            <div @click="changeType('bar-2-2-1')">
              <img src="@/assets/report/img/5.jpg" title="滚动堆积柱状图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='bar-1-1-2'}">
            <div @click="changeType('bar-1-1-2')">
              <img src="@/assets/report/img/6.jpg" title="多系列条形图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='bar-1-2-2'}">
            <div @click="changeType('bar-1-2-2')">
              <img src="@/assets/report/img/7.jpg" title="堆积条形图">
            </div>
          </el-col>
        </el-row>
        <div class="row_name">折线图</div>
        <el-row :gutter="5">
          <!--<el-col :span="8" class="view_item" :class="{active:type==='line-1-2-1'}">-->
          <!--<div @click="changeType('line-1-2-1')">-->
          <!--<img src="@/assets/report/img/8.jpg" title="堆积折线图">-->
          <!--</div>-->
          <!--</el-col>-->
          <el-col :span="8" class="view_item" :class="{active:type==='line-1-1-1'}">
            <div @click="changeType('line-1-1-1')">
              <img src="@/assets/report/img/9.jpg" title="传统折线图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='line-2-1-1'}">
            <div @click="changeType('line-2-1-1')">
              <img src="@/assets/report/img/10.jpg" title="滚动折线图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='line-3-1-1'}">
            <div @click="changeType('line-3-1-1')">
              <img src="@/assets/report/img/14.jpg" title="阶梯折线图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='line-1-1-2'}">
            <div @click="changeType('line-1-1-2')">
              <img src="@/assets/report/img/12.jpg" title="传统面积图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='line-2-1-2'}">
            <div @click="changeType('line-2-1-2')">
              <img src="@/assets/report/img/13.jpg" title="滚动面积图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='line-1-2-2'}">
            <div @click="changeType('line-1-2-2')">
              <img src="@/assets/report/img/11.jpg" title="堆积面积图">
            </div>
          </el-col>
        </el-row>
        <div class="row_name">饼图</div>
        <el-row :gutter="5">
          <el-col :span="8" class="view_item" :class="{active:type==='pie-1'}">
            <div @click="changeType('pie-1')">
              <img src="@/assets/report/img/15.jpg" title="传统饼图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='pie-2'}">
            <div @click="changeType('pie-2')">
              <img src="@/assets/report/img/16.jpg" title="环形图">
            </div>
          </el-col>
          <el-col :span="8" class="view_item" :class="{active:type==='pie-3'}">
            <div @click="changeType('pie-3')">
              <img src="@/assets/report/img/17.jpg" title="南丁格尔图">
            </div>
          </el-col>
        </el-row>
        <!--<div class="row_name">地图</div>-->
        <!--<el-row :gutter="5">-->
        <!--<el-col :span="8" class="view_item"><img src="@/assets/report/img/19.jpg" title="地图"></el-col>-->
        <!--</el-row>-->
      </el-collapse-item>
      <el-collapse-item title="坐标轴设置" name="2">
        <template v-if="isAttr === 0">只有图形才有坐标轴设置</template>
        <template v-if="isAttr !== 0">
          <el-table :data="ax.data" :header-row-class-name="'el_th'" stripe fit v-if="ax.data.length > 0">
            <el-table-column prop="name" label="字段" :class-name="'axis_name'" width="113"></el-table-column>
            <el-table-column prop="x" label="X轴" :class-name="'axis_radio text-center'">
              <template slot-scope="data">
                <el-radio v-model.trim="ax.x" :label="data.row.name" @change="changeX(data.row.name)"></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="y" label="y轴" :class-name="'axis_check text-center'">
              <template slot-scope="data">
                <el-checkbox v-model.trim="data.row.y" :disabled="data.row.name === ax.x" :checked="data.row.y"
                             @change="changeY(data.row)"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-collapse-item>
      <el-collapse-item title="属性设置" name="3" class="c_box_3">
        <template v-if="isAttr === 0">只有图形才有属性设置</template>
        <template v-if="isAttr === 1">
          <div class="row_name grid_title">图例</div>
          <el-row>
            <el-col :span="10" class="grid_name">是否显示：</el-col>
            <el-col :span="14">
              <el-checkbox v-model.trim="options.legend.show" @change="changeAttr"></el-checkbox>
            </el-col>
            <el-col :span="10" class="grid_name">图例间距：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.legend.itemGap" controls-position="right" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">图例宽度：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.legend.itemWidth" controls-position="right" :size="'small'"
                               :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">图例高度：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.legend.itemHeight" controls-position="right" :size="'small'"
                               :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">水平对齐：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="options.legend.left" class="radio_icon" @change="changeAttr">
                <el-radio :label="'left'"><i class="el-icon-document"></i></el-radio>
                <el-radio :label="'center'"><i class="el-icon-document"></i></el-radio>
                <el-radio :label="'right'"><i class="el-icon-document"></i></el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="10" class="grid_name">排列方式：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="options.legend.orient" class="radio_icon" @change="changeAttr">
                <el-radio :label="'horizontal'"><i class="el-icon-document"></i></el-radio>
                <el-radio :label="'vertical'"><i class="el-icon-document"></i></el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="10" class="grid_name">垂直对齐：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="options.legend.top" class="radio_icon" @change="changeAttr">
                <el-radio :label="'top'">上</el-radio>
                <el-radio :label="'middle'">中</el-radio>
                <el-radio :label="'bottom'">下</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <div class="row_name grid_title">坐标系网格</div>
          <el-row>
            <el-col :span="10" class="grid_name">上边距：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.grid.top" controls-position="right" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">下边距：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.grid.bottom" controls-position="right" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">左边距：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.grid.left" controls-position="right" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">右边距：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.grid.right" controls-position="right" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
          </el-row>
          <div class="row_name grid_title">x轴</div>
          <el-row>
            <el-col :span="10" class="grid_name">轴名称：</el-col>
            <el-col :span="12">
              <el-input v-model.trim="xText" :size="'small'" type="text" @change="changeAttr"></el-input>
            </el-col>
            <el-col :span="10" class="grid_name">名称位置：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="options.xAxis.nameLocation" class="radio_icon" @change="changeAttr">
                <el-radio :label="'start'">左</el-radio>
                <el-radio :label="'middle'">中</el-radio>
                <el-radio :label="'end'">右</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="10" class="grid_name">名称字号：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.xAxis.nameTextStyle.fontSize" controls-position="right"
                               :size="'small'"
                               :min="12" @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">刻度旋转角度：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.xAxis.axisLabel.rotate" controls-position="right" :size="'small'"
                               :min="0" :max="359" @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">刻度字号：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.xAxis.axisLabel.textStyle.fontSize" controls-position="right"
                               :size="'small'" :min="12" @change="changeAttr"></el-input-number>
            </el-col>
          </el-row>
          <div class="row_name grid_title">y轴</div>
          <el-row>
            <el-col :span="10" class="grid_name">是否显示：</el-col>
            <el-col :span="12">
              <el-checkbox v-model.trim="options.yAxis[0].show" @change="changeAttr"></el-checkbox>
            </el-col>
            <el-col :span="10" class="grid_name">最大值：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="max" controls-position="right" :size="'small'"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">最小值：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="min" controls-position="right" :size="'small'"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">轴名称：</el-col>
            <el-col :span="12">
              <el-input v-model.trim="yText" :size="'small'" type="text" @change="changeAttr"></el-input>
            </el-col>
            <el-col :span="10" class="grid_name">名称字号：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.yAxis[0].nameTextStyle.fontSize" controls-position="right"
                               :size="'small'" :min="12" @change="changeAttr"></el-input-number>
            </el-col>
            <!--<el-col :span="10" class="grid_name">刻度格式：</el-col>-->
            <!--<el-col :span="12">-->
            <!--<el-input v-model.trim="options.yAxis[0].axisLabel.formatter" :size="'small'" type="text" @change="changeAttr"></el-input>-->
            <!--</el-col>-->
            <el-col :span="10" class="grid_name">刻度字号：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="options.yAxis[0].axisLabel.textStyle.fontSize" controls-position="right"
                               :size="'small'" :min="12" @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">显示分割线：</el-col>
            <el-col :span="14">
              <el-checkbox v-model.trim="options.yAxis[0].splitLine.show" @change="changeAttr"></el-checkbox>
            </el-col>
          </el-row>
        </template>
        <template v-if="isAttr === 2">
          <div class="row_name grid_title">图例</div>
          <el-row>
            <el-col :span="10" class="grid_name">是否显示：</el-col>
            <el-col :span="14">
              <el-checkbox v-model.trim="lineOption.legend.show" @change="changeAttr"></el-checkbox>
            </el-col>
            <el-col :span="10" class="grid_name">图例间距：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="lineOption.legend.itemGap" controls-position="right" :size="'small'"
                               :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">图例宽度：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="lineOption.legend.itemWidth" controls-position="right" :size="'small'"
                               :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">图例高度：</el-col>
            <el-col :span="14">
              <el-input-number v-model.trim="lineOption.legend.itemHeight" controls-position="right" :size="'small'"
                               :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">水平对齐：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="lineOption.legend.left" class="radio_icon" @change="changeAttr">
                <el-radio :label="'left'"><i class="el-icon-document"></i></el-radio>
                <el-radio :label="'center'"><i class="el-icon-document"></i></el-radio>
                <el-radio :label="'right'"><i class="el-icon-document"></i></el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="10" class="grid_name">排列方式：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="lineOption.legend.orient" class="radio_icon" @change="changeAttr">
                <el-radio :label="'horizontal'"><i class="el-icon-document"></i></el-radio>
                <el-radio :label="'vertical'"><i class="el-icon-document"></i></el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="10" class="grid_name">垂直对齐：</el-col>
            <el-col :span="14">
              <el-radio-group v-model.trim="lineOption.legend.top" class="radio_icon" @change="changeAttr">
                <el-radio :label="'top'">上</el-radio>
                <el-radio :label="'middle'">中</el-radio>
                <el-radio :label="'bottom'">下</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <div class="row_name grid_title">饼图</div>
          <el-row>
            <el-col :span="10" class="grid_name">顺时针：</el-col>
            <el-col :span="14">
              <el-checkbox v-model.trim="line.clockwise" @change="changeAttr"></el-checkbox>
            </el-col>
            <el-col :span="10" class="grid_name">内半径：</el-col>
            <el-col :span="12">
              <el-select v-model.trim="line.radius[0]" placeholder="请选择" :size="'small'" @change="changeAttr">
                <el-option v-for="item in inRadius" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10" class="grid_name">外半径：</el-col>
            <el-col :span="12">
              <el-select v-model.trim="line.radius[1]" placeholder="请选择" :size="'small'" @change="changeAttr">
                <el-option v-for="item in outRadius" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10" class="grid_name">显示标签：</el-col>
            <el-col :span="14">
              <el-checkbox v-model.trim="line.label.normal.show" @change="changeAttr"></el-checkbox>
            </el-col>
            <el-col :span="10" class="grid_name">内容格式：</el-col>
            <el-col :span="12" class="text_style">
              <!--<el-input v-model.trim="line.label.normal.formatter" :size="'small'" type="text"-->
              <!--@change="changeAttr"></el-input>-->
              <el-select v-model.trim="line.label.normal.formatter" placeholder="请选择" @change="changeAttr">
                <el-option
                  v-for="item in styleList"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10" class="grid_name">显示引导线：</el-col>
            <el-col :span="14">
              <el-checkbox v-model.trim="line.labelLine.normal.show" @change="changeAttr"></el-checkbox>
            </el-col>
            <el-col :span="10" class="grid_name">第一段长度：</el-col>
            <el-col :span="12">
              <el-input-number v-model.trim="line.labelLine.normal.length" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
            <el-col :span="10" class="grid_name">第二段长度：</el-col>
            <el-col :span="12">
              <el-input-number v-model.trim="line.labelLine.normal.length2" :size="'small'" :min="0"
                               @change="changeAttr"></el-input-number>
            </el-col>
          </el-row>
        </template>
      </el-collapse-item>
      <el-collapse-item title="颜色主题" name="4" class="c_box_4">
        <div class="color_line color_default" :class="{active:color === -1}" @click="colorSelect(-1)">默认主题</div>
        <div class="color_line" :class="{active:color === 1}" @click="colorSelect(1)">
          <img src="@/assets/report/img/color-1.jpg" alt="">
        </div>
        <div class="color_line" :class="{active:color === 2}" @click="colorSelect(2)">
          <img src="@/assets/report/img/color-2.jpg" alt="">
        </div>
        <div class="color_line" :class="{active:color === 3}" @click="colorSelect(3)">
          <img src="@/assets/report/img/color-3.jpg" alt="">
        </div>
        <div class="color_line" :class="{active:color === 4}" @click="colorSelect(4)">
          <img src="@/assets/report/img/color-4.jpg" alt="">
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: "right",
    props: ['type', 'activeName', 'axis', 'option', 'pieLine', 'pieOption', 'color'],
    data() {
      return {
        active: this.activeName,
        ax: this.axis,
        options: this.option,
        lineOption: this.pieOption,
        isAttr: 0,
        line: this.pieLine,
        inRadius: ['0%', '10%', '20%', '30%', '40%', '50%'],
        outRadius: ['60%', '70%', '80%', '90%', '100%'],
        max: this.option.yAxis[0].max,
        min: this.option.yAxis[0].min,
        xText: this.option.xAxis.name,
        yText: this.option.yAxis[0].name,
        styleList: [{
          key: '{b}: {d}%',
          label: '类别名称:百分比%'
        }, {
          key: '{d}%',
          label: '百分比%'
        }, {
          key: '{b}',
          label: '类别名称'
        }]
      }
    },
    watch: {
      pieLine(val) {
        this.line = val;
      },
      pieOption(val) {
        this.lineOption = val;
      },
      type(val, olVal) {
        this.ax = this.axis;
        if (val.split('-')[0] === 'bar') {
          let t2 = false;
          let t1 = parseInt(val.split('-')[3]);
          if (olVal.indexOf('-') > -1)
            t2 = parseInt(olVal.split('-')[3]);
          if ((t2 !== 2 && t1 === 2) || (t2 === 2 && t1 !== 2)) {
            this.options.xAxis.name = this.yText;
            this.options.yAxis[0].name = this.xText;
          } else {
            this.options.xAxis.name = this.xText;
            this.options.yAxis[0].name = this.yText;
          }
        }
        this.isType(val);
      },
      axis(val) {
        this.ax = val;
      },
      xText(val) {
        if (this.type !== 'table')
          this.changeAttr();
      },
      yText(val) {
        if (this.type !== 'table')
          this.changeAttr();
      },
      option(val) {
        this.options = val;
        this.max = val.yAxis[0].max;
        this.min = val.yAxis[0].min;
        this.xText = this.options.xAxis.name;
        this.yText = this.options.yAxis[0].name;
      }
    },
    methods: {
      changeType(type) {
        this.$emit('change', type);
      },
      activeChange(arr) {
        this.$emit('activeChange', arr);
      },
      changeX(name) {
        this.$emit('changeX', name);
      },
      changeY(data) {
        this.$emit('changeY', data);
      },
      isType(val) {
        if (val === 'table')
          this.isAttr = 0;
        else if (val) {
          if (val.split('-')[0] === 'pie')
            this.isAttr = 2;
          else {
            this.isAttr = 1;
            this.xText = this.options.xAxis.name;
            this.yText = this.options.yAxis[0].name;
          }
        }
      },
      changeAttr() {
        if (this.max === 0)
          this.options.yAxis[0].max = null;
        else
          this.options.yAxis[0].max = this.max;
        if (this.min === 0)
          this.options.yAxis[0].min = null;
        else
          this.options.yAxis[0].min = this.min;
        if (this.type !== 'table') {
          this.options.xAxis.name = this.xText;
          this.options.yAxis[0].name = this.yText;
        }
        this.$emit('changeAttr', this.options, this.lineOption, this.line);
      },
      colorSelect(index) {
        this.$emit('colorSelect', index);
      }
    },
    mounted() {
      this.isType(this.type);
    }
  }
</script>
