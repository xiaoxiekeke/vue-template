/*
* outbount-data微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'crm';


/*
* 查询成员列表
*/
export function queryMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryMember,bid);
  return ajax.post(url,param);
}

/*
* 删除成员列表
*/
export function deleteMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.deleteMember,bid);
  return ajax.post(url,param);
}

/*
* 增加成员列表
*/
export function addMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.addMember,bid);
  return ajax.post(url,param);
}

/*
* 查询单个成员信息
*/
export function queryMemberInfo(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryMemberInfo,bid);
  return ajax.post(url,param);
}

/*
* 修改成员信息
*/
export function updateMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.updateMember,bid);
  return ajax.post(url,param);
}


/*
* 查询客户信息
*/
export function queryCustomer(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryCustomer,bid);
  	return ajax.post(url,param);
}

/*
* 更新客户扩展信息
*/
export function updateCustomer(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.crm.updateCustomer,bid);
  return ajax.post(url,param);
}
/*
* 查询基础数据
*/
export function queryCode(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryCode,bid);
  return ajax.post(url,param);
}

/*
* 添加跟进记录
*/
export function addTrace(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.addTrace,bid);
  return ajax.post(url,param);
}

/*
* 查询通话详情
*/
export function queryTraceDetail(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryTraceDetail,bid);
  return ajax.post(url,param);
}


/*
* 微信模板消息发送
*/
export function templateSend(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.templateSend,bid);
  return ajax.post(url,param);
}

/*
* 账号绑定微信公众号
*/
export function createTmpQrCode(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.createTmpQrCode,bid);
  return ajax.post(url,param);
}

/*
* 账号解绑微信
*/
export function unbindWeixinMp(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.unbindWeixinMp,bid);
  return ajax.post(url,param);
}


/*
* 登录
*/
export function login(param = {}){
  param.contextPath = config.system.name;
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.login);
  return ajax.post(url,param);
}

/*
* 密码修改
*/
export function updatePassword(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.updatePassword);
  return ajax.post(url,param);
}

/*
* 退出
*/
export function logout(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.logout);
  return ajax.post(url,param);
}

/*
* 获取登录验证码
*/
export function createImgCode(param = {}){
  return global.getRequestUrl(SERVICE__NAME,config.crm.createImgCode);
}

/*
* 获取上传头像的url
*/
export function uploadHeadPhoto(){
  return global.getRequestUrl(SERVICE__NAME,config.crm.uploadHeadPhoto);
}

/*
* 获取短信验证码
*/
export function sendResetSmsCode(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.sendResetSmsCode);
  return ajax.post(url,param);
}

/*
* 密码重置
*/
export function resetPassword(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.resetPassword);
  return ajax.post(url,param);
}


/*
* 查询客户基本信息
*/
export function queryCustomerInfo(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryCustomerInfo);
    return ajax.post(url,param);
}

/*
* 查询跟进记录
*/
export function queryCustomerTrace(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryCustomerTrace);
    return ajax.post(url,param);
}

/*
* 查询通话详情
*/
export function queryCallDetail(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.crm.queryCallDetail);
    return ajax.post(url,param);
}

/*
* 更新意向度
*/
export function updateTagIntention(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.crm.updateTagIntention);
    return ajax.post(url,param);
}

/*
* 管理员内部登陆
*/
export function ssaLogin(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.crm.ssaLogin);
  return ajax.post(url,param);
}











