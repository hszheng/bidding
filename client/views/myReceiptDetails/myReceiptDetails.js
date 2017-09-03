Template.myReceiptDetails.onRendered(function(){
    document.title = "我的借条";
    if(!Session.get('receiptItemData')){
    	alert("获取借条详情失败");

    }
})
Template.myReceiptDetails.helpers({
    receiptItemData:function(){
    	var receiptItemData1=Session.get('receiptItemData');
        return receiptItemData1;

    },
    formatMoney:function(money){
    	if(money){
          var moneyValue=money.toString().split("").reverse().join("").replace(/(\d{3})/g, "$1,").split("").reverse().join("");
    	if(money.toString().length%3==0){
    		moneyValue=moneyValue.substr(1,moneyValue.length);
    	} 
         return {moneyValue:moneyValue};
    	}
    	
    },
    imgDataArr:function(imgArr){
    	 var imgUrlArr=[];
        if(!imgArr){
            return [];
        }
    	for(var i=0;i<imgArr.length;i++){
    		imgUrlArr.push({url:imgArr[i]});
    	}
    	return imgUrlArr;
    },
    dateFormat:function(date){
    	var dateArr=date.split('-');
    	var dateString=dateArr[0]+"年"+dateArr[1]+"月"+dateArr[2]+"日"
    	return {dateString:dateString};
    },
    isShowContent:function(item){
    	if(item=="是"){
    		return true;
    	}else{
    		return false;
    	}
    }
     

})