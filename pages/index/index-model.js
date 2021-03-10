
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Index extends Base{
    constructor(){
        super();
    }

     /**获取头部广告 */
    getBannerList(callback){
        //定义参数
        var param={
            url: Config.getBanner,
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    //公告快讯
    getArticleList(data,callback){
        //定义参数
        var param={
            url: Config.indexArticle,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    //物业维修
    getHostGoodsList(data,callback){
        var data = this._setGoodsBest(data);
        //定义参数
        var param={
            url: Config.propertyList,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    _setGoodsBest(res){
        var formData={
            cnt:res.cnt,
            pisAdminBest:res.hot
        };
        return formData;
    }

    //店铺活动
    getRecomShopsList(data,callback){
        var data = this._setRecomShops(data);
        //定义参数
        var param={
            url: Config.roomShops,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        //实际请求数据
        this.request(param);
    }
    _setRecomShops(res){
        var formData={
            cnt:res.cnt
        };
        return formData;
    }

    getMyRepairList(data,callback){
        var data = this._setMyRepair(data);
        //定义参数
        var param={
            url: Config.myRepair,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        //实际请求数据
        this.request(param);
    }
    _setMyRepair(res){
        var formData={
            orderStatus:res.order
        };
        return formData;
    }

    getPropertyList(data,callback){
        //console.log(data);
        //定义参数
        var param={
            url: Config.propertyList,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }
    _setNewGoods(res){
        var formData={
            isAdminRecom:res.isAdminRecom,
            cnt: res.cnt,
            p:res.p
        };
        return formData;
    }

    //社区活动
    getActivityList(data,callback){
        //定义参数
        var param={
            url: Config.indexActivity,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        //实际请求数据
        this.request(param);
    }
};

export {Index};