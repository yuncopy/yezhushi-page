// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头

import { Config } from 'config.js';

class Token {
    //构造函数
    constructor() {
        this.verifyUrl = Config.tokenVerify;
        this.tokenUrl = Config.tokenUser;
        this.tokenKey = Config.tokenName;
        this.timeOutMsg = Config.timeOutMsg;
    }

    //验证方法
    verify() {
        var token = wx.getStorageSync(this.tokenKey);
        if (!token) {
            this.getTokenFromServer(); //从服务器获取token
        }
        else {
            this._veirfyFromServer(token); // 验证TOKEN
        } 
    }
    /**验证是否OK */
    _veirfyFromServer(token) {
        var that = this;
        wx.request({
            url: that.verifyUrl,
            method: 'POST',
            data: {
                token: token
            },
            success: function (res) {
                var valid = res.data.data.isValid;
                if(!valid){
                    that.getTokenFromServer();
                }
            }
        })
    }
    /**获取服务TOKEN */
    getTokenFromServer(callBack) {
        var that  = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    data:{
                        code:res.code
                    },
                    success:function(res){
                        if(res.data.code == 10000){
                            console.log( res.data.data.token);
                            var token = res.data.data.token;
                            wx.setStorageSync(that.tokenKey, token);
                            callBack&&callBack(token);
                        }else{
                            that._timeOutError();
                        }
                    }
                })
            }
        })
    }

    /**网络异常*/
    _timeOutError(){
        wx.showToast({
            title: this.timeOutMsg,
            icon: 'none',
            duration: 1500
        })
    }
}

export {Token};