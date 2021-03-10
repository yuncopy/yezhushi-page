// pages/add-address/add-address.js

import { Report } from 'report-model.js';
import { Config } from '../../utils/config.js';
import { Address } from '../../utils/address.js';

var address = new Address();
var report = new Report();
Page({

  data: {
    array: [],
    arrayTemp:[],
    arrayHealth:[],
    arrayEstate:[],
    index: 0, //选择的下标
    indexTemp: 0, //选择的下标
    indexHealth: 0, //选择的下标
    indexEstate:0,//选择的下标
    name: '', //姓名
    number: '', //电话
    detail: '', //详细地址
    showLoading: false, //显示加载动画
    alter: true, //判断今日是否已登记到访（true时是已登记）
    report:[] //到访记录
  },

  onLoad: function(options) {


  //请选择小区
  address.getEstateList((res)=>{
    let arrayEstate = res.data.map(item =>{
      return item;
    });
    arrayEstate.unshift({
      id:0,
      estateName:'请选择小区'
    });
    this.setData({
      arrayEstate:arrayEstate
    });
  });
    
    //来访身份
    var array = [
      {id:0,visit:'请选择身份'},
      {id:1,visit:'小区业主'},
      {id:2,visit:'小区租户'},
      {id:3,visit:'外来访客'},
    ];
    //选择体温
    var arrayTemp = [
      {id:0,temperature:'选择今日体温情况'},
      {id:1,temperature:'正常(低于37.3度)'},
      {id:2,temperature:'异常(37.3及以上)'}
    ];

    //身体状态
    var arrayHealth = [
      {id:0,health:'选择今日身体状态'},
      {id:1,health:'健康'},
      {id:2,health:'干咳乏力'},
      {id:3,health:'发烧发热'}
    ];

    this.setData({
      array:array,
      arrayTemp:arrayTemp,
      arrayHealth:arrayHealth
    });
  },

  onShow() {
    //获取当前用户到访记录
    report.getUserReport((falg,res)=>{
      wx.stopPullDownRefresh();
      //console.log(falg,res.data);
      var report= res.data
      this.setData({
        report: res.data,
        alter:report.length == 0 ? false : true,
        showLoading: false
      });
    });
  },

  //输入的姓名
  bindName(e) {
    this.setData({
      name: e.detail.value
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
  //输入的电话
  bindNumber(e) {
    this.setData({
      number: e.detail.value
    });
  },
  //选择小区
  bindPickerEstate: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      indexEstate: e.detail.value
    })
  },

  //选择身份
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },

  //选择体温
  bindPickerTemperature: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      indexTemp: e.detail.value
    })
  },

   //选择身体状态
   bindPickerHealth: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      indexHealth: e.detail.value
    })
  },

  //已上报执行返回
  bindtapReport: function(e) {
    wx.navigateBack({
      delta: 1
    });
  },

  //输入详细地址
  bindAddress(e) {
    this.setData({
      detail: e.detail.value
    });
  },
  
  //上报健康状态
  bindtapAddReport() {

    if (!this.data.name) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        duration: 1500
      });
    } else if (!this.data.number) {
      wx.showToast({
        title: '请输入您的手机号',
        icon: 'none',
        duration: 1500
      });
    }else if (!this._isPhoneNumber(this.data.number)) {
      wx.showToast({
        title: '您输入的手机号有误',
        icon: 'none',
        duration: 1500
      });
    } else if (this.data.indexEstate == 0) {
      wx.showToast({
        title: '请选择您所在的小区',
        icon: 'none',
        duration: 1500
      });
    } else if (this.data.index == 0) {
      wx.showToast({
        title: '请选择您来访身份',
        icon: 'none',
        duration: 1500
      });
    } else if (this.data.indexTemp == 0) {
      wx.showToast({
        title: '请选择您今日体温情况',
        icon: 'none',
        duration: 1500
      });
    } else if (this.data.indexHealth == 0) {
      wx.showToast({
        title: '请选择您今日身体状态',
        icon: 'none',
        duration: 1500
      });
    } else if (!this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      });
    } else {
      //执行上报
      this.setData({
        showLoading: true
      });
      this._saveReport(0)
    }
  },
  //验证电话号码
  _isPhoneNumber(val){
    var isMobilePhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    var isFixMob= /^0?1[3|4|5|8][0-9]\d{8}$/;
    if(isFixMob.test(val)||isMobilePhone.test(val)){
      return true;
    }else{
      return false;
    }
  },

  //保存用户地址接口
  _saveReport(addressid){
    //初始化值
    var reportData = {
      userName: this.data.name,
      userPhone: this.data.number,
      areaId1: this.data.arrayEstate[this.data.indexEstate].code,
      areaId: this.data.arrayEstate[this.data.indexEstate].id,
      visiter: this.data.array[this.data.index].visit,
      visiterId: this.data.array[this.data.index].id,
      temperature: this.data.arrayTemp[this.data.indexTemp].temperature,
      health: this.data.arrayHealth[this.data.indexHealth].health,
      id: addressid,
      address: this.data.detail,
    };

    //执行业务逻辑
    report.submitReport(reportData,(falg,res)=>{

      this.setData({
        showLoading: false
      });

      console.log(falg,res);

      if (falg) {
        wx.showToast({
          title:'上报成功',
          icon: 'success',
          duration: 1500
        });
        
        //定时返回
        setTimeout(res => {
          wx.navigateBack({
            delta: 1
          });
        }, 500);

      } else {
        wx.showToast({
          title: '上报异常，重新上报',
          icon: 'none',
          duration: 1500
        })
      }
    });
  }
});