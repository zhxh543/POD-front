<template>
  <div id="produceMonitorMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import produceMonitor from '@/components/operationMonitor/produceMonitorMange/produceMonitor.vue'

  export default {
    name: 'produceMonitorMange',
    data() {
      return {
        current: 'produceMonitor',
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
      produceMonitor,
    }
  }
</script>
