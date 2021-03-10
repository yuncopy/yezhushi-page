// pages/address/address.js

import { Config } from '../../utils/config.js';
import { Address } from '../../utils/address.js';

var address = new Address();
const app = getApp();
Page({

  //初始化值
  data: {
    datas: [], //地址列表
    showLoading: true, //加载动画
  },

  onLoad: function(options) {
    //console.log(options);
    if (options) {
      this.data.type = options.type; //类型
    }
  },
  onShow() {
    //获取地址列表
    this.getUserAddress();
  },

  //获取用户地址
  getUserAddress() {
    address.getUserAddress(false,(res)=>{
      wx.stopPullDownRefresh();
      this.setData({
        datas: res.data,
        showLoading: false
      });
    });
  },


  //选择地址
  bindSelect(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.type) {
      //设置全局数据
      app.globalData.address = this.data.datas[index];
      wx.navigateBack({
        delta: 1
      });
    }
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
  //点击默认地址修改默认
  bindtapDefault(e) {

    //设置默认值
    this.setData({
      showLoading: true
    });

    //索引值
    let index = e.currentTarget.dataset.index;
    let revamp = this.data.datas[index];

    if (revamp.isDefault === 0) {

      //修改地址接口
      revamp.isDefault = 1; //设置默认值
      address.saveDefaultAddress(revamp,(res)=>{
        this.setData({
          showLoading: false
        });
        if (res.code == 10000) {
          wx.showToast({
            title: '地址修改成功',
            icon: 'success',
            duration: 1500
          });

          //及时刷新列表
          setTimeout(res => {
            this.getUserAddress();
          }, 500);

        } else {
          wx.showToast({
            title: '默认地址修改失败',
            icon: 'none',
            duration: 1500
          });
        }
      });
      
    } else {

      this.setData({
        showLoading: false
      });
      wx.showToast({
        title: '地址修改成功',
        icon: 'success',
        duration: 1500
      });
    }
  },
  //编辑地址
  bindtapRedact(e) {
    let addressid = e.currentTarget.dataset.addressid;
    wx.navigateTo({
      url: `../add-address/add-address?addressid=${addressid}`
    });
  },

  //删除地址
  bindtapDelete(e) {
    let addressid = e.currentTarget.dataset.addressid;
    wx.showModal({
      title: '温馨提示',
      content: '您是否要删除该收货地址',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          this.setData({
            showLoading: true
          });
          //删除地址接口
          address.deleteAddress({id:addressid},(res)=>{
            this.setData({
              showLoading: false
            });
            //console.log(res);
            //处理结果
            if (res.code === 10000) {
              wx.showToast({
                title: '地址删除成功',
                icon: 'success',
                duration: 1500
              });

              setTimeout(res => {
                this.getUserAddress();
              }, 500);

            } else {
              wx.showToast({
                title: '地址删除失败',
                icon: 'success',
                duration: 1500
              });
            }
          }); 
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getUserAddress();
  },
  //添加地址
  bindtapAdd() {
    wx.navigateTo({
      url: '../add-address/add-address'
    })
  },
});