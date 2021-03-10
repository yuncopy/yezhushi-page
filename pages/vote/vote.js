import { Config } from '../../utils/config.js';
import { Vote } from 'vote-model.js';
import { Player } from '../player/player-model.js';
import WxCountUp from '../../utils/WxCountUp.js';
const utils = require('../../utils/util.js');

var vote = new Vote(); //实例化 启动 对象
var player = new Player(); //实例化 启动 对象

Page({
  data: {
    baseUrl: Config.baseUrl, //图片路径
    imgUrls: [], //大轮播图
    images: [], //小轮播图
    currPage: 1, //新品推荐分页页数
    totalPage: '', //新品推荐总页数
    newShop: [], //活动
    getSelfShopId: '', //自营店铺ID
    showLoading: true, //加载动画
    seckill: [], //投票项目
    player: [], //投票项目选手
    times: [], //优惠秒杀倒计时
  },

  onLoad: function(options) {

    //首页banner
    vote.getBannerList((flag,res)=>{
      //console.log(res)
      if(flag && res.code == Config.sucess){
        this.setData({
          imgUrls: res.data
        });
      }
    });

    //查询投票活动
    vote.getSubjectList((flag,res)=>{
      //console.log(res)
      if(flag && res.code == Config.sucess){
        this.setData({
          newShop: res.data,
          showLoading: false
        });
      }
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
    vote.getPlayerList({p: this.data.currPage},(flag,res)=>{
      //console.log(res)
      if(flag && res.code == Config.sucess){

        let player = this.data.player.concat(res.data.player);
        this.setData({
          player:player,
          seckill: res.data,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage,
          showLoading: false
        });
      }
    });
  },

//上拉加载下一页
onReachBottom() {
  vote.reachBottom(this.data,(page)=>{
    this.setData({
      currPage: page,
      showLoading: true
    });
    //console.log(page);
    this.onShow();
  });
},

  //点击跳转秒杀商品详情
  bindMiaosha(e) {
    let playerid = vote.getDataSet(e,'playerid');
    wx.navigateTo({
      url: `../player/player?playerid=${playerid}`
    });
  },

  bindMiddle(){
    console.log('handout');
    return false;
  },

  bindMiaoVote(e) {
    
    let index = vote.getDataSet(e,'index');
    let playerid = vote.getDataSet(e,'playerid');
    let subjectid = vote.getDataSet(e,'subjectid');
    var params = {playerid:playerid,subjectid:subjectid};

    player.submitPlayerVote(params,(flag,res)=>{
      if(flag && res.code == Config.sucess){
        this.setData({
          showLoading: false
        });
        wx.showToast({
          title: res.data.title,
          icon: res.data.icon,
          duration: 1500
        });
        if(res.data.icon == 'success'){
          var playerArr = this.data.player;
          for (let i in playerArr) {
            if (i == index) { //遍历列表数据 
              playerArr[i].votes = playerArr[i].votes *1 + 1;//根据下标找到目标,改变状态  
            }
          }
          this.setData({
            player: playerArr
          })      
        }
      }
    });
  },

  //新品列表
  bindtapNewMore() {
    wx.navigateTo({
      url: '../voteSubject/voteSubject'
    });
  },
  

  //新品商品详情
  bindtapNew(e) {
    let subjectid = vote.getDataSet(e,'subjectid');
    wx.navigateTo({
      url:'../voteDetails/voteDetails?subjectid='+subjectid
    });
  },

  //跳转搜索
  bindtapSeek() {
    wx.navigateTo({
      url: '../seek/seek?shopTitleIndex=1'
    })
  },
});