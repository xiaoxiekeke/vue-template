/*
* outbount-data微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'openapiAdmin';
/*
* 线路管理新增
*/
export function saveLine(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.saveLine,bid);
  return ajax.post(url,param);
}

/*
* 线路管理查询
*/
export function selectLine(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.selectLine,bid);
  return ajax.post(url,param);
}

/*
* 线路管理更新
*/
export function updateLine(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.updateLine,bid);
  return ajax.post(url,param);
}

/*
* 线路管理删除
*/
export function deleteLine(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.deleteLine,bid);
  return ajax.post(url,param);
}


/*
* 线路管理对接网关查询列表
*/
export function queryGateways(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.queryGateways,bid);
  return ajax.post(url,param);
}


/*
* 结果数据推送地址维护
*/
export function managePushAddress(param = {},bid){
	 let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.managePushAddress,bid);
  	return ajax.post(url,param);
}

/*
* 查询结果数据推送地址
*/
export function queryPushAddress(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.queryPushAddress,bid);
    return ajax.post(url,param);
}

/*
* 删除推送地址
*/
export function deletePushAddress(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.deletePushAddress,bid);
  return ajax.post(url,param);
}


/*
* 创建app
*/
export function createAppKey(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.createAppKey,bid);
    return ajax.post(url,param);
}

/*
* 查询应用列表
*/
export function queryAppList(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.queryAppList,bid);
    return ajax.post(url,param);
}
/*
* 查询单个应用信息
*/
export function queryApp(param = {},bid){
   let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.queryApp,bid);
    return ajax.post(url,param);
}

/*
* 查询业务标签
*/
export function queryTags(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.openapiAdmin.queryTags,bid);
    return ajax.post(url,param);
}

