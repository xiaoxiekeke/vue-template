/*
* 计费微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'fee';

/*
* 获得支付宝支付接口的url
*/
export function getAliPayUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.fee.aliPay)
}


/*
* 查询当前费用是否可用
*/
export function checkFeeLeft(param){
	if(!param){
		param = {
		  channelCode: 6,
          description: 'task checkFeeLeft',
          productId: '',
          item: 1,
          itemDesc: 'task checkFeeLeft',
          feeCount: 1,
          isCheckFrozenMoney: 0
		}
	}
	let url = global.getRequestUrl(SERVICE__NAME,config.fee.checkFeeLeft);
	return ajax.post(url,param);
}
/*
* 查询账号计费相关信息
*/
export function queryFeeAccountById(param = {}){
	param.channelCode = 3;
	let url = global.getRequestUrl(SERVICE__NAME,config.fee.queryFeeAccountById);
	return ajax.post(url,param);
}

/*
* 对公转账
**/
export function offlinePay(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.fee.offlinePay);
	return ajax.post(url,param);
}
/*
* 查询消费记录
*/
export function consumeQueryDesc(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.fee.consumeQueryDesc);
	return ajax.post(url,param);
}
/*
* 查询订单记录
*/
export function queryOrderList(param = {}){
	param.channelCode = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.fee.queryOrderList);
	return ajax.post(url,param);
}


