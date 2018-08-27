<template>
  <div class="content_report">
    <dl class="menu_box">
      <dd><p v-html="menuList.title"></p></dd>
      <dd v-for="(item,index) in menuList.list" @click="changeComponent(item.url)" :key="index">
        <!--<a href="javascript:void(0);" v-html="item.name" :class="{active:current === item.url}"></a>-->
        <a :href="hrefUrl(item.url)" :target="isNewWindow(item.url)" v-html="item.name" :class="{active:current === item.url}"></a>

      </dd>
    </dl>
    <div class="content_box">
      <component :is="current"></component>
    </div>
  </div>
</template>
<script>
  import index from '@/components/report/data/index.vue'
  import setting from '@/components/report/report/index.vue'
  import page from '@/components/report/page/index.vue'

  export default {
    name: 'report',
    data() {
      return {
        current: 'index',
        menuList: {
          title: '',
          list: []
      // {
      //   name: '数据管理',
      //     value: 'index'
      // }, {
      //   name: '报表管理',
      //     value: 'setting'
      // }, {
      //   name: '页面管理',
      //     value: 'page'
      // }
        }
      }
    },
    watch: {
      current(val, olVal) {
        if (val !== olVal) {
          this.$router.push({name: 'report', query: {name: this.current}});
        }
      },
      '$route'(to, f) {
        if (to.query.name !== f.query.name) {
          this.current = to.query.name;
        }
      },
    },
    components: {
      index,
      setting,
      page
    },
    methods: {
      getMenu () {
        const menuId = localStorage.getItem("menuId");
        const menuName = localStorage.getItem("menuName");
        this.menuList.title = menuName
        let url = "/menu/"+menuId
        let param = {
          "parentId":menuId,
        }
        this.$ajax.get(url,param).then(res => {
          if(res.status === 200){
            this.menuList.list = res.data
          }
        });
      },
      routeWatch() {
        let name = '', params = JSON.parse(JSON.stringify(this.$route.query));
        if (this.$route.query.name) {
          name = this.$route.query.name;
        } else {
          name = this.current;
          params.name = this.current;
        }
        this.current = name;
        this.$router.push({name: 'report', query: params});
      },
      changeComponent(page) {    //点击左侧nav切换组件
        let url = page.toLowerCase()
        if(url.indexOf("http") != -1){
          return
        }else{
          this.current = page;
        }
      },
      hrefUrl (url){
        let checkUrl = url.toLowerCase()
        if(checkUrl.indexOf("http") != -1){
          return url
        }else {
          return "javascript:void(0);"
        }
      },
      isNewWindow (url){
        let checkUrl = url.toLowerCase()
        if(checkUrl.indexOf("http") != -1){
          return "_blank"
        }
      },
    },
    mounted() {
      this.getMenu()
      this.routeWatch();
    }
  }
</script>
