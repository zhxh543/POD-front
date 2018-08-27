<template>
  <div class="content_report">
    <dl class="menu_box">
      <dd><p v-html="menuList.title"></p></dd>
      <dd v-for="(item,index) in menuList.list" @click="changeComponent(item.value)" :key="index">
        <a href="javascript:void(0);"  v-html="item.name" :class="{active:current === item.url}"></a>
        <!--<a :href="hrefUrl(item.url)" :target="isNewWindow(item.url)" v-html="item.name" :class="{active:current === item.url}"></a>-->
      </dd>
    </dl>
    <div class="content_box">
      <component :is="current"></component>
    </div>
  </div>
</template>
<script>
  import systemMessageManage from '@/components/newsManage/systemMessageManage.vue'

  export default {
    name: 'newsManage',
    data() {
      return {
        current: 'systemMessageManage',
        menuList: {
          title: '消息管理',
          list: [{
            name: '站内消息',
            value: 'systemMessageManage'
          },
          ]
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
        this.changeCurrentView()
    },
    methods: {
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
        this.$router.push({name: "newsManage", query: params});
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
          this.$router.push({name: 'newsManage', query: {name: page}});
          this.current = page;
        }
      },
      // hrefUrl (url){
      //   let checkUrl = url.toLowerCase()
      //   if(checkUrl.indexOf("http") != -1){
      //     return url
      //   }else {
      //     return "javascript:void(0);"
      //   }
      // },
      // isNewWindow (url){
      //   let checkUrl = url.toLowerCase()
      //   if(checkUrl.indexOf("http") != -1){
      //     return "_blank"
      //   }
      // },
    },
    components: {
      systemMessageManage,

    }
  }
</script>
