'use strict'
Template.grouping.onCreated(function() {
    var self = this;

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
                Session.set('openid', result.openid);
                //取用户id
                Meteor.call('getData', {
                    collection: 'userInfo',
                    selector: {
                        openId: Session.get('openid')
                    }
                }, function(error, result) {
                   // alert('userId' + result[0]._id);
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
Template.grouping.onRendered(function() {
    document.title="创建团会";
    //点击问号弹出提示内容
    $('.question').on('click', function(e) {
        $('.question-tip').toggleClass('tipDisplay');
    });
    // 点击通览页面具体某一行，进入编辑模式
    $('.container').on('click', function(e) {
        var item = e.currentTarget,
            elem = $(e.currentTarget);
        elem.toggleClass('changeBgClor');
        elem.siblings().removeClass('changeBgClor');
    });
    // 输入团费后进入下一步
    $('.group-container1 .profile-complete').on('click', function(e) {
        var groupFee = parseFloat($('#group-fee').val());
        if (!groupFee || !/^[0-9]*$/.test(groupFee)) {
            $('.group-container1 .fee-tip').show();
            return;
        } else {
            $('.group-container1').hide();
            $('.group-container2').show();
            Session.set('groupFee', groupFee);
        }
    });
    // 选择每期周长事件
    $('.group-container2 .length-item').on('click', function(e) {
        var elem = $(e.currentTarget),
            item = e.target,
            turnLength = '';
        $('.group-container2 .fee-tip').hide();
        elem.toggleClass('changeItemBg');
        elem.siblings().removeClass('changeItemBg');
        turnLength = e.target.innerHTML;
        Session.set('turnLength', turnLength);
    });
    // 选择周期后进入下一步
    $('.group-container2 .profile-complete').on('click', function(e) {
        if (!Session.get('turnLength')) {
            $('.group-container2 .fee-tip').show();
            return;
        }
        $('.group-container2').hide();
        $('.group-container3').show();
    });
    // 选择首期付款日后进入下一步
    $('.group-container3 .profile-complete').on('click', function(e) {
        var year = $('.dw-li.dw-v.dw-sel .dw-i')[0].innerHTML,
            month = $('.dw-li.dw-v.dw-sel .dw-i')[1].innerHTML,
            day = $('.dw-li.dw-v.dw-sel .dw-i')[2].innerHTML;
        $('.group-container3').hide();
        $('.group-container4').show();
        Session.set('firstPayTime', year + '年' + month + '月' + day + '日');
    });
    // 填写组员人数进入下一步
    $('.group-container4 .profile-complete').on('click', function(e) {
            var groupNum = parseFloat($('.group-num').val());
            if (!groupNum || !/^[0-9]*$/.test(groupNum)) {
                $('.group-container4 .num-tip').show();
                return;
            } else {
                $('.group-container4').hide();
                $('.group-container5').show();
                Session.set('groupNum', groupNum);
            }
        })
        // 填写群组名称进入下一步
    $('.group-container5 .profile-complete').on('click', function(e) {
        var groupName = $('.group-name').val(),
            nameArr = groupName.split('');
        if (nameArr.length > 3) {
            $('.group-container5 .name-tip2').show();
            return;
        }

        /*if (/[\u4e00-\u9fa5]/.test(nameArr[0]) === false ||
            /[\u4e00-\u9fa5]/.test(nameArr[1]) === false ||
            /[\u4e00-\u9fa5]/.test(nameArr[2]) === false) {
            $('.group-container5 .name-tip2').show();
            return;
        }*/
        for (var i = 0; i < nameArr.length; i++) {
            if (/[\u4e00-\u9fa5]/.test(nameArr[i]) === false) {
                $('.group-container5 .name-tip2').show();
                return;
            }
        }
        if (!groupName) {
            $('.group-container5 .name-tip').show();
            return;
        } else {
            $('.group-container5').hide();
            $('.group-container6').show();
            Session.set('groupName', groupName);
            $('.group-container6 .item-name.groupname').html(Session.get('groupName'));
            $('.group-container6 .item-name.groupfee').html(Session.get('groupFee'));
            $('.group-container6 .item-name.groupperiod').html(Session.get('turnLength'));
            $('.group-container6 .item-name.groupturn').html(Session.get('firstPayTime'));
            $('.group-container6 .item-name.groupnum').html(Session.get('groupNum'));
        }
    });
    // 预览已创建群组
    $('.group-container6 .profile-complete').on('click', function(e) {
        var groupName = $('.group-container6 .group-conent6 .groupname').html(),
            groupFee = parseFloat($('.group-container6 .group-conent6 .groupfee').html()),
            groupPeriod = $('.group-container6 .group-conent6 .groupperiod').html(),
            groupTurn = $('.group-container6 .group-conent6 .groupturn').html(),
            groupNum = parseFloat($('.group-container6 .group-conent6 .groupnum').html()),
            nameArr = groupName.split(''),
            invitedCode = '';
        if (nameArr.length > 3) {
            alert('信息不完整或格式不正确！');
            return;
        }

       /* if (/[\u4e00-\u9fa5]/.test(nameArr[0]) === false ||
            /[\u4e00-\u9fa5]/.test(nameArr[1]) === false ||
            /[\u4e00-\u9fa5]/.test(nameArr[2]) === false) {
            alert('信息不完整或格式不正确！');
            return;
        }*/
        for (var i = 0; i < nameArr.length; i++) {
            if (/[\u4e00-\u9fa5]/.test(nameArr[i]) === false) {
             alert('信息不完整或格式不正确！');   
             return;
            }
        }
        if (!groupName ||
            !groupFee ||
            !/^[0-9]*$/.test(groupFee) ||
            !groupPeriod ||
            !groupTurn ||
            !groupNum ||
            !/^[0-9]*$/.test(groupNum)) {
            alert('信息不完整或格式不正确！');
            return;
        }
        Meteor.call('insertData', {
                collection: 'groupInfo',
                data: {
                    groupName: groupName,
                    creatorId: Session.get('openid'),
                    period: groupPeriod,
                    firstPayTime: groupTurn,
                    number: groupNum,
                    currentTurn: 1,
                    groupFee: groupFee,
                    status: '创建中',
                    invitedCode: '' + _.random(0, 9) + _.random(0, 9) + _.random(0, 9) + _.random(0, 9) + '',
                    bidsArr: [],
                    currentNum: 1,
                    
                }
            },
            function(error, result) {
                var openId = Session.get('openid'),
                    user = UserInfo.findOne({_id: Session.get('userId')});
                //alert('groupid' + result);
                if (!error) {   

                    Meteor.call('insertData', {
                            collection: 'relationship',
                            data: {
                                nowTurn: 1,
                                getBid: 'no',
                                groupId: result,
                                role: '前期未收款',
                                status: '已加入',
                                bidMoney: 0,
                                payMoney: 0,
                                userId: Session.get('userId'),
                                description: '',
                                openid: Session.get('openid'),
                                totalMoney:0
                            }
                        },
                        function(error1, result1) {
                           // alert(error1 + result1);
                        });
                    Meteor.call('updateData', {
                        collection: 'userInfo',
                        selector: {
                            _id: Session.get('userId')
                        },
                        modifier: {
                            $set: {
                                romemaker: 'yes',
                                count:user.count+1
                            }
                        },
                        multi: true
                    }, function(error2, result2) {
                        if (error2) {
                           // alert(error2);
                        } else {
                           // alert(result2);
                        }

                    });
                    $('.group-container6').hide();
                    // appendToGroupIn(openId);
                    // $('.group-container7').show();
                    Router.go('/creating');
                }
            });

    });

    // 获得焦点
    $('.group-container1 #group-fee,.group-container4 .group-num,.group-container5 .group-name')
        .focus('click', function(e) {
            $('.fee-tip').hide();
        });
    //返回/上一步
    $('.group-back,.profile-back').on('click', function(e) {
        var elem = $(e.target),
            backClass = elem.attr('class').split(' ')[0],
            currentConClass = '.group-container' + parseInt(backClass.charAt(backClass.length - 1)),
            prevContainerIndex = parseInt(backClass.charAt(backClass.length - 1)) - 1,
            prevContainerClass = '.group-container' + prevContainerIndex;
        if (!prevContainerIndex) {
            return;
        } else {
            $(currentConClass).hide();
            $(prevContainerClass).show();
        }

    });
    // 团费页面点击返回
    $('.group-container1 .profile-back').on('click',function(e){
        wx.ready(function() {
            wx.closeWindow();

        });
    });
    // appendToGroupIn();
});



function appendToGroupIn(openId) {
    var htmlHead = '',

        htmlEnd = '',

        htmlBody = '',

        groupInfoArr = {},

        groupId = '',

        // openId = "asafdapoqwiehwq",
        groupRelArr = [],

        htmlArr = [];

    Meteor.call('getgroupArr', openId, function(err, result) {
        console.log(err, result);
        if (!err) {
            console.log('result', result);
            _.each(result, function(item) {
                htmlBody = '';
                htmlHead = '<div class="appendContent"  data-id = ' + item.groupId + '><div class="groupInfo"><div class="groupName">' +
                    item.groupName + '<span>' + item.period + '</span></div>' +
                    '<div class="groupFee">' + item.groupFee + '</div>' +
                    '<div class="groupDate">' + item.firstPayDay + '</div></div><div class="groupWhiteBg">';

                htmlEnd = '</div><div class="btn-container">' +
                    '<div class="invite-btn"><span class="toInvite">邀请好友</span><span class="attendent">（' +
                    item.currentNum + '</span><span class="separate">/</span><span class="total-amount">' +
                    item.number + '）</span></div><div class="start-btn">开始</div></div></div>';

                for (var i = 0; i < item.relationshipArr.length; i++) {
                    // htmlBody += '<div class="memberInfo groupHeader"><div data-id=' + item.relationshipArr[i].userId + '>' +
                    //     item.relationshipArr[i].userName + '<img src="./joinNewGroup/queen.png"></div><span>' +
                    //     item.relationshipArr[i].status + '</span></div>';
                    if (item.creatorId === item.relationshipArr[i].currentOpenId) {
                        htmlBody += '<div class="memberInfo groupHeader"><div data-id=' + item.relationshipArr[i].userId + '>' +
                            item.relationshipArr[i].userName + '<img src="./joinNewGroup/queen.png"></div><span>' +
                            item.relationshipArr[i].status + '</span></div>';
                    } else {
                        htmlBody += '<div class="memberInfo groupHeader"><div data-id=' + item.relationshipArr[i].userId + '>' +
                            item.relationshipArr[i].userName + '</div><span>' +
                            item.relationshipArr[i].status + '</span></div>';
                    }
                }
                $('.searchingGroupInfo.group-in').append(htmlHead + htmlBody + htmlEnd);
                // 绑定点击事件
                // 1 点击人物进入
                $('.memberInfo.groupHeader div').on('click', function(e) {
                    var elem = $(e.target),
                        // 判断
                        isroommaker = UserInfo.findOne({
                            _id: elem.data('id')
                        }).romemaker;

                    Session.set('userId', elem.data('id'));
                    Session.set('groupId', elem.parent().parent().parent().data('id'));
                    // 判断
                    if (isroommaker === 'yes') {
                        alert('群组创建人无法删除本人！');
                        return;
                    }
                    Router.go('/delprofile');
                });
                // 2 邀请好友
                $('.group-container7 .invite-btn').on('click', function(e) {
                    var elem = $(e.target).parent().parent().parent();
                    Session.set('groupId', elem.data('id'));
                    Router.go('/inviteFriend');

                });
                // 3 开始游戏
                // 开始投标
                $('.group-container7 .start-btn').on('click', function(e) {
                    var groupId = $(e.target).parent().parent().data('id');

                    // $('.appendContent .btn-container').css('color', '#bdbdbd');
                    // $('.appendContent .start-btn').addClass('activeBtn');
                    Meteor.call('updateData', {
                        collection: 'groupInfo',
                        selector: {
                            _id: groupId
                        },
                        modifier: {
                            $set: {
                                status: '投标中'
                            }
                        }
                    });
                    Router.go('/bidding');
                });
            });

        }

    });
}
