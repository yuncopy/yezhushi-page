
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Vote extends Base{
    constructor(){
        super();
    }

     /**获取头部广告 */
    getBannerList(callback){
        //定义参数
        var param={
            url: Config.getVoteBanner,
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    getSubjectList(callback){
        //定义参数
        var param={
            url: Config.getVoteSubject,
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    getPlayerList(data,callback){
        //定义参数
        var param={
            url: Config.getVotePlayer,
            data:data,
            type:'post',
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    getVoteSubjectList(data,callback){
        //定义参数
        var param={
            url: Config.getSubjectPlayer,
            data:data,
            type:'post',
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    getSubjectPlayerList(data,callback){
        //定义参数
        var param={
            url: Config.getSubjectPlayerList,
            data:data,
            type:'post',
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        //实际请求数据
        this.request(param);
    }

    
};

export {Vote};