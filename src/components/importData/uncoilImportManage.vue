<template>
  <div id="uncoilImportManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import uncoilImportData from '@/components/importData/uncoilImportManage/uncoilImportData.vue'

  export default {
    name: 'uncoilImportManage',
    data() {
      return {
        current: 'uncoilImportData',
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
      uncoilImportData,
    }
  }
</script>
