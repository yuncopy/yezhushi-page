
import { Config } from '../../utils/config.js';
import { Repairs } from '../repairs/repairs-model.js';

var repair = new Repairs(); //实例化 启动 对象

Page({

  data: {
    baseUrl: Config.baseUrl, //图片
    showLoading: true, //加载动画
    mall: [], //店铺信息
    showModal: false
  },

  onLoad: function(options) {
    this.data.repailid = options.shopid;
    this.getRepailDetail(this.data.repailid);

  },

  //获取投票选手
  getRepailDetail(id){

    //查询投票活动
    repair.getRepailDetail({id: id},(flag,res)=>{
     //console.log(res)
     if(flag && res.code == Config.sucess){
       this.setData({
         mall:res.data,
         showLoading: false
       });
     }
    });
   },
 
  //分享
  onShareAppMessage: function() {
    return {
      title: Config.applet,
      path: 'pages/start/start'
    };
  },

  bindClass:function(e){
    let deviceid = repair.getDataSet(e,'deviceid');
    let devicename = repair.getDataSet(e,'devicename');
    
    //console.log(device_id);
    wx.navigateTo({
      url: '../activelist/activelist?deviceid='+deviceid+'&devicename='+devicename
    });
  }

});