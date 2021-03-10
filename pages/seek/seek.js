
import { Config } from '../../utils/config.js';
import { System } from '../../utils/system.js';
import { Seek } from 'seek-model.js';
const utils = require('../../utils/util.js');



var seek = new Seek(); //实例化 启动 对象
var system = new System(); //实例化 启动 对象

Page({
  data: {
    baseUrl: Config.baseUrl, //图片路径
    hotSeek: [], //热搜商品
    inputValue: '', //input的value值
    currPage: 1, //当前页数
    totalPage: '', //总页数
    shops: [], //商品列表
    shopNone: true, //判断否显示热搜和历史搜索
    shopTitle: ['选手', '活动', '新闻'], //搜索的分类
    shopTitleIndex: 0, //搜索分类的下标
    subjectid:'', //活动项目
    showLoading: true, //加载动画
    pastSeek: [], //历史搜索
  },

  onLoad: function(options) {

    //从项目入口
    var key = utils.getKeys(options);
    if(utils.isInArray(key,'subjectid')){
      this.data.subjectid = options.subjectid;
    }
  
    //热搜列表
    system.getSystemInfo((res)=>{
      this.setData({
        hotSeek: res.data.system_hot,
        showLoading: false,
        shopTitleIndex:options.shopTitleIndex * 1 //获取来源转化为int
      });
    });
  },

  //获取缓存的东西
  onShow() {
    let pastSeek = seek.getStorage(seek._storageHistory);
    this.setData({
      pastSeek: pastSeek
    });
    if (!pastSeek || pastSeek.length == 0) {
      history = [];
    } else {
      history = pastSeek;
    }
  },

  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },

  //input输入框，输入的内容
  bindInput(e) {
    //console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value,
    });
    //删除输入框内容
    if (!this.data.inputValue) {
      this.setData({
        currPage: 1, //当前页数
        totalPage: '', //总页数
        shops: [], //商品列表
        shopNone: true
      });
    }
  },

  //点击搜索按钮
  bindtapSeek() {
    if (!this.data.inputValue) {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      });
    } else {
      this.setData({
        currPage: 1, //当前页数
        totalPage: '', //总页数
        shops: [], //商品列表
      });
      this.getLists();
    }
  },

  //历史搜索
  bindtapPast(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      inputValue: item,
      shopNone: false,
    });
    this.getLists();
  },

  //商品搜索结果
  getLists() {

    this.setData({
      showLoading: true
    });

    //把搜索的内容存入缓存
    //console.log(this.data.inputValue);

    this._setHistoryCache();
   
    this.onShow(); //切换时加载页面

    this._getSearchData();
  },


  /**
   * 
   * 设置搜索缓存数据
   * 
   */
  _setHistoryCache(){

    let inputs = this.data.inputValue;
    if (this.data.pastSeek.length != 0) {
      //console.log('aaaa');
      //判断是否和缓存里的名字重复
      let shai = this.data.pastSeek.forEach(item => {
        if (item == inputs) {
          let itemNumber = this.data.pastSeek.indexOf(item);
          this.data.pastSeek.splice(itemNumber, 1);
          let history = this.data.pastSeek;
        }
      });
    }
    //存入缓存
    history.unshift(this.data.inputValue);
    //console.log(history)
    let historys = history.slice(0, 8);  //截取新数组

    seek.setStorage(seek._storageHistory, historys);
  },

  /**
   * 下划线表示设置为私有函数
   * 
   * 获取搜索信息
   */
  _getSearchData(){
    //搜索结果接口
    let index = this.data.shopTitleIndex;
    let subjectid = this.data.subjectid;
    let jiekou = [
      { goods: this.data.inputValue, p: this.data.currPage,index:index,subjectid:subjectid },  // 选手
      { shops: this.data.inputValue, p: this.data.currPage, cnt: 6 ,index:index,subjectid:subjectid }, // 活动
      { brands: this.data.inputValue, p: this.data.currPage,index:index,subjectid:subjectid } //文章
    ];
    //请求获取数据
    let data = jiekou[index];
    seek.getSearchList(data,(flag,res)=>{
      if(flag && res.code == Config.sucess){
        this.setData({
          shops: this.data.shops.concat(res.data.result),
          currPage: res.data.currPage,
          totalPage: res.data.totalPage,
          shopNone: false,
          showLoading: false // 搜索有结果时不显示热搜和历史
        });
        console.log(data);
      }
    });
  },

  //点击删除历史搜素
  bindtapDelete() {
    wx.showModal({
      title: '温馨提示',
      content: '您是否删除历史搜素',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          this.setData({
            showLoading: true
          });

          seek.removeStorage(seek._storageHistory);

          setTimeout(res => {
            this.setData({
              showLoading: false
            });
            setTimeout(res => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              });
              this.onShow();
            }, 100);
          }, 300);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },

  //点击分类导航
  bindtapShopTitle(e) {
    //console.log(e);
    if (!this.data.inputValue) {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      });
    } else {
      //console.log(e.currentTarget.dataset.index);
      this.setData({
        shopTitleIndex: e.currentTarget.dataset.index,
        currPage: 1, //当前页数
        totalPage: '', //总页数
        shops: [], //商品列表
      });
      this.getLists();
    }
  },
  //点击热搜
  bindtapHot(e) {
    let indexs = e.currentTarget.dataset.index;
    this.setData({
      inputValue: this.data.hotSeek[indexs],
      shopNone: false,
    });
    this.getLists();
  },

  //点击跳转品牌列表
  bindtapBrand(e) {
    console.log(e);
    let brandid = e.currentTarget.dataset.brandid;
    wx.navigateTo({
      url:`../noticedetails/noticedetails?articleid=${brandid}&type=news`
    });
  },

  //点击跳转选手详情
  bindtapShopDetails(e) {
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `../player/player?playerid=${goodsid}`
    });
  },

  //点击跳转店铺
  bindtapMall(e) {
    let subjectid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url:'../voteDetails/voteDetails?subjectid='+subjectid
    });
  },

  //上拉加载下一页
  onReachBottom() {
    seek.reachBottom(this.data,(page)=>{
      this.setData({
        currPage: page
      });
      console.log(page);
      this.getLists();
    });
  },
});