Template.bidding.onCreated(function (e) {
    //通过微信接口获取当前用户的openId,并保存到Session中
    var self = this;
    self.autorun(function (c) {
        // var openId = "o0ZfpwoeUJOb1b_cJVCGH2CDVXC0";
        // var openId = "o0Zfpwh6FINws5p6p2pJqbuvsvz0";
        // Session.set('WechatUserInfo', openId);
        if (Session.get('WechatUserInfo')) {
            var result = Session.get('WechatUserInfo');
            if (result) {
                // alert('openId'+result.openid);
                Session.set('currentUserId', result.openid);

                Session.set('isTrue', false);
                Session.set('true', false);
                //取用户id
                // Meteor.call('getData', {
                //     collection: 'userInfo',
                //     selector: {
                //         openId: Session.get('currentUserId')
                //     }
                // }, function (error, result) {
                //     Session.set('userId', result[0]._id);
                //     // alert('userId' + result[0]._id);
                // });
                //取关系表数据
                Meteor.call('getData', {
                    collection: 'relationship',
                    selector: {
                        // userId: Session.get('userId')
                        
                        isRemoved:{
                            $ne:true
                        }
                    },
                    options: {
                        sort: {
                            timestamp: 1
                        }
                    }
                }, function (error, result) {
                    Session.set('relationship', result);
                    console.log(result);
                });
                //取用户表数据
                Meteor.call('getData', {
                    collection: 'userInfo',
                    selector: {}
                }, function (error, result) {
                    if (!error) {
                        var openidArr = _.pluck(result, 'openId'),
                            isTrue = _.contains(openidArr, Session.get('currentUserId'));
                        if (!isTrue) {
                           // alert('您未绑定个人资料，请先绑定个人资料！');
                          //  Router.go('/profile');
                        } else {
                            Meteor.call('getData', {
                                collection: 'relationship',
                                selector: {
                                    isRemoved:{
                                        $ne:true
                                    }
                                }
                            }, function(error1, result1) {
                                if (result1.length === 0) {
                                    alert('您尚未加入群组，请先加入群组！');
                                    Router.go('/joinNewGroup');
                                }
                            });
                            Session.set('userInfo', result);
                        }

                    }
                });
                //获取log表数据
                Meteor.call('getData', {
                    collection: 'log',
                    selector: {} //这里到时候用openId去筛选
                }, function (error, result) {
                    Session.set('log', result);
                    console.log(result);
                });
                //取群组表数据
                Meteor.call('getData', {
                    collection: 'groupInfo',
                    selector: {status:{$in:['投标中','付款中','冻结']}}
                }, function (error, result) {
                    Session.set('groupInfo', result);
                    console.log(result);
                });
                Session.set('isTure', true);
            }
            c.stop();
        }
    });
});
Template.bidding.onRendered(function (e) {
    document.title = "团会";
    //给当前用户点击自己状态的点击事件
    var timer = setInterval(function () {
        if (Session.get('true') && Session.get('isTure')) {
            clearInterval(timer);
            //跳转到投标页面
            $(".groupWhiteBg .BidClickable").click(function (e) {
                var currentGroupId = $(this).data('groupid');
                console.log(currentGroupId);
                Session.set('currentGroupId', currentGroupId);
                Router.go('/bid');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //跳转到支付页面
            $(".groupWhiteBg .PayClick").click(function (e) {
                var currentGroupId = $(this).data('groupid'),
                    nowReceivePerson = $(this).data('nowreceive'),
                    payFee = $(this).data('fee');
                console.log(currentGroupId);
                Session.set('currentGroupId', currentGroupId);
                Session.set('nowReceivePerson', nowReceivePerson);
                Session.set('payFee', payFee);
                Router.go('/pay');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //跳转查看待确认页面
            $(".groupWhiteBg .WaitConfirmClick").click(function (e) {
                var currentGroupId = $(this).data('groupid'),
                    nowReceivePerson = $(this).data('nowreceive'),
                    payFee = $(this).data('fee');
                console.log(currentGroupId);
                Session.set('currentGroupId', currentGroupId);
                Session.set('nowReceivePerson', nowReceivePerson);
                Session.set('payFee', payFee);
                Router.go('/waitConfirm');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //收款人点击跳转到支付确认页面
            $(".groupWhiteBg .PayConfirmClick").click(function (e) {
                var currentGroupId = $(this).data('groupid'),
                    payFee = $(this).data('fee'),
                    openId = $(this).data('openid');
                console.log(openId);
                console.log(currentGroupId);
                Session.set('currentGroupId', currentGroupId);
                Session.set('payFee', payFee);
                Session.set('openId', openId);
                Router.go('/confirm');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //点击跳转到支付已确认页面
            $(".groupWhiteBg .PayDetailClick").click(function (e) {
                var currentGroupId = $(this).data('groupid'),
                    nowReceivePerson = $(this).data('nowreceive'),
                    payFee = $(this).data('fee');
                console.log(currentGroupId);
                Session.set('currentGroupId', currentGroupId);
                Session.set('nowReceivePerson', nowReceivePerson);
                Session.set('payFee', payFee);
                Router.go('/alreadyConfirm');
                Session.set('isTure', false);
                Session.set('true', false);
            });
            //点击查看已完结的群
            $("#complete").click(function(e){
                $("#complete").hide();
                Meteor.call('getData', {
                    collection: 'groupInfo',
                    selector: {status:{$in:['投标中','付款中',"完结","冻结"]}}
                }, function (error, result) {
                    Session.set('groupInfo', result);
                    console.log(result);
                });
            });
        }
    }, 200)
    
});
Template.bidding.helpers({
    //判断进来的人是否有参与过团会
    isEmpty:function(){
        var groupInfo = Session.get('groupInfo');
        if(!groupInfo) return;
        var relationship = Session.get('relationship');
        if(!relationship) return;
        // alert(JSON.stringify(groupInfo));
        var currentUserOpenId = Session.get('currentUserId');
        if(!currentUserOpenId){
            return;
        }
        // alert(currentUserOpenId);
        var nowRelationship = _.where(relationship,{openid:currentUserOpenId});
        // alert(JSON.stringify(nowRelationship));
        var groupIdArr = _.pluck(nowRelationship,'groupId');
        if(groupIdArr.length===0){
            return true;
        }else{
            return false;
        }
    },
    //获取群组
    groups: function () {
        var groupInfo = Session.get('groupInfo');
        if(!groupInfo) return;
        var relationship = Session.get('relationship');
        if(!relationship) return;
        var currentUserOpenId = Session.get('currentUserId');
        var nowRelationship = _.where(relationship,{openid:currentUserOpenId});
        var groupIdArr = _.pluck(nowRelationship,'groupId');
        var groups = [];
        for(var i=0;i<groupIdArr.length;i++){
            var item = _.findWhere(groupInfo,{_id:groupIdArr[i]});
            if(item){
                groups.push(item);
            }
        }
        _.each(groups, function (item, index) { //遍历群组，并且每个群组的时间只取月日
            item.firstPayTime = item.firstPayTime.substr(5);
        });
        return groups;
    },
    //获取与此群组有关的用户列表
    userList: function () {
        var currentId = this._id, //获取外部each的groupId
            nowUser = {}, //当前用户
            currentUserOpenId = Session.get('currentUserId'), //获取当前进来的用户openId
            isRoomMaker = '', //是否是房间创建者
            openId = '', //用户的openId
            groupInfo = Session.get('groupInfo'), //获取群组数据
            currentTurn = _.findWhere(groupInfo, {
                _id: currentId
            }).currentTurn, //获取当前轮数
            creatorId = _.findWhere(groupInfo, {
                _id: currentId
            }).creatorId, //获取当前创建者id
            groupFee = _.findWhere(groupInfo, {
                _id: currentId
            }).groupFee, //获取当前组团费
            list = Session.get('relationship'), //获取关系表数据
            nowList = _.where(list, {
                groupId: currentId,
                nowTurn: currentTurn
            }), //获取与当前群组当前轮相关的关系表数据

            users = Session.get('userInfo'); //获取用户表数据
            // alert(currentUserOpenId);
            // alert(JSON.stringify(nowList));
        // alert(currentId);
        // alert(JSON.stringify(nowList));
        var currentBid = {},
            bidsArr = _.findWhere(groupInfo, {
                _id: currentId
            }).bidsArr;
        if (bidsArr.length > 0){
            currentBid = bidsArr[currentTurn - 1];
        }
        console.log(currentBid);
        if (!nowList) return;
        //遍历用户列表
        _.each(nowList, function (item, index) {
            nowUser = _.findWhere(users, {
                _id: item.userId
            });
            console.log(nowUser);
            item.groupId = currentId;
            item.name = nowUser.userName;
            openId = nowUser.openId;
            count = nowUser.count;
            //判断是否为危险人物
            if (count > 3) {
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

            //完结中状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '完结' &&
                item.role === '往期已收款') {
                item.nowstatus = item.description;
            }

            //投标中状态判断 
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '投标中' &&
                item.role === '前期未收款' &&
                item.status === '未投标') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '未投标，点击投标';
                    item.isBidClick = true;
                } else {
                    item.nowstatus = '未投标';
                    item.isBidClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.status === '未投标') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '未投标，点击投标';
                } else {
                    item.nowstatus = '未投标';
                }
            }
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '投标中' &&
                item.role === '往期已收款') {
                item.nowstatus = item.description;
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '完结' &&
                item.role === '往期已收款') {
                item.nowstatus = item.description;
            }
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '投标中' &&
                item.role === '前期未收款' &&
                item.status === '已投标') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已投标' + item.bidMoney + '元';
                    item.isDetailClick = false;
                } else {
                    item.nowstatus = '已投标';
                    item.isDetaiClick = false;
                }
            }
            //冻结相对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.status === '已投标') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已投标' + item.bidMoney + '元';
                    // item.isDetailClick = false;
                } else {
                    item.nowstatus = '已投标';
                    // item.isDetaiClick = false;
                }
            }
            // 以下是付款中状态判断

            //已经收过款的人未付款的状态显示 （这种情况暂时可能是不需要的）
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '往期已收款' &&
                item.status === '未付款') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + groupFee + '元，点击支付';
                    item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee;
                } else {
                    item.nowstatus = '尚须支付' + groupFee + '元';
                    item.isPayClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '往期已收款' &&
                item.status === '未付款') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + groupFee + '元，点击支付';
                    // item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee;
                } else {
                    item.nowstatus = '尚须支付' + groupFee + '元';
                    // item.isPayClick = false;
                }
            }
            //已经收过款的人未付款的状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '往期已收款' &&
                item.status === '未投标') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + groupFee + '元，点击支付';
                    item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee;
                } else {
                    item.nowstatus = '尚须支付' + groupFee + '元';
                    item.isPayClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '往期已收款' &&
                item.status === '未投标') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + groupFee + '元，点击支付';
                    // item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee;
                } else {
                    item.nowstatus = '尚须支付' + groupFee + '元';
                    // item.isPayClick = false;
                }
            }
            //已经收过款的人待确认状态显示（不是收款人看）
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '往期已收款' &&
                item.status === '待确认' &&
                currentUserOpenId !== currentBid.openId) {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + groupFee + '元，等待确认';
                    item.isWaitConfirmClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee;
                } else {
                    item.nowstatus = '已支付' + groupFee + '元，等待确认';
                    item.isWaitConfirmClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '往期已收款' &&
                item.status === '待确认' &&
                currentUserOpenId !== currentBid.openId) {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + groupFee + '元，等待确认';
                    // item.isWaitConfirmClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee;
                } else {
                    item.nowstatus = '已支付' + groupFee + '元，等待确认';
                    // item.isWaitConfirmClick = false;
                }
            }
            //已经收过款的人待确认状态显示（是收款人看）
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '往期已收款' &&
                item.status === '待确认' &&
                currentUserOpenId === currentBid.openId) {
                item.nowstatus = '已支付' + groupFee + '元，等待确认';
                item.payFee = groupFee;
                item.openId = openId;
                item.isPayConfirmClick = true;
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '往期已收款' &&
                item.status === '待确认' &&
                currentUserOpenId === currentBid.openId) {
                item.nowstatus = '已支付' + groupFee + '元，等待确认';
                item.payFee = groupFee;
                item.openId = openId;
                // item.isPayConfirmClick = true;
            }
            //已经收过款的人已付款状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '往期已收款' &&
                item.status === '已付款') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + groupFee + '元，查看详情';
                    // item.isPayDetailClick = true;
                } else {
                    item.nowstatus = '已支付' + groupFee + '元，查看详情';
                    item.isPayDetailClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '往期已收款' &&
                item.status === '已付款') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + groupFee + '元，查看详情';
                    // item.isPayDetailClick = true;
                } else {
                    item.nowstatus = '已支付' + groupFee + '元，查看详情';
                    // item.isPayDetailClick = false;
                }
            }
            // (标会第一轮付款中)尚未收过款的人未付款状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '前期未收款' &&
                item.status === '已投标' &&
                item.getBid === 'no') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元，点击支付';
                    item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                } else {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元';
                    item.isPayClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.status === '已投标' &&
                item.getBid === 'no') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元，点击支付';
                    // item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                } else {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元';
                    // item.isPayClick = false;
                }
            }
            //（标会非第一轮付款中）尚未收过款的人未付款状态显示
            // if (_.findWhere(groupInfo, {
            //         _id: currentId
            //     }).status === '付款中' &&
            //     item.role === '前期未收款' &&
            //     item.status === '未付款' &&
            //     item.getBid === 'no') {
            //     if (openId === currentUserOpenId) {
            //         item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元，点击支付';
            //         item.isPayClick = true;
            //     } else {
            //         item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元';
            //         item.isPayClick = false;
            //     }
            // }

            //（收款人看）尚未收过款的人待确认状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.status === '待确认' &&
                item.getBid === 'no' &&
                currentUserOpenId === currentBid.openId) {
                item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，等待确认';
                item.isPayConfirmClick = true;
                if (item.role === '前期未收款') {
                    item.payFee = groupFee - currentBid.bid;
                    item.openId = openId;
                } else {
                    item.payFee = groupFee;
                    item.openId = openId;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.status === '待确认' &&
                item.getBid === 'no' &&
                currentUserOpenId === currentBid.openId) {
                item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，等待确认';
                // item.isPayConfirmClick = true;
                if (item.role === '前期未收款') {
                    item.payFee = groupFee - currentBid.bid;
                    item.openId = openId;
                } else {
                    item.payFee = groupFee;
                    item.openId = openId;
                }
            }
            //尚未收过款的人未收到状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '前期未收款' &&
                item.status === '未收到'
            ) {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元，点击支付';
                    item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                } else {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元';
                    item.isPayClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.status === '未收到'
            ) {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元，点击支付';
                    // item.isPayClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                } else {
                    item.nowstatus = '尚须支付' + (groupFee - currentBid.bid) + '元';
                    // item.isPayClick = false;
                }
            }
            //（非收款人看）尚未收过款的人待确认状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '前期未收款' &&
                item.status === '待确认' &&
                item.getBid === 'no' &&
                currentUserOpenId !== currentBid.openId) {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，等待确认';
                    item.isWaitConfirmClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                } else {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，等待确认';
                    item.isWaitConfirmClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.status === '待确认' &&
                item.getBid === 'no' &&
                currentUserOpenId !== currentBid.openId) {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，等待确认';
                    // item.isWaitConfirmClick = true;
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                } else {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，等待确认';
                    // item.isWaitConfirmClick = false;
                }
            }
            //尚未收款人已付款的状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '前期未收款' &&
                item.status === '已付款') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，查看详情';
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                    item.isPayDetailClick = true;
                } else {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元,已确认';
                    item.isPayDetailClick = false;
                }
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.status === '已付款') {
                if (openId === currentUserOpenId) {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元，查看详情';
                    item.receivePerson = _.findWhere(Session.get('userInfo'), {
                        openId: currentBid.openId
                    }).userName;
                    item.payFee = groupFee - currentBid.bid;
                    // item.isPayDetailClick = true;
                } else {
                    item.nowstatus = '已支付' + (groupFee - currentBid.bid) + '元,已确认';
                    // item.isPayDetailClick = false;
                }
            }
            //收款人的状态显示
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '付款中' &&
                item.role === '前期未收款' &&
                item.userId === _.findWhere(Session.get('userInfo'), {
                    openId: currentBid.openId
                })._id) {
                item.nowstatus = '第' + currentTurn + '期中标者，' + '投标' + currentBid.bid + '元';
                item.isBidDetailClick = true;
            }
            //冻结对应
            if (_.findWhere(groupInfo, {
                    _id: currentId
                }).status === '冻结' &&
                item.role === '前期未收款' &&
                item.userId === _.findWhere(Session.get('userInfo'), {
                    openId: currentBid.openId
                })._id) {
                item.nowstatus = '第' + currentTurn + '期中标者，' + '投标' + currentBid.bid + '元';
                // item.isBidDetailClick = true;
            }
            
            console.log(item.name);
        });
        Session.set('true', true);
        return nowList;
    }
});
// Template.bidding.events({
//  '.groupWhiteBg .BidClickable':function(e){
//      alert('123');
//  }
// })
