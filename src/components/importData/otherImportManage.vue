<template>
  <div id="otherImportManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import otherImportData from '@/components/importData/otherImportManage/otherImportData.vue'

  export default {
    name: 'otherImportManage',
    data() {
      return {
        current: 'otherImportData',
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
      otherImportData,
    }
  }
</script>
