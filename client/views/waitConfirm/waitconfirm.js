Template.waitConfirm.onRendered(function () {
    //点击小图放大事件
    $("#bigPicture").click(function (e) {
        var url = $(this).attr('src');
        $(".pay-container2 .bg .show").css({
            "background-image": "url(" + url + ")",
            "background-size": "100% 100%"
        });
        $(".pay-container2 .bg").show();
    });
    //点击遮罩层使其消失
    $('.pay-container2 .bg').click(function (e) {
        $(".pay-container2 .bg").hide();
    });
    //点击返回事件
    $(".backtoupload").click(function (e) {
        Router.go('/bidding');
    });
});
Template.waitConfirm.helpers({
    currentGroup2: function () {
        var currentId = Session.get('currentGroupId'),
            groupInfo = Session.get('groupInfo'),
            payFee = Session.get('payFee'),
            nowReceivePerson = Session.get('nowReceivePerson'),
            nowGroup = _.findWhere(groupInfo, {
                _id: currentId
            }),
            userId = _.findWhere(Session.get('userInfo'), {
                openId: Session.get('currentUserId')
            })._id,
            payPerson = _.findWhere(Session.get('userInfo'), {
                openId: Session.get('currentUserId')
            }).userName,
            status = _.findWhere(Session.get('relationship'), {
                userId: userId,
                groupId: currentId
            }).status,
            receiptPicture = '';
        receiptPicture = _.findWhere(Session.get('log'), {
            userId: userId,
            groupId: currentId
        }).reciptPicture;
        nowGroup.receiptPicture = receiptPicture;
        nowGroup.nowReceivePerson = nowReceivePerson;
        nowGroup.payFee = payFee;
        nowGroup.userStatus = status;
        nowGroup.payPerson = payPerson;
        return nowGroup;
    }
});
