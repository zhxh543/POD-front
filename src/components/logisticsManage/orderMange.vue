<template>
  <div id="orderMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import factoryOrders from '@/components/logisticsManage/orderMange/factoryOrders.vue'

  export default {
    name: 'orderMange',
    data() {
      return {
        current: 'factoryOrders',
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
      factoryOrders,
    }
  }
</script>
