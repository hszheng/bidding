/**
 * 服务端所有的methods。
 *
 * @author  Vincent Zheng
 * @review
 */

'use strict';

Meteor.methods({
    /**
     * 保存数据
     * 
     * @param  {Object} options 保存数据参数
     * {
     *     collection: 'user', // collection名
     *     data: { name: 'rose', age: 20 } // 保存的数据
     * }
     * 
     * @return {String} 保存后的_id
     */
    insertData: function(options) {
        var self = this,
            collections = {
                userInfo: UserInfo,
                groupInfo: GroupInfo,
                relationship: Relationship,
                log: Log
            },
            collection = null,
            id = '';

        self.unblock();

        try {
            check(options, {
                collection: String,
                data: Object
            });
        } catch (e) {
            Utility.throwError(1001);
        }


        collection = collections[options.collection];

        if (!collection) {
            // collection不存在
            Utility.throwError(1002);
        }

        // 保存时间
        options.data.timestamp = Date.now();

        // 保存数据
        id = collection.insert(options.data);

        return id;
    },
    /**
     * 更新数据
     * 
     * @param  {Object} options 更新数据参数
     * {
     *     collection：'user', // collection名
     *     selector：{ name: 'rose' }, // 选择器
     *     modifier：{ $set: { age: 18 } }, // 修改的数据
     *     multi：false, // 是否修改全部
     * }
     * 
     * @return {Boolean} 是否修改成功，true：是；false：否；
     */
    updateData: function(options) {
        var self = this,
            collections = {
                userInfo: UserInfo,
                groupInfo: GroupInfo,
                relationship: Relationship,
                log: Log
            },
            collection = null,
            data = [];

        self.unblock();

        options = _.extend({
            multi: false
        }, options);

        try {
            check(options, {
                collection: String,
                selector: Match.OneOf(Object, String),
                modifier: Object,
                multi: Boolean
            });
        } catch (e) {
            Utility.throwError(1001);
        }

        collection = collections[options.collection];

        if (!collection) {
            // collection不存在
            Utility.throwError(1002);
        }

        if (!options.multi && collection.find(options.selector).fetch().length > 1) {
            // 找到多条数据
            Utility.throwError(1003);
        }

        if (collection.find(options.selector).fetch().length === 0) {
            // 找不到数据
            Utility.throwError();
        }

        collection.update(options.selector, options.modifier, {
            multi: options.multi
        });

        return true;
    },
    /**
     * 获取数据
     * 
     * @param  {Object} options 查询数据条件
     * {
     *      collection：user, // collection名
     *      selector：{ name: 'rose' }, // 选择器
     *      options：{ skip: 0, limit: 1 } // 选择器选项
     * }
     * 
     * @return {Array} 查询的数据
     */
    getData: function(options) {
        var self = this,
            collections = {
                userInfo: UserInfo,
                groupInfo: GroupInfo,
                relationship: Relationship,
                log: Log,
                myReceipt:Receipt
            },
            collection = null,
            data = [];

        self.unblock();

        options = _.extend({
            options: {}
        }, options);

        try {
            check(options, {
                collection: String,
                selector: Match.OneOf(Object, String),
                options: Object
            });
        } catch (e) {
            Utility.throwError(1001);
        }

        collection = collections[options.collection];

        if (!collection) {
            // collection不存在
            Utility.throwError(1002);
        }

        return collection.find(options.selector, options.options).fetch();
    },
    /**
     * 获取当前时间戳
     * 
     * @return {Number} 当前时间戳
     */
    getCurrentTime: function() {
        var self = this;

        self.unblock();

        return Date.now();
    },
    /**
     * 获取微信对接的配置信息
     * 
     * @param  {String} url 微信对接的URL
     * 
     * @return {Object}     微信对接的配置信息
     */
    getWechatConfig: function(url) {
        var self = this,
            signStr = '',
            config = {
                appId: APPID,
                nonceStr: APPID,
                signature: '',
                timestamp: Math.floor(Date.now() / 1000)
            },
            token = Token.findOne(),
            tokenResult = null,
            ticketResult = null;

        self.unblock();
        if (!token || Date.now() - token.timestamp > 7000 * 1000) {
            tokenResult = HTTP.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APP_SECRET);
            ticketResult = HTTP.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + tokenResult.data.access_token + '&type=jsapi');
            if (!token) {
                Token.insert({
                    token: tokenResult.data.access_token,
                    ticket: ticketResult.data.ticket,
                    timestamp: Date.now()
                });
            } else {
                Token.update(token._id, {
                    $set: {
                        token: tokenResult.data.access_token,
                        ticket: ticketResult.data.ticket,
                        timestamp: Date.now()
                    }
                });
            }
            token = {
                token: tokenResult.data.access_token,
                ticket: ticketResult.data.ticket,
                timestamp: Date.now()
            };
        }
        signStr = decodeURIComponent('jsapi_ticket=' + token.ticket + '&noncestr=' + config.nonceStr + '&timestamp=' + config.timestamp + '&url=' + url);

        config.signature = new jsSHA(signStr, 'TEXT').getHash('SHA-1', 'HEX');
        return config;
    },

    /**
     * 获取授权的token
     * 
     * @param  {String} code 微信授权的code
     * 
     * @return {Object}      用户基本信息
     */
    getUserInfoByCode: function(code) {
        var self = this,
            result = null,
            access = null,
            userData = null,
            data = null;

        self.unblock();

        result = HTTP.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + APPID + '&secret=' + APP_SECRET + '&code=' + code + '&grant_type=authorization_code');
        if (!result || !result.content) {
            return null;
        }
        access = JSON.parse(result.content);
        userData = HTTP.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + access.access_token + '&openid=' + access.openid + '&lang=zh_CN')
        data = JSON.parse(userData.content);
        if(data.errcode){
            data.log = '未获取到openId';
        }
        return data;
    },
    /**
     * [getgroupArr 返回某人已参加的群组信息数组]
     * @param  {[Array]} groupArr 返回群组ID数组
     * @return {[Array]}          对象数组
     */
    getgroupArr: function(openId) {
        var groupRelArr = [],
            groupArr = [],
            relationArr = [],
            relationshipArr = [],
            getgroupArr = [],
            _groupRelArr = [],
            // userId = "JeRadPqR3X49b23dR";
        userId = UserInfo.findOne({
            openId: openId
        })._id;
        
        
        Relationship.find({
            userId: userId,
            isRemoved: {
                $ne: true
            }
        }).fetch().forEach(function(e) {
            groupRelArr.push({
                relationId: e._id,
                groupId: e.groupId,
            });
        });
        
        _.each(groupRelArr,function(item){
            
            var group = GroupInfo.findOne({_id:item.groupId});
            
            if(group.status === '创建中'){
                _groupRelArr.push({
                    relationId: item.relationId,
                    groupId: item.groupId
                });   
            }
        });

        _.each(_groupRelArr, function(item1) {
            groupArr = GroupInfo.findOne({
                _id: item1.groupId,

            });

            relationArr = Relationship.find({
                groupId: item1.groupId,
                isRemoved: {
                    $ne: true
                }
            }).fetch();

            relationshipArr = [];
            // _.each(relationArr, function(item2) {
            //     relationshipArr.push({
            //         userName: UserInfo.findOne({
            //             _id: item2.userId,
            //             isRemoved: {
            //                 $ne: true
            //             }
            //         }).userName,
            //         status: item2.status,
            //         userId: item2.userId
            //     });
            //     console.log('relationshipArr',relationshipArr);
            // });
             _.each(relationArr, function(item2) {
                var user =  UserInfo.findOne({
                        _id: item2.userId,
                        isRemoved: {
                            $ne: true
                        }
                    });
                relationshipArr.push({
                    userName:user.userName,
                    currentOpenId:user.openId,
                    status: item2.status,
                    userId: item2.userId,
                });
                console.log('relationshipArr',relationshipArr);
            });
            getgroupArr.push({
                groupName: groupArr.groupName,
                period: groupArr.period,
                groupFee: groupArr.groupFee,
                firstPayDay: groupArr.firstPayTime.split('年')[1],
                currentNum: groupArr.currentNum,
                number: groupArr.number,
                relationshipArr: relationshipArr,
                groupId: item1.groupId,
                creatorId: groupArr.creatorId
            });
        });
        console.log(getgroupArr);
        return getgroupArr;

    },
    /**
     * 查询组，返回组信息与参与人
     * @param  {String} ivitedCode 邀请码
     * @return {Array}  显示的数据
     */
    groupInfoArr: function(invitedCode,groupName) {
        var groupArr = GroupInfo.findOne({
                invitedCode: invitedCode,
                groupName: groupName,
                isRemoved: {
                    $ne: true
                }
            });
       if(!groupArr){
            groupInfoArr = [];
        }
        else{
         var  groupInfoArr = [],
            relationshipArr = [],
            groupId = groupArr._id,

            relationArr = Relationship.find({
                groupId: groupId,
                isRemoved: {
                    $ne: true
                }
            }).fetch();
        console.log(relationArr);
        _.each(relationArr, function(item) {
            relationshipArr.push({
                userName: UserInfo.findOne({
                    _id: item.userId,
                    isRemoved: {
                        $ne: true
                    }
                }).userName,
                status: item.status
            });
        });

        groupInfoArr.push({
            groupName: groupArr.groupName,
            period: groupArr.period,
            groupFee: groupArr.groupFee,
            firstPayDay: groupArr.firstPayTime.split('年')[1],
            relationshipArr: relationshipArr,
            groupId: groupId
        });
      }
        return groupInfoArr;
    },
    displayUserInfo: function(userId) {
        var idArr = [],
            monthlypay = 0,
            sum = 0,
            groupInfo = [],
            userinfo = UserInfo.findOne({
                _id: userId,
                isRemoved: {
                    $ne: true
                }
            });

        Relationship.find({
            isRemoved: {
                $ne: true
            }
        }).fetch().forEach(function(e) {
            idArr.push(e.groupId);
        });

        groupInfo = GroupInfo.find({
            isRemoved: {
                $ne: true
            }
        }).fetch();

        if (groupInfo.length) {
            groupInfo.forEach(function(e) {
                console.log(e.groupFee);
                sum += e.groupFee;
            });
            monthlypay = parseFloat((sum / groupInfo.length).toFixed(2));
        }
        userinfo.monthlypay = monthlypay;
        console.log(userinfo);
        return userinfo;
    },
    /**
     * 发送验证码
     * 
     * @param  {String} mobile 手机号码
     * @param  {String} captcha 验证码
     * 
     * @return {Boolean}       true：发送成功；false：发送失败。
     */
    sendCaptcha: function (mobile, captcha) {
        var self = this,
            sync = null,
            result = '';

        self.unblock();

        sync = Meteor.wrapAsync(sendCaptchaAsync);
        result = sync(mobile, captcha);
        return result;
    }

});


