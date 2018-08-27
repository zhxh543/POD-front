<template>
  <div class="page_content">
    <el-row>
      <el-col :span="21">
        <v-left
          :type="flexType"
          :list="list"
          :contentFlag="contentFlag"
          :editActive="editActive"
          :current="pageCurrent"

          @changeClose="dClose"
          @editorOpen="editorOpen"
          @flexSet="flexSet"
          @setFlexIndex="setFlexIndex"
          @changeContent="changeContent"
          @editChange="editChange"
          @editSave="editSave"
          @deleteBox="deleteBox"
          @pageActive="pageActive"
        ></v-left>
      </el-col>
      <el-col :span="3">
        <v-right
          :type="type"
          @flex="flex"
        ></v-right>
      </el-col>
    </el-row>
    <v-dialog
      v-if="modal"
      :modal="modal"

      @dialogClose="dClose"
      @selectCollect="selectCollect"
    ></v-dialog>

    <el-dialog
      title="插入文字"
      :visible.sync="eModal"
      width="1050px"
      center
      :before-close="editorClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row style="height:300px;">
        <vue-html5-editor ref="editor" :content="content" :height="260" @change="updateData"></vue-html5-editor>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="4" :offset="20" class="text-right">
          <el-button type="primary" @click="editText">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import '@/assets/vue-html5-editor/css/style.css'
  import vLeft from '@/components/report/page/tools/left.vue'
  import vRight from '@/components/report/page/tools/right.vue'
  import vDialog from '@/components/report/page/tools/dialog.vue'

  export default {
    name: "pMain",
    props: ['type', 'list', 'editActive', 'contentFlag', 'pageCurrent'],
    data() {
      return {
        modal: false,
        eModal: false,
        editor: null,
        flexType: this.type,
        flexIndex: {
          index: -1,
          idx: -1,
          type: '',
          data: ''
        },
        content: ''
      }
    },
    components: {
      vLeft,
      vRight,
      vDialog
    },
    watch: {
      eModal(val, olVal) {
        if (val) {
          this.$nextTick(() => {
            if (this.editActive.index > -1 && this.editActive.idx > -1) {
              this.content = this.list[this.editActive.index].list[this.editActive.idx].data;
            }
          });
        }
      },
      type(val) {
        this.flexType = val;
      }
    },
    methods: {
      updateData(text) {
        this.content = text;
      },
      pageActive(index) {
        this.$emit('pageActive', index);
      },
      deleteBox(index, idx) {
        this.$emit('deleteBox', index, idx);
      },
      editText() {
        this.$emit('editSave', this.content);
        this.$nextTick(() => {
          this.eModal = false;
        });
      },
      editSave(data, flag) {
        this.$emit('editSave', data, flag);
      },
      changeContent(flag) {
        this.$emit('changeContent', flag);
      },
      flexSet(type) {
        this.$emit('flexSet', type);
      },
      flex(type) {
        this.$emit('flex', type);
      },
      dClose(flag) {
        this.modal = flag;
      },
      editorOpen(flag, index, idx) {
        this.eModal = flag;
        this.$emit('editChange', index, idx);
      },
      editChange(index, idx) {
        this.$emit('editChange', index, idx);
      },
      editorClose() {
        this.eModal = false;
        this.editor = null;
      },
      selectCollect(data) {
        this.changeContent(true);
        let setting = JSON.parse(data.settings);
        if (setting.chartType.indexOf('-') < 0)
          this.flexIndex.type = 'table';
        else
          this.flexIndex.type = 'chart';
        this.flexIndex.data = data.id;
        this.$emit('selectCollect', this.flexIndex);
      },
      setFlexIndex(index, idx) {
        this.flexIndex.index = index;
        this.flexIndex.idx = idx;
      }
    },
    mounted() {
    }
  }
</script>
