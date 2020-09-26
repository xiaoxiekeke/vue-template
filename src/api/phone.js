
var Phone = function(){
	this.user = {};
	this.event = {};

	this.opened = false;
	/*
	* 初始化
	*/
	this.init = function(user){
		this.user = user;
		let _loadScript = function (url) {
			return new Promise((resolve,reject) => {
				let script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function(){
          resolve && resolve();
        }
        script.src = url;
        document.getElementsByTagName('body')[0].appendChild(script);
			});
		}
		Promise.all([
			_loadScript('static/websdk/plugins/jssip.js'),
			_loadScript('static/websdk/plugins/crypto.js'),
			_loadScript('static/websdk/xiaoman-phone.js?t='+new Date().getTime())
		]).then(() => {
			xiaoman.phone.event.onMessage((res) => {
				if(res.msgType == 'EventOpened'){
					this.opened = true;
				}
				this.emit('message',res)
	    })
	    xiaoman.base.loginWithUser({
	    	user : this.user,
	      success:(res) => {
	      	xiaoman.phone.open({
		        success: (res) => {
		           
		        },
		        fail: (res) => {
	           	console.error(JSON.stringify(res))
		        }
		      })
	      },
	      fail: (res) => {
	        console.error(JSON.stringify(res))
	      }
	    });
		})
	}

	/*
	* 销毁
	*/
	this.destory = function(){
		this.event = {};
		if(!this.opened){
			return;
		}
		try{
			xiaoman.phone.close();
		}catch(e){

		}
	}

	/*
	* 挂断电话
	*/
	this.handup = function(){
		try{
			xiaoman.phone.release();
		}catch(e){
			
		}
	}

	/*
	* 事件
	*/
	this.on = function(key,fn){
		this.event[key] = this.event[key] || [];
		this.event[key].push(fn);
		//this.event[key] = [fn];
	}

	this.emit = function (type) {
		let args = [].slice.call(arguments,1);
		(this.event[type] || []).forEach( fn => {
			fn && fn(...args)
		});
	}
	/*
	* 电话功能是否开启
	*/
	this.isOpen = function(){
		return this.opened;
	}

}



export default Phone;