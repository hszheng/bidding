// 'use strict';
var num = 60;
var clock = 0;
Template.profile.onCreated(function () {
    var self = this;

    Session.set('userInfoOptoins', {});
    Session.set('groupInfoOptoins', {});
    Session.set('relationshipOptoins', {});
    Session.set('userId', '');
    Session.set('idArr', []);
    self.autorun(function () {
        if (Session.get('userInfoSelector') || Session.get('userInfoOptoins')) {
            self.subscribe('userInfo', Session.get('userInfoSelector'), Session.get('userInfoOptoins'));
        }
        if (Session.get('groupInfoSelector') || Session.get('groupInfoOptoins')) {
            self.subscribe('groupInfo', Session.get('groupInfoSelector'), Session.get('groupInfoOptoins'));
        }
        if (Session.get('relationshipSelector') || Session.get('relationshipOptoins')) {
            self.subscribe('relationship', Session.get('relationshipSelector'), Session.get('relationshipOptoins'));
        }

    });
    self.autorun(function (c) {
        Session.set('relationshipSelector', {
            'isRemoved': {
                $ne: true
            },
            'userId': Session.get('userId')
        });
    });
    self.autorun(function (c) {
        if (Session.get('idArr')) {
            Session.set('groupInfoSelector', {
                '_id': {
                    $in: Session.get('idArr')
                },
                'isRemoved': {
                    $ne: true
                }
            });
        }

    });
    self.autorun(function (c) {
        if (Session.get('WechatUserInfo')) {
            var result = Session.get('WechatUserInfo');
            if (result) {
                Session.set('openid', result.openid);
                //取用户表数据
                Meteor.call('getData', {
                    collection: 'userInfo',
                    selector: {}
                }, function (error, result) {
                    Session.set('userInfo', result);
                    console.log(result);
                });
            }
            c.stop();
            Session.set('userInfoSelector', {
                'isRemoved': {
                    $ne: true
                },
                'openId': Session.get('WechatUserInfo').openid
            });
        }
    });

});


Template.profile.onRendered(function () {
    document.title = "个人资料";
    // 点击验证码事件
    $('.get-captcha').on('click', function (e) {
        var phoneNum = $('.bind-container #profileCell').val(),
            codeLength = 4, //验证码的长度
            result = '', //用来放验证码
            random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9); //随机数
        if (!phoneNum || !/^1[345678][0-9]{9}$/.test(phoneNum)) {
            $('.bind-container #profileCell').addClass('changeOutline');
            return;
        }
        if ($(this).hasClass('change-captcha-bg')) {
            console.log($(this));
            return;
        } else {
            for (var i = 0; i < codeLength; i++) { //循环操作
                var index = Math.floor(Math.random() * 10); //取得随机数的索引（0~35）
                result += random[index]; //根据索引取得随机数加到result上
            }
            alert(result);
            Session.set('result', result);
            Meteor.call('sendCaptcha', phoneNum, result);
            // $(this).addClass('already');
            clock = setInterval(doLooop, 1000); //1秒执行一次
        }
    });
    // 绑定或个人资料
    $('.bind-container .profile-complete').on('click', function (e) {
        var profileName = $('.bind-container #profileName').val(),
            profileCell = $('.bind-container #profileCell').val(),
            profileCaptcha = $('.bind-container #profileCaptcha').val(),
            captcha = Session.get('result');
        if (!profileName) {
            $('.bind-container #profileName').addClass('changeOutline');
            return;
        }
        if (!profileCell || !/^1[345678][0-9]{9}$/.test(profileCell)) {
            $('.bind-container #profileCell').addClass('changeOutline');
            return;
        }
        // 验证验证码是否正确

        if (!profileCaptcha) {
            $('.bind-container #profileCaptcha').addClass('changeOutline');
            return;
        }
        if (profileName && profileCell && profileCaptcha === captcha) {
            $('.bind-container .profile-tip').show();
            setTimeout(function (e) {
                var isBinded = Session.get('isBinded'),
                    userInfo = Session.get('WechatUserInfo');
                $('.bind-container .profile-tip').hide();
                if (!isBinded && userInfo) {
                    // Session.set('isBinded', true);
                    Meteor.call('insertData', {
                            collection: 'userInfo',
                            data: {
                                userName: profileName,
                                openId: userInfo.openid,
                                phoneNum: profileCell,
                                count: 0,
                                romemaker: 'no'
                            }
                        },
                        function (error, result) {
                            console.log(result);
                            if (!result) {
                                // Router.go('/joinNewGroup');
                            }
                        });
                }
                if(isBinded && userInfo){
                    Meteor.call('updateData',{collection:'userInfo',selector:{_id:Session.get('userId')},modifier:{$set:{userName:profileName,profileName:profileCell}},multi:true},function(err,result){
                        console.log(err,result);
                    })
                }
            }, 1500);

        }
    });
    $('.bind-container #profileName,.bind-container #profileCell,.bind-container #profileCaptcha').focus(function (e) {
        var elem = $(e.currentTarget);
        removeOutline(elem);
    });
    // 点击返回
    $('.bind-container .profile-back,.checkprofile-container .checkprofile-back').on('click', function(e) {
        wx.ready(function() {
            wx.closeWindow();
        });
    });
});

Template.profile.helpers({
    isBinded: function () {
        // 检索数据库中是否已存在用户的openId，若存在，则表明已绑定
        var usersOpenId = _.pluck(Session.get('userInfo'),'openId'),
            currentOpenId = Session.get('openid');
        if(_.contains(usersOpenId,currentOpenId)){
            Session.set('isBinded',true);
            return true;
        }else{
            Session.set('isBinded',false);
            return false;
        }
    },
    userinfoArr: function () {
        var userinfo = UserInfo.findOne();
        userinfoArr = [];

        if (userinfo) {
            userinfoArr.push({
                userName: userinfo.userName,
                phoneNum: userinfo.phoneNum,
                count: userinfo.count
            });
            Session.set('userId', userinfo._id);
        }
        return userinfoArr;
    },
    monthlypay: function () {
        var idArr = [],
            monthlypay = 0,
            sum = 0,
            groupInfo = [];

        Relationship.find().fetch().forEach(function (e) {
            idArr.push(e.groupId);
        });

        Session.set('idArr', idArr);

        console.log(idArr);

        groupInfo = GroupInfo.find().fetch();

        if (groupInfo.length) {
            groupInfo.forEach(function (e) {
                console.log(e.groupFee);
                sum += e.groupFee;
            });
            monthlypay = sum / groupInfo.length;
        }

        return monthlypay;

    }

});

Template.profile.events({

});

// 获取验证码定时器

function doLooop() {
    num--;
    var html = num + '秒后再次发送';
    if (num > 0) {
        $('.get-captcha').addClass('change-captcha-bg');
        $('.get-captcha').html(html);
    } else {
        clearInterval(clock); //清除js定时器
        $('.get-captcha').removeClass('change-captcha-bg');
        $('.get-captcha').html('验证码');
        num = 60;
    }

}
// 移除outline
function removeOutline(selector) {
    $(selector).removeClass('changeOutline');
}
