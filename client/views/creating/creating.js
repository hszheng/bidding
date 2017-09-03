'use strict'
Template.creating.onCreated(function () {
    var self = this;
    self.autorun(function (c) {
        // var openId = "o0Zfpwh6FINws5p6p2pJqbuvsvz0";
        // Session.set('WechatUserInfo', openId);
        if (Session.get('WechatUserInfo')) {
            var result = Session.get('WechatUserInfo');
            if (result) {
                Session.set('currentUserId', result.openid);
                // alert(result.openid);
                Session.set('isTrue', false);
                Session.set('true', false);
                Meteor.call('getData', {
                    collection: 'groupInfo',
                    selector: {
                        status: '创建中',
                    }
                }, function (err, result) {
                    console.log(err, result);
                    Session.set('groupInfo', result);
                });
                Meteor.call('getData', {
                    collection: 'userInfo',
                    selector: {

                    }
                }, function (err, result) {
                    console.log(err, result);
                    Session.set('userInfo', result);
                });
                Meteor.call('getData', {
                    collection: 'relationship',
                    selector: {
                        isRemoved: {
                            $ne: true
                        }
                    }
                }, function (err, result) {
                    console.log(err, result);
                    Session.set('relationship', result);
                });
                Session.set('isTure', true);
            }
            c.stop();
        }
    });
});
Template.creating.onRendered(function () {
    document.title = "创建中";
    //给当前用户点击自己状态的点击事件
    var timer = setInterval(function () {
        if (Session.get('true') && Session.get('isTure')) {
            clearInterval(timer);
            //非群主成员点击可以查看其他成员的详细资料事件
            $(".groupWhiteBg .isDetailClick").click(function(e){
                var currentGroupId = $(this).data('groupid'),
                    userId = $(this).data('id');
                Session.set('userId', userId);
                console.log(currentGroupId);
                Session.set('groupId', currentGroupId);
                Router.go('/delprofile');
                $(".profile-footer .delete-profle").hide();
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //跳转到删除群组某成员页面
            $(".groupWhiteBg .isDeleteClick").click(function (e) {
                var currentGroupId = $(this).data('groupid'),
                    userId = $(this).data('id');
                Session.set('userId', userId);
                console.log(currentGroupId);
                Session.set('groupId', currentGroupId);
                Router.go('/delprofile');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //点击分享按钮
            $(".inviteClick").click(function (e) {
                var currentGroupId = $(this).data('id');
                console.log(currentGroupId);
                Session.set('nowGroupId', currentGroupId);
                // alert(currentGroupId);
                Router.go('/inviteFriend');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //群组点击开始按钮事件
            $(".isCompleteClick").click(function (e) {
                if (confirm('是否确定要开始本轮标会？')) {
                    var currentGroupId = $(this).data("id"),
                        groupInfo = _.findWhere(Session.get('groupInfo'), {
                            _id: currentGroupId
                        }),
                        currentNum = groupInfo.currentNum,
                        number = groupInfo.number,
                        nowList = _.where(Session.get('relationship'), {
                            groupId: currentGroupId
                        });
                    Meteor.call('updateData', {
                        collection: 'groupInfo',
                        selector: {
                            _id: currentGroupId
                        },
                        modifier: {
                            $set: {
                                number: currentNum,
                                status: '投标中'
                            }
                        },
                        multi: true
                    }, function (err, result) {
                        console.log(err, result);
                        // alert(err); 
                    });
                    for (var i = 0; i < nowList.length; i++) {
                        Meteor.call('updateData', {
                            collection: 'relationship',
                            selector: {
                                _id: nowList[i]._id
                            },
                            modifier: {
                                $set: {
                                    status: '未投标'
                                }
                            },
                            multi: true
                        }, function (err, result) {
                            if (err) {
                                // alert('ERR' + err);
                            } else {
                                // alert('Result' + result);
                            }
                        });
                    }
                    $(this).css({
                        "background": "#bdbdbd",
                        "color": "white",
                        "border-color": "#bdbdbd"
                    });
                    $(this).siblings().css({
                        "color": "#bdbdbd",
                        "border-color": "#bdbdbd"
                    });
                    $(this).siblings().find('.toInvite').css("color", "#bdbdbd");
                }else{

                }
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //非群主点击开始按钮事件
            $(".notComplete").click(function (e) {
                confirm('您不是群主，没有权限！');
                Session.set('isTure', false);
                Session.set('true', false);
            });

        }
    }, 500)
});

Template.creating.helpers({
    isEmpty: function () {
        var groupInfo = Session.get('groupInfo');
        if (!groupInfo) return;
        var currentUserOpenId = Session.get('currentUserId');
        var nowRelationship = _.where(Session.get('relationship'), {
            openid: currentUserOpenId
        });
        // alert(JSON.stringify(nowRelationship));
        var groupIdArr = _.pluck(nowRelationship, 'groupId');
        if (groupIdArr.length === 0) {
            return true;
        } else {
            return false;
        }
    },
    //获取群组
    groups: function () {
        var groupInfo = Session.get('groupInfo');
        if (!groupInfo) return;
        var relationship = Session.get('relationship');
        if (!relationship) return;
        var currentUserOpenId = Session.get('currentUserId');
        var nowRelationship = _.where(relationship, {
            openid: currentUserOpenId
        });
        var groupIdArr = _.pluck(nowRelationship, 'groupId');
        var groups = [];
        for (var i = 0; i < groupIdArr.length; i++) {
            var item = _.findWhere(groupInfo, {
                _id: groupIdArr[i]
            });
            if (item) {
                groups.push(item);
            }
        }
        console.log(groups);
        _.each(groups, function (item, index) { //遍历群组，并且每个群组的时间只取月日
            item.firstPayTime = item.firstPayTime.substr(5);
            if (item.creatorId === currentUserOpenId) {
                item.isInvite = true;
                item.isComplete = true;
            } else {
                item.isInvite = true;
                item.isNotComplete = true;
            }
        });
        return groups;
    },
    //获取人员列表
    userList: function () {
        var currentId = this._id, //获取外部each的groupId
            nowUser = {}, //当前用户
            count = 0,
            currentUserOpenId = Session.get('currentUserId'), //获取当前进来的用户openId
            isRoomMaker = '', //是否是房间创建者
            openId = '', //用户的openId
            groupInfo = Session.get('groupInfo'), //获取群组数据
            creatorId = _.findWhere(groupInfo, {
                _id: currentId
            }).creatorId, //获取当前创建者id
            list = Session.get('relationship'), //获取关系表数据
            nowList = _.where(list, {
                groupId: currentId,
                nowTurn: 1
            }), //获取与当前群组当前轮相关的关系表数据
            users = Session.get('userInfo'); //获取用户表数据
        // alert(JSON.stringify(nowList));
        // alert('123');
        if (!nowList) return;
        //遍历用户列表
        _.each(nowList, function (item, index) {
            nowUser = _.findWhere(users, {
                _id: item.userId
            });
            // alert(JSON.stringify(nowUser));
            console.log(nowUser);
            item.groupId = currentId;
            item.name = nowUser.userName;
            openId = nowUser.openId;
            count = nowUser.count;
            item.nowstatus = '已加入';
            //判断是否为危险人物
            if (count > 2) {
                item.danger = true;
            } else {
                item.danger = false;
            }
            //判断是否是房主
            if (creatorId === openId) {
                item.romeMaker = true;
            } else {
                item.romeMaker = false;
            }
            //若果当前用户是该群群主，则他有删除进团团员的权利,如果当前用户不是群主，则他没有删除团员的权利，但是有查看其他人资料的权利
            if (creatorId === currentUserOpenId) {
                if (currentUserOpenId === openId) {

                } else {
                    item.isCanDelete = true;
                }
            } else {
                item.isCanDelete = false;
                if(currentUserOpenId === openId){

                }else{
                    item.isDetail = true;
                }
            }

        });
        Session.set('true', true);
        return nowList;
    }
});
