<template>
  <div id="appManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import appManageList from '@/components/systemManage/appManage/appManageList.vue'
  import weChatTel  from '@/components/systemManage/appManage/weChatTel.vue'

  export default {
    name: 'appManage',
    data() {
      return {
        current: '',
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
        if (newValue.query.com !== oldValue.query.com) {
          this.listenRouter();
        }
      }
    },
    mounted: function () {
      this.listenRouter();
    },
    methods: {
      //监听路由发生变化
      listenRouter() {
        if (this.$route.query.com) {
          this.current = this.$route.query.com;
        }else {
          this.current = 'appManageList';
        }
      },
    },
    components: {
      appManageList,
      weChatTel
    }
  }
</script>
