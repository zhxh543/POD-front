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
          <div class="el_name">数据源名称</div>
          <div class="el_tool">
            <el-input v-model.trim="info.name" placeholder="请输入数据源名称"></el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="next_step">
        <el-button type="primary" :loading="loading" :disabled="info.name === ''" @click="next">完成</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "end",
    props: ['database'],
    data() {
      return {
        info: this.database,
        active: 2,
        loading: false,
        finish: '进行中'
      }
    },
    methods: {
      next() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$emit('nextStep', 'sEdit');
        }, 1000);
      }
    }
  }
</script>
