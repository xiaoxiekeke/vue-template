import axios from 'axios'
import Qs from 'qs'
import {kerror,extend} from './utils.js'

const AxiosConfig = {
	timeout: 20000,
	withCredentials: false
}
//权限认证错误码
const AuthorizeCode = ["709001","709002","709003","709004","709005","709006"];

const Ajax = {
	instance : new Vue(),
	before : function(url){
		if(url.indexOf('{businessId}') >0 && sessionStorage.getItem('__user') == null){
			this.instance.$alert('长时间未操作，请重新登录', '登录失效', {
        confirmButtonText: '确定',
        callback: action => {
        	let bid = localStorage.getItem('__bid') || 'yeta';
      		location.hash = '/'+bid+'/login'
        }
      });
			return false;
		}
		return true;
	},
	auth : function(resp){
		if(!resp.data || !resp.data.code ){
			return true;
		}
		if(AuthorizeCode.indexOf(resp.data.code + '') >= 0){
			this.instance.$alert('长时间未操作，请重新登录', '登录失效', {
        confirmButtonText: '确定',
        callback: action => {
        	let bid = localStorage.getItem('__bid') || 'yeta';
      		location.hash = '/'+bid+'/login'
        }
      });
      return false;
		}
		return true;
	},
	addCache : function(key,fn){
		return new Promise(function(resolve,reject){
			let val = sessionStorage.getItem(key);
			if(val){
				resolve && resolve(JSON.parse(val));
			}else if(fn){
				fn().then(resp => {
					sessionStorage.setItem(key,JSON.stringify(resp));
					resolve && resolve(resp);
				});
			}
		});
	}
}


Ajax.post = function(url,param,config){
	if(!Ajax.before(url)){
		return;
	}
	config = extend({},AxiosConfig,config);
	return new Promise(function(resolve,reject){
		axios.post(url,param,config).then(function(resp){
			if(Ajax.auth(resp) === true){
				resolve && resolve(resp.data);
			}
		}).catch(function(error){
		    kerror('Request Error',{url : url,param : param});
		    reject(error)
		});
	});	
}

Ajax.formPost = function (url, param, config) {
	if(!Ajax.before(url)){
		return;
	}
	config = extend({}, AxiosConfig, config);
	var data = Qs.stringify(param);
	return new Promise(function (resolve, reject) {
		axios.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'blob' }).then((resp) => {
			if(Ajax.auth(resp) === true){
				resolve && resolve(resp.data);
			}
		}).catch(function (error) {
			reject(kerror('Request Error', { url: url, param: param }));
		});
	});
}

Ajax.formDataPost = function(url,formData){
	if(!Ajax.before(url)){
		return;
	}
	let config = extend({},AxiosConfig,{headers:{'Content-Type':'multipart/form-data'} });
	return new Promise(function(resolve,reject){
		axios.post(url,formData,config).then(function(resp){
			if(Ajax.auth(resp) === true){
				resolve && resolve(resp.data);
			}	
		}).catch(function(error){
		    kerror('Request Error',{url : url});
		    reject && reject();	
		});
	});	
}


Ajax.get = function(url,param,config){
	if(!Ajax.before(url)){
		return;
	}
	config = extend({},AxiosConfig,config);
	return new Promise(function(resolve,reject){
		axios.get(url,{params:param},config).then(function(resp){
			if(Ajax.auth(resp) === true){
				resolve && resolve(resp.data);
			}	
		}).catch(function(error){
		    kerror('Request Error',{url : url,param : param});
		    reject && reject();	
		});
	});	
}


export default Ajax;