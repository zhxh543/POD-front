<template>
  <div class="report_dialog">
    <el-dialog
      title="插入文字"
      :visible.sync="modal"
      width="1050px"
      center
      :before-close="handleClose"
    >
      <el-row>
        <Vueditor ref="editor"></Vueditor>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'vEditor',
    props: ['str'],
    data() {
      return {
        modal: true,
        edit: null
      };
    },
    mounted() {
      this.setEditor();
    },
    methods: {
      setEditor() {
        this.edit = null;
        this.$nextTick(() => {
          this.edit = this.$refs['editor'];
          this.edit.setContent(this.str);
        });
      },
      handleClose() {
        this.$emit('editorClose', false, this.edit.getContent());
        this.edit = null;
      }
    }
  };
</script>
<style scoped lang="less" type="text/less">
  .left {
    height: 500px;
    width: 400px;
    float: left;
  }

  .right {
    height: 500px;
    float: left;
    width: 600px;
    border: 1px solid #cccccc;
  }
</style>
