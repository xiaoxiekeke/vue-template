/*
* UC微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'uc';

/*
* 根据token查询用户信息
*/
export function queryAccountInfo(param = {},bid,token){
  let apiUrl = config.uc.queryAccountInfo + '?token='+token,
    url = global.getRequestUrl(SERVICE__NAME,apiUrl,bid);
  return ajax.post(url,param);
}

/*
* 查询成员列表
*/
export function queryMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.queryMember,bid);
  return ajax.post(url,param);
}

/*
* 删除成员列表
*/
export function deleteMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.deleteMember,bid);
  return ajax.post(url,param);
}

/*
* 增加成员列表
*/
export function addMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.addMember,bid);
  return ajax.post(url,param);
}

/*
* 查询单个成员信息
*/
export function queryMemberInfo(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.queryMemberInfo,bid);
  return ajax.post(url,param);
}

/*
* 修改成员信息
*/
export function updateMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.updateMember,bid);
  return ajax.post(url,param);
}



/*
* 账号解绑微信
*/
export function unbindWeixinMp(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.unbindWeixinMp,bid);
  return ajax.post(url,param);
}


/*
* 登录
*/
export function login(param = {}){
  param.contextPath = config.system.name;
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.login);
  return ajax.post(url,param);
}

/*
* 获取登录图片验证码
*/
export function createImgCode(param = {}){
  return global.getRequestUrl(SERVICE__NAME,config.uc.createImgCode);
}

/*
* 密码修改
*/
export function updatePassword(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.updatePassword);
  return ajax.post(url,param);
}

/*
* 上传头像获取上传头像的url
*/
export function uploadHeadPhoto(){
  return global.getRequestUrl(SERVICE__NAME,config.uc.uploadHeadPhoto);
}

/*
* 退出
*/
export function logout(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.logout);
  return ajax.post(url,param);
}



/*
* 获取重置密码验证码
*/
export function sendResetSmsCode(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.sendResetSmsCode);
  return ajax.post(url,param);
}

/*
* 密码重置
*/
export function resetPassword(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.resetPassword);
  return ajax.post(url,param);
}





/*
* 话术管理员登录
*/
export function speechSkillAdminLogin(param = {}){
  param.contextPath = config.system.name;
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.speechSkillAdminLogin);
  return ajax.post(url,param);
}

/*
* 检查号码是否被占用
*/
export function phoneCheck(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.phoneCheck);
  return ajax.post(url,param);
}
/*
* 获取注册短信验证码
*/
export function sendSmsVerifyCode(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.sendSmsVerifyCode);
  return ajax.post(url,param);
}

/*
* 获得注册的图片验证码
*/
export function getRegisterImageUrl(){
  return global.getRequestUrl(SERVICE__NAME,config.uc.createVerifyImage__register);
}

/*
* 注册
*/
export function register(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.uc.register);
  return ajax.post(url,param);
}



