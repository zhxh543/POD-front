<template>
  <div id="moduleAdd">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
      <div class="handle-block"></div>
      <!--:rules="registerRules"-->
      <el-form  :model="formModule" status-icon  ref="formModule":rules="registerRules" label-width="100px" class="module-form">
        <template>
          <div class="user-form">
            <el-form-item label="功能名称" prop="name">
              <el-input v-model="formModule.details.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="功能路径" prop="url">
              <el-input v-model="formModule.details.url" placeholder="请输入路径"></el-input>
            </el-form-item>
            <el-form-item label="功能图标" prop="icon" v-show="funType=='array'">
              <el-input v-model.trim="formModule.details.icon" placeholder="请输入图标class"></el-input>
            </el-form-item>
            <el-form-item label="模块类型" prop="funType">
              <el-radio-group v-model="funType" @change="changeType()">
                <el-radio label="array">一级模块</el-radio>
                <el-radio label="item">二级模块</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="一级模块" v-show="funType=='item'" prop="parentId">
              <el-select v-model="formModule.details.parentId" placeholder="请选择" :loading="funLoading" :popper-append-to-body="false">
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in funList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="功能描述" prop="description">
              <el-input v-model.trim="formModule.details.description" placeholder="功能描述"></el-input>
            </el-form-item>
            <!-- 新加-子功能 -->
            <el-form-item label="子功能" v-if="funType=='item'" style="width: 600px">
              <div class="add-btn"><el-button type="primary" size="mini" @click="dialogFormVisible = true">增加</el-button></div>
              <div class="form-item-table" v-if="subfunctionList.length">
                <div class="table-item"><span>名称</span><span style="width: 25%">地址</span><span>请求方式</span><span style="width: 10%">操作</span></div>
                <div class="table-item" v-for="(item, index) in subfunctionList" :key="index">
                  <span>{{item.name}}</span>
                  <el-tooltip class="item" effect="dark" :content="item.url" placement="top">
                    <span>{{item.url}}</span>
                  </el-tooltip>
                  <span>{{item.method}}</span>
                  <span style="width: 10%; cursor: pointer;" @click="delSubfunctionFun(index)">删除</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number :min="1"  :max="9999999"   v-model="formModule.details.sort"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="formModule.details.enabled" placeholder="请选择状态" :popper-append-to-body="false">
                <el-option label="启用" :value="true"></el-option>
                <el-option label="停用" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求方式" prop="method">
              <el-select v-model="formModule.details.method" placeholder="请选择请求方式" :popper-append-to-body="false">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色应用" prop="roleIds" style="width: 600px">
              <template>
                <el-checkbox-group v-model="formModule.roleIds">
                  <el-checkbox :label="item.id" v-for="item in roleList" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </div>
        </template>
      </el-form>
      <div class="form-submit ">
        <el-button  type="primary" @click="submitForm('formModule')" v-loading="loading">保存</el-button>
      </div>
    </div>
    <!-- 子功能添加 -->
    <el-dialog title="添加子功能" left :visible.sync="dialogFormVisible"
               width="600px">
      <el-form :model="addSubfunctionList" :rules="subfunctionRules" ref="subfunctionRefs" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addSubfunctionList.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="addSubfunctionList.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
           <el-select v-model="addSubfunctionList.method" placeholder="请选择请求方式" :popper-append-to-body="false">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SubfunctionCancelFun('subfunctionRefs')" size="mini">取 消</el-button>
        <el-button type="primary" @click="addSubfunctionFun('subfunctionRefs')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // 正则验证
  import { validateIcon } from '@/util/validate';
  export default {
    name: "moduleAdd",
    data (){
      var validateApp = (rule, value, callback) => {
        if (!validateIcon(value)) {
          callback(new Error('请输入:字母、数字、下划线或横线'));
        }else{
          callback();
        }
      };
      return {
        msg : "系统模块管理",
        crumbsList:[   //  面包屑
          {name:'系统模块管理',url:{routerName:'systemManage',params:{name:'systemModuleManage'}}},
          {name:'新增模块',url:""},
        ],
        editId: "",
        funList: [],//一级模块
        loading: false,//保存防止重复提交
        funLoading:false,//获取一级模块列表时，未加载出时候有个滚动的图标
        registerRules:{
          name: [
            { required: false,  min: 1, max: 20,message: '长度在1 到20个字符',trigger: 'blur' }
          ],
          url: [
            { required: false,  min: 1, max: 200,message: '长度在1 到200个字符',trigger: 'blur' }
          ],
          // parentId: [
          //   { required: true,message: '请选择一个模块',trigger: 'blur' }
          // ],
          // method: [
          //   { required: true,message: '请选择一个请求方式',trigger: 'blur' }
          // ],
          // sort: [
          //   { required: true,  type: "number",message: '排序必须为数字值',trigger: 'blur' }
          // ],
          icon: [
            { required: false,  min: 1, max: 21,message: '长度在1 到20个字符',trigger: 'blur' },
            { validator: validateApp, trigger: 'blur' }
          ],
          description: [
            { required: false, min: 1, max: 200,message: '长度在1 到200个字符',trigger: 'blur' }
          ],
          roleIds: [
            { type: 'array', required: false, message: '请至少选择一个系统角色', trigger: 'change' }
          ],
          // enabled: [
          //   {  required: true, message: '请选择信息状态',trigger: 'blur' }
          // ],
        },
        formModule: {
          "details":{
            "name":"",
            "url":"",
            "icon": "",
            "parentId":"",
            "sort":1,
            "description":"",
            "enabled": true,
            "method":"GET"
          },
          roleIds: []
        },
        funType: "array",
        flag:true,//只有第一次选择模块类型为二级的时候才加载一级模块列表
        roleList: [],//角色id集合
        subfunctionList: [],  // 子功能列表
        addSubfunctionList: {},
        dialogFormVisible: false,
        subfunctionRules: {
          name: [
            { required: true, message: '请填写名称', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请填写地址', trigger: 'blur' }
          ],
          method: [
            { required: true, message: '请选择一个请求方式', trigger: 'change' }
          ],
        }
      }

    },
    mounted(){
      this.editId = this.$route.query.id
      // this.formModule.roleList.push(this.roleList[0].roleCode)
      this.getRoleData()
      if(this.editId){
        this.getDetail()
      }
    },
    methods: {
      getDetail (){
        let url = "/resource/"+this.editId
        let param = {
          "id":this.editId,
        }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            this.formModule = res.data
            if(res.data.details.parentId==null){
              this.funType = "array"
            }else {
              this.subfunctionList = res.data.buttons
              this.funType= "item"
              this.getFunList()
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      // 获取角色列表
      getRoleData () {
        let url = "/role"
        let param = {
          "current":this.page,
          "size" :this.pageSize,
        }
        this.$ajax.get(url,{}).then(res => {
          if(res.status === 200){
            this.roleList = res.data
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      submitForm(formName) {
        let url = "/resource/"
        let param = this.formModule

        if(this.funType == 'item') {
          param.buttons = this.subfunctionList
          if(!param.buttons.length) {
            this.$message.error('请添加子功能！')
            return false
          }
        }
        let mathod = "post"
        if(this.editId){
          url = "/resource/"+this.editId
          mathod = "put"
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$ajax.update(url,param,mathod).then(res => {
              this.loading = false
              if(res.status === 200){
                this.$router.go(-1)
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.$emit("loadData")
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
      //获取一级模块
      getFunList (){
        let url = "/resource"
        this.funLoading = true
        this.$ajax.get(url,{}).then(res => {
          this.funLoading = false
          if(res.status === 200){
            this.funList = res.data
            // this.formModule.details.parentId = res.data[0].id
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      /*选择模块类型为二级的时候才加载一级模块列表,再次选择一级时候要清空选择的一级模块*/
      changeType () {
        if(this.funType=='item'){
          if(this.flag){
            this.flag = false
            this.getFunList();
          }
          this.formModule.details.icon = ""
        }else{
          this.formModule.details.parentId= null
        }
      },
      // 增加子功能
      addSubfunctionFun(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              message: '添加子功能成功！',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.subfunctionList.push(this.addSubfunctionList)
            this.addSubfunctionList = {}
          } else {
            return false;
          }
        });
      },
      // 删除子功能
      delSubfunctionFun(index) {
        this.subfunctionList.splice(index, 1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      },
      // 取消
      SubfunctionCancelFun(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style  lang="less" type="text/less">
  #moduleAdd{
  .module-form{
    width: 424px;
   }.el-select {
      width: 100%;
    }
    .el-dialog__header{
      border-bottom: 1px solid #eeeeee;
      .el-dialog__title{
        font-size: 14px;
      }
    }
    .form-item-table {
      width: 100%;
      height: auto;
      border: 1px solid #eee;
      .table-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 0 10px;
        border-top: 1px solid #eee;
        span {
          display: block;
          width: 25%;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

</style>
