// pages/repList/repList.js

import { Repairs } from '../repairs/repairs-model.js';
import { Config } from '../../utils/config.js';

var repairs = new Repairs(); //实例化 启动 对象

Page({
  data: {
    being: [], //正在维修
    stocks: [], //已完成的维修
    showLoading: true,
    baseUrl:Config.baseUrl,
  },
  onLoad: function(options) {
    
  },
  onShow() {

    //正在维修
    repairs.getRepairList({orderStatus:"0,1,2"},(res)=>{
      //console.log(res);
      wx.stopPullDownRefresh();
      this.setData({
        being: res.data
      });
    });

    //维修完成
    repairs.getRepairList({orderStatus:"3"},(res)=>{
      //console.log(res);
      //wx.stopPullDownRefresh();
      this.setData({
        stocks: res.data,
        showLoading: false
      });
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
  //确认维修已完成
  bindStocks(e) {
    let orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: Config.repairTitle,
      content: Config.repairMsg,
      success: res => {
        if (res.confirm) {
          this.setData({
            showLoading: true
          });
          console.log('用户点击确定');
          
          repairs.finishOrder({orderId: orderid},(res)=>{
            this.setData({
              showLoading: false
            });
            console.log(res);

            if (res.code === 10000) {
              wx.showToast({
                title: Config.repairTip,
                icon: 'success',
                duration: 1500
              });
              
              //定时刷新
              setTimeout(res => {
                this.onShow();
              }, 500);
            } else {
              wx.showToast({
                title: res.desc,
                icon: 'none',
                duration: 1500
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击跳转详情
  bindDetails(e) {
    console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../repDetails/repDetails?orderid=${orderid}`
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.onShow();
  }
});