
class Config{
    //constructor 是一种用于创建和初始化class创建的对象的特殊方法。
    // 构造函数
    constructor(){

    }
}

Config.applet = '业主事';
Config.bannerName = '安泰物业';
Config.bannerDescription = '贴心改变生活，用心创造价值。';
Config.api = 'http://yezhushi-api.me/api/v1/'; //接口地址
Config.baseUrl = 'http://yezhushi-api.me/'; //图片地址 https://towass.honghuseo.cn/
Config.tokenName = 'token';
Config.onPay=true;  //是否启用支付

//统一管理接口定义
Config.systemInfo = Config.api + 'system/load_config'; //系统配置接口
Config.tokenVerify = Config.api + 'token/verify'; //验证TOKEN接口
Config.tokenUser = Config.api + 'token/user'; //获取用户TOKEN接口
Config.modifyUser = Config.api + 'token/modify'; //更新用户信息
Config.indexArticle = Config.api + 'index/get_article_list'; //公告快讯
Config.indexActivity = Config.api + 'index/get_activity_list'; //社区活动
Config.propertyList = Config.api + 'repair/get_property_list'; //物业维修
Config.roomShops = Config.api + 'index/recom_shops_list'; //店铺活动
Config.myRepair = Config.api + 'index/get_repair_list'; //我的报修列表
Config.getArticle = Config.api + 'article'; //查看文章
Config.getRepairType = Config.api + 'repair/get_repair_type'; //获取报修类型
Config.getAddress = Config.api + 'address/get_address'; //用户地址
Config.defaultAddress = Config.api + 'address/set_default'; //设置用户默认地址
Config.deleteAddress = Config.api + 'address/delete_address'; //删除用户地址
Config.saveAddress = Config.api + 'address/save_address'; //删除用户地址
Config.getEstates = Config.api + 'repair/get_estate_list'; //获取所有小区地址
Config.uploadFile = Config.api + 'repair/repair_image'; //执行文件上传
Config.submitRepair = Config.api + 'repair/submit_repair'; //执行文件上传操作
Config.finishRepair = Config.api + 'repair/finish_order'; //确认报修已完成
Config.getMyInfo = Config.api + 'user/get_my_info'; //获取用户信息
Config.getBanner = Config.api + 'index/get_banner'; //获取轮播图
Config.saveReport = Config.api + 'user/save_report'; //上报疫情防控信息
Config.getReport = Config.api + 'user/get_report'; //获取疫情防控信息
Config.getVoteBanner = Config.api + 'vote/get_vote_banner'; //获取投票图片
Config.getVoteSubject = Config.api + 'vote/get_vote_subject'; //获取投票活动
Config.getVotePlayer = Config.api + 'vote/get_vote_player'; //获取投票选手
Config.getSubjectPlayer = Config.api + 'vote/get_subject_list'; //所有项目分页数据
Config.getSubjectPlayerList = Config.api + 'vote/get_subject_player_list'; //所有项目分页数据
Config.getSearchList = Config.api + 'index/searchAll'; //所有项目分页数据
Config.getPlayer = Config.api + 'vote/get_player_info'; //获取选手信息
Config.submitVote = Config.api + 'vote/to_submit_vote'; //获取选手信息

//统一异常提示
Config.timeOutMsg = '网络异常';
Config.setUserMsg ='用户信息更新异常';
Config.repairMsg ='您的报修是否已经完成';
Config.repairTitle ='温馨提示';
Config.repairTip ='操作成功';
Config.sucess = 10000;

export {Config};