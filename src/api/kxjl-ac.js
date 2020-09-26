/*
* kylin微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'kxjlAc';


/*
* ACD配置查询
*/
export function acdQuery(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.acdQuery);
	return ajax.post(url,param);
}

/*
* ACD配置新增
*/
export function acdCreate(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.acdCreate);
	return ajax.post(url,param);
}

/*
* ACD配置修改
*/
export function acdUpdate(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.acdUpdate);
	return ajax.post(url,param);
}

/*
* ACD配置删除
*/
export function acdDelete(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.acdDelete);
	return ajax.post(url,param);
}



//查询用户关联的坐席及其所在坐席组信息
export function queryAgentsAcdsByPage(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.queryAgentsAcdsByPage);
	return ajax.post(url,param);
}


//查询单个坐席关联的组、用户、坐席信息
export function queryByAgentId(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.queryByAgentId);
	return ajax.post(url,param);
}


//添加用户和坐席
export function agentCreate(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.agentCreate);
	return ajax.post(url,param);
}

//编辑用户和坐席
export function agentUpdate(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.agentUpdate);
	return ajax.post(url,param);
}

//删除用户和坐席
export function agentDelete(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.kxjlAc.agentDelete);
	return ajax.post(url,param);
}
