<template>
  <div id="printSpeedStateMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import printSpeedState from '@/components/reprintManage/printSpeedStateMange/printSpeedState.vue'

  export default {
    name: 'printSpeedStateMange',
    data() {
      return {
        current: 'printSpeedState',
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
      printSpeedState,
    }
  }
</script>
