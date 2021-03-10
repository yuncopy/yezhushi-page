

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
* 时间戳转化为年 月 日 时 分 秒 
* number: 传入时间戳 
* format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime2Date(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

// 格式化数字
function number_format (text) {
  return text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

/**
 * 获取所有对象键名
 * @param {*} object 
 */
function getKeys(dictObject){
  var createArr = []
  console.log(dictObject);
  for (let key in dictObject) {
    createArr.push(key); 
  }
  return createArr;
}


module.exports = {
　　 formatTime: formatTime2Date,
    formatNumber:formatNumber,
    isInArray:isInArray,
    getKeys:getKeys
}