
import { Config } from '../../utils/config.js';
import { Vote } from '../vote/vote-model.js';
import { Player } from '../player/player-model.js';

var vote = new Vote(); //实例化 启动 对象
var player = new Player(); //实例化 启动 对象

Page({

  data: {
    baseUrl: Config.baseUrl, //图片
    showLoading: true, //加载动画
    masktop: '', //是否显示商品分类
    currPage: 1, //当前页数
    totalPage: '', //总页数
    mall: [], //店铺信息
    subjectid:'', // 项目ID
    datas: [], //商品数组
    contents:'', //活动内容
    collect: false, //判断活动规则关闭 
    mallLists: [], //店铺分类接口
    mallTitle:'', // 标题
    index: '', //选择商品分类的下标
    showModal: false
  },

  onLoad: function(options) {

    this.data.subjectid = options.subjectid;
    this.getSubjectPlayers(this.data.subjectid);
  },

  //获取投票选手
  getSubjectPlayers(subjectid){
    //查询投票活动
    vote.getSubjectPlayerList({p: this.data.currPage,subjectid:subjectid},(flag,res)=>{
     //console.log(res)
     if(flag && res.code == Config.sucess){
       this.setData({
         datas:this.data.datas.concat(res.data.player),
         mall:res.data,
         contents:res.data.content,
         totalPage: res.data.totalPage,
         currPage: res.data.currPage,
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

  //点击联系商家
  bindPhone() {
    if (this.data.mall.shopTel) {
      wx.makePhoneCall({
        phoneNumber: this.data.mall.shopTel
      });
    } else {
      wx.showToast({
        title: '该店铺暂无联系方式',
        icon: 'none',
        duration: 1500
      });
    }
  },
  
  //点击收藏店铺
  bindtapCollect() {
    this.setData({
      masktop: 0,
      showLoading: false,
      collect:true,
      mallTitle:'请仔细阅读活动规则',
    });    
  },

  //显示店铺商品分类
  bindClass() {
    
    //显示弹窗
    this.setData({
      masktop: 0,
      currPage:1,
      totalPage:'',
      mallTitle:'所有投票项目',
      showLoading: true,
      collect:false
    });

    //获取项目
    vote.getVoteSubjectList({p: this.data.currPage,size:100},(flag,res)=>{
      if(flag && res.code == Config.sucess){
        this.setData({
          mallLists:res.data.result,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage,
          showLoading: false
        });
      }
     });
    
  },
  //搜索跳转
bindtapSeek(e) {
  let subjectid = vote.getDataSet(e,'subjectid');
   wx.navigateTo({
    url: '../seek/seek?shopTitleIndex=0'+'&subjectid='+subjectid
   });
},



  //点击跳转商品详情
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
        var playerArr = this.data.datas;
        //console.log(playerArr);
        for (let i in playerArr) {
          if (i == index) { //遍历列表数据 
            //console.log(i,index);
            playerArr[i].votes = playerArr[i].votes *1 + 1;//根据下标找到目标,改变状态  
          }
        }
        //console.log(playerArr);
        this.setData({
          datas: playerArr
        })      
      }
    }
  });
},


  //点击分类筛选商品
  bindtapLists(e) {
    this.data.subjectid = vote.getDataSet(e,'subjectid');
    let index = vote.getDataSet(e,'index');
    //初始化数据
    this.setData({
      datas: [],
      currPage: 1,
      totalPage: '',
      index:index,
      showLoading: true,
    });
    this.getSubjectPlayers(this.data.subjectid);
    this.bindClose();
  },

  //关闭分类
  bindClose() {
    this.setData({
      masktop: '-2000rpx',
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
        showLoading: true,
      });
      this.getSubjectPlayers(this.data.subjectid);
    } else {
      console.log('已加载到最后一页');
    }
  },
});