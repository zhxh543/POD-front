<template>
  <div id="roadMonitorMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import roadMonitor from '@/components/operationMonitor/roadMonitorMange/roadMonitor.vue'

  export default {
    name: 'roadMonitorMange',
    data() {
      return {
        current: 'roadMonitor',
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
      roadMonitor,
    }
  }
</script>
