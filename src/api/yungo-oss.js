
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'yungoOss';

export function getUploadUrl() {
	return global.getRequestUrl(SERVICE__NAME,config.yungoOss.upload)
}