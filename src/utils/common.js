
/*
 * 获取url参数
 * variable：要获取的字段名称
 */
export function getQueryVariable(variable) {
    //var query = window.location.href;
    var query = "http://192.168.250.12:30000/performance/brinson?strategy_id=B0000000000000000000000000002314&index_code=000905&begin_date=20180228&end_date=20180525";
    if(query.indexOf("?") < 0){
        return "";
    }
    var vars = query.split("?")[1].split("&");
    for(var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
}

/*
先从链接中获取参数值，值为空时，再从cookie中获取
name:cookie的key
isSaveToCookie:从URL中获取到value不为空时，是否保存到cookie
*/
export function getParamFromURLOrCookie(name,isSaveToCookie = false) {
    var value = getQueryVariable(name);
    if(value == ""){
        value = getCookie(name);
    }

    if(isSaveToCookie){
        setCookie(name,value,60);
    }
    
    return value
}

/*
    入参
    name:cookie's key,
    value:cookie's value,
    minuteToLive:cookie有效期时长（分钟）
    */
export function setCookie(name,value,minuteToLive){

    var cookie = name + '=' + encodeURIComponent(value);
    
    if(typeof daysToLive == 'number'){
        cookie += ';max-age='+(minuteToLive*60);
    }
    document.cookie = cookie;
 }

/*
    入参;
    name:cookie's key
    */
export function getCookie(name) {
  var cookies = document.cookie;
  var list = cookies.split("; ");          // 解析出名/值对列表
      
  for(var i = 0; i < list.length; i++) {
    var arr = list[i].split("=");          // 解析出名和值
    if(arr[0] == name)
      return decodeURIComponent(arr[1]);   // 对cookie值解码
  } 
  return "";
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

