<template>
  <div id="printSpeedMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import printSpeed from '@/components/reprintManage/printSpeedMange/printSpeed.vue'

  export default {
    name: 'printSpeedMange',
    data() {
      return {
        current: 'printSpeed',
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
      printSpeed,
    }
  }
</script>
