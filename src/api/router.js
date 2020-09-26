/*
* 呼叫路由
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'router';

/*
* 保存规则
*/
export function saveRule(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.router.saveRule);
	return ajax.post(url,param);
}

/*
* 删除规则
*/
export function deleteRule(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.router.deleteRule);
	return ajax.post(url,param);
}

