/*
*词库服务
*/
import ajax from './ajax.js'
import global from './global.js'
import config from './config.js'

const SERVICE__NAME = 'brainkb';
/*
* 查询词库的列表
*/
export function queryDicList(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryDicList,bid);
    return ajax.post(url,param);
}

/*
*新建词库
*/
export function addDict(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addDict,bid);
    return ajax.post(url,param);
}
/*
*删除词库
*/
export function delDict(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.delDict,bid);
    return ajax.post(url,param);
}

/*
*单个添加
*/
export function addSingle(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addSingle,bid);
    return ajax.post(url,param);
}

/*
*导出
*/
export function exportDic(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.exportDic,bid);
    return ajax.post(url,param);
}
/*
*词典详情
*/
export function queryDicDetail(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryDicDetail,bid);
    return ajax.post(url,param);
}
/*
*关键字搜索
*/
export function queryByterm(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryByterm,bid);
    return ajax.post(url,param);
}
/*
*删除词典
*/
export function delDicbyids(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.delDicbyids,bid);
    return ajax.post(url,param);
}
/*
*刷新词典
*/
export function addTask(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addTask,bid);
    return ajax.post(url,param);
}
/*
*编辑词典
*/
export function queryDetail(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryDetail,bid);
    return ajax.post(url,param);
}
/*
*批量上传
*/
export function addBatch(param={}){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addBatch);
    return ajax.formDataPost(url,param);
}

/*
*查询任务
*/
export function queryTask(param,bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryTask,bid);
    return ajax.post(url,param);
}
 /*
 *下载模板
 */
 export function exportKnow(param = {}){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.exportKnow);
    return ajax.post(url,param);
 }

/***知识点**/


/*
* 查询知识点列表
*/
export function queryKnowList(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryKnowList,bid);
    return ajax.post(url,param);
}

/*
* 添加知识点
*/
export function addKnow(param = {},bid){
	let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addKnow,bid);
    return ajax.post(url,param);
}

/*
* 删除知识点
*/
export function deleteKnowledgeByIds(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.deleteKnowledgeByIds,bid);
    return ajax.post(url,param);
}

/*
* 分词
*/
export function analyze(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.analyze,bid);
    return ajax.post(url,param);
}

/*
* or查询
*/
export function queryByOr(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryByOr,bid);
    return ajax.post(url,param);
}

/*
* 查询知识点问题列表
*/
export function queryQuestionList(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryQuestionList,bid);
    return ajax.post(url,param);
}

/*
* 删除知识点问题
*/
export function deleteQuestionByIds(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.deleteQuestionByIds,bid);
    return ajax.post(url,param);
}

/*
* 刷新(重新加载)
*/
export function refresh(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.refresh,bid);
    return ajax.post(url,param);
}
/*
* 关联相近词库
*/
export function adddicrelation(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.adddicrelation,bid);
    return ajax.post(url,param);
}

/*
* 查询分类
*/
export function queryTags(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryTags,bid);
    return ajax.post(url,param);
}

/*
* 添加分类
*/
export function addTag(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addTag,bid);
    return ajax.post(url,param);
}

/*
* 添加单个问题
*/
export function addSingleQuestion(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addSingleQuestion,bid);
    return ajax.post(url,param);
} 
/*
*查看问题详情
*/
export function questionDetail(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.questionDetail,bid);
    return ajax.post(url,param);
} 

/*
*编辑问题
*/
export function editSingleQuestion(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.editSingleQuestion,bid);
    return ajax.post(url,param);
} 
/*
*导出问题
*/
export function exportKbQuestion(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.exportKbQuestion,bid);
    return ajax.post(url,param);
}

/*
*下载模板
*/
export function exportTemplate(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.exportTemplate,bid);
    return ajax.post(url,param);
}
/*
*批量上传问题
*/
export function batchtask(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.batchtask,bid);
    return ajax.formDataPost(url,param);
}
/*
*录音上传
*/
export function recordFill(param = {},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.recordFill,bid);
    return ajax.formDataPost(url,param);
}
/*
*删除录音
*/
export function recordfileDelete(param={},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.recordfileDelete,bid);
    return ajax.post(url,param);
}


/*
*查询全部知识库
*/
export function querylistByBus(param={},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.querylistByBus,bid);
    return ajax.post(url,param);
}

/*
*根据知识库查找分类
*/
export function kbtagQuery(param={},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.kbtagQuery,bid);
    return ajax.post(url,param);
}


/*
*将知识库提交审核
*/
export function commitKbToReview(param={},bid){
    let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.commitKbToReview,bid);
    return ajax.post(url,param);
}

/******************** 规则模型 *******************/

/*
* 查询模型列表
*/
export function queryModeList(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryModelList,bid);
  return ajax.post(url,param);
}

/*
* 添加模型
*/
export function addModel(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addModel,bid);
  return ajax.post(url,param);
}

/*
* 删除模型
*/
export function delModel(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.delModel,bid);
  return ajax.post(url,param);
}

/*
* 查询规则列表
*/
export function queryRuleList(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryRuleList,bid);
  return ajax.post(url,param);
}

/*
* 添加规则
*/
export function addRule(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addRule,bid);
  return ajax.post(url,param);
}

/*
* 删除规则
*/
export function delRule(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.delRule,bid);
  return ajax.post(url,param);
}

/*
* 查询规则类型
*/
export function queryRuleTypes(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.queryRuleTypes,bid);
  return ajax.post(url,param);
}

/*
* 添加规则类型
*/
export function addRuleType(param = {},bid){
  let url = global.getRequestUrl(SERVICE__NAME,config.brainkb.addRuleType,bid);
  return ajax.post(url,param);
}
