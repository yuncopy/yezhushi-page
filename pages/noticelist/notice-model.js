
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Notice extends Base{
    constructor(){
        super();
    }

    //公告快讯
    getArticleList(data,callback){
        data = this._setPage(data);
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

    /*格式化分页数据*/
    _setPage(res){
        var formData={
            cnt:res.pageSize,
            p:res.pageNo,
            weight:res.weight
        };
        return formData;
    }

    getDetailInfo(id,callback){
        //定义参数
        var param={
            url: Config.getArticle+'/'+id,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        //实际请求数据
        this.request(param);
    }
    

    getActivityInfo(data,callback){
        //定义参数
        var param={
            url: Config.indexActivity,
            data:data,
            type:'post',
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

export {Notice};