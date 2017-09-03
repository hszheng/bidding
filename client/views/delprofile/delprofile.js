'use strict';
Template.delprofile.onCreated(function () {
    var self = this;

    self.autorun(function () {
        if (Session.get('groupInfoSelector') || Session.get('groupInfoOptoins')) {
            self.subscribe('groupInfo', Session.get('groupInfoSelector'), Session.get('groupInfoOptoins'));
        }
        if (Session.get('userInfoSelector') || Session.get('userInfoOptoins')) {
            self.subscribe('userInfo', Session.get('userInfoSelector'), Session.get('userInfoOptoins'));
        }
        if (Session.get('relationshipSelector') || Session.get('relationshipOptoins')) {
            self.subscribe('relationship', Session.get('relationshipSelector'), Session.get('relationshipOptoins'));
        }

    });
    self.autorun(function (c) {
        if (Session.get('WechatUserInfo')) {
            var result = Session.get('WechatUserInfo');
            if (result) {
                Session.set('openid', result.openid);
                // alert('openid' + result.openid);
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

    Session.set('groupInfoSelector', {
        'isRemoved': {
            $ne: true
        }
    });
    Session.set('groupInfoOptoins', {});

    Session.set('userInfoSelector', {
        'isRemoved': {
            $ne: true
        }
    });
    Session.set('userInfoOptoins', {});

    Session.set('relationshipSelector', {
        'isRemoved': {
            $ne: true
        }
    });
    Session.set('relationshipOptoins', {});
});
Template.delprofile.onRendered(function () {
    var self = this,
        userId = '',
        groupId = Session.get('groupId');
    // alert('groupId' + groupId);
    self.autorun(function () {
        userId = Session.get('userId');
        // alert(userId);

        Meteor.call('displayUserInfo', userId, function (err, result) {
            if (!err) {
                console.log(result);
                Session.set('displayUserInfo', result);
            }

        });
    });
    //点击返回事件
    $(".profile-footer .profile-back").click(function(e){
        Router.go('/creating');
    });
    // 点击删除弹出确认
    $('.profile-complete.delete-profle').on('click', function (e) {
        $('.delprofile-tip.del-tiper').show();
    });
    // 确认删除
    $('.delprofile-tip.del-tiper .del-btn').on('click', function (e) {
        $('.delprofile-tip.del-tiper').hide();
        $('.beforedelprofile-container input').val('');
        Meteor.call('getData', {
            collection: 'userInfo',
            selector: {
                _id: userId
            }
        }, function (err, result) {
            if (err) {
                // alert(err);
            } else {
                Meteor.call('updateData', {
                    collection: 'userInfo',
                    selector: {
                        _id: userId
                    },
                    modifier: {
                        $set: {
                            count: result[0].count - 1
                        }
                    },
                    multi: true
                }, function (err, result) {
                    if (!err) {
                        // alert('result!!!!!');
                    }
                });
            }

        });
        Meteor.call('getData', {
            collection: 'groupInfo',
            selector: {
                _id: groupId
            }
        }, function (err, result) {
            if (err) {
                // alert(err);
            } else {
                Meteor.call('updateData', {
                    collection: 'groupInfo',
                    selector: {
                        _id: groupId
                    },
                    modifier: {
                        $set: {
                            currentNum: result[0].currentNum - 1
                        }
                    },
                    multi: true
                }, function (err, result) {
                    if (!err) {
                        // alert('123!');
                    }
                });
            }

        });

        Meteor.call('updateData', {
            collection: 'relationship',
            selector: {
                userId: userId,
                groupId: groupId
            },
            modifier: {
                $set: {
                    isRemoved: true
                }
            },
            multi: true
        }, function (err, result) {
            if (!err) {
                // alert('123123123123');
                Router.go('/creating');
            }
        });
        

    });
});

Template.delprofile.helpers({
    displayUserInfo: function () {
        console.log(Session.get('displayUserInfo'));
        return Session.get('displayUserInfo');
    }

});
