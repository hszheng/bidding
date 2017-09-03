/**
 * 客户端启动后执行的逻辑代码。
 *
 * @author  Vincent Zheng
 * @version 1.0
 * @since   2015-10-30
 * @review
 */

'use strict';
Meteor.startup(function () {
    $(document).ready(function () {
        var scale = $('body').width() / PAGE_WIDTH;
        $('meta[name="viewport"]').attr('content', 'width=' + PAGE_WIDTH + ',initial-scale=' + scale +
            ',maximum-scale=' + scale + ',user-scalable=no');;
    });
    var result={openid:'eqwdsvvwe'};
    Session.set('WechatUserInfo', result);

    //微信授权
    // var code = Utility.parse('code'),
    //     redirect_uri = encodeURIComponent(location.href);        
    // if (code) {
    //     Meteor.call('getUserInfoByCode', code, function (err, result) {
    //         if (!err && result) {
    //             Session.set('WechatUserInfo', result);
    //         }
    //     });
    // } else {
    //     location.assign('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID +
    //         '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=professional_edition#wechat_redirect');
    // }
    // // 微信接口
    // Meteor.call('getWechatConfig', location.href.split('#')[0], function (err, result) {
    //     wx.config({
    //         debug: false,
    //         appId: result.appId,
    //         timestamp: result.timestamp,
    //         nonceStr: result.nonceStr,
    //         signature: result.signature,
    //         jsApiList: [
    //         'checkJsApi',
    //         'onMenuShareTimeline',
    //         'onMenuShareAppMessage',
    //         'onMenuShareQQ',
    //         'onMenuShareWeibo',
    //         'onMenuShareQZone',
    //         'hideMenuItems',
    //         'showMenuItems',
    //         'hideAllNonBaseMenuItem',
    //         'showAllNonBaseMenuItem',
    //         'translateVoice',
    //         'startRecord',
    //         'stopRecord',
    //         'onVoiceRecordEnd',
    //         'playVoice',
    //         'onVoicePlayEnd',
    //         'pauseVoice',
    //         'stopVoice',
    //         'uploadVoice',
    //         'downloadVoice',
    //         'chooseImage',
    //         'previewImage',
    //         'uploadImage',
    //         'downloadImage',
    //         'getNetworkType',
    //         'openLocation',
    //         'getLocation',
    //         'hideOptionMenu',
    //         'showOptionMenu',
    //         'closeWindow',
    //         'scanQRCode',
    //         'openProductSpecificView',
    //         'addCard',
    //         'chooseCard',
    //         'openCard'
    //   ]
    //     });
    // });

    // 文件上传完回调
    // Uploader.finished = function (index, fileInfo, templateContext) {
    //     console.log(fileInfo.baseUrl + fileInfo.name);
    //     var url = fileInfo.baseUrl + fileInfo.name;
    //     $("#loading").css("display","none");
    //     $('.image-container').css({
    //         "background-image": "url(" + url + ")",
    //         "background-size": "100% 100%"
    //     });
    // };
});