<template>
  <div class="left">
    <ul class="nav" :class="{'active':!menuActive}">
      <li @click="changeCurrent()">
        <a class="showActive" style="text-align: center"><i class="el-icon-menu"></i></a>
      </li>
      <li v-for="(item, index) in menuList" :key="index" @click="getMenuId(item.id,item.name)">
        <router-link :to="item.url"  :title="item.name">
          <i :class="item.icon"></i>
          <span v-html="item.name"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'left',
    props: ["menuActive"],//current-name--来自哪个页面的调用；
    data() {
      return {
        menuList : []
      }
    },
    created() {
      // this.getMenuListFun()
    },
    beforeCreate (){
      let _this = this
      this.$ajax.get('/menu',)
        .then(function (res) {
          if(!res) {
            _this.$router.push({"name":"login"})
          }else {
            _this.menuList = res.data
          }
        })
        .catch(function (error) {
          // console.log("err",error);
        });
    },
    methods: {
      // 获取一级菜单
      getMenuListFun() {
        this.$ajax.get('/menu').then(res => {
          if(res.status == 200) {
            this.menuList = res.data
          }
        })
      },
      // 跳转页面
      toViewFun(item) {
        console.log(item)
      },
      changeCurrent () {
        this.$emit("activeChanged",!this.menuActive)
        localStorage.setItem('showMenu', this.menuActive);
      },
      getIsMenuShow() {    //获取localStorage，判断菜单是否显示
        const showMenuStorage = localStorage.getItem("showMenu");
        if (showMenuStorage == false) {
          this.$emit("activeChanged",false)
        }else {
          this.$emit("activeChanged",true)
        }
      },
      getMenuId (id,name){
        localStorage.setItem('menuId', id);
        localStorage.setItem('menuName', name);
      }
    },
    mounted() {
      this.getIsMenuShow();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  .left {
    width: auto;
    height: 100%;
    background: #ffffff;
    border-right: 1px solid #d2dae9;
  }

  .nav {
    width: 160px;
  }

  .nav.active {
    width: 50px;
  }

  .nav.active a {
    width: 50px;
    overflow: hidden;
  }

  .nav.active span {
    display: none;
  }

  .nav a {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    /*color: #8f8f8f;*/
    /*font-size: 14px;*/
    transition: all .3s ease-in-out;
  }

  .nav a i {
    font-size: 22px;
  }

  .nav span {
    margin-left: 10px;
  }

  .nav a:hover, .nav a.linkActive{
    /*background: #373737;*/
    color: #fff;
  }
  .showActive{
    cursor: pointer;
    /*background: #373737;*/
    i{
      color: #fff;}
  }

  .nav {
    position: relative;
    overflow: hidden;
    height: 100%;
  }
</style>
