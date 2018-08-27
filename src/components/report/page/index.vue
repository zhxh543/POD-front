<template>
  <div class="el_content">
    <div class="el_top_title">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList"></Crumbs>
      <div class="top_tools" v-if="crumbsList.length > 1">
        <!--<el-button size="small" @click="outPut">导出图片</el-button>-->
        <el-button size="small" @click="reviewPage(false)">预览</el-button>
        <el-button size="small" @click="pageModal = true">添加资源框</el-button>
        <el-button size="small" @click="editModal = true">保存</el-button>
      </div>
    </div>
    <div class="el_body" id="body">
      <component
        :is="current"
        :type="flexType"
        :list="pageList"
        :mainList="mainList"
        :editActive="editActive"
        :contentFlag="contentFlag"
        :pageCurrent="pageCurrent"

        @nextStep="next"
        @flex="flexChange"
        @flexSet="flexSet"
        @getMainList="getList"
        @selectCollect="selectCollect"
        @changeContent="changeContent"
        @editChange="editChange"
        @editSave="editSave"
        @deleteBox="deleteBox"
        @deletePage="deletePage"
        @editMain="editMain"
        @review="review"
        @pageActive="pageActive"
      ></component>
    </div>

    <el-dialog
      title="保存页面"
      :visible.sync="editModal"
      width="800px"
      center
      :before-close="editClose"
    >
      <el-row :gutter="15">
        <el-col :span="4" class="tool_name">页面名称：</el-col>
        <el-col :span="20">
          <el-input type="text" placeholder="请输入页面名称" v-model.trim="pageMain.name"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top: 20px;">
        <el-col :span="3" :offset="18" class="text-right">
          <el-button @click="editClose">取消</el-button>
        </el-col>
        <el-col :span="3" class="text-right">
          <el-button type="primary" :disabled="!pageMain.name" :loading="loading" @click="editPage">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="选择布局方式"
      :visible.sync="pageModal"
      width="800px"
      center
      :before-close="pageClose"
    >
      <el-row :gutter="15">
        <el-col :span="4" class="tool_name">插入位置：</el-col>
        <el-col :span="20" style="line-height:40px;">
          <el-radio v-model="pageInsert" label="1">下方插入</el-radio>
          <el-radio v-model="pageInsert" label="2" :disabled="pageCurrent < 0">上方插入</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="4" class="tool_name">布局方式：</el-col>
        <el-col :span="20">
          <el-row :gutter="20" class="page_layout">
            <el-col :span="6">
              <el-radio v-model="pageLay" label="1"><img src="@/assets/report/img/lay1.png" alt=""></el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio v-model="pageLay" label="2"><img src="@/assets/report/img/lay2.png" alt=""></el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio v-model="pageLay" label="3"><img src="@/assets/report/img/lay3.png" alt=""></el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio v-model="pageLay" label="4"><img src="@/assets/report/img/lay4.png" alt=""></el-radio>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top: 20px;">
        <el-col :span="3" :offset="18" class="text-right">
          <el-button @click="pageClose">取消</el-button>
        </el-col>
        <el-col :span="3" class="text-right">
          <el-button type="primary" @click="addLayout">插入</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!--<img :src="img" v-if="img">-->
    <!--<a :href="img" v-if="img" target="_blank">下载</a>-->
  </div>
