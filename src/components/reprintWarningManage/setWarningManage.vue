<template>
  <div id="setWarningManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import setWarning from '@/components/reprintWarningManage/setWarningManage/setWarning.vue'

  export default {
    name: 'setWarningManage',
    data() {
      return {
        current: 'setWarning',
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
      setWarning,
    }
  }
</script>
