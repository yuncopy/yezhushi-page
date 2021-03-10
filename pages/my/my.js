// pages/my/my.js

import { My } from 'my-model.js';
import { Config } from '../../utils/config.js';
var my = new My(); //实例化 启动 对象

Page({

  data: {
    userScore: 0, //我的积分
    showLoading: true,
    datasNumber: [], //数量接口
  },
  onLoad: function(options) {
    

  },
  onShow() {
    //获取积分信息
    my.getUserInfo({},(res)=>{
      wx.stopPullDownRefresh();

      //console.log(res);
      this.setData({
        userScore: res.data.userScore,
        datasNumber: res.data.orderNum,
        showLoading: false
      });
    });
  },
  //点击查看积分明细
  bindIntegral() {
    wx.navigateTo({
      url: '../integral/integral'
    });
  },

  //查看所有订单
  bintapOrder() {
    wx.navigateTo({
      url: '../orderList/orderList'
    });
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
  //下拉刷新
  onPullDownRefresh() {
    this.onShow();
  }
});