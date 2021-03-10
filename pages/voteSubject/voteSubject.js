import { Config } from '../../utils/config.js';
import { Vote } from '../vote/vote-model.js';
import WxCountUp from '../../utils/WxCountUp.js'

var vote = new Vote(); //实例化 启动 对象

Page({

  data: {
    baseUrl: Config.baseUrl, //图片路径
    newShop: [], //商品数组
    number:0,
    totalPage: '', //总页数
    currPage: 1,  //当前页数
    showLoading: true, //是否显示加载
  },

  onLoad: function(options) {
    this.getSubjectList();

    //this.countUp = new WxCountUp('number', 5234, {}, this);
    //this.countUp.start();
   
  },

  getSubjectList(){
   //查询投票活动

   vote.getVoteSubjectList({p: this.data.currPage},(flag,res)=>{
    //console.log(res)
    if(flag && res.code == Config.sucess){
      this.setData({
        newShop:this.data.newShop.concat(res.data.result),
        totalPage: res.data.totalPage,
        currPage: res.data.currPage,
        showLoading: false
      });
    }
   });
  },

  //项目详情
  bindtapNew(e) {
    let subjectid = vote.getDataSet(e,'subjectid');
    wx.navigateTo({
      url:'../voteDetails/voteDetails?subjectid='+subjectid
    });
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },

  //上拉加载下一页
  onReachBottom() {
    console.log(0);
    if (this.data.currPage * 1 < this.data.totalPage * 1) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.setData({
        showLoading: true
      });
      this.getSubjectList();
    } else {
      console.log('已加载到最后一页');
    }
  },
})