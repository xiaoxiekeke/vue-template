/*
* 资源管理
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = "resmanage";

/*
* 添加短信模板
*/
export function addSmsTemplet(param = {},bid){
	param.companyResId = global.getBusinessId();
 	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.addSmsTemplet,bid);
  	return ajax.post(url,param);
}

/*
* 查询短信模板
*/
export function querySmsTemplet(param = {},bid){
	param.companyResId = global.getBusinessId();
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.querySmsTemplet,bid);
  	return ajax.post(url,param);
}

/*
* 查看模板详情
*/
export function querySmsTempletInfo(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.querySmsTempletInfo,bid);
  	return ajax.post(url,param);
}

/*
*删除短信模板
*/
export function deleteSmsTemplet(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.deleteSmsTemplet,bid);
  	return ajax.post(url,param);
}

/*
* 更新短信模板
*/
export function updateSmsTemplet(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.updateSmsTemplet,bid);
  	return ajax.post(url,param);
}

/*
* 查询短信发送记录
*/
export function querySmsSameRecord(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.querySmsSameRecord,bid);
  	return ajax.post(url,param);
}


/*
* 查询企业线路
*/
export function queryCPNInfo(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.queryCPNInfo,bid);
  	return ajax.post(url,param);
}

export function queryCPNInfoWithBus(param ={} ,bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.resmanage.queryCPNInfoWithBus,bid);
	return ajax.post(url,param);
}