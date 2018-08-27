<template>
  <div id="reprintManage">
    <component :is="current"></component>
  </div>
</template>
<script>
  import reprintSuggest from '@/components/examineManage/reprintMange/reprintSuggest.vue'
  import examineEdit from '@/components/examineManage/reprintMange/examineEdit.vue'


  export default {
    name: 'reprintManage',
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
          this.current = 'reprintSuggest';
        }

      },
    },
    components: {
      reprintSuggest,
      examineEdit
    }
  }
</script>
