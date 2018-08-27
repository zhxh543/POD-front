<template>
  <div id="costParameterMange">
    <component :is="current"></component>
  </div>
</template>
<script>
  import costParameter from '@/components/printingManage/costParameterMange/costParameter.vue'

  export default {
    name: 'costParameterMange',
    data() {
      return {
        current: 'costParameter',
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
      costParameter,
    }
  }
</script>
