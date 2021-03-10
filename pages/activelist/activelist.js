

import { Config } from '../../utils/config.js';
import { Index } from '../index/index-model.js';
import { Repairs } from '../repairs/repairs-model.js';

var index = new Index(); //实例化 启动 对象
var repair = new Repairs(); //实例化 启动 对象

Page({

  data: {
    baseUrl:Config.baseUrl,
    datas: [],
    mallLists: [], //店铺分类接口
    index: '', //选择商品分类的下标
    deviceid:'', //设备分类ID
    currPage: 1,
    totalPage: '',
    showLoading:true
  },

  onLoad: function(options) {
    
    if(options.deviceid){
      //console.log(options.deviceid);
      this.data.deviceid = options.deviceid;
      this.setData({
        deviceid:this.data.deviceid,
        devicename:options.devicename
      });
    }
    this.getLists();
  },
  getLists() {
    //物业维修
    let param = {p: this.data.currPage,cnt:6,deviceid:this.data.deviceid};
    index.getPropertyList(param,(flag,res)=>{
      if(flag && res.code == Config.sucess){
        let datas = this.data.datas.concat(res.data.result);
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage,
          showLoading:false
        });
      }
    });
  },
  
  //点击跳转维修详情
  bindMall(e){
    //console.log(e);
    let shopid = index.getDataSet(e,'shopid');
    wx.navigateTo({
      url: `../repairDetails/repairDetails?shopid=${shopid}`
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
    index.reachBottom(this.data,(page)=>{
      this.setData({
        currPage: page,
        showLoading: true
      });
      this.getLists();
    });
  },



  //显示店铺商品分类
  bindClass() {
    //获取项目
    repair.getRepairType((res)=>{
      if(res.code == Config.sucess){
        res.data.unshift({ "repairId": "", "repairName": "全部分类" }); //前面插入
        this.setData({
          mallLists:res.data,
          showLoading: false,
          showModal:true,
          masktop: 0
        });
      }
     });
  },
  

  //点击分类筛选商品
  bindtapLists(e) {

    this.data.deviceid = repair.getDataSet(e,'deviceid');
    let index = repair.getDataSet(e,'index');
    //console.log(index,this.data.mallLists);
    //初始化数据
    this.setData({
      index:index,
      currPage:1,
      datas:[],
      deviceid:'',
      mallLists:this.data.mallLists,
      showLoading: false,
    });
    this.getLists();
    this.bindClose();
  },

  //关闭分类
  bindClose() {
    this.setData({
      masktop: '-2000rpx',
    });
  }

});