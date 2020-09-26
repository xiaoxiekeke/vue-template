/*
* bm微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'bm';

/*
* 企业认证上传附件
*/
export function getUploadEntAuthAttachUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.bm.uploadEntAuthAttach);
}

/*
* 查询节点标签
*/
export function queryLabelOptionList(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.bm.queryLabelOptionList);
	return ajax.post(url,param);
}

/*
* 查询企业状态
*/
export function queryEntAuthByBusId(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.bm.queryEntAuthByBusId);
	return ajax.post(url,param);
}

/*
* 查询企业外显号码
*/
export function searchTel(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.bm.searchTel);
	return ajax.post(url,param);
}

/*
* 企业认证
*/
export function enterpriseAuth(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.bm.enterpriseAuth);
	return ajax.post(url,param);
}


export function queryBusinessConfig(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.bm.queryBusinessConfig);
  return ajax.post(url,param);
}

export function saveBusinessConfig(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.bm.saveBusinessConfig);
  return ajax.post(url,param);
}
