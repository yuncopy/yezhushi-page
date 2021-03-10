// pages/community/community.js

import { Config } from '../../utils/config.js';
import { Index } from '../index/index-model.js';
const utils = require('../../utils/util.js');
var index = new Index(); //实例化 启动 对象


Page({
  data: {
  	baseUrl:Config.baseUrl,//图片路径
    datas: [], //社区活动列表
    currPage: 1, //当前页数
    totalPage: '', //总页数
    showLoading: true, //加载动画
  },

  onLoad: function(options) {
    this.getLists();
  },

  getLists() {
     //社区活动
     index.getActivityList({
       pageNo:this.data.currPage,
       pageSize:6
      },(res)=>{
      //console.log(res);
      let lists = res.data.root.map(item => {
        console.log(item.createTime)
        item.createTime = utils.formatTime(item.createTime,'Y-M-D');
        return item;
      });
      this.setData({
        showLoading: false,
        datas: lists,
        currPage: res.data.currPage,
        totalPage: res.data.totalPage,
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

  //跳转新闻详情
  bindtapCom(e) {
    console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&type=activity`
    });
  },

  //上拉加载下一页
  onReachBottom() {
    if (this.data.currPage * 1 < this.data.totalPage * 1) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.setData({
        showLoading: true
      });
      this.getLists();
    } else {
      console.log('已加载到最后一页');
    }
  },
})