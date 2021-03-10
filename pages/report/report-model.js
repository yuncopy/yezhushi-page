
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';


class Report extends Base{
    constructor(){
        super();
    }

    /*更新地址*/
    submitReport(data,callback){
        var param={
            url: Config.saveReport,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        this.request(param);
    }

    getUserReport(callback){
        var param={
            url: Config.getReport,
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        this.request(param);
    }
}

export {Report};