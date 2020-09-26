/*
* json假数据
*/
import ajax from './ajax.js'
/*
* 配置
*/
export function getConfig(){
	let url = 'static/config/config.json';
	return ajax.get(url,{t : new Date().getTime()});
}
/*
* 创建任务配置
*/
export function getTaskConfig(){
	return ajax.addCache('__cfg_task',() => {
		let url = 'static/config/taskconfig.json';
		return ajax.get(url,{t : new Date().getTime()});
	});
}
/*
* 历史任务示例
*/
export function getHistoryExample(){
	let url = 'static/config/example-task-history.json';
	return ajax.get(url,{});
}

/*
* 客户管理下拉框配置
*/
export function getCustomerConfig(){
	return ajax.addCache('__cfg_customer',() => {
		let url = 'static/config/config__customer.json';
		return ajax.get(url,{});
	});
}

/*
* 开放平台体验应用
*/
export function queryAppList(){
	let url = 'static/config/app.json';
	return ajax.get(url,{t : new Date().getTime()});
}

/*
* 查询自有线路接口体验信息
*/
export function getLineInfo(){
	let url = 'static/config/lineinfo.json';
	return ajax.get(url,{t : new Date().getTime()});
}
/*
* 开放平台体验呼出
*/
export function queryExpTasks(){
	let url = 'static/config/exp_tasks.json';
	return ajax.get(url,{t : new Date().getTime()});
}

/*
* 获取app标签
*/
export function queryDefaultTags(){
	let url = 'static/config/apptags.json';
	return ajax.get(url,{t : new Date().getTime()});
}

/*
* 获取版本信息
*/
export function getVersion(){
	let url = 'static/config/version.json';
	return ajax.get(url,{t : new Date().getTime()});
}

/*
* 查询线路号码并发配置（特殊逻辑代码）
*/

export function getTelNum(){
	let url = 'static/config/telnum.json';
	return ajax.get(url,{t : new Date().getTime()});
}


/*
* 获取日志记录
*/
export function getUpdateLog(){
	let url = 'static/config/updatelog.json';
	return ajax.get(url,{t : new Date().getTime()});
}


export function getRuleTemplate() {
	return ajax.addCache('__rule_template',() => {
		let url = 'static/config/rule_template.json';
		return ajax.get(url,{t : new Date().getTime()});
	})
}
