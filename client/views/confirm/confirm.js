Template.confirm.onRendered(function () {
    document.title = "收款确认";
    var currentId = Session.get('currentGroupId'),
        currentTurn = _.findWhere(Session.get('groupInfo'), {
            _id: currentId
        }).currentTurn,
        bidsArr = _.findWhere(Session.get('groupInfo'), {
            _id: currentId
        }).bidsArr,
        currentBid = bidsArr[currentTurn - 1],
        num = _.findWhere(Session.get('groupInfo'), {
            _id: currentId
        }).number,
        period = _.findWhere(Session.get('groupInfo'), {
            _id: currentId
        }).period,
        firstPayTime = _.findWhere(Session.get('groupInfo'), {
            _id: currentId
        }).firstPayTime,
        year = firstPayTime.slice(0, 4),
        month = firstPayTime.slice(5, 7),
        day = firstPayTime.slice(8, 10),
        nowTime = year + '-' + month + '-' + day,
        nextTime = '',
        days = 0,
        userId = _.findWhere(Session.get('userInfo'), {
            openId: Session.get('openId')
        })._id,
        checkerId = _.findWhere(Session.get('userInfo'), {
            openId: Session.get('currentUserId')
        })._id,
        statusArry = [],
        totalMoney = _.findWhere(Session.get('relationship'), {
            groupId: currentId,
            userId: checkerId
        }).totalMoney,
        description = "";
    //点击返回事件
    $(".backtoconfirm").click(function (e) {
        Router.go('/bidding');
    });
    // 我同意XXX协议
    $('.pay-container3 .check-protocal .confirmProtocal').on('click', function (e) {
        $(e.target).toggleClass('confirmcheck');
    });
    // 确认已经收到该款项
    $('.pay-container3 .check-proof .confirmPay').on('click', function (e) {
        $(e.target).toggleClass('confirmcheck');
    });
    //点击未收到按钮事件
    $(".unconfirmpaid").click(function (e) {
        $(".unconfirm-tip").toggle();
    });
    //点击确定按钮事件
    $(".confirmpaid").click(function (e) {
        if ($('.pay-container3 .check-proof .confirmPay').hasClass('confirmcheck') &&
            $('.pay-container3 .check-protocal .confirmProtocal').hasClass('confirmcheck')) {
            totalMoney = totalMoney + parseInt($("#fee").html());
            Meteor.call('updateData', {
                collection: 'relationship',
                selector: {
                    userId: userId,
                    groupId: currentId
                },
                modifier: {
                    $set: {
                        status: '已付款'
                    }
                },
                multi: true
            }, function (err, result) {
                alert('确认成功！');
                console.log(err, result);
                Meteor.call('updateData', {
                    collection: 'relationship',
                    selector: {
                        groupId: currentId,
                        userId: checkerId
                    },
                    modifier: {
                        $set: {
                            totalMoney: totalMoney
                        }
                    },
                    multi: true
                }, function (err, result) {
                    console.log(err, result);
                });
                Meteor.call('getData', {
                    collection: 'relationship',
                    selector: {
                        groupId: currentId,
                        userId: {
                            $ne: checkerId
                        }
                    }
                }, function (err, result) {
                    console.log(err, result);
                    console.log(result);
                    statusArry = _.pluck(result, 'status');
                    console.log(statusArry);
                    if (_.contains(statusArry, '已投标') ||
                        _.contains(statusArry, '待确认')) {
                        console.log('本轮尚未结束');
                    } else {
                        if (period === '一个月') {
                            days = 30;
                        }
                        if (period === '两个月') {
                            days = 60;
                        }
                        if (period === '三个月') {
                            days = 90;
                        }
                        if (period === '一周') {
                            days = 7;
                        }
                        if (period === '两周') {
                            days = 14;
                        }
                        if (period === '三周') {
                            days = 21;
                        }
                        nextTime = getDate(nowTime, days)
                            //判断是否多有人都收过款
                        if (currentTurn === num) {
                            description = '第' + currentTurn + '期中标,收款' + totalMoney;
                            Meteor.call('updateData', {
                                collection: 'groupInfo',
                                selector: {
                                    _id: currentId
                                },
                                modifier: {
                                    $set: {
                                        status: '完结'
                                    }
                                },
                                multi: true
                            }, function (err, result) {
                                console.log(err, result);
                            });
                            Meteor.call('updateData', {
                                collection: 'relationship',
                                selector: {
                                    groupId: currentId,
                                    userId: checkerId
                                },
                                modifier: {
                                    $set: {
                                        role: '往期已收款',
                                        description: description,
                                    }
                                },
                                multi: true
                            }, function (err, result) {
                                console.log(err, result);
                            });
                            alert('本轮标会到此完结!');
                        } else {
                            description = '第' + currentTurn + '期中标,收款' + totalMoney;
                            Meteor.call('updateData', {
                                collection: 'groupInfo',
                                selector: {
                                    _id: currentId
                                },
                                modifier: {
                                    $set: {
                                        status: '投标中',
                                        currentTurn: currentTurn + 1,
                                        firstPayTime: nextTime
                                    }
                                },
                                multi: true
                            }, function (err, result) {
                                console.log(err, result);
                            });
                            Meteor.call('updateData', {
                                collection: 'relationship',
                                selector: {
                                    groupId: currentId,
                                    userId: checkerId
                                },
                                modifier: {
                                    $set: {
                                        role: '往期已收款',
                                        description: description
                                    }
                                },
                                multi: true
                            }, function (err, result) {
                                console.log(err, result);
                            });
                            Meteor.call('getData', {
                                collection: 'relationship',
                                selector: {
                                    groupId: currentId
                                }
                            }, function (err, result) {
                                console.log(err, result);
                                for (var i = 0; i < result.length; i++) {
                                    Meteor.call('updateData', {
                                        collection: 'relationship',
                                        selector: {
                                            _id: result[i]._id
                                        },
                                        modifier: {
                                            $set: {
                                                status: '未投标',
                                                nowTurn: currentTurn + 1,
                                                bidMoney: 0
                                            }
                                        },
                                        multi: true
                                    }, function (err, result) {
                                        console.log(err, result);
                                    });
                                }
                            });
                            alert('即将进入下一轮!');
                        }

                    }
                });
            });
        } else {
            alert("请确定和同意协议！");
        }
    });
    //点击未收到按钮事件
    $('.unconfirm-tip-btn').click(function (e) {
        Meteor.call('updateData', {
            collection: 'relationship',
            selector: {
                userId: userId,
                groupId: currentId
            },
            modifier: {
                $set: {
                    status: '未收到'
                }
            },
            multi: true
        }, function (err, result) {
            console.log(err, result);
        });
        $(".unconfirm-tip").hide();
    });
    //点击图片放大图片
    $("#BigPicture").click(function (e) {
        var str = $(this).attr('src');
        $(".pay-container3 .bg .show").css({
            "background-image": "url(" + url + ")",
            "background-size": "100% 100%"
        });
        $(".pay-container3 .bg").show();
    });
    //点击遮罩层使其消失
    $('.pay-container3 .bg').click(function (e) {
        $(this).hide();
    });
});
Template.confirm.helpers({
    currentGroup1: function () {
        var currentId = Session.get('currentGroupId'),
            groupInfo = Session.get('groupInfo'),
            payFee = Session.get('payFee'),
            nowGroup = _.findWhere(groupInfo, {
                _id: currentId
            }),
            userId = _.findWhere(Session.get('userInfo'), {
                openId: Session.get('openId')
            })._id,
            payPerson = _.findWhere(Session.get('userInfo'), {
                openId: Session.get('openId')
            }).userName,
            receiptPicture = '';

        receiptPicture = _.findWhere(Session.get('log'), {
            userId: userId,
            groupId: currentId
        }).reciptPicture;
        nowGroup.receiptPicture = receiptPicture;
        nowGroup.payFee = payFee;
        nowGroup.payPerson = payPerson;
        return nowGroup;
    }
});

function getDate(nowTime, days) {
    var date = new Date();
    date.setDate(date.getDate() + days); //这里的days就是你要加的天数，减也可以。年、月会相应加上去，值得注意的是        date.getMonth()得到的月份比实际月份小1，所以实际月份是(date.getMonth()+1)
    return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + '日';
}
