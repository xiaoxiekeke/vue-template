/*
* outbount-data微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'outboundData';
/*
* 查询意向节点数据
*/
export function queryIntention(param,bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundData.queryIntention,bid);
	return ajax.post(url,param);
}
/*
* 查询通话数据
*/
export function queryCallNum(param,bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundData.queryCallNum,bid);
	return ajax.post(url,param);
}

/*
* 获取筛选列表
*/
export function searchCallResultList(param,bid) {
	return ajax.addCache('__callresult',() => {
		let url = global.getRequestUrl(SERVICE__NAME, config.outboundData.searchCallResultList,bid);
		return ajax.post(url, {});
	});
}


/*
* 获取任务结果
*/
export function queryTaskReport(params,bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundData.queryTaskReport,bid);
	return ajax.post(url, params);
}



/*
* 下载名单
*/
export function downloadCallData(params,bid) {
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundData.downloadCallData,bid);
	return ajax.formPost(url, params);
}

/*
* 下载报表
*/
export function downloadTaskReport(params,bid) {
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundData.downloadTaskReport,bid);
	return ajax.formPost(url, params);
}

/*
* 查询实时报表
*/
export function queryRealTimeReport(params = {},bid){
	params.params = {};
	params.params.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME, config.outboundData.queryRealTimeReport,bid);
	return ajax.post(url, params);
}







