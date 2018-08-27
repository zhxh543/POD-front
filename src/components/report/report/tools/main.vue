<template>
  <div class="el_box cl_table">
    <template v-if="type === 'table'">
      <template v-if="table.length > 0">
        <el-table :data="table" :header-row-class-name="'el_th'" stripe>
          <template v-for="(item,index) in keys">
            <el-table-column :prop="item" :label="item"></el-table-column>
          </template>
        </el-table>
        <!--<el-row class="text-center">-->
          <!--<el-pagination layout="prev, pager, next"-->
                         <!--:current-page="mPage.page"-->
                         <!--:page-size="mPage.size"-->
                         <!--:total="mPage.total"-->
                         <!--@current-change="getMainData"-->
          <!--&gt;</el-pagination>-->
        <!--</el-row>-->
      </template>
      <template v-else>
        <p class="tip-p">请选择数据集后进行数据预览！</p>
      </template>
    </template>
    <template v-else>
      <div v-if="draw" id="chart" :style="{width:'500px',height:'500px'}"></div>
      <p v-if="!draw" class="tip-p">请选择数据集和坐标轴信息后进行报表预览!</p>
    </template>
  </div>
</template>

<script>
  export default {
    name: "box",
    props: ['type', 'table', 'keys', 'draw'],
    data() {
      return {}
    },
    methods: {
      getMainData() {
        this.$emit('getMainData');
      },
      isDraw() {
        if (this.draw)
          this.$emit('ondraw', this.type);
      }
    },
    mounted() {
      if (this.type !== 'table')
        this.isDraw();
    }
  }
</script>
