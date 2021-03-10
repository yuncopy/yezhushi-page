/**
 * Created by jimmy-jiang on 2016/11/21.
 */
import { Token } from 'token.js';
import { Config } from 'config.js';

class Base {
    constructor() {
        "use strict";
        this.onPay = Config.onPay;
        this.token = Config.tokenName;
    }

    //http 请求类, 当noRefech为true时，不做未授权重试机制
    request(params, noRefetch) {

        var that = this,url=params.url;
        
        /**不传请求方式默认GET请求 */
        if(!params.type) params.type = 'get';

        /*不需要再次组装地址*/
        if(params.setUpUrl==false) url = params.url;

        wx.request({
            url: url,
            data: params.data,
            method:params.type,
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync(that.token)
            },
            success: function (res) {
                
                //console.log(res);

                // 判断以2（2xx)开头的状态码为正确
                // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
                var code = res.statusCode.toString();
                var startChar = code.charAt(0);
                if (startChar == '2') {
                    
                    //结果以参数形式传给回调函数中处理
                    params.sCallback && params.sCallback(res.data);

                } else {

                    if (code == '401') {
                        if (!noRefetch) {
                            that._refetch(params);
                        }
                    }
                    that._processError(res);
                    params.eCallback && params.eCallback(res.data);
                }
            },
            fail: function (err) {
                //wx.hideNavigationBarLoading();
                that._processError(err);
                // params.eCallback && params.eCallback(err);
            }
        });
    }

    _processError(err){
        console.log(err);
    }

    _refetch(param) {
        var token = new Token();
        token.getTokenFromServer((token) => {
            this.request(param, true);
        });
    }

    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    }

    /**执行文件上传 */
    uploadFile(params,noRefetch){
        var that = this,url=params.url;
         /*不需要再次组装地址*/
        if(params.setUpUrl==false) url = params.url;

        wx.uploadFile({
            url: url,
            formData: params.data,
            filePath: params.img,
            name: 'file', //固定
            method:'post',
            header: {
                "content-Type": "multipart/form-data",
                'token': wx.getStorageSync(that.token)
            },success: function (res) {
                
                //console.log(res);
                // 判断以2（2xx)开头的状态码为正确
                // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
                var code = res.statusCode.toString();
                var startChar = code.charAt(0);
                if (startChar == '2') {
                    
                    //结果以参数形式传给回调函数中处理
                    params.sCallback && params.sCallback(res.data);

                } else {

                    if (code == '401') {
                        if (!noRefetch) {
                            that._refetch(params);
                        }
                    }
                    that._processError(res);
                    params.eCallback && params.eCallback(res.data);
                }
            },
            fail: function (err) {
                //wx.hideNavigationBarLoading();
                that._processError(err);
                // params.eCallback && params.eCallback(err);
            }
        });
    }

    /*本地缓存 保存／更新*/
    setStorage(key,data){
       return wx.setStorageSync(key,data);
    };

    /**获取缓存 */
    getStorage(key){
        return wx.getStorageSync(key);
    };

    /**删除 */
    removeStorage(key){
        return wx.removeStorageSync(key);
    };
    
     //上拉加载下一页
     reachBottom(data,callback) {
        if (data.currPage * 1 < data.totalPage * 1) {
            callback && callback(data.currPage * 1 + 1);
        } else {
            console.log('已加载到最后一页');
        }
    }
};

export {Base};
