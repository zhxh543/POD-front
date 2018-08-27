<template>
  <div id="roleManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import roleManageList from '@/components/systemManage/roleManage/roleManageList.vue'
  import roleEmpower from '@/components/systemManage/roleManage/roleEmpower.vue'

  export default {
    name: 'roleManage',
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
          this.current = 'roleManageList';
        }
      },
    },
    components: {
      roleManageList,
      roleEmpower
    }
  }
</script>
