/*
* yungo-abp微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'yungoAbp';

/*
* 查询短信模板
*/
export function querySmsTemplateByPager(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.querySmsTemplateByPager,bid);
	return ajax.post(url,param);
}

/*
*体验外呼任务获取短信验证码
*/
export function sendIdentifyCode(param={},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.yungoAbp.sendIdentifyCode,bid);
  return ajax.post(url,param);
}


/*
* 短信验证码校验
*/
export function checkIdentifyCode(param={},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.yungoAbp.checkIdentifyCode,bid);
  return ajax.post(url,param);
}