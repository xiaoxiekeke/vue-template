import config from './config.js'
import ajax from './ajax.js'
import {kerror,getUUID} from './utils.js'
import {getConfig,getVersion} from '@/api/jsondata.js'
import {queryBusinessConfig} from '@/api/bm.js'


const Global = {
	config : null,
	//初始化配置
	initConfig : function () {
		var _this = this;
		return getConfig().then( data => {
			this.config = data;
		},() => { kerror('config parse error');});
	},
	getClientId : function () {
		let clientId = localStorage.getItem('__clientId');
		if(clientId){
			return clientId;
		}
		clientId = getUUID();
		localStorage.setItem('__clientId',clientId);
		return clientId;
	},
	getBusinessId : function(){
		let user = sessionStorage.getItem('__user');
		if(!user){
			return '';
		}
		let userObj = JSON.parse(user);
		return userObj.business ? userObj.business.id : '';
	},
	getUserInfo : function(path){
		let user = sessionStorage.getItem('__user');
		if(!user){
			return '';
		}
		if(!path){
			return JSON.parse(user);
		}
		let obj = JSON.parse(user);
		path = path.split('.');

	  let index = 0
	  const length = path.length

	  while (obj != null && index < length) {
	    obj = obj[path[index++]]
	  }
	  return (index && index == length) ? obj : ''
	},
	getVersionInfo : function(account,bid){
		return new Promise((resolve,reject) => {
			let url = '',defaultUrl = '';
			getVersion().then((resp) => {
      	let vConf = resp,
      		vMap = resp.version;
      	defaultUrl = vConf.default;
      	for(let key in vMap){
      		if(vMap[key].account.indexOf(account) >= 0 || 
      			vMap[key].bid.indexOf(bid) >= 0){
      			url = key;
      			break;
      		}
      	}
      	url = url || defaultUrl;
      	resolve && resolve(url)
      });
		});
	},
	destroyData : function(){
		sessionStorage.removeItem('__user');
		sessionStorage.removeItem('__callresult');
		sessionStorage.removeItem('__labelList');
		sessionStorage.removeItem('__tasklist');
		sessionStorage.removeItem('__p');
		sessionStorage.removeItem('__rule_template');
	},
	getPermission : function(key){
		return ajax.addCache('__p',() => {
			return new Promise(function(resolve,reject){
				queryBusinessConfig().then(resp => {
					let rows = resp && resp.result ? (resp.result.rows || []) : [];
					let p = JSON.parse(JSON.stringify(config.permission));
					rows.forEach(item => {
						let key = item.key,val = item.value;
						if(key == '__menu' || key == '__fun' || key == '__agent'){
							Object.assign(p[key],val ? JSON.parse(val) : {} )
						}
					})
					resolve && resolve(p);
				})
			});
		});
	},
	checkPermission : function(key){
		return new Promise((resolve,reject) => {
			this.getPermission().then(resp => {
				let obj = null;
				key.split('.').every((item,index) => { obj = index == 0 ? resp[item] : obj[item]; return obj != null });
				resolve && resolve(obj == null ? false : obj);
			});
		})
	},
	/*
	* 获取配置文件里的值
	*/
	getConfig : function(key){
		return this.config ? this.config[key] : '';
	},
	/*
	* 获取静态资源文件路径
	*/
	getStaticFileUrl : function(url){
		if(!url){
			return '';
		}
		if(!this.config || url.startsWith('http')){
			return url;
		}
		let staticUrl = this.config.staticUrl;
		if(staticUrl.endsWith('/')){
			staticUrl.substring(0,staticUrl.lastIndexOf('/'));
		}
		if(!url.startsWith('/')){
			url = '/' +url;
		}
		return staticUrl + url;
	},
	getFlowUrl : function(hash){
		let flowUrl = this.config.flowUrl,
			userInfo = sessionStorage.getItem('__user'),
			userObj = userInfo ? JSON.parse(userInfo) : null,
			businessId = userObj && userObj.business ? userObj.business.id : '',
			token = userObj ? userObj.token : '';
		if(flowUrl.endsWith('/')){
			flowUrl.substring(0,staticUrl.lastIndexOf('/'));
		}
		flowUrl += '/#'+hash+'?token='+token+'&bid='+businessId;
		return flowUrl;
	},
	/*
	* 获取录音资源文件路径
	*/
	getVoiceFileUrl: function (url) {
		if(!url){
			return '';
		}
		if (!this.config || url.startsWith('http')) {
			return url;
		}
		let voiceUrl = this.config.voiceUrl;
		if (voiceUrl.endsWith('/')) {
			voiceUrl.substring(0, voiceUrl.lastIndexOf('/'));
		}
		if (!url.startsWith('/')) {
			url = '/' + url;
		}
		return voiceUrl + url;
	},
	/*
	* 获取下载中心URL
	*/
	getDownCenterUrl : function(url){
		if(!url){
			return '';
		}
		if (!this.config || url.startsWith('http')) {
			return url;
		}
		let downUrl = this.config.downUrl;
		if (downUrl.endsWith('/')) {
			downUrl.substring(0, downUrl.lastIndexOf('/'));
		}
		if (!url.startsWith('/')) {
			url = '/' + url;
		}
		return downUrl + url;
	},
	/*
	* 获取接口地址
	* context 模块上下文
	* url 接口地址
	*/
	getRequestUrl : function(context,apiUrl,bid){
		let url = '',
			interfaceUrl = this.config ? this.config.interfaceUrl : null,
			userInfo = sessionStorage.getItem('__user'),
			userObj = userInfo ? JSON.parse(userInfo) : null,
			businessId = userObj && userObj.business ? userObj.business.id : '{businessId}',
			token = userObj ? userObj.token : '',
			serviceContext = this.config.service[context];
		if(interfaceUrl == null){
			kerror('config is null');
			return;
		}
		if(!interfaceUrl.startsWith('/')){
			interfaceUrl += '/';
		}
		url = interfaceUrl + serviceContext + apiUrl;
		url = url.replace(/{businessId}/,bid ? bid : businessId);
		url = url.replace(/{traceId}/,userObj ? userObj.account : '0000');
		url = url.replace(/\/\//g,'/');
		if(url.indexOf("token=") >= 0){
      return url;
    }
    if(url.indexOf("?") > 0){
        url += "&token="+token
    }else{
        url += "?token="+token;
    }
		return url;
	}
}

export default Global;

