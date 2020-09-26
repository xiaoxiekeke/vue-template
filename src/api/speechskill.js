
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'speechSkill';
/*
*保存话术意向度设置
*/
export function saveIntention(param={},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.speechSkill.saveIntention);
	return ajax.post(url,param);
}

/*
*查询意向设置
*/
export function queryIntention(param={},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.speechSkill.queryIntention);
	return ajax.post(url,param);
}