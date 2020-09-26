/*
* 用户信息
*/
const state = {
  //菜单是否展开
  isCollapse : false,
  business : {
  	 id : '',
  	 name : '',
  	 status : null,
  	 lack : null
  },
  id : '',
  surname : '',
  dnCode : '',
  token : '',
  account : '',
  photo : '',
  bindStatus:1,
  downQueue : 0,
  //在线预览
  calling : false,
  //推送结果
  receive :{
  	callout : {
  		dialog : '',
  		voice : '',
  		callRecord : ''
  	},
  	callin : {
  		dialog : '',
  		voice : '',
  		callRecord : ''
  	}
  }
}

// getters
const getters = {}

// actions
const actions = {
	setReceive ({commit,state},data){
		commit('RECEIVE',data);
	},
	setPreviewStatus ({ commit, state },calling) {
		commit('PREVIEWSTATUS',calling);
	},
	collapse ({ commit, state }){
		commit('COLLAPSE')
	},
	modifyBusiness ({commit,state},data){
		commit('modifyBusiness',data)
		//同步至sessionStorage
		let userObj = JSON.parse(sessionStorage.getItem('__user'));
		for(let key in data){
			userObj.business[key] = data[key];
		}
   		sessionStorage.setItem('__user',JSON.stringify(userObj));
	},
	modifyUserPhoto ({commit,state},photo){
		commit('MODIFY_PHOTO',photo)
		//同步至sessionStorage
		let userObj = JSON.parse(sessionStorage.getItem('__user'));
		userObj.photo = photo;
        sessionStorage.setItem('__user',JSON.stringify(userObj));
	},
	modifyBindState:function({commit,state},bindStatus){
	    commit('MODIFYBINDSTATE',bindStatus);
	    let userObj = JSON.parse(sessionStorage.getItem('__user'));
	    userObj.bindStatus = bindStatus;
	    sessionStorage.setItem('__user',JSON.stringify(userObj));
	},
	modifySurName : function({commit,state},surname){
		commit('MODIFY_SURNAME',surname);
	    let userObj = JSON.parse(sessionStorage.getItem('__user'));
	    userObj.surname = surname;
	    sessionStorage.setItem('__user',JSON.stringify(userObj));
	},
	setUserInfo : function({commit,state}){
		commit('INIT',JSON.parse(sessionStorage.getItem('__user')));
	},
	addDownTask : function({commit,state},data){
		commit('DOWN');
	}
}
// mutations
const mutations = {
	RECEIVE : function(state,receive){
		let type = receive.type,
			data = receive.data;
		if(data == null){
			state.receive[type].dialog = '';
			state.receive[type].voice = '';
			state.receive[type].callRecord = '';
		}else{
			state.receive[type][data.type] = data.content;
		}
	},
	COLLAPSE : function(state){
		state.isCollapse = !state.isCollapse
	},
	INIT : function(state,user){
		state.token = user.token;
		state.dnCode = user.dnCode;
		state.business.id = user.business.id;
		state.business.name = user.business.name;
		state.account = user.account;
    	state.bindStatus=user.bindStatus;
		state.photo = user.photo;
		state.id = user.id;
		state.surname = user.surname;
		state.master = user.master;
	},
	modifyBusiness : function(state,data){
		for(let key in data){
			state.business[key] = data[key];
		}
	},
  	MODIFYBINDSTATE:function(state,data){
    	state.bindStatus = data
  	},
	MODIFY_PHOTO : function(state,photo){
		state.photo = photo;
	},
	MODIFY_SURNAME : function(state,surname){
		state.surname = surname;
	},
	DOWN : function(state){
		state.downQueue++;
	},
	PREVIEWSTATUS : function(state,calling){
		state.calling = calling;
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}