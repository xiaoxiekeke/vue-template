/*
* 外呼微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'outbound';


/*
* 通过excel上传数据
*/
export function getUploadExcelUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.outbound.uploadExcel)
}

/*
* 查询任务
*/
export function searchTasksDto(param = {},bid){
	param.sysType = config.system.id;
	param.taskType = 1;
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.searchTasksDto,bid);
	return ajax.post(url,param);
}
/*
*查询发音人（老）
*/
export function searchRobotVoice(param = {}){
	param.version = 2;
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.searchRobotVoice);
	return ajax.post(url,param);
}

/*
* 历史记录
*/
export function searchHistoryTask(param = {}) {
	param.taskType = 1;
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME, config.outbound.searchHistoryTask);
	return ajax.post(url, param);
}


/*
* 导出记录
*/
export function exportHistory(id) {
	let downloadUrl = config.outbound.download + '/' + id + '/1'
	let url = global.getRequestUrl(SERVICE__NAME, downloadUrl);
	return ajax.formPost(url, {});
}

/*
* 任务管理
*/
export function manageRobotTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME, config.outbound.manageRobotTask);
	return ajax.post(url, param);
}

/*
*创建外呼任务
*/
export function createTaskWithFile(param ={}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.createTaskWithFile);
	return ajax.post(url,param);
}

/*
*修改外呼任务
*/
export function modifyTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.modifyTask);
	return ajax.post(url,param);
}

/*
*暂停任务
*/
export function pauseTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.pauseTask);
	return ajax.post(url,param);
}

/*
*运行任务
*/
export function runTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.runTask);
	return ajax.post(url,param);
}

/*
*删除任务
*/
export function deleteTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.deleteTask);
	return ajax.post(url,param);
}
/*
*查询发音人（新）
*/
export function searchSpeaker(param = {}){
	param.version = 2;
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.searchSpeaker);
	return ajax.post(url,param);
}
/*
*查询企业号码（新）
*/
export function searchTel(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.searchTel);
	return ajax.post(url,param);
}

/*
*查询当前任务（新）
*/
export function searchTaskList(param = {},bid){
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.searchTaskList);
	return ajax.post(url,param);
}

/*
*查询历史任务（新）
*/
export function searchHistoryTaskList(param = {}){
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.searchHistoryTaskList);
	return ajax.post(url,param);
}

/*
* 体验
*/
export function createTaskDataWithKeyValue(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.outbound.createTaskDataWithKeyValue,bid);
	return ajax.post(url,param);
}



