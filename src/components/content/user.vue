<template>
  <div class="content_user">
    <div class="box_container">
      <el-row :gutter="14">
        <el-col :span="24">
          <div class="box">
            <div class="box_title">用户运营</div>
            <div class="box_content">
              <el-row :gutter="14">
                <el-col :span="6">
                  <div class="box_item">
                    <p>总应用</p>
                    <h2 v-text="userData.appCount"></h2>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box_item">
                    <p>总用户</p>
                    <h2 v-text="userData.userCount"></h2>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box_item">
                    <p>总图书</p>
                    <h2 v-text="userData.bookCount"></h2>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box_item">
                    <p>总工单</p>
                    <h2 v-text="userData.orderCount"></h2>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="box_container">
      <div class="box">
        <div class="box_title">审核管理</div>
        <div class="box_content box_exa">
          <el-row :gutter="14">
            <el-col :span="12">
              <div class="box_exa_item" :class="[enabledOne ? '' : 'disabled']" @click="changeView('examineManage','reprintManage', enabledOne, '13')">
                <img src="./img/img.jpg" alt="">
                <div>
                  <div>
                    <i class="el-icon-tickets"></i>
                    <h2>重印建议审核</h2>
                    <p>待审核：{{userData.reprintSuggest ? userData.reprintSuggest : '0'}}</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="box_exa_item" :class="[enabledTwo ? '' : 'disabled']" @click="changeView('examineManage','produceManage', enabledTwo,'13')">
                <img src="./img/img2.jpg" alt="">
                <div>
                  <div>
                    <i class="el-icon-document"></i>
                    <h2>生产工单审核</h2>
                    <p>待审核：{{userData.production ? userData.production : 0}}</p>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="box_container">
      <el-row :gutter="14">
        <el-col :span="24">
          <div class="box">
            <div class="box_title">功能模块</div>
            <div class="box_content">
              <el-row :gutter="14">
                <el-col :span="6" v-for="(item, index) in allWithFlagList" :key="index" v-if="item.url != '/index'" >
                  <router-link tag="div" :to="item.enabled ? item.url : ''" class="box_item" :class="[item.enabled ? '' : 'enabled']" @click.native="getMenuId(item.id)">
                    <h2><i :class="item.icon"></i></h2>
                    <p>{{item.name}}</p>
                  </router-link>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'user',
  data () {
    return {
      userData: "",
      allWithFlagList: [],
      enabledOne: false,//审核管理第一个有没有权限
      enabledTwo: false,//审核管理第二个有没有权限
      auditManageList: [
        {enabled: true,id:""},
        {enabled: true,id:""}
      ]
    }
  },
  created() {
    this.getAllWithFlagList()
    this.getAuditManage()
  },
  mounted: function () {
    this.getData();
  },
  methods : {
    //修改menuid
    getMenuId (id){
      localStorage.setItem('menuId', id);
    },
    // getAllWithFlag
    getAllWithFlagList() {
      this.$ajax.get('/menu/allWithFlag').then(res => {
        if(res.status == 200) {
          this.allWithFlagList = res.data
        }
      })
    },
    // 获取审核管理权限
    getAuditManage() {
      let _this = this
      this.$ajax.get('/menu/13').then(res => {
        if(res.status == 200) {
          this.auditManageList = res.data
          res.data.forEach(function (item) {
            if(item.url=='reprintManage'){
              _this.enabledOne  = item.enabled
            }else if(item.url=='produceManage'){
              _this.enabledTwo  = item.enabled
            }
          })
        }
      })
    },
    // 获取用户运营
    getData() {
      let url = "/home/data"
      this.$ajax.get(url, {}).then(res => {
        if (res.status === 200) {
          this.userData = res.data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      });
    },
    /*跳转页面*/
    changeView(page,name, enabled,pid) {
      localStorage.setItem('menuId', pid);
      if(!enabled) return false
      this.$router.push({name: page, query: { name: name}})
    },
  }
}
</script>
<style lang="less">
.box_container{
  margin-bottom: 20px;
}
.box {
  width: 100%;
  height: auto;
  background: #ffffff;
  border: 1px solid #d2dae9;
  .box_title {
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #f8f8f8;
    color: #666;
    padding: 0 20px;
  }
  .el-col{padding-top: 7px;padding-bottom: 7px}
  .box_content {
    width: 100%;
    height: auto;
    padding: 10px 20px;
    .box_item {
      background: #f7f7f7;
      text-align: center;
      height: 120px;
      padding: 30px 0;
      line-height: 2;
      // cursor: pointer;
      &.enabled {
        cursor: default;
        h2 {
          color: #999;
        }
      }
      p {
        /*font-size: 12px;*/
        /*color: #999;*/
      }
      h2 {
        font-size: 24px;
      }
      div{
        width: 100%;
        height: 85px;
        border: 1px solid #dfdfdf;
        border-bottom-style: dashed;
        margin-top: -30px;
        padding-top: 10px;
      }
      a.btn_item{
        display: block;
        width: 100%;
        height: 35px;
        border: 1px solid #dfdfdf;
        border-top: none;
        /*font-size: 12px;*/
        color: #666;
        line-height: 34px;
        &:hover{
          color: #30b8fe;
        }
      }
    }
  }
  .box_exa{
    height: 360px;
    .box_exa_item{
      width: 100%;
      height: 320px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      &.disabled {
        cursor: default;
        div {
          color: #999;
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
        div{
          width: 100%;
          height: auto;
          text-align: center;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          color: #ffffff;
          i{
            font-size: 30px;
            margin-bottom: 20px;
          }
          h2{
            /*font-size: 16px;*/
            line-height: 2;
          }
          p{
            /*font-size: 14px;*/
          }
        }
    }
    .exa_item{
      width: 100%;
      height: 320px;
      &>div{
        width: 100%;
        height: 153px;
        background: #000;
        color: #ffffff;
        overflow: hidden;
        position: relative;
        &:last-child{
          margin-top: 14px;
        }
        &:hover>div{
        top: 0;
        }
        &>div{
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .7);
          position: absolute;
          z-index: 2;
          left: 0;
          top: 100%;
          transition: all .3s ease-in-out;
          div{
            width: 100%;
            height: auto;
            text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            color: #ffffff;
            i{
              font-size: 30px;
              margin-bottom: 20px;
            }
            h2{
              font-size: 16px;
              line-height: 2;
            }
            p{
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
