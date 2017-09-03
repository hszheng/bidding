/**
 * 服务端的配置文件。
 * 如果配置信息定义了全局变量，则使用全部字母大写的方式命名，使用下划线连接，例如：SYS_ROUTES。
 *
 * @author  Vincent Zheng
 * @review
 */

// 'use strict';

var self = this;

/**
 * 微信的AppID
 * 
 * @type {String}
 */
self.APPID = 'wxb56ebacca725902c';

/**
 * 微信AppSecret
 * 
 * @type {String}
 */
self.APP_SECRET = '16d81e368cc35c3a9bc9599632074b93';
/**
 * 文件上传保存路径
 * 
 * @type {String}
 */
// self.UPLOAD_FILE_PATH = '/Users/yangchunboy/Documents/file';
// self.UPLOAD_FILE_PATH = '/Users/Curry/Documents/file';
self.UPLOAD_FILE_PATH = '/data/uploadFiles';
// self.UPLOAD_FILE_PATH = '/Users/zhenghongsheng/Documents/file';

/**
 * 发送短信接口host
 * 
 * @type {String}
 */
self.SHOW_API_HOST = 'http://route.showapi.com';

/**
 * 发送短信appid
 * 
 * @type {String}
 */
self.SHOW_API_APP_ID = '13052',

/**
 * 发送短信secret
 * 
 * @type {String}
 */
self.SHOW_API_SECRET = '71db04056f82489f8ff9550d0eb78a25';
