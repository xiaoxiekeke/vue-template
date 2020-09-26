/*
* kylin微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'kylin';


/*
* 查询实时监控数据
*/
export function queryRealTimeData(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.queryRealTimeData);
	return ajax.post(url,param);
}

/*
* 查询监控详细内容
*/
export function queryRealTimeCallDetail(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.queryRealTimeCallDetail);
	return ajax.post(url,param);
}

/*
* 更新跟踪记录
*/
export function updateTrace(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.updateTrace);
	return ajax.post(url,param);
}

/*
* crm查询客户信息
*/
export function queryCustomerInfo(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.queryCustomerInfo);
	return ajax.post(url,param);
}

/*
* 接管
*/
export function takeControl(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.takeControl);
	return ajax.post(url,param);
}


/*
* 监控
*/
export function monitorDialog(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.monitorDialog);
	return ajax.post(url,param);
}

/*
* 保存监控配置
*/
export function saveConfig(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.config);
	return ajax.post(url,param);
}

/*
* 查询监控配置
*/
export function queryConfig(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.queryConfig);
	return ajax.post(url,param);
}

/*
* 查询知识库
*/
export function queryKbOr(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.queryKbOr);
	return ajax.post(url,param);
}

/*
* 规则判断
*/
export function judgeContent(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kylin.judgeContent);
	return ajax.post(url,param);
}