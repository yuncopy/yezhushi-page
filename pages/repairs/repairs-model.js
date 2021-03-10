
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';


class Repairs extends Base{
    constructor(){
        super();
    }

    //获取报修类型
    getRepairType(callback){
        var param={
            url: Config.getRepairType,
            sCallback:function(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

    /*更新用户信息到服务器*/
    modifyUserInfo(data,callback){
        var data = this._setUserInfo(data);
        //delete data.avatarUrl;  //将昵称去除
        //delete data.nickName;  //将昵称去除
        var param={
            url: Config.modifyUser,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(true,res);
            }
        };
        this.request(param);
    }

    /*格式化用户信息*/
    _setUserInfo(res,callback){
        var formData={
            userName:res.nickName,
            userPhoto:res.avatarUrl,
            city:res.city,
            country:res.country,
            province:res.province,
            language:res.language,
            gender:res.gender,
        };
        return formData;
    }

    /**文件上传 */
    uploadImge(res,callback){
        var param={
            url: Config.uploadFile,
            data:res.data,
            img:res.img,
            name:res.name,
            sCallback:function(res){
                callback && callback(res);
            }
        };
        this.uploadFile(param);
    }
    
    /**提交报修单*/
    submitRepairOrder(data,callback){
        var param={
            url: Config.submitRepair,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

    /**获取维修列表 */
    getRepairList(data,callback){
        var param={
            url: Config.myRepair,
            data:data,
            type:"post",
            sCallback:function(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }
    /**确认报修 */
    finishOrder(data,callback){
        var param={
            url: Config.finishRepair,
            data:data,
            type:"post",
            sCallback:function(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

    /**
     * 查看详情
     * @param {*} data 
     * @param {*} callback 
     */
    getRepailDetail(data,callback){
        var param={
            url: Config.propertyList,
            data:data,
            type:"post",
            sCallback:function(res){
                callback && callback(true,res);
            },eCallback(res){
                callback && callback(false,res);
            }
        };
        this.request(param);
    }
};

export {Repairs};