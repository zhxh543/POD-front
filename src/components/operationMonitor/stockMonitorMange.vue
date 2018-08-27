<template>
  <div id="stockMonitorMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import stockMonitor from '@/components/operationMonitor/stockMonitorMange/stockMonitor.vue'

  export default {
    name: 'stockMonitorMange',
    data() {
      return {
        current: 'stockMonitor',
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
      stockMonitor,
    }
  }
</script>
