

import { Config } from '../../utils/config.js';
import { System } from '../../utils/system.js';
import { Index } from 'index-model.js';
const utils = require('../../utils/util.js');

var system = new System();
var index = new Index(); //实例化 启动 对象

Page({
  data: {
    baseUrl: Config.baseUrl, //图片路径
    notice: [], //公示公告
    showLoading: true, //加载中动画
    wuyeName: '', //配置信息、小区物业名字
    activity: [], //社区活动
    story: [], //社区故事
    storeActivity: [], //店铺活动
    news: [], //社区新闻
    hotShop: [], //热销商品
    currPage: 1, //新品推荐分页页数
    totalPage: '', //新品推荐总页数
    newShop: [], //新品推荐商品
    repa: '', //正在维修的维修订单
    bannerArr:[], //轮播图
    swiperCurrent:0,
    bannerName:Config.bannerName, //名称
    bannerDescription:Config.bannerDescription, //描述
  },
  onLoad: function() {

    /**获取广告幻灯片片 */
    index.getBannerList((flag,res)=>{
      //console.log(res)
      if(flag && res.code == Config.sucess){
        this.setData({
          bannerArr: res.data,
          baseUrl:Config.baseUrl
        });
      }
    });

    // 公告快讯
    index.getArticleList({pageNo:1,pageSize:6},(res)=>{
      //console.log(res);
      //社区新闻截取时间
      let news = res.data[1].articleChildList.root.map(item => {
        item.createTime = utils.formatTime(item.createTime,'Y-M-D');
        return item;
      });
      //社区新闻截取个数（前三个）
      let beforeNews = news.slice(0, 3);

      //社区故事截取时间
      let story = res.data[2].articleChildList.root.map(item => {
        item.createTime = utils.formatTime(item.createTime,'Y-M-D');
        return item;
      });
      //社区故事截取个数（前三个）
      let beforeStory = story.slice(0, 3);
      
      //赋值操作
      this.setData({
        notice: res.data[0].articleChildList.root,
        news: beforeNews,
        story: beforeStory,
      });
    });

    //社区活动
    index.getActivityList({pageNo:1,pageSize:6},(res)=>{
      //console.log(res);
      let activity = res.data.root.map(item => {
        item.createTime = utils.formatTime(item.createTime,'Y-M-D');
        item.beginTime = utils.formatTime(item.beginTime,'Y-M-D');
        item.endTime = utils.formatTime(item.endTime,'Y-M-D');
        return item;
      });
      this.setData({
        activity: activity,
        showLoading: false
      });
    });

    //物业维修
    index.getPropertyList({p:1,cnt:3},(flag,res)=>{
      if(flag && res.code == Config.sucess){
        this.setData({
          hotShop: res.data.result
        });
      }
    });
  },

  /** 轮播图的切换事件*/
  swiperChange: function (e) { 
   
    //console.log(e); 
    var index = e.detail.current;
    this.setData({
      swiperCurrent: e.detail.current,   //获取当前轮播图片的下标
      bannerName:this.data.bannerArr[index].name,
      bannerDescription:this.data.bannerArr[index].description,
    })
    
  },

  //分享
  onShareAppMessage: function(res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },

  onShow() {
    index.getMyRepairList({order:'0,1'},(res)=>{
      //console.log(res);
      if (res.data.length != 0) {
        this.setData({
          repa: res.data[0]
        });
      }
    });
  },

  //新品推荐
  getLists() {
    index.getNewGoodsList({
      isAdminRecom: 1,
      cnt: 10,
      p: this.data.currPage
    },(res)=>{
     // console.log(res);
      this.setData({
        newShop: this.data.newShop.concat(res.data.root),
        totalPage: res.data.totalPage,
        currPage: res.data.currPage,
        showLoading: false
      })
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
      //console.log('已加载到最后一页');
    }
  },
  //点击跳转店铺（店铺活动）
  bindMalls(e) {
    console.log(e);
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../malldetails/malldetails?shopid=${shopid}`
    });
  },
  //点击跳转报修详情
  bindMend(e) {
    //console.log(e);
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../repDetails/repDetails?orderid=${orderid}`
    });
  },
  //店铺活动跳转更多
  bindMallsMove() {
    wx.navigateTo({
      url: '../activelist/activelist'
    });
  },
  //新品列表
  bindtapNewMore() {
    wx.navigateTo({
      url: '../newShop/newShop'
    });
  },
  //新品商品详情
  bindtapNew(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../shopDetails/shopDetails?goodsid=${goodsid}`
    });
  },
  //热销跳转列表
  bindtapHotMore() {
    wx.navigateTo({
      url: '../hotShop/hotShop'
    });
  },
  //热销跳转详情
  bindtapHotShop(e) {
    console.log(e);
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../repairDetails/repairDetails?shopid=${goodsid}`
    });
  },
  //跳转社区活动详情
  bindtapActivity(e) {
    //console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&type=activity`
    });
  },
  //社区活动列表
  bindtapCommun() {
    wx.navigateTo({
      url: '../community/community'
    });
  },
  //跳转社区新闻列表
  bindtapNews() {
    wx.navigateTo({
      url: '../comNews/comNews?type=news'
    });
  },
  //跳转社区故事列表
  bindtapStory() {
    wx.navigateTo({
      url: '../comNews/comNews?type=story'
    });
  },

  //跳转社区新闻详情页
  bindtapNewsDetails(e) {
    //console.log(e);
    let articleid = e.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: `../noticedetails/noticedetails?articleid=${articleid}&type=news`
    });
  },
  //跳转精品商城
  bindMall() {
    wx.navigateTo({
      url: '../mall/mall'
    });
  },

  //跳转疫情防控
  bindReport() {
    wx.navigateTo({
      url: '../report/report'
    });
  },

    
  //在线报修
  bindtapRep() {
    wx.switchTab({
      url: '../repairs/repairs'
    });
  },

  //点击跳转搜索页面
  bindtapSeek() {
    wx.navigateTo({
      url: '../seek/seek?shopTitleIndex=2' //文章
    });
  },
  
  //查看公告快讯列表
  bindtapNotice() {
    wx.navigateTo({
      url: '../noticelist/noticelist'
    });
  },
});