</template>
<script>
  import '@/assets/report/css/page.css'
  import html2canvas from 'html2canvas';
  import vIndex from '@/components/report/page/tools/index.vue'
  import vContent from '@/components/report/page/tools/main.vue'

  export default {
    name: 'index',
    data() {
      return {
        pageFlag: false,
        height: document.body.clientHeight - 250,
        editModal: false,
        loading: false,
        pageList: [],
        crumbsList: [   //  面包屑
          {name: '页面管理', url: {routerName: 'report', params: {name: 'page', page: 'vIndex'}}},
        ],
        pageMain: {
          id: '',
          name: '',
          settings: ''
        },
        current: 'vIndex',
        flexType: '1-1-0',
        img: null,
        mainList: {
          page: {
            current: 1,
            size: 10,
            total: 0
          },
          data: []
        },
        contentFlag: false,
        editActive: {
          index: -1,
          idx: -1
        },
        pageCurrent: -1,
        pageModal: false,
        pageLay: '1',
        pageInsert: '1'
      }
    },
    components: {
      vIndex,
      vContent
    },
    watch: {
      '$route'(to, f) {
        if (to.query.page !== f.query.page) {
          this.current = to.query.page;
        }
      },
      current(val, olVal) {
        if (val !== olVal) {
          this.$router.push({name: 'report', query: {name: 'page', page: this.current}});
        }
        switch (val) {
          case 'vIndex':
            this.crumbsList = [
              {name: '页面管理', url: {routerName: 'report', params: {name: 'page', page: 'vIndex'}}}
            ];
            this.reset();
            break;
          case 'vContent':
            this.crumbsList = [
              {name: '页面管理', url: {routerName: 'report', params: {name: 'page', page: 'vIndex'}}},
              {name: '配置页面', url: ''}
            ];
            break;
        }
      }
    },
    methods: {
      pageActive(index) {
        this.pageCurrent = index;
      },
      pageClose() {
        this.pageModal = false;
        this.pageCurrent = -1;
        this.pageLay = '1';
        this.pageInsert = '1';
      },
      addLayout() {
        this.setListSeq(this.pageList);
        if (this.pageCurrent < 0) {
          this.setLayout(this.pageList, true);
        } else
          this.setLayout(this.pageList, false);
      },
      setLayout(list, flag) {
        let line = '', n = -1;
        let lay = parseInt(this.pageLay);
        if (lay > 0) {
          line = {
            add: true,
            hr: true,
            col: lay,
            height: 300,
            seq: list.length - 1,
            list: []
          };
          for (let i = 0; i < lay; i++) {
            line.list.push({
              col: lay,
              type: '',
              data: '',
              hr: false
            });
          }
        }
        if (flag)
          list.push(line);
        else {
          if (this.pageInsert === '2') {
            list.forEach((item, index) => {
              if ((this.pageCurrent - 1) <= index) {
                item.seq = index + 1;
              }
            });
            line.seq = this.pageCurrent;
          } else {
            list.forEach((item, index) => {
              if (this.pageCurrent < index) {
                item.seq = index + 1;
              }
            });
            line.seq = this.pageCurrent + 1;
          }
          list.push(line);
          list.sort(this.sortSeq);
        }
        this.pageClose();
      },
      setListSeq(list) {
        if (list.length > 0)
          list.forEach((item, index) => {
            if (!item.seq) {
              item.seq = index;
            }
          });
      },
      sortSeq(a, b) {
        return a.seq - b.seq
      },


      reset() {
        this.pageList = [];
        this.flexType = '1-1-0';
        this.pageMain = {
          id: '',
          name: '',
          settings: ''
        };
        this.pageCurrent = -1;
        this.pageLay = '1';
        this.pageInsert = '1';
      },
      reviewPage(flag) {
        let url = this.$ajax.getUrl();
        if (flag) {
          let time = new Date();
          window.open(`${url}/#/review?id=${this.pageMain.id}&v=${time.getTime()}`);
        } else {
          let settings = {
            flexType: this.flexType,
            pageList: this.pageList
          };
          localStorage.removeItem('settings');
          localStorage.setItem('settings', JSON.stringify(settings));
          window.open(url + '/#/review');
        }
      },
      review(data) {
        if (data) {
          this.pageMain = data;
          this.reviewPage(true);
        }
      },
      editPage() {
        let settings = {
          flexType: this.flexType,
          pageList: this.pageList
        };
        let method = 'post', url = '/chartBook';
        if (this.pageMain.id) {
          url = url + '/' + this.pageMain.id;
          method = 'put';
        } else
          delete this.pageMain.id;
        this.pageMain.settings = JSON.stringify(settings);
        this.loading = true;
        this.$ajax.update(url, this.pageMain, method).then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.$message.success(res.data.msg);
            this.editModal = false;
            this.current = 'vIndex';
            this.getList(1);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      editClose() {
        this.editModal = false;
      },

      editMain(data) {
        this.pageMain = {
          id: data.id,
          name: data.name,
          settings: data.settings
        };
        let settings = JSON.parse(data.settings);
        this.flexType = settings.flexType;
        this.pageList = settings.pageList;
        this.setListSeq(this.pageList);
        this.current = 'vContent';
      },

      deletePage(data) {
        if (data.id) {
          this.$confirm('此操作将永久删除该页面, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete('/chartBook/' + data.id).then(res => {
              if (res.status === 200) {
                this.$message.success(res.data.msg);
                this.getList(1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
          }).catch(() => {
            return false;
          });
        }
      },

      routeWatch() {
        let name = '', params = JSON.parse(JSON.stringify(this.$route.query));
        if (this.$route.query.page) {
          name = this.$route.query.page;
        } else {
          name = this.current;
          params.name = 'page';
          params.page = this.current;
        }
        this.current = name;
        this.$router.push({name: 'report', query: params});
      },
      next(param) {
        if (param.indexOf('index') >= 0) {
          this.current = 'vIndex';
        } else if (param.indexOf('main') >= 0) {
          this.reset();
          this.current = 'vContent';
        }
      },
      flexChange(type) {
        let flag = false;
        this.pageList.forEach((item, index) => {
          item.list.forEach((itm, idx) => {
            if (itm.type)
              flag = true;
          });
        });
        if (flag) {
          this.$confirm('修改布局将丢失当前布局数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.flexType = type;
          }).catch(() => {
            return false;
          });
        } else
          this.flexType = type;
      },
      setFlex(list, type, height) {
        let line = {
          height: 0,
          hr: false,
          list: []
        };
        if (height === 100) {
          line.height = 100;
          line.hr = true;
          line.list.push({
            col: '1',
            type: '',
            data: ''
          });
        } else
          for (let i = 0; i < type; i++) {
            line.height = height;
            line.hr = true;
            let o = {
              col: type,
              hr: false,
              type: '',
              data: ''
            };
            line.list.push(o);
          }
        list.push(line);
      },
      flexSet(type) {
        switch (parseInt(type[0])) {
          case 1:
            this.pageList = [];
            if (type[2] === '0')
              this.setFlex(this.pageList, parseInt(type[1]), this.height);
            else
              this.setFlex(this.pageList, 2, this.height);
            break;
          case 2:
            this.pageList = [];
            if (type[1] === '0') {
              this.setFlex(this.pageList, 1, 100);
              this.setFlex(this.pageList, parseInt(type[2]), this.height - 110);
            } else {
              this.setFlex(this.pageList, parseInt(type[1]), this.height / 2 - 5);
              this.setFlex(this.pageList, parseInt(type[2]), this.height / 2 - 5);
            }
            break;
          case 3:
            this.pageList = [];
            this.setFlex(this.pageList, 1, 100);
            this.setFlex(this.pageList, parseInt(type[2]), (this.height / 2 - 60));
            this.setFlex(this.pageList, parseInt(type[3]), (this.height / 2 - 60));
            break;
        }
      },
      getList(page) {
        this.mainList.page.current = page;
        this.$ajax.get('/chartBook', {
          current: page,
          size: this.mainList.page.size,
          descs: 'createdTime'
        }).then(res => {
          if (res.status === 200) {
            this.mainList.page.total = res.data.total;
            this.mainList.data = res.data.records;
          }
        });
      },
      outPut() {
        let $this = this;
        let body = document.getElementById("body");
        html2canvas(body).then(function (canvas) {
          $this.img = canvas.toDataURL();
        });
      },
      selectCollect(param) {
        this.pageList[param.index].list[param.idx].type = param.type;
        this.pageList[param.index].list[param.idx].data = param.data;
        if (param.type === 'table') {
          this.pageList[param.index].list[param.idx].tableData = {
            data: [],
            keys: []
          };
        }
      },
      changeContent(flag) {
        this.contentFlag = flag;
      },
      editChange(index, idx) {
        this.editActive.index = index;
        this.editActive.idx = idx;
      },
      editSave(text, flag) {
        let type = '';
        if (text) {
          if (flag)
            type = 'image';
          else
            type = 'text';
          this.pageList[this.editActive.index].list[this.editActive.idx].data = text;
          this.pageList[this.editActive.index].list[this.editActive.idx].type = type;
        }
      },
      deleteBox(index, idx) {
        if (!this.pageList[index].list[idx].type) {
          this.pageList[index].list.splice(idx, 1);
          if (this.pageList[index].list.length < 1)
            this.pageList.splice(index, 1);
        } else {
          this.pageList[index].list[idx].type = '';
          this.pageList[index].list[idx].data = '';
          if (this.pageList[index].list[idx].tableData)
            delete this.pageList[index].list[idx].tableData;
        }
      }
    }
    ,
    mounted() {
      this.routeWatch();
      this.getList(1);
    }
  }
</script>
