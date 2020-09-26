/*
* outbount-data微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'weixin';


/*
* 账号绑定微信公众号
*/
export function createTmpQrCode(param,bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.weixin.createTmpQrCode,bid);
  return ajax.post(url,param);
}


















