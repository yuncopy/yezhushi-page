/**
 * Created by jimmy on 17/3/9.
 */
import {Base} from 'base.js';
import { Config } from 'config.js';

class Address extends Base{

    constructor() {
        super();
    }

    //使用报修页面获取用户地址
    getUserAddress(data,callback){
        var param={
            url: Config.getAddress,
            data:data,
            sCallback:function(res){
                if(res) {
                    callback && callback(res);
                }
            }
        };
        this.request(param);
    }
   
    /**设置默认地址 */
    saveDefaultAddress(res,callback){
        var data = this._setUpAddress(res);
        var param={
            url: Config.defaultAddress,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

    /*保存地址*/
    _setUpAddress(res){
        var formData={
            userName: res.userName,
            areaId1: res.areaId1,
            areaId: res.areaId,
            address: res.address,
            isDefault: res.isDefault,
            userPhone: res.userPhone,
            id: res.addressId,
            addressId:res.addressId
        };
        return formData;
    }

    //软删除用户地址
    deleteAddress(res,callback){
        var param={
            url: Config.deleteAddress,
            type:'post',
            data:res,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

    //获取小区信息
    getEstateList(callback){
        var param={
            url: Config.getEstates,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

    /*更新保存地址*/
    submitAddress(data,callback){
        var data = this._setUpAddress(data);
        var param={
            url: Config.saveAddress,
            type:'post',
            data:data,
            sCallback:function(res){
                callback && callback(res);
            },eCallback(res){
                callback && callback(res);
            }
        };
        this.request(param);
    }

}

export {Address}