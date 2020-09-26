<template>
	<div></div>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import {loadScript,kinfo,getUUID} from '@/api/utils.js'

	export default {
		data : function () {
			return {
				timer : null,
				config : {
					server : ''
				},
				imAccount : '',
				connection : null,
				stateMapping : ["ERROR", "CONNECTING", "CONNFAIL", "AUTHENTICATING", "AUTHFAIL", "CONNECTED", "DISCONNECTED", "DISCONNECTING", "ATTACHED", "REDIRECT", "CONNTIMEOUT"]
			}
		},
		computed : {
		 	...mapState('user',[
        'account'
      ])
		},
		methods : {
			...mapActions('user',[
        'modifyBindState'
      ]),
			init : function(){
				this.connect();
				setTimeout(() => { this.startReconnect() },8000);
			},
			connect : function(){
				var _this = this,
					serverUrl = this.config.server,
					imAccount = this.imAccount;
				if(!serverUrl){
					kinfo('serverUrl is null');
					return;
				}
		    this.connection = new Strophe.Connection(serverUrl, null, false);
		    this.connection.connect(imAccount,imAccount,function(status){
	        kinfo("connect status :" +_this.stateMapping[status]);
	        if(status == Strophe.Status.CONNECTED){
            _this.connection.addHandler(function(msg){
            	_this.parseMessage(msg);
                return true;
            }, null, 'message', null, null, null);
	        }
		    });
			},
			startReconnect : function(){
				if(!this.connection.connected){
					kinfo('connection is disconnect,begin reconnect...')
					this.connect();
				}
				this.timer = setTimeout(() => { this.startReconnect() },8000);
			},
			parseMessage : function(msg){
				let body = '',
					messageType='';

		        try{
		        	messageType = msg.getElementsByTagName('messageType')[0].innerHTML;
		        	if (messageType=="bindStatusNotify") {
    		            body = msg.getElementsByTagName('messageBody')[0].innerHTML;
    		            body=JSON.parse(body)
    		            if (body.bindStatus==1) {
    		            	this.modifyBindState(1)
    		            }else if(body.bindStatus==0){
    		            	this.modifyBindState(0)
    		            }
		        	};
		            
		        }catch(e){
		        	msg.errmsg=e
		            body = null;
		        }
		        if(!body){
		        	kinfo('unknow message :'+msg.errmsg)
		        	return;
		        }
			}
		},
		beforeDestroy : function(){
			clearTimeout(this.timer);
		},
		mounted : function(){
			var imConfig = this.$global.getConfig('im'),
				serverUrl = imConfig ? imConfig.serverUrl : '';
			this.config.server = serverUrl;
			if(!this.config.server){
				return;
			}
			this.imAccount = this.account + '_msg_client@xiaomankf.com/'+getUUID().substring(0,8);
			let stropheUrl = 'static/kcdn/strophe/strophe.js';
		    loadScript(stropheUrl).then(() => {
		        this.init();
		    });
		}
	}

</script>