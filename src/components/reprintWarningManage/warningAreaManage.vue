<template>
  <div id="warningAreaManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import warningArea from '@/components/reprintWarningManage/warningAreaManage/warningArea.vue'

  export default {
    name: 'warningAreaManage',
    data() {
      return {
        current: 'warningArea',
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
      warningArea,
    }
  }
</script>
