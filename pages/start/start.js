// pages/start/start.js
import { Config } from '../../utils/config.js';
import { System } from '../../utils/system.js';
import { Start } from 'start-model.js';

//实例化对象
var system = new System();
var start = new Start(); //实例化 启动 对象


Page({

  data: {
    datas: '', //小程序信息
    showLoading: true, //加载中动画
    time: 50,         //初始时间
    interval: ""      //定时器
  },
  onLoad: function(options) {
    //获取userId和userInfo
    var token = wx.getStorageSync(Config.tokenName);
    //console.log(token);
    //判断是否授权 授权后直接跳转到index
    if ( token ) {
      wx.switchTab({
        url: '../index/index'
      });
    }

    //清空缓存时没有token
    if (!token) {
      //没有token时 一直请求
      var setInter = setInterval(() => {
        token = wx.getStorageSync(Config.tokenName);
        if (token) {
          console.log('结束')
          clearInterval(setInter);
        }
      }, 50);
    }
    this._getSystemInfo();
  },
  /**系统配置信息**/
  _getSystemInfo:function(){
    var that=this;
    system.getSystemInfo((systemInfo)=>{
        that._bindAddressInfo(systemInfo);
    });
  },
  /*绑定系统信息*/
  _bindAddressInfo:function(systemInfo){
    this.setData({
        datas: systemInfo.data,
        showLoading: false, //加载中动画
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
  
  //按钮的点击事件
  bindGetUserInfo(e) {
    var that=this;
    start.getUserInfo(e,(flag)=> {
      if (!flag) {
        wx.showToast({
          title: Config.setUserMsg,
          icon: 'none',
          duration: 1500
        })
      }else{
          /**跳转 */
          wx.switchTab({
            url: '../index/index'
          });
          that.setData({
            userInfo:e
        });
      }
    })
  },

  /*
    * 提示窗口
    * params:
    * title - {string}标题
    * content - {string}内容
    * flag - {bool}是否跳转到 "我的页面"
    */
    showTips:function(title,content,flag){
      wx.showModal({
          title: title,
          content: content,
          showCancel:false,
          success: function(res) {
              
          }
      });
  },

  
});