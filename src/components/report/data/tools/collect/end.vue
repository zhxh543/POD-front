<template>
  <div class="el_box">
    <el-row>
      <el-col :span="16">
        <el-steps :active="active" finish-status="success">
          <el-step title="已完成"></el-step>
          <el-step title="已完成"></el-step>
          <el-step :title="finish"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el_form">
          <div class="el_name">数据集名称</div>
          <div class="el_tool">
            <el-input v-model.trim="info.name" placeholder="请输入数据集名称"></el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="next_step">
        <el-button type="primary" :loading="editLoading" :disabled="info.name === ''" @click="next">完成</el-button>
      </el-col>
    </el-row>
    <p v-if="type !== 'Mongo'" class="rds-remark" v-html="' 查询语句必须以 select 开头，并且不能包含分号<br/>'"></p>

  </div>
</template>

<script>
  export default {
    name: "end",
    props: ['collect', 'editLoading', 'type'],
    data() {
      return {
        active: 2,
        finish: '进行中',
        info: this.collect,
        rules: {
          name: [
            {required: true, message: '请输入数据集名称', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      next() {
        setTimeout(() => {
          if (this.info.id === '')
            delete this.info.id;
          this.$emit('changeCollectInfo', this.info);
          this.$emit('nextStep', 'cEdit');
        }, 1000);
      }
    }
  }
</script>
