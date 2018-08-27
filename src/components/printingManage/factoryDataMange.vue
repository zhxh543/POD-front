<template>
  <div id="factoryDataMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import factoryData from '@/components/printingManage/factoryDataMange/factoryData.vue'

  export default {
    name: 'factoryDataMange',
    data() {
      return {
        current: 'factoryData',
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
      factoryData,
    }
  }
</script>
