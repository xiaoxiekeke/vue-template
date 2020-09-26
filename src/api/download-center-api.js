import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'downloadCenterApi';

/*
*查询下载中心任务(新)
*/
export function queryDownloadTask(param = {}){
  // param.sysType = config.system.id;
  let url = global.getRequestUrl(SERVICE__NAME,config.downloadCenterApi.queryDownloadTask);
  return ajax.post(url,param);
}

/*
*添加下载中心任务(新)
*/
export function addDownloadTask(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.downloadCenterApi.addDownloadTask);
  return ajax.post(url,param);
}

/*
*取消下载任务(新)
*/
export function deleteDownloadTask(param={}){
  let url = global.getRequestUrl(SERVICE__NAME,config.downloadCenterApi.deleteDownloadTask);
  return ajax.post(url,param);
}