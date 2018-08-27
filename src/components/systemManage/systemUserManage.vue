<template>
  <div id="systemUserManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import systemUser from '@/components/systemManage/systemUserManage/systemUser.vue'

  export default {
    name: 'systemUserManage',
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
          this.current = 'systemUser';
        }
      },
    },
    components: {
      systemUser,
    }
  }
</script>
