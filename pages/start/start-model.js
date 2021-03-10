
// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';


class Start extends Base{
    constructor(){
        super();
    }

    //得到用户信息
    getUserInfo(e,callback){
        var that=this;
        wx.getSetting({    //查询是否授权
            success: res => {
                //授权时
                if (res.authSetting['scope.userInfo'] == true) {
                    var user = e.detail.userInfo;
                    this.modifyUserInfo(user, callback);
                } else { //已授权
                    console.log('未授权');
                }
            }
        });
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
};

export {Start};