Template.protocol.onRendered(function(){

});
Template.protocol.helpers({
	currentGroupInfo:function(){
        var currentId = Session.get('currentGroupId'),
            groupInfo = Session.get('groupInfo'),
            payFee = Session.get('payFee'),
            nowReceivePerson = Session.get('nowReceivePerson'),
            today = '',
            nowGroup = _.findWhere(groupInfo,{_id:currentId});
        nowGroup.nowReceivePerson = nowReceivePerson;
        nowGroup.payPerson = _.findWhere(Session.get('userInfo'),{openId:Session.get('currentUserId')}).userName;
        nowGroup.payFee = payFee;
        Meteor.call('getCurrentTime',function(err,result){
        	today = new Date(result);
        	today = today.toLocaleDateString();
        	console.log(today);
        	nowGroup.time = today;
        });
        return nowGroup;
    }
})