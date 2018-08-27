<template>
  <div class="el_box">
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="next('c1')">新建数据集</el-button>
        <el-button type="primary" @click="next('s1')">配置数据源</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="collectList" v-loading="tableLoading" :header-row-class-name="'el_th'" stripe>
          <el-table-column prop="name" label="数据集名称"></el-table-column>
          <el-table-column prop="createdTime" label="创建时间">
            <template slot-scope="data">{{data.row.createdTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="data">
              <!--<el-button size="mini" type="info" plain @click="dataView(data.row)">数据预览</el-button>-->
              <el-button size="mini" type="primary" plain @click="updateCollect(data.row)">编辑</el-button>
              <el-button size="mini" type="danger" plain @click="deleteCollect(data.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="collectList.length > 0">
      <el-col :span="24" class="text-center">
        <el-pagination layout="prev, pager, next" :current-page="cPage.current" :page-size="cPage.size" :total="cPage.total" @current-change="changePage"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['collectList', 'cPage', 'tableLoading'],
    data() {
      return {}
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
      next(param) {
        this.$emit('nextStep', param);
      },
      changePage(page) {
        this.$emit('getCollectList', page);
      },
      deleteCollect(data) {
        this.$emit('deleteCollect', data);
      },
      // dataView(data) {
      //   this.$emit('dataView', data);
      // }
      updateCollect(data) {
        this.$emit('updateCollect', data);
      }
    }
  }
</script>
