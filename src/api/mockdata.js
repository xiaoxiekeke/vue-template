/*
* outbount-data微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'mock';

/*
* 成员管理
*/
/*
* 查询成员列表
*/
export function queryMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.mock.queryMember,bid);
  return ajax.post(url,param);
}

/*
* 删除成员列表
*/
export function deleteMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.mock.deleteMember,bid);
  return ajax.post(url,param);
}

/*
* 增加成员列表
*/
export function addMember(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.mock.addMember,bid);
  return ajax.post(url,param);
}





/*
* 账号绑定微信公众号
*/
export function createTmpQrCode(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.mock.createTmpQrCode,bid);
  return ajax.post(url,param);
}

/*
* 账号解绑微信
*/
export function unbindWeixinMp(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.mock.unbindWeixinMp,bid);
  return ajax.post(url,param);
}


/*
* 登录
*/
export function login(param = {}){
  param.contextPath = config.system.name;
  let url = global.getRequestUrl(SERVICE__NAME,config.mock.login);
  return ajax.post(url,param);
}

