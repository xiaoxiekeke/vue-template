// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import moment from 'vue-moment'
import lodash from 'lodash'
import VueCookies from 'vue-cookies'

import App from './App'
import global from '@/api/global.js'
import config from '@/api/config.js'
import phone from '@/api/phone.js'

import KxjlCommon from 'kxjl-common';
import 'kxjl-common/dist/kxjl.common.min.css'

import {queryAccountInfo} from '@/api/uc.js'

Vue.config.productionTip = false

Vue.prototype.$global = global;
Vue.prototype.$config = config;
Vue.prototype.$lodash = lodash;
Vue.prototype.$phone = new phone();

Vue.use(moment)
Vue.use(VueCookies);
Vue.use(KxjlCommon);

router.beforeEach((to, from, next) => {
  if(to.meta.requireAuth && sessionStorage.getItem('__user') == null){
		let token = to.query.token,
			businessId = to.query.bid,
			sign = localStorage.getItem('__bid') || 'yeta';
		if(businessId && token){
			queryAccountInfo(null,businessId,token).then(resp => {
				const data = lodash.get(resp,'result.rows[0]',null);
				if(resp.code == 0 && data){
					let userObj = {
						account : lodash.get(data,'user.phone',''),
						id : lodash.get(data,'user.id',''),
						surname : lodash.get(data,'user.surname',''),
						photo : lodash.get(data,'user.headPhoto',''),
						bindStatus : lodash.get(data,'user.bindStatus',''),
						token : token,
						master : lodash.get(data,'user.master'),
						business : {
							id : businessId,
							name : lodash.get(data,'business.name','')
						},
						dn : lodash.get(data,'agent.dn','')
					}
				  sessionStorage.setItem('__user',JSON.stringify(userObj));
					next();
				}else{
					next({ path: '/'+sign+'/login',query: {redirect: to.fullPath} });
				}
			});
		}else{
			next({ path: '/'+sign+'/login',query: {redirect: to.fullPath} });
		}
  }else{
    next()
  }
});

global.initConfig().then(function(){
	new Vue({
	  el: '#app',
	  store,
	  router,
	  components: { App },
	  template: '<App/>'
	});
});

