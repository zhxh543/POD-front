<template>
  <div id="systemModuleManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import systemModule from '@/components/systemManage/systemModuleManage/systemModule.vue'
  import moduleAdd  from '@/components/systemManage/systemModuleManage/moduleAdd.vue'

  export default {
    name: 'systemModuleManage',
    data() {
      return {
        current: '',
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
        if (newValue.query.com !== oldValue.query.com) {
          this.listenRouter();
        }
      }
    },
    mounted: function () {
      this.listenRouter();
    },
    methods: {
      //监听路由发生变化
      listenRouter() {
        if (this.$route.query.com) {
          this.current = this.$route.query.com;
        }else {
          this.current = 'systemModule';
        }
      },
    },
    components: {
      systemModule,
      moduleAdd
    }
  }
</script>
