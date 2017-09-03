/**
 * 公用方法类
 */

//'use strict';


var self = this;

self.Utility = {};

/**
 * 获取服务器当前时间
 * 
 * @param  {Function} callback 回调
 * 
 * @return {Void}
 */
Utility.getCurrentTime = function (callback) {
    
    check(callback, Function);

    Meteor.call('getCurrentTime', function (err, result) {
        if (err) {
            return Utility.getCurrentTime(callback);
        }

        callback(result);
    });
};

/**
 * 获取URL中参数的值
 * 
 * @param  {String} key 参数名
 * 
 * @return {String} 参数值
 */
Utility.parse = function (key) {
    var result = '',
        tmp = [];
    location.search
        .substr(1)
        .split('&')
        .forEach(function (item) {
            tmp = item.split('=');
            if (tmp[0] === key) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
};