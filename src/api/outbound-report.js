/*
* outbount-report微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'outboundReport';

/*
* 查询实时报表
*/
export function queryRealTimeReport(params = {}){
	params.params = {};
	params.params.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundReport.queryRealTimeReport);
	return ajax.post(url, params);
}
/*
* 生成报表
*/
export function generateRealTimeReport(params = {}){
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundReport.generateRealTimeReport);
	return ajax.post(url, params);
}

/*
* 取消报表生成
*/
export function deleteRealTimeReport(params = {}){
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundReport.deleteRealTimeReport);
	return ajax.post(url, params);
}