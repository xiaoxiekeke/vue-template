import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'openapi';

/*
* 获取token
*/
export function token(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.openapi.token,bid);
  	return ajax.post(url,param);
}

/*
* 查询配置
*/
export function queryConfig(param = {},bid,token){
	let url = global.getRequestUrl(SERVICE__NAME,config.openapi.queryConfig,bid);
	url += token;
  	return ajax.post(url,param);
}

/*
* 直接外呼
*/
export function callout(param = {},bid,token){
	let url = global.getRequestUrl(SERVICE__NAME,config.openapi.callout,bid);
	url += token;
  	return ajax.post(url,param);
}