/**
 * 发送验证码
 * 
 * @param  {String}   phone    手机号码
 * @param  {String}   captcha  验证码
 * @param  {Function} callback 回调函数
 * 
 * @return {Void}
 */
function sendCaptchaAsync(mobile, captcha, callback) {
    var date = new Date(),
        year = '' + date.getFullYear(),
        month = '00' + (date.getMonth() + 1),
        day = '00' + date.getDate(),
        hour = '00' + date.getHours(),
        minute = '00' + date.getMinutes(),
        seconds = '00' + date.getSeconds(),
        timestamp = year + month.substr(month.length - 2) +
            day.substr(day.length - 2) +
            hour.substr(hour.length - 2) +
            minute.substr(minute.length - 2) +
            seconds.substr(seconds.length - 2);
    HTTP.get(SHOW_API_HOST + '/28-1', {
        params: {
            showapi_appid: SHOW_API_APP_ID,
            showapi_sign: SHOW_API_SECRET,
            showapi_timestamp: timestamp,
            tNum: 'T151230000443',
            mobile: mobile,
            content: JSON.stringify({ code: captcha })
        }
    }, function (error, result) {
        callback(null, result);
    });
}

/**
 * 创建模板
 * 
 * @return {Void}
 */
function createSMSTemplate(callback) {
    HTTP.get(SHOW_API_HOST + '/28-2', {
        params: {
            showapi_appid: SHOW_API_APP_ID,
            showapi_sign: SHOW_API_SECRET,
            showapi_timestamp: '20151230144413',
            content: '您好,验证码是[code],请在微信中输入该验证码，并完成个人信息的修改或绑定，感谢您对团子汇的支持！',
            title: '广州团汇网络有限公司'
        }
    }, function (error, result) {
        callback(null, result);
    });
}
