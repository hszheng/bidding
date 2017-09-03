Template.groupInvitation.onCreated(function(){
	var groupId = Router.current().params._id;
	// alert(groupId);
	Session.set('currentRouterId',groupId);
});
Template.groupInvitation.onRendered(function(){
	document.title = "团会邀请";
	var selector = {collection:'groupInfo',selector:{_id:Session.get('currentRouterId')},options:{}};
	Meteor.call('getData',selector,function (err,result){
		if(err){
			return;
		}
		$('.addGroupStep .inviteCode .copyCode .green').html(result[0].groupName + result[0].invitedCode);
		$('.groupInvitation .whiteBgOne .groupName span').html(result[0].groupName);
		$('.groupInvitation .whiteBgOne .groupFee span').html(result[0].groupFee);
		$('.groupInvitation .whiteBgOne .groupTime span').html(result[0].period);
		$('.groupInvitation .whiteBgOne .groupDate span').html(result[0].firstPayTime);
		$('.groupInvitation .whiteBgOne .groupNumber span').html(result[0].number);

	});
	
});
