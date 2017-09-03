/**
 * 客户端的配置文件。
 * 如果配置信息定义了全局变量，则使用全部字母大写的方式命名，使用下划线连接，例如：SYS_ROUTES。
 *
 * @author  Vincent Zheng
 * @version 1.0
 * @since   2015-10-30
 * @review
 */

'use strict';

/**
 * Router配置项
 * 
 * layoutTemplate 默认使用布局
 * @type {String}
 *
 * notFoundTemplate 找不到route时显示的template
 * @type {String}
 */
Router.configure({
    layoutTemplate: 'basicLayout',
    notFoundTemplate: 'notFound'
});

/**
 * 配置客户端使用的所有的routes。
 * 
 * {
 *     route: 'home', // route名
 *     path: '/', // 访问路径
 *     template: 'home', // template名
 *     subscribes: [{
 *         collection: 'test', // 加载数据collection的名字
 *         selector: 'testSelector', // 订阅数据selector的Session名
 *         options: 'testOptions' // 订阅数据options的Session名
 *     }]
 * }
 */
window.SYS_ROUTES = [
    { route: 'home', path: '/', template: 'home', subscribes: [] },
    { route: 'bid', path: '/bid', template: 'bid', subscribes: [] },
    { route: 'groupInvitation', path: '/groupInvitation/:_id', template: 'groupInvitation', subscribes: [] },
    { route: 'inviteFriend', path: '/inviteFriend', template: 'inviteFriend', subscribes: [] },
    { route: 'joinNewGroup', path: '/joinNewGroup', template: 'joinNewGroup', subscribes: [] },
    { route: 'profile', path: '/profile', template: 'profile', subscribes: [] },
    { route: 'grouping', path: '/grouping', template: 'grouping', subscribes: [] },
    { route: 'dateplugin', path: '/dateplugin', template: 'dateplugin', subscribes: [] },
    { route: 'pay', path: '/pay', template: 'pay', subscribes: [] },
    { route: 'bidding', path: '/bidding', template: 'bidding', subscribes: [] },
    { route: 'protocol', path: '/protocol', template: 'protocol', subscribes: [] },
    { route: 'waitConfirm', path: '/waitConfirm', template: 'waitConfirm', subscribes: [] },
    { route: 'confirm', path: '/confirm', template: 'confirm', subscribes: [] },
    { route: 'alreadyConfirm', path: '/alreadyConfirm', template: 'alreadyConfirm', subscribes: [] },
    { route: 'delprofile', path: '/delprofile', template: 'delprofile', subscribes: [] },
    { route: 'creating', path: '/creating', template: 'creating', subscribes: [] },
    { route: 'myReceipt',path:'/myReceipt',template:'myReceipt', subscribes:[]},
    { route: 'myReceiptDetails',path:'/myReceiptDetails',template:'myReceiptDetails',subscribes:[]}
];

/**
 * 屏幕宽度
 * 
 * @type {Number}
 */
window.PAGE_WIDTH = 640;

/**
 * 服务号App ID
 * 
 * @type {String}
 */
window.APPID = 'wxb56ebacca725902c';

window.HOST = 'http://test.xuuue.cn:4008';
// window.HOST = 'http://wechat.xuuue.cn';
