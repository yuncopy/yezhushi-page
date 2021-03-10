// pages/repDetails/repDetails.js

import { Repairs } from '../repairs/repairs-model.js';
import { Config } from '../../utils/config.js';
import { System } from '../../utils/system.js';

var repairs = new Repairs(); //实例化 启动 对象
var system = new System();

Page({

  data: {
    datas: '', //详情信息
    wuyePhoto: '', //物业电话
    showLoading: true,
    baseUrl:Config.baseUrl,
  },

  onLoad: function(options) {
    console.log( options.orderid);

    repairs.getRepairList({orderId: options.orderid},(res)=>{
      console.log(res);
      //wx.stopPullDownRefresh();
      this.setData({
        datas: res.data[0],
        showLoading: false
      });
    });

    /**获取系统配置 */
    system.getSystemInfo((res)=>{
      console.log(res);
      this.setData({
        wuyePhoto: res.data.system_phone
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
              if (res.code === 10000) {
                wx.showToast({
                  title: Config.repairTip,
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(res => {
                  wx.navigateBack({
                    delta: 1
                  });
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
  //点击给师傅拨打电话
  bindMaster(e) {
    let usertel = e.currentTarget.dataset.usertel;
    wx.makePhoneCall({
      phoneNumber: usertel
    });
  },
});