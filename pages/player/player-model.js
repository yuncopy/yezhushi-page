
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Player extends Base{
    constructor(){
        super();
    }

    /**获取用户信息 */
    getPlayerInfo(data,callback){
        //定义参数
        var param={
            url: Config.getPlayer,
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

    /**
     * 投票
     * @param {*} data 
     * @param {*} callback 
     */
    submitPlayerVote(data,callback){
        //定义参数
        var param={
            url: Config.submitVote,
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
    
};

export {Player};