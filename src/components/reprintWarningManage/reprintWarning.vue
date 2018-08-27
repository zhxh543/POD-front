<template>
  <div id="reprintWarning">
    <component :is="current"></component>
  </div>
</template>
<script>
  import reprintWarningList from '@/components/reprintWarningManage/reprintWarning/reprintWarningList.vue'

  export default {
    name: 'reprintWarning',
    data() {
      return {
        current: 'reprintWarningList',
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
      reprintWarningList,
    }
  }
</script>
