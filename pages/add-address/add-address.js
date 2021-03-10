// pages/add-address/add-address.js

import { Address } from '../../utils/address.js';
import { Config } from '../../utils/config.js';
var address = new Address();
let itemNumber, addressid;
Page({

  data: {
    array: [],
    index: 0, //选择的下标
    name: '', //姓名
    number: '', //电话
    detail: '', //详细地址
    isDefault: false, //是否为默认地址
    alter: false, //判断是否为修改地址（true时是修改）
    showLoading: false, //显示加载动画
    isGetAddress:false //是否获取微信地址
  },

  onLoad: function(options) {
    
    //请选择小区
    address.getEstateList((res)=>{
      //let array = res.data.data.map(item => item.areaName);
      let array = res.data.map(item =>{
        return item;
        //return item.estateName
      });
      array.unshift({
        id:0,
        estateName:'请选择小区'
      });
      this.setData({
        array:array
      });
    });

    addressid = options.addressid;
    //判断是否是修改地址
    if (addressid) {
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      this.setData({
        showLoading: true
      });

      //获取地址
      address.getUserAddress({addressId:addressid},(res)=>{
        //console.log(res);
        let arrayIndex = this.data.array.map(item => {
          if (item.id == res.data[0].areaId) {
            itemNumber = this.data.array.indexOf(item);
          }
        });
         /*绑定地址信息*/
        this.setData({
            alter: true,
            showLoading: false,
            name: res.data[0].userName,
            number: res.data[0].userPhone,
            index: itemNumber,
            detail: res.data[0].address,
            isDefault: res.data[0].isDefault === 0 ? false : true,
        });
      });
    }
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  //输入详细地址
  bindAddress(e) {
    this.setData({
      detail: e.detail.value
    });
  },
  bindtapAddress(e){
    var that=this;
    //授权获取地址
    wx.chooseAddress({
      success: function (res) {
          console.log(res);
          if(res.telNumber) {
               /*绑定地址信息*/
              var detail = res.provinceName+'-'+res.cityName+'-'+res.countyName;
              that.setData({
                alter: false,
                showLoading: false,
                name: res.userName,
                number: res.telNumber,
                index: 0,
                detail: detail+'-'+res.detailInfo,
                isDefault: true,
            });
            this.data.isGetAddress = true;
            //自动保存地址
            //this._saveAddress(0);

          }
          //模拟器上使用
          else{
              that.showTips('操作提示', '地址信息更新失败,手机号码信息为空~');
          }
      }
    })
  },
  //是否设为默认地址
  switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    this.setData({
      isDefault: e.detail.value
    });
  },
  //添加地址
  bindtapAdd() {

    //console.log(this.data.number);

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
    } else if (this.data.index == 0) {
      wx.showToast({
        title: '请选择您所在的小区',
        icon: 'none',
        duration: 1500
      });
    } else if (!this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      });

    } else if (this.data.alter == false) {
      this.setData({
        showLoading: true
      });
      this._saveAddress(0)
    } else {
      this.setData({
        showLoading: true
      });
      this._saveAddress(addressid)
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
  _saveAddress(addressid){
    //初始化值
    var addressData = {
      userName: this.data.name,
      areaId1: this.data.array[this.data.index].estateName,
      areaId: this.data.array[this.data.index].id,
      address: this.data.detail,
      isDefault: this.data.isDefault == true ? 1 : 0,
      userPhone: this.data.number,
      id: addressid,
      addressId:addressid
    };
    //console.log(addressData);

    //执行业务逻辑
    address.submitAddress(addressData,(res)=>{
      this.setData({
        showLoading: false
      });
      console.log(res);
      if (res.code === 10000) {
        wx.showToast({
          title: addressid ? '修改添加成功' : '地址添加成功',
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
          title: addressid ? '修改添加失败' : res.desc,
          icon: 'none',
          duration: 1500
        })
      }
    });
  }
});