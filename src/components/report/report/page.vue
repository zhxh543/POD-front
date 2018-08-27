<template>
  <div class="el_box">
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="next('report')">新建报表</el-button>
      </el-col>
    </el-row>
    <div v-loading="listLoading">
      <el-row>
        <el-col :span="24">
          <el-table :data="chartList" :header-row-class-name="'el_th'" stripe>
            <el-table-column prop="name" label="报表名称"></el-table-column>
            <el-table-column prop="createdTime" label="创建时间">
              <template slot-scope="data">
                {{data.row.createdTime | formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="250">
              <template slot-scope="data">
                <el-button size="mini" type="primary" plain @click="updateView(data.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" plain @click="deleteCollect(data.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="chartList.length > 0">
        <el-col :span="24" class="text-center">
          <el-pagination layout="prev, pager, next"
                         :current-page="chartPage.current"
                         :page-size="chartPage.size"
                         :total="chartPage.total"
                         @current-change="getChartList"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['chartList', 'listLoading', 'chartPage'],
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
      getChartList(page) {
        this.$emit('getChartList', page);
      },
      deleteCollect(id) {
        this.$emit('deleteCollect', id);
      },
      updateView(id) {
        this.$emit('updateView', id);
      }
    }
  }
</script>
