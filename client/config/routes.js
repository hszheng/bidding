/**
 * 客户端所有的route。
 *
 * @author  Vincent Zheng
 * @version 1.0
 * @since   2015-10-30
 * @review
 */

'use strict';

/**
 * 设置route跳转，设置后才会显示当前页的内容。
 *
 * @author Vincent Zheng
 */
Router.onBeforeAction(function () {
    var self = this;

    self.next();
});

/**
 * 初始化routes
 *
 * @author Vincent Zheng
 */
_.each(SYS_ROUTES, function (route, index) {
    Router.route(route.route, {
        path: route.path,
        template: route.template,
        subscriptions: function () {},
        waitOn: function () {
            var subscribes = [];
            if (!_.isArray(route.subscribes)) {
                // 如果subscribes不是数组，则renturn
                return subscribes;
            }
            _.each(route.subscribes, function (item, index) {
                if (_.isString(item.collection) && _.isString(item.selector) && _.isString(item.options)) {
                    subscribes.push(Meteor.subscribe(item.collection, Session.get(item.selector), Session.get(item.options)));
                }
            });
            return subscribes;
        },
        onBeforeAction: function (pause) {
            var self = this;

            if (self.ready()) {
                self.render();
            } else {
                self.render('loading');
            }
        }
    });
});
