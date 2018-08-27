<template>
  <div id="passwordManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import resetPassword from '@/components/systemManage/passwordManage/resetPassword.vue'

  export default {
    name: 'passwordManage',
    data() {
      return {
        current: '',
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
        console.log(newValue)
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
          this.current = 'resetPassword';
        }
      },
    },
    components: {
      resetPassword,
    }
  }
</script>
