// pages/my/my.js

import { Player } from 'player-model.js';
import { Config } from '../../utils/config.js';
import WxCountUp from '../../utils/WxCountUp.js';
const utils = require('../../utils/util.js');

var player = new Player(); //实例化 启动 对象

Page({

  data: {
    baseUrl: Config.baseUrl, //图片路径
    showLoading: true,
    playerid:'', //选手ID
    subjectid:'', //项目ID
    player:[], //选手信息
    datasNumber: [], //数量接口
  },
  onLoad: function(options) {
    this.data.playerid = options.playerid;
  },
  onShow() {
   this.getPlayer();
  },

  getPlayer(){

    let playerid = this.data.playerid;
    player.getPlayerInfo({playerid:playerid},(flag,res)=>{
      if(flag && res.code == Config.sucess){
        
        //计数动画
        for(let key in  res.data){
          if(utils.isInArray(['number','cur_order','votes','views'],key)){
            //console.log('player_'+key,res.data[key]);
            new WxCountUp('player_'+key, res.data[key], {}, this).start(); 
          }
        }
        this.setData({
          player: res.data,
          subjectid:res.data.subject_id,
          showLoading: false
        });
      }
    });
  },
  
  //点击查看积分明细
  bindIntegral(e) {

    let playerid = this.data.playerid;
    let subjectid = this.data.subjectid;
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
          for(let key in  this.data.player){
            if(utils.isInArray(['votes'],key)){
              new WxCountUp('player_'+key, this.data.player[key] = this.data.player[key]*1 + 1, {}, this).start();
            } 
          }
        }
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
  //下拉刷新
  onPullDownRefresh() {
    this.onShow();
  }
});