/*
* yungo-api微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'yungoApi';

export function getUploadHeadPhotoUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.yungoApi.uploadHeadPhoto);
}

export function getCreateVerifyImageUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.yungoApi.createVerifyImage);
}

export function getRegisterImageUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.yungoApi.createVerifyImage__register);
}

/*
* 登录
*/
export function login(param = {}){
	param.contextPath = config.system.name;
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.login);
	return ajax.post(url,param);
}
/*
* 密码修改
*/
export function updatePassword(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.updatePassword);
	return ajax.post(url,param);
}
/*
* 退出
*/
export function logout(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.logout);
	return ajax.post(url,param);
}
/*
* 检查号码是否被占用
*/
export function phoneCheck(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.phoneCheck);
	return ajax.post(url,param);
}
/*
* 获取短信验证码
*/
export function sendSmsVerifyCode(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.sendSmsVerifyCode);
	return ajax.post(url,param);
}

/*
* 注册
*/
export function register(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.register);
	return ajax.post(url,param);
}

/*
* 密码重置
*/
export function resetPassword(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.resetPassword);
	return ajax.post(url,param);
}

export function sendResetSmsVerifyCode(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.sendResetSmsVerifyCode);
	return ajax.post(url,param);
}

/*
* 查询短信模板
*/
export function querySmsTemplateByPager(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.yungoApi.querySmsTemplateByPager,bid);
	return ajax.post(url,param);
}
















