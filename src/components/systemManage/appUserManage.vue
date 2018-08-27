<template>
  <div id="appUserManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import appUserList from '@/components/systemManage/appUserManage/appUserList.vue'
  import appUserEmpower from '@/components/systemManage/appUserManage/appUserEmpower.vue'

  export default {
    name: 'appUserManage',
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
          this.current = 'appUserList';
        }
      },
    },
    components: {
      appUserList,
      appUserEmpower
    }
  }
</script>
