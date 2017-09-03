
Template.myReceipt.onRendered(function(){
	document.title = "我的借条";

	 var userId=Session.get('WechatUserInfo').openid;
     var userSelector={collection:'userInfo',selector:{openId:userId},options:{}};
     Meteor.call('getData',userSelector,function(err,userResult){
     var selector = {collection:'myReceipt',selector:{$or:[{borrowerPhone:userResult[0].phoneNum},{lenderPhone:userResult[0].phoneNum},{guaranteePhone:userResult[0].phoneNum}]},options:{}};
     Meteor.call('getData',selector,function (err,result){
		if(err){
			return;
		}
		for(var i=0;i<result.length;i++){

            //将阿拉伯数字每三位一逗号分隔(如：15000000转化为15,000,000)
			var moneyValue=result[i].money.toString().split("").reverse().join("").replace(/(\d{3})/g, "$1,").split("").reverse().join(""); 
			if(result[i].money.toString().length%3==0){
				moneyValue=moneyValue.substr(1,moneyValue.length);
			}
			if(i === (result.length -1)){
				$('.myReceipt .myReceiptList').append('<div class="myReceiptItem" style="border:0px" data-id="'+result[i]._id+'">'+
				'<span class="borrowTime">'+result[i].borrowTime+'</span><span class="money">'+moneyValue+'元</span></div>');
			}
			else{
				$('.myReceipt .myReceiptList').append('<div class="myReceiptItem" data-id="'+result[i]._id+'">'+
				'<span class="borrowTime">'+result[i].borrowTime+'</span><span class="money">'+moneyValue+'元</span></div>');
			}
			
		}

		$('.myReceipt .myReceiptItem').off('click');
		$('.myReceipt .myReceiptItem').on('click',function(){
			var index = $('.myReceipt .myReceiptItem').index(this);
			Session.set('receiptItemData',result[index]);
			Router.go('/myReceiptDetails');
		})
		
	});

 })
     

})