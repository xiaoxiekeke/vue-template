
const Config = {
	debug : true,
	analysis : false,
	system : {
  	name : 'yeta',
  	id : "2"
  },
  permission:{
    __menu :{
      openapi : false,
      monitor : true
    },
    __fun : {
      monitor : false,
      wxPush : true,
      transcript : false,
      agent : false
    },
    __agent: {
      count: 0
    }
  },
  //接口地址配置，按微服务划分
  configUrl : "static/config/config.json",
  mock:{
    // 成员管理
    queryMember:'/52/api/v1/crm/member/{businessId}/queryMember',
    deleteMember:'/52/api/v1/crm/member/{businessId}/deleteMember',
    addMember:'/52/api/v1/crm/member/{businessId}/addMember',

    // 绑定微信
    createTmpQrCode:'/56/api/v1/mp/qrCode/{businessId}/createTmpQrCode',
    unbindWeixinMp:'/52/api/v1/crm/member/{businessId}/unbindWeixinMp',

    //登录
    login:'/api/v1/crm/account/login',
    logout : '/api/v1/crm/account/logout'
  },
  router : {
    saveRule : '/router/v1/api/config/rule/save?traceId={traceId}',
    deleteRule : '/router/v1/api/config/rule/delete?traceId={traceId}'
  },
  resmanage : {
    addSmsTemplet : '/api/v1/res/{businessId}/sms/templet/addSmsTemplet',
    querySmsTemplet : '/api/v1/res/{businessId}/sms/templet/querySmsTemplet',
    querySmsTempletInfo : '/api/v1/res/{businessId}/sms/templet/querySmsTempletInfo',
    deleteSmsTemplet : '/api/v1/res/{businessId}/sms/templet/deleteSmsTemplet',
    updateSmsTemplet : '/api/v1/res/{businessId}/sms/templet/updateSmsTemplet',
    querySmsSameRecord : '/api/v1/res/{businessId}/sms/templet/querySmsSameRecord',
    queryCPNInfo : '/api/v1/res/cpn/queryCPNInfo',
    queryCPNInfoWithBus: '/api/v1/res/cpn/queryCPNInfoWithBus'
  },
  crm:{
    queryMember:'/api/v1/crm/member/{businessId}/queryMember',
    deleteMember:'/api/v1/crm/member/{businessId}/deleteMember',
    addMember:'/api/v1/crm/member/{businessId}/addMember',
    updateMember:'/api/v1/crm/member/{businessId}/updateMember',
    queryMemberInfo:'/api/v1/crm/member/{businessId}/queryMemberInfo',
    queryCustomer :'/api/v1/crm/{businessId}/customer/queryCustomer',
    updateCustomer : '/api/v1/crm/{businessId}/customer/updateCustomer',
    queryCode : '/api/v1/crm/{businessId}/code/queryCode',
    addTrace : '/api/v1/crm/{businessId}/customer/addTrace',
    queryTraceDetail : '/api/v1/crm/{businessId}/customer/queryTraceDetail',
    queryCustomerInfo : '/api/v1/crm/{businessId}/customer/queryCustomerInfo',
    queryCustomerTrace : '/api/v1/crm/{businessId}/customer/queryCustomerTrace',
    queryCallDetail : '/api/v1/crm/{businessId}/customer/queryCallDetail',
    updateTagIntention : '/api/v1/crm/{businessId}/customer/updateTagIntention',
    templateSend:'/api/v1/crm/weixin/message/template/send',
    accountBind:'/api/v1/crm/weixin/account/bind',
    accountUnbind:'/api/v1/crm/weixin/account/unbind',
    unbindWeixinMp:'/api/v1/crm/member/{businessId}/unbindWeixinMp',
    login:'/api/v1/account/login',
    logout : '/api/v1/account/logout',
    createImgCode:'/api/v1/account/createImgCode',
    updatePassword : '/api/v1/account/{businessId}/updatePassword',
    uploadHeadPhoto : '/api/v1/account/{businessId}/uploadHeadPhoto',
    sendResetSmsCode : '/api/v1/account/sendResetSmsCode',
    resetPassword : '/api/v1/account/resetPassword',
    ssaLogin : '/api/v1/account/ssaLogin'
  },
  weixin:{
    createTmpQrCode:'/api/v1/mp/qrCode/{businessId}/createTmpQrCode'
  },
  brain : {
  	querySpeechSkill : '/api/v1/speechSkill/{businessId}/querySpeechSkill',
    queryTemplateSpeechSkill : '/api/v1/speechSkill/{businessId}/queryTemplateSpeechSkill',
    copy : '/api/v1/speechSkill/{businessId}/copy',
    export: '/api/v1/speechSkill/{businessId}/export',
    deleteSpeechSkill:'/api/v1/speechSkill/{businessId}/deleteSpeechSkill',
    saveSpeechSkill: '/api/v1/speechSkill/{businessId}/saveSpeechSkill',
    import : '/api/v1/speechSkill/{businessId}/import',
    querySpeechSkillReview : '/api/v1/speechSkill/{businessId}/querySpeechSkillReview',
    querySpeechSkillTemplate : '/api/v1/speechSkill/{businessId}/querySpeechSkillTemplate',
    submitPreview : '/api/v1/speechSkill/{businessId}/submitPreview',
    queryNodeList : '/api/v1/speechSkillNode/{businessId}/queryNodeList',
    saveSpeechSkillNode : '/api/v1/speechSkillNode/{businessId}/saveSpeechSkillNode',
    deleteSpeechSkillNode : '/api/v1/speechSkillNode/{businessId}/deleteSpeechSkillNode',
    updateIndustryType : '/api/v1/speechSkill/{businessId}/updateIndustryType',
    submitReview : '/api/v1/speechSkill/{businessId}/submitReview',
    queryKnowledge : '/api/v1/speechSkill/{businessId}/queryKnowledge',
    queryLabel:'/api/v1/speechSkill/{businessId}/queryLabel',
    setLabel : '/api/v1/speechSkill/{businessId}/setLabel',
    querMcpConfig: '/api/v1/speechSkill/{businessId}/querMcpConfig',
    querySpeechSkillByIds: '/api/v1/speechSkill/{businessId}/querySpeechSkillByIds'
  },
  bm : {
    queryLabelOptionList : '/api/v1/talkScriptLabel/{businessId}/queryLabelOptionList',
    queryEntAuthByBusId : '/api/v1/business/{businessId}/queryEntAuthByBusId',
    searchTel : '/api/v1/business/{businessId}/searchTel',
    uploadEntAuthAttach : '/api/v1/business/{businessId}/uploadEntAuthAttach',
    enterpriseAuth : '/api/v1/business/{businessId}/enterpriseAuth',
    queryBusinessConfig:'/api/v1/businessConfig/{businessId}/query',
    saveBusinessConfig:'/api/v1/businessConfig/{businessId}/save'
  },
  outboundData : {
    queryIntention : '/api/v1/taskstatics/{businessId}/queryIntention',
    queryCallNum : '/api/v1/taskstatics/{businessId}/queryCallNum',
    searchCallResultList: '/api/v1/outbound/task/{businessId}/searchCallResultList',
    queryTaskReport:'/api/v1/taskReport/{businessId}/queryTaskReport',
    downloadCallData:'/api/v1/taskReport/{businessId}/downloadCallData',
    downloadTaskReport:'/api/v1/taskReport/{businessId}/downloadTaskReport'
  },
  outboundReport : {
    queryRealTimeReport : '/api/v1/report/{businessId}/queryRealTimeReport',
    generateRealTimeReport : '/api/v1/report/{businessId}/generateRealTimeReport',
    deleteRealTimeReport:'/api/v1/report/{businessId}/deleteRealTimeReport'
  },
  fee : {
    checkFeeLeft : '/api/v1/fee/{businessId}/checkFeeLeft',
    queryFeeAccountById : '/api/v1/fee/{businessId}/queryFeeAccountById',
    aliPay : '/api/v1/fee/{businessId}/aliPay',
    offlinePay : '/api/v1/fee/{businessId}/offlinePay',
    consumeQueryDesc :'/api/v1/fee/{businessId}/consumeQueryDesc',
    queryOrderList : '/api/v1/fee/{businessId}/queryOrderList'
  },
  outbound : {
    searchTasksDto : '/api/v1/outbound/{businessId}/searchTasksDto',
    uploadExcel : '/api/v1/outbound/{businessId}/uploadExcel',
    searchRobotVoice : '/api/v1/outbound/{businessId}/searchRobotVoice',
    searchHistoryTask:'/api/v1/outbound/{businessId}/searchHistoryTask',
    download:'/api/v1/outbound/{businessId}/download',
    manageRobotTask : '/api/v1/outbound/{businessId}/manageRobotTask',
    createTaskWithFile : '/api/v1/outbound/taskmanage/{businessId}/createTaskWithFile',
    modifyTask : '/api/v1/outbound/taskmanage/{businessId}/modifyTask',
    pauseTask : '/api/v1/outbound/taskmanage/{businessId}/pauseTask',
    runTask : '/api/v1/outbound/taskmanage/{businessId}/runTask',
    deleteTask : '/api/v1/outbound/taskmanage/{businessId}/deleteTask',
    searchSpeaker : '/api/v1/outbound/taskmanage/{businessId}/searchSpeaker',
    searchTel : '/api/v1/outbound/taskmanage/{businessId}/searchTel',
    searchTaskList : '/api/v1/outbound/taskquery/{businessId}/searchTaskList',
    searchHistoryTaskList : '/api/v1/outbound/taskquery/{businessId}/searchHistoryTaskList',
    createTaskDataWithKeyValue : '/api/v1/outbound/{businessId}/createTaskDataWithKeyValue'
  },
  outboundManage : {
    searchTaskList : '/api/v1/outbound/taskquery/{businessId}/searchTaskList',
    pauseTask : '/api/v1/outbound/taskmanage/{businessId}/pauseTask',
    runTask : '/api/v1/outbound/taskmanage/{businessId}/runTask',
    deleteTask : '/api/v1/outbound/taskmanage/{businessId}/deleteTask',
    searchSpeaker : '/api/v1/outbound/resource/{businessId}/searchSpeaker',
    uploadTaskFile : '/api/v1/outbound/taskmanage/{businessId}/uploadTaskFile',
    createTaskWithFile : '/api/v1/outbound/taskmanage/{businessId}/createTaskWithFile',
    modifyTask : '/api/v1/outbound/taskmanage/{businessId}/modifyTask',
    searchTel : '/api/v1/outbound/resource/{businessId}/searchTel',
    searchHistoryTaskList : '/api/v1/outbound/taskquery/{businessId}/searchHistoryTaskList',        
    addLongTermTaskData : '/api/v1/outbound/taskmanage/{businessId}/addLongTermTaskData',
    searchCallResultList : '/api/v1/outbound/taskquery/searchCallResultList'
  },
  yungoApi : {
    login : '/api/v1/account/login',
    logout : '/api/v1/account/logout',
    createVerifyImage :'/api/v1/account/createVerifyImage',
    createVerifyImage__register : '/api/v1/register/createImgVerifyCode',
    updatePassword : '/api/v1/account/updatePassword',
    uploadHeadPhoto : '/api/v1/account/{businessId}/uploadHeadPhoto',
    phoneCheck : '/api/v1/account/phoneCheck',
    sendSmsVerifyCode : '/api/v1/register/sendSmsVerifyCode',
    register : '/api/v1/register/register',
    resetPassword : '/api/v1/account/resetPassword',
    sendResetSmsVerifyCode : '/api/v1/account/sendResetSmsVerifyCode',
    querySmsTemplateByPager :'/api/v1/smsTemplate/{businessId}/querySmsTemplateByPager',
  },
  yungoAbp : {
    querySmsTemplateByPager :'/api/v1/smsTemplate/{businessId}/querySmsTemplateByPager',
    sendIdentifyCode:'/api/v1/newsms/0/sendIdentifyCode',
    checkIdentifyCode:'/api/v1/newsms/0/checkIdentifyCode'
  },
  yungoOss : {
    upload : '/oss/upload'
  },
  brainkb : {
    queryDicList : '/api/v1/dic/{businessId}/query/list',
    addDict : '/api/v1/dic/{businessId}/add',
    delDict : '/api/v1/dic/{businessId}/deletedic',
    addSingle :'/api/v1/dic/term/{businessId}/add/single',
    exportDic : '/api/v1/dic/{businessId}/flush/exportDic',
    queryDicDetail : '/api/v1/dic/{businessId}/query/detail',
    queryByterm : '/api/v1/dic/term/{businessId}/query/byterm',
    delDicbyids : '/api/v1/dic/term/{businessId}/delete/byids',
    addTask : '/api/v1/dic/{businessId}/flush/addtask',
    queryDetail : '/api/v1/dic/term/{businessId}/query/detail',
    addBatch : '/api/v1/dic/term/{businessId}/add/batch',
    queryTask : '/api/v1/task/{businessId}/query',
    exportKnow : '/api/v1/dic/template/{businessId}/query',
    queryKnowList : '/api/v1/knowledge/{businessId}/query/list',
    addKnow : '/api/v1/knowledge/{businessId}/add',
    deleteKnowledgeByIds : '/api/v1/knowledge/{businessId}/deleteKnowledgeByIds',
    analyze : '/api/v1/search/{businessId}/analyze',
    queryByOr : '/api/v1/search/{businessId}/or',
    queryQuestionList : '/api/v1/knowledge/question/{businessId}/query/list',
    deleteQuestionByIds : '/api/v1/knowledge/question/{businessId}/delete/byids',
    refresh : '/api/v1/knowledge/{businessId}/flush/addtask',
    adddicrelation : '/api/v1/knowledge/{businessId}/adddicrelation',
    queryTags : '/api/v1/knowledge/{businessId}/kbtag/query',
    addTag : '/api/v1/knowledge/{businessId}/kbtag/add',
    addSingleQuestion : '/api/v1/knowledge/question/{businessId}/add/single',
    exportKbQuestion : '/api/v1/knowledge/{businessId}/exportKbQuestion',
    exportTemplate : '/api/v1/knowledge/template/{businessId}/query',
    batchtask : '/api/v1/knowledge/question/{businessId}/add/batchtask',
    recordFill :'/api/v1/knowledge/answer/{businessId}/recordfile/add',
    questionDetail :'/api/v1/knowledge/question/{businessId}/query/detail',
    editSingleQuestion : '/api/v1/knowledge/question/{businessId}/edit/single',
    recordfileDelete : '/api/v1/knowledge/answer/{businessId}/recordfile/delete',
    querylistByBus : '/api/v1/knowledge/{businessId}/querylistByBus',
    kbtagQuery:'/api/v1/knowledge/{businessId}/kbtag/query',
    commitKbToReview:'/api/v1/knowledge/{businessId}/commitKbToReview',
    //
    queryModelList : '/api/v1/regular/group/{businessId}/query',
    addModel : '/api/v1/regular/group/{businessId}/add',
    delModel : '/api/v1/regular/group/{businessId}/delete',
    queryRuleList : '/api/v1/regular/{businessId}/query',
    addRule : '/api/v1/regular/{businessId}/add',
    delRule : '/api/v1/regular/{businessId}/delete',
    queryRuleTypes : '/api/v1/regular/type/{businessId}/query',
    addRuleType : '/api/v1/regular/type/{businessId}/add'
  },
  taichiDataApi:{
    // indexStatistics:'/api/v1/outbound/{businessId}/indexStatistics',
    indexStatistics:'/api/v1/eventSession/{businessId}/indexStatistics',
    taskStatistics:'/api/v1/outbound/{businessId}/taskStatistics',
    queryTaskDataReport:'/api/v1/outbound/{businessId}/queryTaskDataReport',
    queryTaskFeeStatistics : '/api/v1/fee/{businessId}/queryTaskFeeStatistics',
    queryTaskFeeDetail : '/api/v1/fee/{businessId}/queryTaskFeeDetail',
    historyStatistics:'/api/v1/outbound/{businessId}/historyStatistics',
    transferCount : '/api/v1/session/{businessId}/transferCount',
    queryFeeTotalStatistics:'/api/v1/fee/{businessId}/queryFeeTotalStatistics',
    queryCallReport: '/api/v1/eventSession/{businessId}/queryCallReport'
  },
  downloadCenterApi:{
    queryDownloadTask:'/api/v1/task/{businessId}/queryDownloadTask',
    addDownloadTask:'/api/v1/task/{businessId}/addDownloadTask',
    deleteDownloadTask:'/api/v1/task/{businessId}/deleteDownloadTask'
  },
  downloadCenterRecord:{
    addDownloadTask:'/api/v1/task/{businessId}/addDownloadTask'
  },
  speechSkill : {
    saveIntention : '/api/v1/intentionKbMap/{businessId}/save',
    queryIntention : '/api/v1/intentionKbMap/{businessId}/query'
  },
  openapiAdmin : {
    saveLine : '/api/v1/{businessId}/line/saveLine',
    selectLine : '/api/v1/{businessId}/line/selectLine',
    updateLine : '/api/v1/{businessId}/line/updateLine',
    deleteLine : '/api/v1/{businessId}/line/deleteLine',
    queryGateways : '/api/v1/{businessId}/line/queryGateways',

    managePushAddress : '/api/v1/{businessId}/push/managePushAddress',
    queryPushAddress : '/api/v1/{businessId}/push/queryPushAddress',
    deletePushAddress : '/api/v1/{businessId}/push/deletePushAddress',
    queryAppList : '/api/v1/{businessId}/app/queryAppList',
    queryTags : '/api/v1/{businessId}/app/queryTags',
    createAppKey : '/api/v1/{businessId}/app/createAppKey',
    queryApp : '/api/v1/{businessId}/app/queryApp'
  },
  openapi : {
      token : '/oauth/v1/token',
      queryConfig : '/config/v1/query?token=',
      callout : '/outbound/v1/task/callout?token='
  },
  uc:{
    queryAccountInfo : '/api/v1/account/{businessId}/queryAccountInfo',
    queryMember:'/api/v1/user/{businessId}/queryUserList',//已变crm
    deleteMember:'/api/v1/user/{businessId}/deleteUser',//已变crm
    addMember:'/api/v1/user/{businessId}/addUser',//已变crm
    updateMember:'/api/v1/user/{businessId}/updateUser',//已变crm
    queryMemberInfo:'/api/v1/user/{businessId}/queryUserInfo',//已变crm
    unbindWeixinMp:'/api/v1/user/{businessId}/unbindWeixinMp',//已变crm
    login:'/api/v1/account/login',//未变crm
    createImgCode:'/api/v1/account/createImgCode',//未变crm
    updatePassword : '/api/v1/account/{businessId}/updatePassword',//未变crm
    uploadHeadPhoto : '/api/v1/account/{businessId}/uploadHeadPhoto',//未变crm
    sendResetSmsCode : '/api/v1/account/sendResetSmsCode',//未变crm
    resetPassword : '/api/v1/account/resetPassword',//未变crm

    speechSkillAdminLogin : '/api/v1/account/speechSkillAdminLogin',//已变yunguoApi
    createVerifyImage__register : '/api/v1/register/createImgVerifyCode',//未变yunguoApi
    phoneCheck : '/api/v1/account/phoneCheck',//未变yunguoApi
    sendSmsVerifyCode : '/api/v1/register/sendSmsVerifyCode',//未变yunguoApi
    register : '/api/v1/register/register',//未变yunguoApi
    logout : '/api/v1/account/logout'
  },
  kylin:{
    queryRealTimeData:'/api/v1/monitor/{businessId}/queryRealTimeData',
    queryRealTimeCallDetail:'/api/v1/monitor/{businessId}/queryRealTimeCallDetail',
    updateTrace:'/api/v1/monitor/{businessId}/updateTrace',
    queryCustomerInfo:'/api/v1/monitor/{businessId}/queryCustomerInfo',
    takeControl:'/api/v1/monitor/{businessId}/takeControl',
    monitorDialog:'/api/v1/monitor/{businessId}/monitorDialog',
    config:'/api/v1/monitor/{businessId}/config',
    queryConfig:'/api/v1/monitor/{businessId}/queryConfig',
    queryKbOr : '/api/v1/monitor/{businessId}/queryKbOr',
    judgeContent : '/api/v1/monitor/{businessId}/judgeContent'
  },
  kxjlAc:{
    acdQuery:'/api/v1/{businessId}/manage/acd/query',//ACD配置查询
    acdCreate:'/api/v1/{businessId}/manage/acd/create',//ACD配置添加
    acdUpdate:'/api/v1/{businessId}/manage/acd/update',//ACD配置修改
    acdDelete:'/api/v1/{businessId}/manage/acd/delete',//ACD配置删除
    queryAgentsAcdsByPage:'/api/v1/{businessId}/manage/acd-agent/queryAgentsAcdsByPage',//查询用户关联的坐席及其所在坐席组信息
    queryByAgentId:'/api/v1/{businessId}/uc/agent/queryByAgentId',//查询单个坐席关联的组、用户、坐席信息
    agentCreate:'/api/v1/{businessId}/uc/agent/create',//添加用户和坐席
    agentUpdate:'/api/v1/{businessId}/uc/agent/update',//编辑用户和坐席
    agentDelete:'/api/v1/{businessId}/uc/agent/delete'//删除用户和坐席
  }
}


export default Config;
