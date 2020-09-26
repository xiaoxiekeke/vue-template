/*
* 外呼微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'outboundManage';



/*
*查询当前任务（新）
*/
export function searchTaskList(param = {},bid){
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.searchTaskList);
	return ajax.post(url,param);
}

/*
*暂停任务
*/
export function pauseTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.pauseTask);
	return ajax.post(url,param);
}

/*
*运行任务
*/
export function runTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.runTask);
	return ajax.post(url,param);
}

/*
*删除任务
*/
export function deleteTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.deleteTask);
	return ajax.post(url,param);
}

/*
*查询发音人
*/
export function searchSpeaker(param = {}){
	param.version = 2;
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.searchSpeaker);
	return ajax.post(url,param);
}
/*
* 通过excel上传数据
*/
export function getUploadExcelUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.outboundManage.uploadTaskFile)
}

/*
*创建外呼任务
*/
export function createTaskWithFile(param ={}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.createTaskWithFile);
	return ajax.post(url,param);
}
/*
*修改外呼任务
*/
export function modifyTask(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.modifyTask);
	return ajax.post(url,param);
}

/*
*查询企业号码
*/
export function searchTel(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.searchTel);
	return ajax.post(url,param);
}

/*
*查询历史任务
*/
export function searchHistoryTaskList(param = {}){
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.searchHistoryTaskList);
	return ajax.post(url,param);
}

/*
* 体验
*/
export function addLongTermTaskData(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.outboundManage.addLongTermTaskData,bid);
	return ajax.post(url,param);
}

/*
* 获取筛选列表
*/
export function searchCallResultList(param,bid) {
	return ajax.addCache('__callresult',() => {
		let url = global.getRequestUrl(SERVICE__NAME, config.outboundManage.searchCallResultList,bid);
		return ajax.post(url, {});
	});
}

