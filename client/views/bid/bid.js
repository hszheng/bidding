Template.bid.onCreated(function (e) {

});
Template.bid.onRendered(function (e) {
    document.title = '投标';
    // $(".bidding-content1 .question").click(function (e) {
    //     $('.question-tip').toggle();
    // });
    $(".bidding-back").click(function (e) {
        Router.go('/bidding');
    });
    $(".profile-complete").click(function () {
    	var bidMoney = 0,
    		currentUserId = Session.get('currentUserId'),
    		userInfo = Session.get('userInfo'),
    		nowUserId = _.findWhere(userInfo,{openId:currentUserId})._id,
    		currentGroupId = Session.get('currentGroupId'),
    		relationship = Session.get('relationship'),
            openId = '', 
    		nowRelation = {},
            statusArr = [],
            bidArry = [],
            bidsArr = _.findWhere(Session.get('groupInfo'),{_id:currentGroupId}).bidsArr,
            max = 0,
            maxObject = {};
        //当没有写金额时就弹出提示框
        if ($("#group-fee").val() === "") {
            $(".fee-tip").show();
        }else{//否则执行修改属性和状态语句
        	bidMoney = parseInt($("#group-fee").val());
        	nowRelation = _.findWhere(relationship,{userId:nowUserId,groupId:currentGroupId});//取得当前关系的那条数据
        	Meteor.call('updateData',{collection:'relationship',selector:{_id:nowRelation._id},modifier:{$set:{bidMoney:bidMoney,status:'已投标'}},multi:true},function(err,result){
        		Meteor.call('getData',{collection:'relationship',selector:{groupId:currentGroupId,role:{$ne:'往期已收款'}}},function(err,result){
                    statusArr = _.pluck(_.where(result,{groupId:Session.get('currentGroupId')}),'status');
                    //如果所有人都已投标，执行以下代码
                    if(!_.contains(statusArr,'未投标')){
                       alert('本轮投标结束！');
                       var item = {};
                       bidArry =  _.pluck(_.where(result,{groupId:Session.get('currentGroupId')}),'bidMoney');
                       max = _.max(bidArry);//获取投标中的最大值
                       maxObj = _.findWhere(result,{bidMoney:max});//如果有人投了相同的钱数，则取最先投钱的那个人作为得标者
                       item.bid = max;//用item这个对象去保存本轮的表人的姓名和投标钱
                       openId = _.findWhere(Session.get('userInfo'),{_id:maxObj.userId}).openId;
                       item.openId = openId;
                       bidsArr.push(item);//将每次投标钱最多的人的姓名和标钱保存到bidsArr数组中
                       Meteor.call('updateData',{collection:'relationship',selector:{_id:maxObj._id},modifier:{$set:{getBid:'yes'}},multi:true},function(err,result){
                            console.log(err,result);
                       });
                       Meteor.call("updateData",{collection:'groupInfo',selector:{_id:maxObj.groupId},modifier:{$set:{status:'付款中',bidsArr:bidsArr}},multi:true},function(err,result){
                            console.log(err,result);
                       });
                    }else{//当这一轮有人没有投标时执行else代码

                        alert('已投标，还有其他人未投标！');
                    }
                });
        	});
        	console.log(nowRelation);
        }
    });
    $("#group-fee").keyup(function () {
        $(".fee-tip").hide();
    });
});
Template.bid.helpers({

});
