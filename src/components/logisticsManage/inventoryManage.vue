<template>
  <div id="inventoryManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import factoryInventory from '@/components/logisticsManage/inventoryManage/factoryInventory.vue'

  export default {
    name: 'inventoryManage',
    data() {
      return {
        current: 'factoryInventory',
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
      factoryInventory,
    }
  }
</script>
