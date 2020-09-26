import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'downloadCenterRecord';


/*
*添加录音到下载中心任务(新)
*/
export function addDownloadRecordTask(param = {}){
  let url = global.getRequestUrl(SERVICE__NAME,config.downloadCenterRecord.addDownloadTask);
  return ajax.post(url,param);
}

