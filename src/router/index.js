import Vue from 'vue'
import Router from 'vue-router'
//入口文件
const Entry = () => import('@/components/Entry/entry');

const home = () => import('@/components/content/user');
const report = () => import('@/components/content/report');
const review = () => import('@/components/report/review');
const reportView = () => import('@/components/report/review/reportView');
const PrintingManage = () => import('@/components/content/printingMenu');//印制管理
const ExamineManage = () => import('@/components/content/examineMenu');//审核管理
const ImportManage = () => import('@/components/content/importMenu');//数据导入
const LogisticsManage = () => import('@/components/content/logisticsMenu');//厂存物流管理
const OperationMonitor = () => import('@/components/content/operationMenu');//运营监控
const ReprintManage = () => import('@/components/content/reprintMenu');//重印工单管理
const ReprintWarningManage = () => import('@/components/content/reprintWarningMenu');//重印预警
const SystemManage = () => import('@/components/content/systemMenu');//系统管理
const NewsManage = () => import('@/components/content/newsMenu');//消息管理
const Login = () => import('@/components/login/login');//登录


Vue.use(Router)

export default new Router({
  linkActiveClass: 'linkActive',
  routes: [
    {
      path: '/',
      redirect: '/entry',
    },
    {
      path: '/review',
      name: 'review',
      component: review
    },
    {
      path: '/reportView',
      name: 'reportView',
      component: reportView
    },
    {
    path:'/entry',
    name:'entry',
    component:Entry,
    redirect:'/home',
    children: [
      {
        path: '/',
        name: 'home',
        component: home,
        redirect: '/index'
      },
      {
        path: '/index',
        name: 'index',
        component: home
      },
      {
        path: '/report',
        name: 'report',
        component: report
      },
      {
        path: '/printingManage',
        component: PrintingManage,
        name: 'printingManage'
      },
      {
        path: '/examineManage',
        component: ExamineManage,
        name: 'examineManage'
      },
      {
        path: '/importManage',
        component: ImportManage,
        name: 'importManage'
      },
      {
        path: '/logisticsManage',
        component: LogisticsManage,
        name: 'logisticsManage'
      },
      {
        path: '/operationMonitor',
        component:OperationMonitor,
        name: 'operationMonitor'
      },
      {
        path: '/reprintManage',
        component:ReprintManage,
        name: 'reprintManage'
      },
      {
        path: '/reprintWarningManage',
        component:ReprintWarningManage,
        name: 'reprintWarningManage'
      },
      {
        path: '/systemManage',
        component:SystemManage,
        name: 'systemManage'
      },
      {
        path: '/newsManage',
        component:NewsManage,
        name: 'newsManage'
      }
    ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
