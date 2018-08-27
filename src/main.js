// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import less from 'less'
import 'element-ui/lib/theme-chalk/index.css'
import '@static/css/reset.css'
// import '@static/css/skin.css'
import '@static/fonts/iconfont.css'
import echarts from 'echarts'
import Crumbs from '@/components/common/crumbs.vue'   //面包屑组件
import http from './assets/js/http.js'
import {operateDesc} from './assets/js/public.js'  //public 文件用户信息
// editor
import VueHtml5Editor from './assets/vue-html5-editor/dist/vue-html5-editor.js'


const eOption = {
  // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
  name: "vue-html5-editor",
  // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
  showModuleName: false,
  // 自定义各个图标的class，默认使用的是font-awesome提供的图标
  icons: {
    text: "iconfont icon-Font-Style",
    color: "iconfont icon-color",
    font: "iconfont icon-ziti",
    align: "iconfont icon-ALIGNMIDDLE",
    list: "iconfont icon-list",
    link: "iconfont icon-link",
    unlink: "iconfont icon-unlink",
    tabulation: "iconfont icon-biaoge",
    image: "iconfont icon-image",
    hr: "iconfont icon-fengexian",
    eraser: "iconfont icon-qingchugeshi",
    undo: "iconfont icon-chexiao",
    // "full-screen": "fa fa-arrows-alt",
    // info: "fa fa-info",
  },
  // 配置图片模块
  image: {
    // 文件最大体积，单位字节  max file size
    sizeLimit: 1024 * 1024,
    // 上传参数,默认把图片转为base64而不上传
    upload: {
      url: 'api/chartBook/upload',
      headers: {},
      params: {},
      fieldName: 'file'
    },
    // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
    compress: null,
    // 响应数据处理,最终返回图片链接
    uploadHandler(responseText) {
      //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
      let json = JSON.parse(responseText);
      if (json.code === 200) {
        return json.data;
      } else {
        return json.msg;
      }
    }
  },
  // 语言，内建的有英文（en-us）和中文（zh-cn）
  language: "zh-cn",
  // 自定义语言
  i18n: {
    "zh-cn": {
      "align": "对齐方式",
      "image": "图片",
      "list": "列表",
      "link": "链接",
      "unlink": "去除链接",
      "table": "表格",
      "font": "文字",
      "full screen": "全屏",
      "text": "排版",
      "eraser": "格式清除",
      "info": "关于",
      "color": "颜色",
      "please enter a url": "请输入地址",
      "create link": "创建链接",
      "bold": "加粗",
      "italic": "倾斜",
      "underline": "下划线",
      "strike through": "删除线",
      "subscript": "上标",
      "superscript": "下标",
      "heading": "标题",
      "font name": "字体",
      "font size": "文字大小",
      "left justify": "左对齐",
      "center justify": "居中",
      "right justify": "右对齐",
      "ordered list": "有序列表",
      "unordered list": "无序列表",
      "fore color": "前景色",
      "background color": "背景色",
      "row count": "行数",
      "column count": "列数",
      "save": "确定",
      "upload": "上传",
      "progress": "进度",
      "unknown": "未知",
      "please wait": "请稍等",
      "error": "错误",
      "abort": "中断",
      "reset": "重置"
    }
  },
  // 隐藏不想要显示出来的模块
  // the modules you don't want
  hiddenModules: [],
  // 自定义要显示的模块，并控制顺序
  // keep only the modules you want and customize the order.
  // can be used with hiddenModules together
  visibleModules: [
    "text",
    "color",
    "font",
    "align",
    "list",
    "link",
    "unlink",
    "tabulation",
    "image",
    "hr",
    "eraser",
    "undo",
    // "full-screen",
    "info",
  ],
  // 扩展模块，具体可以参考examples或查看源码
  // extended modules
  modules: {
    //omit,reference to source code of build-in modules
  }
};

Vue.use(VueHtml5Editor, eOption);

require('echarts/map/js/china')

import $ from 'jquery'

const webRootUrl = 'http://rds.ptpress.com.cn/';

// 正式ip地址：http://10.10.2.223/
// 测试地址：http://rds.xatime888.com/
//正式地址：http://rds.ptpress.com.cn/

Vue.prototype.downloadUrl = webRootUrl+"file";//下载地址
Vue.prototype.serverUrl = webRootUrl;//网站地址

// 操作说明
Vue.prototype.dataCollectionDesc = operateDesc.dataCollectionDesc;
Vue.prototype.appUserDesc = operateDesc.appUserDesc;
Vue.prototype.warningBaseDesc = operateDesc.warningBaseDesc;
Vue.prototype.defPwdDesc = operateDesc.defPwdDesc;
Vue.prototype.costPodDesc = operateDesc.costPodDesc;
Vue.prototype.costTradDesc = operateDesc.costTradDesc;
Vue.prototype.costThresholdDesc = operateDesc.costThresholdDesc;
Vue.prototype.importDesc = operateDesc.importDesc;
Vue.prototype.importIntDesc = operateDesc.importIntDesc;
Vue.prototype.setWarningDesc = operateDesc.setWarningDesc;
Vue.use(ElementUI)
Vue.use(less)
Vue.prototype.$echarts = echarts

Vue.use(Vuex);

Vue.config.productionTip = false

Vue.prototype.$ajax = http;

Vue.component('Crumbs', Crumbs);   //全局使用面包屑
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
