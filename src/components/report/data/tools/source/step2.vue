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
    <el-row>
      <el-col :span="12">
        <data-form :database="data" :type="type" :testLoading="testLoading" @next="next"
                   @testSource="testSource"></data-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import dataForm from '@/components/report/data/tools/source/form.vue'

  export default {
    name: "step2",
    props: ['type', 'database', 'testLoading'],
    data() {
      return {
        active: 1,
        data: this.database
      }
    },
    components: {
      dataForm
    },
    methods: {
      next(param) {
        this.$emit('nextStep', param);
      },
      testSource() {
        this.$emit('testSource');
      }
    },
    mounted() {
      if (!this.data.port)
        switch (this.type) {
          case 'MySQL':
            this.data.port = 3306;
            break;
          case 'Oracle':
            this.data.port = 1521;
            break;
          case 'MSSql':
            this.data.port = 1433;
            break;
          case 'Mongo':
            this.data.port = 3307;
            break;
        }
    }
  }
</script>
