<template>
  <div id="systemParameterManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import systemParameter from '@/components/systemManage/systemParameterManage/systemParameter.vue'

  export default {
    name: 'systemParameterManage',
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
          this.current = 'systemParameter';
        }
      },
    },
    components: {
      systemParameter,
    }
  }
</script>
