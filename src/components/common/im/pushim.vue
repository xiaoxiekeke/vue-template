<template>
	<div></div>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import {loadScript,kinfo,getUUID} from '@/api/utils.js'

	export default {
		props : ['phoneNum'],
		data : function () {
			return {
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
                'account',
                'receive'
            ])
		},
		watch : {
			phoneNum : function(val,oldVal){
				if(this.connection){
					this.connection.disconnect();
					this.connection = null;
				}
				this.imAccount = 'openapi_'+val + '@xiaomankf.com';
				this.init();
			}
		},
		methods : {
			...mapActions('user',[
                'setReceive'
            ]),
			init : function(){
				this.connect();
			    this.startReconnect();
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
				if(this.connection && !this.connection.connected){
					kinfo('connection is disconnect,begin reconnect...')
					this.connect();
				}
				setTimeout(() => { this.startReconnect() },8000);
			},
			parseMessage : function(msg){
				let body = '',
					bodyObj = {},
					type = '',
					messageType = '';
					console.log(msg)
		        try{
		        	messageType = msg.getElementsByTagName('messageType')[0].innerHTML;
		        	if(['receiveVoice','receiveDialog','receiveCallRecord'].indexOf(messageType) >= 0){
		        		body = msg.getElementsByTagName('messageBody')[0].innerHTML;
	            		bodyObj = JSON.parse(body);

	            		switch(messageType){
	            			case 'receiveCallRecord' : //话单
	            				type = bodyObj.direction == '1' ? 'callin' : 'callout';
	            				if(bodyObj.task_data_id){
	            					this.setReceive({"type" : type,"data" :{"type" : 'callRecord',content : body}});
		            			}else if(!this.receive[type].callRecord){
		            				this.setReceive({"type" : type,"data" :{"type" : 'callRecord',content : body}});
		            			}
		            			if(!bodyObj.time_answer){
			            			this.setReceive({"type" : type,"data" : {"type" : 'dialog',content : '{}' }});
			            			this.setReceive({"type" : type,"data" : {"type" : 'voice',content : '{}' }});
			            		}
	            				break;
	            			case 'receiveVoice' : //录音推送
	            				type = (!!bodyObj.task_data_id && bodyObj.task_data_id != '0') ? 'callout' : 'callin';
	            				this.setReceive({"type" : type,"data" : {"type" : 'voice',content : body}});
	            				break;
	            			case 'receiveDialog' : //会话推送
	            				type = (!!bodyObj.task_data_id && bodyObj.task_data_id != '0') ? 'callout' : 'callin';
	            				this.setReceive({"type" : type ,"data" : {"type" : 'dialog',content : body}});
	            				break;
	            		}
		        	}
		        }catch(e){
		        	msg.errmsg = e;
		            body = null;
		        }
		        if(!body){
		        	kinfo('unknow message :'+msg.errmsg)
		        	return;
		        }
			}
		},
		beforeDestroy : function(){
			if(this.connection){
				this.connection.disconnect();
				this.connection = null;
			}
		},
		mounted : function(){
			var imConfig = this.$global.getConfig('im'),
				serverUrl = imConfig ? imConfig.serverUrl : '';
			this.config.server = serverUrl;
			if(!this.config.server){
				return;
			}
			let account = this.phoneNum || this.account;
			this.imAccount = 'openapi_'+account + '@xiaomankf.com';
			let stropheUrl = 'static/kcdn/strophe/strophe.js';
		    loadScript(stropheUrl).then(() => {
		        this.init();
		    });
		}
	}

</script>