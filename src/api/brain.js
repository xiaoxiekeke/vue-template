/*
* brain微服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'brain';

export function getImportUrl(){
	return global.getRequestUrl(SERVICE__NAME,config.brain.import);
}
/*
* 查询话术
*/
export function querySpeechSkill(param){
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.brain.querySpeechSkill);
	return ajax.post(url,param);
}
/*
* 查询话术模板
*/
export function queryTemplateSpeechSkill(param){
	let url = global.getRequestUrl(SERVICE__NAME,config.brain.queryTemplateSpeechSkill);
	return ajax.post(url,param);
}
/*
* 复制话术
*/
export function copy(param){
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME,config.brain.copy);
	return ajax.post(url,param);
}

/*
* 导出话术
*/
export function exportSpeech(param = {}) {
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.export);
	return ajax.formPost(url, param);
}

/*
* 新增话术
*/
export function saveSpeechSkill(param = {}) {
	param.sysType = config.system.id;
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.saveSpeechSkill);
	return ajax.post(url, param);
}

/*
* 删除话术
*/
export function deleteSpeechSkill(param = {}) {
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.deleteSpeechSkill);
	return ajax.post(url, param);
}

/**
* 话术导入
*/
export function importSpeech(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.import);
	return ajax.formDataPost(url, param);
}

/*
* 查询话术失败原因
*/
export function querySpeechSkillReview(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.querySpeechSkillReview);
	return ajax.formDataPost(url, param);
}

/*
* 查询话术动态字段
*/
export function querySpeechSkillTemplate(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.querySpeechSkillTemplate);
	return ajax.formDataPost(url, param);
}

/*
* 电话预览
*/
export function submitPreview(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.submitPreview);
	return ajax.formDataPost(url, param);
}


/*
*查询动态话术
*/
export function queryNodeList(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.queryNodeList);
	return ajax.post(url, param);
}

/*
*查询动态话术
*/
export function saveSpeechSkillNode(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.saveSpeechSkillNode);
	return ajax.post(url,param);
}
/*
*删除动态话术组
*/
export function deleteSpeechSkillNode(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.deleteSpeechSkillNode);
	return ajax.post(url,param);
}

/*
*保存话术所属行业
*/
export function updateIndustryType(param={},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.updateIndustryType);
	return ajax.post(url,param);
}

/*
*
*/
export function submitReview(param={},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.submitReview);
	return ajax.post(url,param);
}
/*
* 查询话术使用的知识库和类别
*/
export function queryKnowledge(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.queryKnowledge);
	return ajax.post(url,param);
}



/*
* 查询标签
*/
export function queryLabel(param = {},bid){
	param.businessId = global.getBusinessId();
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.queryLabel);
	return ajax.post(url,param);
}

/*
* 设置标签
*/
export function setLabel(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.setLabel);
	return ajax.post(url,param);
}

/*
* 查询行业类别接口
*/
export function querMcpConfig(param = {}){
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.querMcpConfig);
	return ajax.post(url,param);
}

export function querySpeechSkillByIds(param = {}) {
	let url = global.getRequestUrl(SERVICE__NAME, config.brain.querySpeechSkillByIds);
	return ajax.post(url,param);
}