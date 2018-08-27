<template>
  <div id="receiveManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import receiveList from '@/components/reprintManage/receiveManage/receiveList.vue'

  export default {
    name: 'receiveManage',
    data() {
      return {
        current: 'receiveList',
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
      receiveList,
    }
  }
</script>
