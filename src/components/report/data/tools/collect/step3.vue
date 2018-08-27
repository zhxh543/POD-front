<template>
  <div class="el_box">
    <el-row>
      <el-col :span="16">
        <el-steps :active="active" finish-status="success">
          <el-step title="已完成"></el-step>
          <el-step title="进行中"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row class="el_row">
      <el-col :span="24">
        <el-input type="textarea" v-model="info.statement" placeholder="请输入查询语句" rows="5"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" :disabled="info.statement === ''" @click="next">下一步</el-button>
      </el-col>
    </el-row>
    <div class="data_preview">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :disabled="!info.statement && !loading" @click="dataReview">数据预览</el-button>
          <!--<el-button type="primary">筛选</el-button>-->
        </el-col>
      </el-row>
      <el-row>
        <template v-if="keys.length > 0">
          <el-col :span="24">
            <el-table :data="tableData" v-loading="loading" :header-row-class-name="'el_th'" stripe>
              <template v-for="(item,index) in keys">
                <el-table-column :prop="item" :label="item" v-if="item!=='_id'&&item!=='id'"></el-table-column>
              </template>
            </el-table>
          </el-col>
        </template>
        <el-col v-if="keys.length === 0">
          <p class="list_tip">暂无数据预览!</p>
        </el-col>
      </el-row>
    </div>
    <br/>
    <p v-if="type !== 'Mongo'" class="rds-remark" v-html="'查询语句必须以 select 开头，并且不能包含分号<br/>预览只显示10条。<br/>'"></p>
    <p v-if="type === 'Mongo'" class="rds-remark" v-html="'预览只显示10条。<br/>'"></p>
  </div>
</template>

<script>
  export default {
    name: "step3",
    props: ['collect', 'type'],
    data() {
      return {
        active: 1,
        info: this.collect,
        keys: [],
        tableData: [],
        loading: false
      }
    },
    methods: {
      next() {
        if (!this.info.collectionName)
          delete this.info.collectionName;
        this.$emit('changeCollectInfo', this.info);
        this.$emit('nextStep', 'cEnd');
      },
      dataReview() {
        this.loading = true;
        this.$emit('changeMask', true);
        this.$ajax.post('/dataSet/preview', this.info).then(res => {
          this.loading = false;
          this.$emit('changeMask', false);
          if (res.status === 200) {
            this.tableData = res.data;
            this.keys = [];
            for (let key in res.data[0]) {
              this.keys.push(key);
            }
          } else
            this.$message.error(res.data.msg);
        });
      }
    }
  }
</script>
<style scoped>
  .list_tip {
    color: #c0c4cc;
    font-size: 14px;
    padding: 20px 0 0 10px;
    border-top: 1px solid #e4e7ed;
  }
</style>
