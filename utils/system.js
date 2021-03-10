/**
 * Created by jimmy on 17/3/9.
 */
import {Base} from 'base.js';
import { Config } from 'config.js';

class System extends Base{
    constructor() {
        super();
    }
    /*获得小程序配置信息*/
    getSystemInfo(callback){
        var that=this;
        var param={
            url: Config.systemInfo,
            sCallback:function(res){
                if(res) {
                    callback && callback(res);
                }
            }
        };
        this.request(param);
    } 
}

export {System}