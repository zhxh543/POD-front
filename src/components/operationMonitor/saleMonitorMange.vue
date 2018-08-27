<template>
  <div id="saleMonitorMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import saleMonitor from '@/components/operationMonitor/saleMonitorMange/saleMonitor.vue'

  export default {
    name: 'saleMonitorMange',
    data() {
      return {
        current: 'saleMonitor',
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
    },
    methods: {
      //监听路由发生变化
      listenRouter() {
        if (this.$route.query.name) {
          this.current = this.$route.query.name;
        }
      },
    },
    components: {
      saleMonitor,
    }
  }
</script>
