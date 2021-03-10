
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class My extends Base{
    constructor(){
        super();
    }
    /**获取用户信息 */
    getUserInfo(data,callback){
        //定义参数
        var param={
            url: Config.getMyInfo,
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

export {My};