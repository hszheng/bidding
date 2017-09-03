Template.inviteFriend.onRendered(function(){
	var groupId = Session.get('nowGroupId');//获取前一步点击邀请好友的组的id
	// var groupId = "TFyEBJAXeA5dYoxdv";
	var openid = Session.get('WechatUserInfo').openid;
	var userInfoSelector = {collection:'userInfo',selector:{openId:openid,isRemoved:{$ne:true}},options:{}};
	var selector = {collection:'groupInfo',selector:{_id:groupId,isRemoved:{$ne:true}},options:{}};
	Meteor.call('getData',selector,function (err,result){//获取当前组的信息
		if(err){
			return;
		}
		$('.inviteFriend .whiteBgOne .groupName span').html(result[0].groupName);
		$('.inviteFriend .whiteBgOne .groupFee span').html(result[0].groupFee);
		$('.inviteFriend .whiteBgOne .groupTime span').html(result[0].period);
		$('.inviteFriend .whiteBgOne .groupDate span').html(result[0].firstPayTime);
		$('.inviteFriend .whiteBgOne .groupNumber span').html(result[0].number);
	});

	Meteor.call('getData',userInfoSelector,function (err,result){//获取当前转发用户的名字
		if(err){
			return;
		}
		var link = HOST + '/groupInvitation/' + groupId,
			imgUrl = HOST + '/groupInvitation/tzh.png';
		// alert(link);	
		wx.ready(function(){
			wx.onMenuShareTimeline({
			    title: result[0].userName + '邀请你加入团会', // 分享标题
			    link: link, // 分享链接
			    desc: '加入团会，与好友一起理财', // 分享描述
			    imgUrl: imgUrl, // 分享图标
			    success: function () { 
			        // 用户确认分享后执行的回调函数
                               Router.go('/creating');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
                               Router.go('/creating');
			    }
			});

			wx.onMenuShareAppMessage({
			    title: result[0].userName + '邀请你加入团会', // 分享标题
			    desc: '加入团会，与好友一起理财', // 分享描述
			    link: link, // 分享链接
			    imgUrl: imgUrl, // 分享图标
			    type: '', // 分享类型,music、video或link，不填默认为link
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
                                Router.go('/creating');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
                      Router.go('/creating');
			    }
			});
		});
	});
	$('.inviteFriend .shareTip').click(function(){
		$('.inviteFriend .shareTip').hide();
	});

	$('.inviteFriendFooter').click(function(){
               Router.go('/creating');
	});


});
