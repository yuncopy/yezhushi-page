// pages/repairs/repairs.js

import { Config } from '../../utils/config.js';
import { Repairs } from 'repairs-model.js';
import { System } from '../../utils/system.js';
import { Address } from '../../utils/address.js';
//实例化对象
var repairs = new Repairs(); //实例化 启动 对象
var system = new System(); //实例化 启动 对象
var address = new Address(); //实例化 启动 对象

const app = getApp();
let userId;

Page({

  data: {
    array: [], //全部的类型数组
    flag: 0, //选中的下标
    index: 0, //选中的下标
    arrayName: [], //筛选出来的数组
    text: '', //输入的问题描述
    temp: [], //上传的图片
    address: '', //获取默认地址
    wuyeName: '', //物业名字
    showLoading: true,
    imgs: [], //评价上传后的图片
  },
  onLoad: function(options) {

    this._loadData();

  },
  _loadData(callback){

    this._getRepairType();

    this._getSystemInfo();

  },
  _getRepairType(){
    //获取报修类型
    repairs.getRepairType((res)=>{
      let arrysName = res.data;
      let arrys = [];
      for (var i = 0; i < arrysName.length; i++) {
        arrys = arrys.concat(arrysName[i].repairName);
      }
      arrys.unshift("选择报修类型");
      this.setData({
        array: res.data,
        arrayName: arrys,
      });
    });
  },
  //获取系统配置
  _getSystemInfo(){
    system.getSystemInfo((res)=>{
      this.setData({
        wuyeName: res.data.system_title,
        showLoading: false
      });
    });
    
  },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
  onShow() {
    this.setData({
      address: '',
    });
    if (!app.globalData.address) {
      address.getUserAddress({is_default:1},(res)=>{
        wx.stopPullDownRefresh();
        if (!res.data || res.data.length != 0) {
          this.setData({
            address: res.data[0],
            showLoading: false
          });
        }
      });
    } else {
      this.setData({
        address: app.globalData.address,
        showLoading: false
      });
    }
  },
  //选择类型
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },
  //问题描述内容
  bindText(e) {
    this.setData({
      text: e.detail.value
    });
  },
  //点击上传图片
  bindPhoto(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        var temp = this.data.temp;
        console.log(tempFilePaths);
        console.log(temp);
        if (index == -1) {
          console.log('111111');
          temp = temp.concat(tempFilePaths);
        } else {
          console.log("22222222");
          temp[index] = tempFilePaths[0];
        }
        if (temp.length > 3) {
          temp.splice(3, temp.length - 3);
        }
        this.setData({
          temp: temp
        });
        console.log(this.data.temp);
      }
    });
  },
  //点击删除当前图片
  bindShan(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let temp = this.data.temp;
    // console.log(temp);
    // console.log(index);
    temp.splice(index, 1);
    // console.log(temp)
    this.setData({
      temp: temp
    });
  },
  //点击选择地址，进行跳转
  bindAddress() {
    wx.navigateTo({
      url: '../address/address?type=1'
    })
  },
  //提交报修按钮
  bindButton() {
    if (this.data.index == 0) {
      wx.showToast({
        title: '请选择报修类型',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.text) {
      wx.showToast({
        title: '请输入报修内容',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.address) {
      wx.showToast({
        title: '请选择报修地址',
        icon: 'none',
        duration: 1500
      })
    } else {
      var temp = this.data.temp;
      var len = temp.length;
      if (len == 0) {

        this.evalute();

      } else {
        var copy = temp.slice(0);
        for (var i = 0; i < len; i++) {
          var img = copy.shift();

          //执行图片上传
          this.uploadImg(img);
        }
      }
    }
  },
  // 上传图片
  uploadImg(img) {
    wx.showLoading({
      title: '提交中',
    })
    //console.log(img);
    //执行文件上传操作
    repairs.uploadImge({
      img:img,
      data:{
        folder: 'repair'
      }
    },(res)=>{
        //转化成对象
        let ress = JSON.parse(res);
        wx.hideLoading(); //隐藏提示框
        if (ress.code === 10000) {
          var imgs = this.data.imgs;
          imgs.push(ress.data.url);
          this.setData({
            imgs: imgs
          });
          var temp = this.data.temp;
          console.log(temp)
          console.log(imgs)
          var len0 = temp.length;
          var len = imgs.length;
          if (len == len0) { //全部上传成功才执行提交数据

            //执行提交操作
            this.evalute();
          }
        } else {

          wx.hideLoading();
          wx.showToast({
            title: ress.msg,
            icon: 'none',
            duration: 1500
          });
          console.log("上传失败")
        }
    });
  },
  //提交报修接口
  evalute() {

    this.setData({
      showLoading: true
    });

    repairs.submitRepairOrder({
      //提交数据
      consigneeId: this.data.address.addressId,
      orderRemarks: this.data.text,
      fid: this.data.array[this.data.index * 1 - 1].repairId,
      orderSrc1: this.data.imgs[0] == undefined ? '' : this.data.imgs[0],
      orderSrc2: this.data.imgs[1] == undefined ? '' : this.data.imgs[1],
      orderSrc3: this.data.imgs[2] == undefined ? '' : this.data.imgs[2],
    },(res)=>{

      //处理结果
      this.setData({
        showLoading: false
      });
      console.log(res);

      if (res.code === 10000) {
        wx.showToast({
          title: '报修成功',
          icon: 'success',
          duration: 1500
        });
        setTimeout(res => {
          this.setData({
            index: 0, //选中的下标
            text: '', //输入的问题描述
            temp: [], //上传的图片
            address: '', //获取默认地址
          });

          //置空操作
          app.globalData.address = '';
          
          //跳转报修列表
          wx.navigateTo({
            url: '../repList/repList'
          });
        }, 500);

      } else {
        
        wx.showToast({
          title: "报修失败，请重新操作",
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // onHide(){
  //   this.setData({
  //     index: 0, //选中的下标
  //     text: '', //输入的问题描述
  //     temp: [], //上传的图片
  //     imgs: [], //评价上传后的图片
  //   });
  // },
  onUnload() {
    this.setData({
      index: 0, //选中的下标
      flag: 0, //选中的下标
      text: '', //输入的问题描述
      temp: [], //上传的图片
      imgs: [], //评价上传后的图片
    });
  },
});