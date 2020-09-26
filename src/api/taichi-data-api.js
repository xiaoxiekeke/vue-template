import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'taichiDataApi';

/*
*查询首页表报(新)
*/
export function indexStatistics(param = {}){
  // param.sysType = config.system.id;
  let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.indexStatistics);
  return ajax.post(url,param);
}

/*
*查任务报表统计(新)
*/
export function taskStatistics(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.taskStatistics);
  return ajax.post(url,param);
}

/*
*查任务详情报表(新)
*/
export function queryTaskDataReport(param={}){
  let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.queryTaskDataReport);
  return ajax.post(url,param);
}

/*
* 查询任务计费统计信息
*/
export function queryTaskFeeStatistics(param = {},bid){
	param.channelCode = config.system.id;
	param.businessId = global.getBusinessId();

	let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.queryTaskFeeStatistics);
  return ajax.post(url,param);
}

/*
* 查询任务计费详情
*/
export function queryTaskFeeDetail(param = {},bid){
	param.channelCode = config.system.id;
	param.businessId = global.getBusinessId();
	let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.queryTaskFeeDetail);
  return ajax.post(url,param);
}

/*
* 查询历史数据
*/
export function historyStatistics(param = {},bid){
  param.channelCode = config.system.id;
  param.businessId = global.getBusinessId();
  let url = global.getRequestUrl(SERVICE__NAME, config.taichiDataApi.historyStatistics,bid);
  return ajax.post(url, param);
}

/*
* 查询转人工数量
*/
export function transferCount(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.transferCount,bid);
    return ajax.post(url,param);
}


/*
* 企业计费合计
**/
export function queryFeeTotalStatistics(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.queryFeeTotalStatistics);
  return ajax.post(url,param);
}

/*
* 呼入详情
*/
export function queryCallReport(param = {}) {
  let url = global.getRequestUrl(SERVICE__NAME,config.taichiDataApi.queryCallReport);
  return ajax.post(url,param);
}