// pages/about/about.js

import { Config } from '../../utils/config.js';
import { System } from '../../utils/system.js';

var system = new System();

Page({

  data: {
    mallName: '', //小程序名称
    phoneNo: '', //客服电话
    qqNo: '', //客服QQ
    mailAddress: '', //邮箱
    mallDesc: '', //小程序描述
    showLoading:true,
  },

  onLoad: function(options) {

    system.getSystemInfo((res)=>{
      this.setData({
        mallName: res.data.system_name,
        phoneNo: res.data.system_phone,
        qqNo: res.data.system_qq,
        mailAddress: res.data.system_mail,
        mallDesc: res.data.system_desc,
        showLoading: false, //加载中动画
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

  //点击拨打电话
  bindPhoto() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNo
    })
  },
});