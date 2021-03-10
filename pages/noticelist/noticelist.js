// pages/noticelist/noticelist.js

import { Config } from '../../utils/config.js';
import { Notice } from 'notice-model.js';
const utils = require('../../utils/util.js');
//实例化对象
var notice = new Notice(); //实例化 启动 对象


Page({

  data: {
    datas: [], //公告列表
    currPage: 1, //当前页数
    totalPage: '', //总页数
    showLoading:true,//加载动画
  },
  //小程序注册完成后，加载页面，触发onLoad方法
  onLoad: function(options) {
    this.getLists();
  },

   //公告列表
  getLists() {
    notice.getArticleList({
      weight: 1,
      cnt: 10,
      p: this.data.currPage,
    },(res)=>{
      let lists = res.data[0].articleChildList.root.map(item =>{
        item.createTime = utils.formatTime(item.createTime,'Y-M-D');
        return item;
      });

      this.setData({
        showLoading:false,
        datas: this.data.datas.concat(lists),
        currPage: res.data[0].articleChildList.currPage,
        totalPage: res.data[0].articleChildList.totalPage,
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
  bindtapNews(e){
    console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&type=news`
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