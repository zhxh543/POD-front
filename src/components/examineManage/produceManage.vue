<template>
  <div id="produceManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import produceWorkList from '@/components/examineManage/produceManage/produceWorkList.vue'

  export default {
    name: 'produceManage',
    data() {
      return {
        current: 'produceWorkList',
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
      produceWorkList,
    }
  }
</script>
