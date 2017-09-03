'use strict';
Template.joinNewGroup.onCreated(function() {
    var self = this;

    Session.set('userInfoSelector', {
        'isRemoved': {
            $ne: true
        },

    });
    Session.set('relationshipSelector', {
        'isRemoved': {
            $ne: true
        }
    });
    Session.set('groupInfoSelector', {
        'isRemoved': {
            $ne: true
        },
    });

    Session.set('userInfoOptoins', {});
    Session.set('relationshipOptoins', {});
    Session.set('groupInfoOptoins', {});
    Session.set('ivitedCode', '');

    self.autorun(function() {
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
    self.autorun(function(c) {
        if (Session.get('WechatUserInfo')) {
            var result = Session.get('WechatUserInfo');
            if (result) {
                // alert("000000"+result.openid);
                Session.set('openid', result.openid);
                //取用户id
                Meteor.call('getData', {
                    collection: 'userInfo',
                    selector: {
                        openId: Session.get('openid')
                    }
                }, function(error, result) {
                    if (!error) {
                        if (result.length === 0) {
                            alert('您未绑定个人资料，请先绑定个人资料！');
                            Router.go('/profile');
                        } else {
                            Session.set('userId', result[0]._id);
                            //alert('userId' + result[0]._id);
                        }
                    }
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
Template.joinNewGroup.onRendered(function() {
    document.title = '加入团会';
    // 回车进行搜索
    $('.searchGroup .groupName').keypress(function(e) {
        if (e.keyCode == 13) {
            $('.searchGroup .searchImg').click();
        }

    });
    $('.searchGroup .groupName').on('click', function(e) {
        $('.searchGroup .searchTipMark').css('display', 'none');
    });
    // 点击搜索图标
    $('.searchGroup .searchImg').on('click', function(e) {
        var str = $('.searchGroup .groupName').val(),
            invitedCode = str.slice(str.length-4,str.length),
            groupName = str.slice(0,str.length-4),
            htmlHead = '',
            htmlEnd = '</div><div class="joinIn"><div>加入</div></div>',
            htmlBody = '',
            groupInfoArr = {},
            groupId = '',
            currentNum = 0,
            number = 0,
            userRelation = {};
            //alert('invitedCode'+invitedCode);
            //alert('groupName'+groupName);
            if(!invitedCode||!groupName){
                alert('请输入完整信息!');
                return ;
            }

            $('.searchingGroupInfo').empty();
        Meteor.call('groupInfoArr', invitedCode, groupName, function(err, result) {
            /*
            groupInfoArr = result[0];

            groupId = groupInfoArr.groupId;

            currentNum = GroupInfo.findOne({
                _id: groupId
            }).currentNum;

            userRelation = Relationship.findOne({
                groupId: groupId,
                userId: Session.get('userId')
            });

            number = GroupInfo.findOne({
                _id: groupId
            }).number;

            if (err) {
                console.log(err)
            }
            */
            if (!err) {
                 groupInfoArr = result[0];
              
                 if(!groupInfoArr){
                   alert('未找到该群组！');
                 }
                 groupId = groupInfoArr.groupId;

                 currentNum = GroupInfo.findOne({
                     _id: groupId
                 }).currentNum;

                 userRelation = Relationship.findOne({
                     groupId: groupId,
                     userId: Session.get('userId')
                 });

                 number = GroupInfo.findOne({
                     _id: groupId
                 }).number;
                htmlHead = '<div class="groupInfo">' +
                    '<div class="groupName">' + groupInfoArr.groupName + '<span>' + groupInfoArr.period + '</span></div>' +
                    '<div class="groupFee">' + groupInfoArr.groupFee + '元</div>' +
                    '<div class="groupDate">' + groupInfoArr.firstPayDay + '</div></div><div class="groupWhiteBg">';

                for (var i = 0; i < groupInfoArr.relationshipArr.length; i++) {
                    htmlBody += '<div class="memberInfo groupHeader"><div>' +
                        groupInfoArr.relationshipArr[i].userName + '<img src="./joinNewGroup/queen.png"></div><span>' +
                        groupInfoArr.relationshipArr[i].status + '</span></div>';
                }

                $('.searchGroup .searchTipMark').css('display', 'block');
                $('.searchingGroupInfo').append(htmlHead + htmlBody + htmlEnd);

                if (currentNum === number) {
                    $('.searchingGroupInfo .joinIn div').css('backgroundColor', '#bdbdbd');
                }
                // 点击加入群组
                $('.searchingGroupInfo .joinIn').on('click', function(e) {
                    var openId = Session.get('openid'),
                        user = UserInfo.findOne({
                            openId: openId
                        }),
                        count = user.count;

                    // alert(user);

                    if (!user) {
                        alert('请先绑定个人资料！');
                        return;
                    }
                    if (currentNum === number) {
                        alert('该群组已满人！');
                        $('.searchingGroupInfo .joinIn div').css('backgroundColor', '#bdbdbd');
                        return;
                    }
                    if (userRelation) {
                        alert('你已是群组成员！');
                        return;
                    }
                    Meteor.call('insertData', {
                            collection: 'relationship',
                            data: {
                                nowTurn: 1,
                                getBid: 'no',
                                groupId: groupId,
                                role: '前期未收款',
                                status: '已加入',
                                bidMoney: 0,
                                payMoney: 0,
                                description: '',
                                userId: user._id,
                                openid: Session.get('openid'),
                                totalMoney:0
                            }
                        },
                        function(error, result) {
                            console.log(error, result);
                            if (!err) {
                                // 更新表数据
                                Meteor.call('updateData', {
                                    collection: 'groupInfo',
                                    selector: {
                                        _id: groupId
                                    },
                                    modifier: {
                                        $set: {
                                            currentNum: currentNum + 1
                                        }
                                    }
                                }, function(error1, result1) {
                                    // alert('error1:' + error1);
                                    if (!error1) {
                                        // alert('result1:' + result1);
                                    }
                                });
                                //更新用户数据
                                Meteor.call('updateData', {
                                    collection: 'userInfo',
                                    selector: {
                                        _id: user._id
                                    },
                                    modifier: {
                                        $set: {
                                            count: count + 1
                                        }
                                    }
                                }, function(error2, result2) {
                                    // alert('error2' + error2);
                                    if (!error2) {
                                        // alert('result2' + result2);
                                    }
                                });
                                $('.searchingGroupInfo .joinIn div').css('backgroundColor', '#bdbdbd');
                                $('.searchingGroupInfo .joinIn div').html('已加入');
                            }
                        });

                });
            }

        });

        $('.searchTip').hide();
    });

    // 点击加入
    $('.searchingGroupInfo .joinIn div').click(function() {
        $('.searchingGroupInfo .joinIn div').css('backgroundColor', '#bdbdbd');
        $('.searchingGroupInfo .joinIn div').html('已加入，点击左上角返回并查看群组');
    });
});


Template.joinNewGroup.helpers({
    groupInfoArr: function() {
        return Session.get('groupInfoArr');
    }
});
