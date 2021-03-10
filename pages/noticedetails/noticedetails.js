// pages/noticedetails/noticedetails.js

import { Config } from '../../utils/config.js';
import { Notice } from '../noticelist/notice-model.js';
const utils = require('../../utils/util.js');

//实例化对象
var notice = new Notice(); //实例化 启动 对象

Page({

  data: {
    title: '', //标题
    time: '',  //时间
    catid: '',  //类型
    nodes:'',//详情
    beginTime:'', //活动开始时间
    endTime:'', //结束时间
    place:'', //地点
    sponsor_unit:'', //举办单位
    showLoading:true
  },

  onLoad: function(options) {
      var id = options.articleid;
      var type = options.type;
      this.data.id=id;
      //console.log(id,type);
      switch(type){
          case 'activity':
            this._getActivityInfo()
            break;
          case 'news':
            this._getArticleInfo();
          break;
      }
      
  },

  /**获取活动信息 */
  _getActivityInfo(callback){
    var that = this;
    notice.getActivityInfo({id:that.data.id},(res)=>{
      //console.log(res);
      this.setData({
        title: res.data.articleTitle,
        time: utils.formatTime(res.data.createTime,'Y-M-D'),
        catid: res.data.catId,
        nodes:res.data.articleContent,
        cidName:'社区活动',
        beginTime:utils.formatTime(res.data.beginTime,'Y-M-D'),
        endTime:utils.formatTime(res.data.endTime,'Y-M-D'),
        place:res.data.place,
        sponsor_unit:res.data.sponsor_unit,
        showLoading:false
      });
      wx.setNavigationBarTitle({
        title: that.data.cidName
      })
      callback && callback();
    });
  },
  
  /**获取文章信息 */
  _getArticleInfo:function(callback){
    var that = this;
    notice.getDetailInfo(that.data.id,(res)=>{
      this.setData({
        title: res.data.articleTitle,
        time: utils.formatTime(res.data.createTime,'Y-M-D'),
        catid: res.data.catId,
        cidName:res.data.cidName,
        nodes:res.data.articleContent,
        showLoading:false
      });
      wx.setNavigationBarTitle({
        title: that.data.cidName
      })
      callback&& callback();
    });
  },

  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },
})