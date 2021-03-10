
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Seek extends Base{
    constructor(){
        super();
        this._storageHistory = 'history';
    }

    getSearchList(data,callback){
        //定义参数
        var param={
            url: Config.getSearchList,
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

export {Seek};