<template>
  <div id="systemMessageManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import systemMessage from '@/components/newsManage/systemMessageManage/systemMessage.vue'

  export default {
    name: 'systemMessageManage',
    data() {
      return {
        current: '',
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
        console.log(newValue)
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
          this.current = 'systemMessage';
        }
      },
    },
    components: {
      systemMessage,
    }
  }
</script>
