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
      <el-col :span="24"><span class="data_title">数据库</span></el-col>
      <el-col :span="24">
        <div class="data_type" :class="{active:dataType === 'MySQL'}" @click="selSource('MySQL')">
          <div class="data_type_box">
            <div class="data_type_mask"><i class="el-icon-check"></i></div>
            <img src="@/assets/report/img/mysql.png" alt="mysql">
          </div>
        </div>
        <div class="data_type" :class="{active:dataType === 'Oracle'}" @click="selSource('Oracle')">
          <div class="data_type_box">
            <div class="data_type_mask"><i class="el-icon-check"></i></div>
            <img src="@/assets/report/img/oracle.png" alt="oracle">
          </div>
        </div>
        <div class="data_type" :class="{active:dataType === 'MSSql'}" @click="selSource('MSSql')">
          <div class="data_type_box">
            <div class="data_type_mask"><i class="el-icon-check"></i></div>
            <img src="@/assets/report/img/sqlsever.png" alt="sqlsever">
          </div>
        </div>
        <div class="data_type" :class="{active:dataType === 'Mongo'}" @click="selSource('Mongo')">
          <div class="data_type_box">
            <div class="data_type_mask"><i class="el-icon-check"></i></div>
            <img src="@/assets/report/img/mongo.png" alt="mongo">
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="next_step">
        <el-button type="primary" :disabled="dataType === 0" @click="next">下一步</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><span class="data_title">现有数据源</span></el-col>
      <el-col :span="24">
        <template v-if="sourceList.length > 0">
          <div class="data_type" v-for="(item,index) in sourceList">
            <div class="data_type_box">
              <div class="data_type_mask">
                <div class="data_edit_icon">
                  <i class="el-icon-edit" @click="editSource(item)"></i>
                  <i class="el-icon-delete" @click="deleteSource(item)"></i>
                </div>
              </div>
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
  </div>
</template>

<script>
  export default {
    name: "step1",
    props: ['sourceList', 'type'],
    data() {
      return {
        active: 0,
        dataType: this.type
      }
    },
    methods: {
      next() {
        this.$emit('nextStep', 's2');
      },
      selSource(index) {
        this.dataType = index;
        this.$emit('selectSource', index);
      },
      editSource(data) {
        this.$emit('editSource', data);
      },
      deleteSource(data) {
        this.$emit('deleteSource', data);
      }
    }
  }
</script>
<style scoped>
  .list_tip {
    color: #c0c4cc;
    font-size: 14px;
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #e4e7ed;
  }
</style>
