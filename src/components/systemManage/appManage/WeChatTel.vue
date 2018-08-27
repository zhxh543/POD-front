<template>
  <div id="weChatTel">
    <div  class="el_examine">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />

      <el-form :model="weChatForm" :rules="rulesWeChat"  ref="weChatForm" label-width="100px" class="examine-form">
        <el-form-item label="模板ID" prop="templateId">
          <p class="remark">模板ID：微信公众平台模板库中搜索标题为审批流程提醒<br/>（模板ID为：OPENTM415432162）或按详情内容申请新的模板</p>
          <p class="modalId"><el-input v-model.trim="weChatForm.templateId" placeholder="请输入模板ID" class="fl"></el-input>
            <el-button type="primary" plain class="fl" v-loading="loading" @click="submitForm('weChatForm')">绑定</el-button></p>
        </el-form-item>
        <el-form-item label="标题">
          <p>审批流程提醒</p>
        </el-form-item>
        <el-form-item label="详细内容">
          <p>{ {first.DATA} }</p>
          <p>申请人：{ {keyword1.DATA }}</p>
          <p>审批类型：{ {keyword2.DATA} }</p>
          <p>审批状态：{ {keyword3.DATA} }</p>
          <p>{ {remark.DATA} }</p>
        </el-form-item>
        <el-form-item label="内容示例">
          <p>你有新的审批流程提醒</p>
          <p>申请人：向航</p>
          <p>审批类型：请假申请</p>
          <p>审批状态：待审批</p>
          <p>事假</p>
        </el-form-item>
      </el-form>
      <div class="form-submit ">
      </div>
    </div>
  </div>
</template>

<script>
  // 正则验证
  import { validateLetter } from '@/util/validate';
  export default {
    name: "weChatTel",
    data (){
      var validateApp = (rule, value, callback) => {
        if (!validateLetter(value)) {
          callback(new Error('请输入:字母、数字或者下划线'));
        }else{
          callback();
        }
      };
      return {
        msg : "微信消息模板",
        crumbsList:[   //  面包屑
          {name:'应用管理',url:{routerName:'systemManage',params:{name:'appManage'}}},
          {name:'微信消息模板',url:""},
        ],
        loading: false,
        rulesWeChat :{
          templateId: [
            { required: true, message: '请输入模板ID', trigger: 'blur' },
            { min:1, max: 100, message: '最多可输入100个字', trigger: 'blur' },
            // { validator: validateApp, trigger: 'blur' }
          ],
        },
        weChatForm: {
          appId: "",
          templateId: "",
        }
      }
    },
    mounted() {
      this.weChatForm.appId = this.$route.query.id
      this.getData()
    },
    methods : {
      getData () {
        let url = "/weChat/template/"+this.weChatForm.appId
        let param = {
          "appId":this.weChatForm.appId,
        }
        this.loading = true
        this.$ajax.get(url,param).then(res => {
          this.loading = false
          if(res.status === 200){
            this.weChatForm.templateId = res.data
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      submitForm(formName) {
        let url = "/weChat/template/"+this.weChatForm.appId
        let param = this.weChatForm
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$ajax.post(url,param).then(res => {
              this.loading = false
              if(res.status === 200){
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.getData()
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          } else {
            console.log('表单错误!');
            return false;
          }
        });
      },
    },

  }
</script>

<style  lang="less" >
  #weChatTel{
    .el_examine {
      background: #ffffff;
      padding: 20px 0;
      border: 1px solid #d2dae9;
      min-height: 400px;
      height: 100%;
    }
    .examine-form{
      width: 640px;
      padding: 18px 0 0 0;
      .el-input-number .el-input__inner{
        text-align: left;
      }
      .modalId{
        padding: 10px 0;
        .el-input{
          width: 280px;
          margin-right: 15px;
        }
      }
      p{
        color: #999999;font-size: 14px}
    }
    .crumbs{margin: 0 20px}
    .remark{
      color: #e6a23c!important;
      width: auto;
      display: inline-block;
      border: 1px solid #f5dab1;
      background: #fdf6ec;
      border-radius: 4px;
      line-height: 38px;
      padding: 0 12px;
    }
  }

</style>
