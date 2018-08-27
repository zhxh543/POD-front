<template>
  <div class="content_report">
    <dl class="menu_box">
      <dd><p v-html="menuList.title"></p></dd>
      <dd v-for="(item,index) in menuList.list" @click="changeComponent(item.url)" :key="index">
        <a :href="hrefUrl(item.url)" :target="isNewWindow(item.url)" v-html="item.name" :class="{active:current === item.url}"></a>
      </dd>
    </dl>
    <div class="content_box">
      <component :is="current"></component>
    </div>
  </div>
</template>
<script>
  import stockMonitorMange from '@/components/operationMonitor/stockMonitorMange.vue'
  import saleMonitorMange from '@/components/operationMonitor/saleMonitorMange.vue'
  import produceMonitorMange from '@/components/operationMonitor/produceMonitorMange.vue'
  import roadMonitorMange from '@/components/operationMonitor/roadMonitorMange.vue'


  export default {
    name: 'operationMonitor',
    data() {
      return {
        current: '',
        menuList: {
          title: '',
          list: []
        }
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
        if (newValue.query.name !== oldValue.query.name) {
          this.listenRouter();
        }
      }
    },
    mounted: function () {
        this.getMenu()
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
            this.current = res.data[0].url
            this.changeCurrentView()
          }
        });
      },
      changeCurrentView() {    // 刷新页面定位到当前组件
        var name = "";
        var params = JSON.parse(JSON.stringify(this.$route.query));
        if (this.$route.query.name) {
          name = this.$route.query.name;
        } else {/*没有$route.query.name时，默认打开第一个组件*/
          name = this.current;
          params.name=this.current;
        }
      this.current = name;
        this.$router.push({name: "operationMonitor", query: params});
      },
      //监听路由发生变化
      listenRouter() {
        if (this.$route.query.name) {
          this.current = this.$route.query.name;
        }
      },
      changeComponent(page) {    //点击左侧nav切换组件
        let url = page.toLowerCase()
        if(url.indexOf("http") != -1){
          return
        }else{
          this.$router.push({name: 'operationMonitor', query: {name: page}});
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
    components: {
      stockMonitorMange,
      saleMonitorMange,
      produceMonitorMange,
      roadMonitorMange,
    }
  }
</script>
