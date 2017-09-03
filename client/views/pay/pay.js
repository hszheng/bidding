Template.pay.onRendered(function () {
    document.title="付款";
    // 文件上传事件
    $('#insertImageCon .uploadPanel input[type="file"]').change(function (e) {
        $('#insertImageCon .rightButton').click();
        $("#loading").css("background-image","url()");
        $("#loading").css("display","block");
    });
    
    // 我同意XXX协议
    $('.pay-container1 .check-protocal .confirmProtocal').on('click',function(e){
    	$(e.target).toggleClass('confirmcheck');
    });
    $(".backtogroup").click(function(e){
        Router.go('/bidding');
    });
    $(".profile-complete").click(function(e){
        var nowUserId = _.findWhere(Session.get('userInfo'),{openId:Session.get('currentUserId')})._id,
            currentId = Session.get('currentGroupId'),
            reciptPicture = '',
            nowReceivePerson = Session.get('nowReceivePerson'),
            currentTurn = _.findWhere(Session.get('groupInfo'),{_id:currentId}).currentTurn,
            groupName = _.findWhere(Session.get('groupInfo'),{_id:currentId}).groupName,
            payPerson = _.findWhere(Session.get('userInfo'),{openId:Session.get('currentUserId')}).userName,
            payFee = Session.get('payFee'),
            str = '',
            data = {};
        data.userId = nowUserId;
        data.opneId = Session.get('currentUserId');
        data.groupId = currentId;
        data.currentTurn = currentTurn;
        data.protocalDescirption = groupName + '第' + currentTurn + '期,' + payPerson + '付款给' + nowReceivePerson + payFee + '元';
        if($(".image-container").css("background-image")!=="none"){
            str = $(".image-container").css("background-image");
            data.reciptPicture = str.substring(4, str.length - 1);
        }else{
            data.reciptPicture = '';
        }
        data.type = "支付";
        if($('.pay-container1 .check-protocal .confirmProtocal').hasClass('confirmcheck')){
            Meteor.call('updateData',{collection:'relationship',selector:{userId:nowUserId,groupId:currentId},modifier:{$set:{status:'待确认'}},multi:true},function(err,result){
                alert('已发送请求，等待收款人确认！');
            });
            Meteor.call('insertData',{collection:'log',data:data},function(err,result){
                console.log(err,result);
            })
        }else{
            alert('请同意协议！');
        }
    });
});
Template.pay.helpers({
    currentGroupInfo:function(){
        var currentId = Session.get('currentGroupId'),
            groupInfo = Session.get('groupInfo'),
            payFee = Session.get('payFee'),
            nowReceivePerson = Session.get('nowReceivePerson'),
            nowGroup = _.findWhere(groupInfo,{_id:currentId});
        nowGroup.nowReceivePerson = nowReceivePerson;
        nowGroup.payFee = payFee;
        return nowGroup;
    }
});
