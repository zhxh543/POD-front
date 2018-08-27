<template>
  <div class="el_box">
    <el-row>
      <el-col :span="16">
        <el-steps :active="active" finish-status="success">
          <el-step title="进行中"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><span class="data_title">文件</span></el-col>
      <el-col :span="24">
        <div class="data_type" :class="{active:dataType === 'excel'}" @click="selSource('excel')">
          <div class="data_type_box">
            <div class="data_type_mask"><i class="el-icon-check"></i></div>
            <img src="@/assets/report/img/excel.png" alt="excel">
          </div>
        </div>
        <div class="data_type" :class="{active:dataType === 'csv'}" @click="selSource('csv')">
          <div class="data_type_box">
            <div class="data_type_mask"><i class="el-icon-check"></i></div>
            <img src="@/assets/report/img/csv.png" alt="csv">
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><span class="data_title">数据源</span></el-col>
      <el-col :span="24" v-loading="loading">
        <template v-if="sourceList.length > 0">
          <div class="data_type" v-for="(item,index) in sourceList" :class="{active:collect.dataSourceId === item.id && dataType === item.dbType}" :key="index">
            <div class="data_type_box" @click="selCSource(item)">
              <div class="data_type_mask"><i class="el-icon-check"></i></div>
              <img v-if="item.dbType === 'MySQL'" src="@/assets/report/img/mysql.png">
              <img v-if="item.dbType === 'Oracle'" src="@/assets/report/img/oracle.png">
              <img v-if="item.dbType === 'MSSql'" src="@/assets/report/img/sqlsever.png">
              <img v-if="item.dbType === 'Mongo'" src="@/assets/report/img/mongo.png">
            </div>
            <p v-html="item.name"></p>
          </div>
        </template>
        <template v-else>
          <p class="list_tip">暂无数据源!</p>
        </template>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="next_step">
        <el-button type="primary" :disabled="dataType === 0" @click="next">下一步</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import '@/assets/report/css/style.css'

  export default {
    name: "step1",
    props: ['sourceList','collect'],
    data() {
      return {
        active: 0,
        dataType: 0,
        loading: false
      }
    },
    methods: {
      next() {
        if(this.dataType !== 'excel' && this.dataType !== 'csv' && this.dataType !== 0)
          this.$emit('nextStep', 'c3');
        else
          this.$emit('nextStep', 'c2');
      },
      selSource(index) {
        this.dataType = index;
        this.$emit('selectSource', index);
      },
      selCSource(data){
        this.dataType = data.dbType;
        this.$emit('selCSource', data);
      }
    }
  }
</script>
