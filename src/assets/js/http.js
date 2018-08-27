'use strict'

import axios from 'axios'
import qs from 'qs'

const localUrl = window.location.protocol + '//' + window.location.host;
let jumpLock  = 0 //如果出现401就false 不执行jumplogin

// axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  // console.log(response)
  return response

}, error => {
  // console.log(error)
  return Promise.resolve(error.response)
})

axios.defaults.withCredentials = true

  // axios.defaults.baseURL = (process.env.NODE_ENV == 'development' ? '/api' : 'http://10.10.2.223/api/')     //http://wx.ptpress.com.cn:8086
axios.defaults.baseURL = (process.env.NODE_ENV == 'development' ? '/api' : 'http://rds.ptpress.com.cn/api/')     //http://wx.ptpress.com.cn:8086
 // axios.defaults.baseURL = (process.env.NODE_ENV == 'development' ? '/api' : 'http://rds.xatime888.com/api/')     //http://wx.ptpress.com.cn:8086
// axios.defaults.baseURL = (process.env.NODE_ENV == 'development' ? '/api' : 'http://10.10.2.223/api/')     //http://wx.ptpress.com.cn:8086
function jumpLogin () {//跳转登录
  // localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
  // 获取http协议
  var protocol      = window.location.protocol;
  //获取主机名+端口号
  var host          = window.location.host;
  //  公用请求地址
  var publicUrls     = protocol + "//" + host;
  window.location.href = publicUrls+'/#/login';
  return false
};
export default {
  getUrl(){
    return localUrl;
  },
  login(url, params) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(params)
    });
  },
  post(url, params, config) {
    let header = {'Content-Type': 'application/json;charset=UTF-8'};
    let p = params;
    if (config) {
      header = config;
      p = qs.stringify(params)
    } else {
      p = JSON.stringify(params)
    }
    return axios({
      method: 'post',
      url,
      data: p,
      headers: header
    }).then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状
        jumpLogin()
        return false;
      }else {
        return response;
      }
    })
  },
  file(url, params) {
    return axios({
      method: 'post',
      url,
      data: params,
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
        jumpLogin()
        return false;
      }else if(response.status ===403){
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return
      }else {
        return response;
      }
    })
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
    })
      .then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
        jumpLogin()
        return false;
      }else if(response.status ===403){
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return
      }else {
        return response;
      }
    })
  },
  getMessage(url,params){
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
    }).then((response) => {
      return response
    })
  },
  update(url, params, method) {
    return axios({
      method: method,
      url,
      data: JSON.stringify(params),
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
        jumpLogin()
        return false;
      }else if(response.status ===403){
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return
      }else {
        return response;
      }
    });
  },
  put(url, params) {
    return axios({
      method: 'put',
      url,
      data: JSON.stringify(params),
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
        jumpLogin()
        return false;
      }else if(response.status ===403){
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return
      }else {
        return response;
      }
    })
  },
  putSimple(url, params) {
    return axios({
      method: 'put',
      url,
      data: params,
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
        jumpLogin()
        return false;
      }else if(response.status ===403){
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return
      }else {
        return response;
      }

    })
  },
  delete(url, params) {
    return axios({
      method: 'delete',
      url,
      data: JSON.stringify(params),
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if(response.status ===401){
        localStorage.setItem('isLogin', false);//在浏览器里面记录登录状态
        jumpLogin()
        return false;
      }else if(response.status ===403){
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return
      }else {
        return response;
      }
    })
  }
}
