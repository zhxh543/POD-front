<template>
  <div class="el_box">
    <el-row>
      <el-form :model="data" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="数据库地址：" prop="host">
          <el-input v-model.trim="data.host" placeholder="请输入数据库地址"></el-input>
        </el-form-item>
        <el-form-item label="数据库端口号：" prop="port">
          <el-input v-model.trim="data.port" placeholder="请输入数据库端口号"></el-input>
        </el-form-item>
        <!--<el-form-item label="数据库版本：" prop="version" v-if="type === 3">-->
        <!--<el-radio-group v-model="data.version">-->
        <!--<el-radio label="1">SQLServer2000</el-radio>-->
        <!--<el-radio label="2">SQLServer2005以上版本</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="用户名：" prop="user">
          <el-input v-model.trim="data.user" placeholder="请输入数据库用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pwd">
          <el-input type="password" v-model.trim="data.pwd" placeholder="请输入数据库密码"></el-input>
        </el-form-item>
        <el-form-item label="连接对象：" prop="oracleType" v-if="type === 'Oracle'">
          <el-radio-group v-model.trim="data.oracleType">
            <el-radio label="SID">数据库实例</el-radio>
            <el-radio label="ServiceName">数据库服务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据库/ODBC：" prop="dbName">
          <el-input v-model.trim="data.dbName" placeholder="请输入数据库名称"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="24" class="next_step">
        <el-button type="success" @click="test" :loading="testLoading">
          <template v-if="!testLoading">测试连接</template>
          <template v-if="testLoading">正在测试</template>
        </el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-col>
    </el-row>
    <!--<el-row style="border-top: 1px solid #eee; padding-top: 20px;margin-top: 0"><p class="rds-remark">-->
      <!--开发者调用模板消息接口是需提供模板ID</p></el-row>-->
  </div>
</template>

<script>
  export default {
    name: "mongo",
    props: ['database', 'type', 'testLoading'],
    data() {
      let portNumber = (rule, value, callback) => {
        let test = /^\+?[1-9]\d*$/;
        if (!test.test(value)) {
          callback(new Error('端口号必须是大于0的正整数'));
        } else {
          callback();
        }
      };
      return {
        data: this.database,
        rules: {
          host: [
            {required: true, message: '请输入数据库地址', trigger: 'blur'},
          ],
          port: [
            {required: true, message: '请输入数据库端口号', trigger: 'blur'},
            {validator: portNumber, trigger: 'blur'}
          ],
          user: [
            {required: true, message: '请输入数据库用户名', trigger: 'blur'},
          ],
          pwd: [
            {required: true, message: '请输入数据库密码', trigger: 'blur'},
          ],
          dbName: [
            {required: true, message: '请输入数据库名称', trigger: 'blur'},
          ],
          // version:[
          //   {required: true, message: '请选择SQLServer版本', trigger: 'change'},
          // ],
          oracleType: [
            {required: true, message: '请选择连接对象', trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      test() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('testSource');
          } else {
            this.$message.error('正确填完信息才能测试连接!');
            return false;
          }
        });
      },
      next() {
        // this.$emit('next','sEnd');
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('next', 'sEnd');
          } else {
            this.$message.error('填完信息才能下一步');
            return false;
          }
        });
      }
    }
  }
</script>
