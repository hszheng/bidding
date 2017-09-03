/**
 * 定义项目中使用的所有的collections。
 *
 * @author  Sven Wang
 * @review
 */

// 'use strict';

var self = this;

/**
 * 微信接口时的ticket
 *
 * {
 *     token: '',
 *     ticket: '',
 *     timestamp: 1448007235401
 * }
 * 
 * @type {Object}
 *
 * @author Sven Wang
 */
 self.Token = new Mongo.Collection('token');

 /**
 * 用户信息表
 *
 * {
 *     userName: 'xxx',
 *     openId:'dsadas12312dsa',//用于判断用户是否已绑定
 *     phoneNum : '13790446796',  //手机号
 *     timestamp: 123456781, //创建时间
 * }
 *
 * @type {Object}
 *
 * @author Curry Liang
 */
self.UserInfo = new Mongo.Collection('userInfo');

 /**
 * 群组表
 *
 * {
 *     groupName: 'xxx', //群组名
 *     creatorId:'dasdasfassd',//创建人
 *     period:'一个月',//周期
 *     firstPayTime:'2015年12月12日',//首期付款日
 *     number:10,//人数
 *     currentTurn:2,//当前的轮数
 *     groupFee:10000,//团费
 *     status:'投标中',//组状态
 *     invitedCode:'groupName+四位数字',//邀请码
 *     timestamp: 123456781, //创建时间
 * }
 *
 * @type {Object}
 *
 * @author Curry Liang
 */
self.GroupInfo = new Mongo.Collection('groupInfo');

/**
 * 关系表
 *
 * {
 *     userId:'dasdasvad',//用户id
 *     groupId:'dasdasdef',//组id
 *     role:'一类付款人',//玩家身份
 *     status:'已投标',//别人状态
 *     timestamp: 123456781, //创建时间
 * }
 *
 * @type {Object}
 *
 * @author Curry Liang
 */
self.Relationship = new Mongo.Collection('relationship');

/**
 * 记录表
 *
 * {
 *     userId:'dsadas',//用户的id
 *     groupId:'dasdasdef',//组别id
 *     currentTurn:2,//当前轮数
 *     reciptPicture:'http://www.baidu.com/123.png',//用户上传的凭证路径
 *     protocalDescirption:'表会名 ＋ 第几期  xx 付款  xx 多少钱',//协议（确定怎么保存）
 *     type:'支付',//类型
 *     timestamp: 123456781, //创建时间
 * }
 *
 * @type {Object}
 *
 * @author Curry Liang
 */
self.Log = new Mongo.Collection('log');
/**
 *借条表
 *
 * {
 *
 * 		receiptNo: '2015051100009' //编号
 * 		time: '2016/5/14  AM 10:46:36' //填写时间	
 * 		lenderName: '张三'，  //借出人的姓名
 * 		lenderPhone: '18824920361', //借出人手机号码
 * 	 	lenderNumber: 'xxxxxxxxxxx', //借出人身份证号码
 * 	 	lenderAddress: 'xxxxxxxxxx', //借出人地址
 * 	 	borrowerName: '李四', //借入人
 * 	 	borrowerPhone: '18942310895' //借入人手机号码
 * 	 	borrowerNumber: 'xxxxxxxxx', //借入人身份证号码
 * 	 	borrowerAddress: 'xxxxxxxxx', //借入人地址
 * 	 	money: 12000， //借款金额
 * 	 	yearRate: 15% , //年利率
 * 	 	borrowTime: '2015-4-01', //借款日期
 * 	 	payStopTime: '2015-5-01', //还款日期
 * 	 	purpose: 'xxxxxx', //借款用途
 * 	 	receiptAccountType: 'xxxxx',//收款类型
 * 	 	receiptAccountNo: 'xxxxx'//收款账号
 * 	 	payType: '利息分期偿还'//还款方式
 * 	 	lateDayRate: 0.05%  //逾期日利率
 * 	 	paymentDay: '每月14日' //每期还款日
 * 	 	interestTime: '13 //利息几个月支付一次'	
 * 	 	isGuarantee: true //是否有担保人 	
 * 	 	guarantee：'王五'，//担保人
 * 	 	guaranteePhone: '18824920361' //担保人手机号码
 * 	 	guaranteeNumber: 'xxxxxxxxxxx' //担保人证件号
 * 	 	guaranteeAddress: 'xxxxxxxxx' //担保人地址
 * 	 	isGuaranteeHouse: true //是否有房屋担保
 * 	 	houseOwner: 'xxxx' //房屋所有人	 	
 * 	 	propertyNo: 'xxxxxx' //产权证号或土地证
 * 	 	houseArea: '10平米'//房产面积
 * 	 	mortgageHouse: '1200000' //抵押价值
 * 	 	houseAddress: 'xxxxxxx' //房产地址
 * 	 	isOtherGuanantee: true  //是否有其他担保物
 * 	 	otherOwner: 'xxxx'  //担保物所有人
 * 	 	mortgageOther: '100人民币'//其他抵押价值
 * 	 	mortgageDesc: 'xxxxxxx'//抵押品描述
 * 	 	imgArr:['xxxxxx','xxxxx'] //图片数组
 * 	 	otherClause: 'xxxxxxxx' //其他条款
 * 	 	ip: 'xxxxx' //提交者ip
 * 	 	randomNo: 'xxxxxxxx'//提交后随机码
 * 	 	isComplete: true //是否已处理
 * 	 	isStar: true //是否星标
 * 	 	timestamp: 11213131333232   时间戳
 * }
 *
 * 
 */



self.Receipt = new Mongo.Collection('receipt');
