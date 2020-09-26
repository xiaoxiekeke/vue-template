<template>
	<div>
	</div>
</template>

<script>
	import {loadScript,kinfo} from '@/api/utils.js'
	import { Base64 } from 'js-base64';

	export default {
		props : ['account','data'],
		data : function(){
			return {
				audio : null,
				ua : null,
				session : null,
				//
				fsConfig : null,
				state : '',
				sessionState : ''
			}
		},
		watch : {
			state : function(val,oldVal){
				console.log('state:'+val)
			},
			sessionState : function(val,oldVal){
				console.log('sessionState:'+val)
			}
		},
		methods : {
			init : function(){
				let _this = this;
			    this.audio = document.createElement("AUDIO");
			    this.audio.setAttribute("autoplay", "autoplay");
			    //
			    this.fsConfig = this.$global.getConfig('fsConfig');
			    if(!this.fsConfig){
			    	return;
			    }
			    let socket = new JsSIP.WebSocketInterface('wss://'+this.fsConfig.socketURL),
				    configuration = {
				        sockets:[socket],
				        uri:"sip:"+this.account+this.fsConfig.sipURI,
				        authorization_user:undefined,
				        display_name:this.account,
				        password:this.account,
				        register:false
				    };
				this.socket = socket;
			    this.ua = new JsSIP.UA(configuration);
			    //add event
			    this.ua.on('connecting',function(ev){
			        _this.state = 'connecting';
			    });
			    _this.ua.on('connected',function(ev){
			        _this.state = 'connected';
			    });
			    _this.ua.on('disconnected',function(ev){
			        _this.state = 'disconnected';
			    });
			    _this.ua.on('registered',function(ev){
			        _this.state = 'registered';
			        _this.$emit('change','registered',ev);
			    });
			    _this.ua.on('unregistered',function(ev){
			        _this.state = 'unregistered';
			      	_this.$emit('change','unregistered',ev);
			    });
			    _this.ua.on('registrationFailed',function(ev){
			        _this.state = 'registrationFailed';
			        setTimeout(()=>{_this.register()},1000);
			        _this.$emit('change','registrationFailed',ev);
			    });
			    _this.ua.on('registrationExpiring',function(ev){
			        _this.state = 'registrationExpiring';
			    });
			    _this.ua.on('newRTCSession',function(ev){
			    	_this.state = 'newRTCSession';
			      	//主叫会话
		            if (ev.originator == 'local') {
		            	_this.$emit('change','newRTCSession',ev);
				        setTimeout(function() {
				            var evt = document.createEvent('Event');
				            evt.initEvent('icecandidate', false, false);
				            ev.session.connection.dispatchEvent(evt);
				        }, 1500);
		                return;
		            }
			    });
			    _this.ua.on('newMessage',function(ev){
			       
			    });
			    _this.ua.start();
			    setTimeout(() => {this.register()},1000);
			},
			callout : function(){
				if(!this.ua || !this.ua.isRegistered()){
					return;
				}
				var options = {
		            'mediaConstraints' : { 'audio': true,'video':false},
		            'pcConfig': {
		                iceServers: [
		                    {urls:this.fsConfig.iceURL}
		                ]
		            },
		            sessionTimersExpires: 1800,
		            no_answer_timeout:180,
		            register_expires:1800,
		            mediaStream:null,
		           	extraHeaders : [
		            	"X-business-id:"+this.data.business_id,
		            	"X-app-id:"+this.data.app_id,
		            	"X-robot-id:"+this.data.robot_id,
		            	"X-call-relation-id:"+this.data.call_relation_id
		            ]
		           /* extraHeaders:["X-businessid:150",
		                "X-skillid:9703",
		                "X-user:"+Base64.encode(JSON.stringify({'姓名':'徐日良'})),
		                "X-vid:62140"
		            ]*/
		        };
		        this.session = this.ua.call(this.fsConfig.expURI, options);
		        this.initCall();
			},
			release : function(){
				if(this.session){
					this.session.terminate({ status_code: 603, reason_phrase: 'Decline' });
				}
				this.destroyCall();
			},
			register : function(){
			    if(this.ua && this.ua.isRegistered())
			        return;
			    if(this.ua.isConnected()){
			        this.ua.register();
			    }
			},
			unRegister : function(){
				if(this.ua && this.ua.isRegistered()){
			        this.ua.unregister();
			    }
			},
			destroyCall : function(){
				
			},
			initCall : function(){
				var _this = this,
					session = this.session,
					connection = session ? session.connection : null;
				if(!session){
					return;
				}

			    session.on('progress',function(s_ev){
			       	_this.sessionState = 'progress';
			    });
			    session.on('failed',function(s_ev){
			    	_this.sessionState = 'failed';
			    	_this.$emit('change','failed',s_ev);
			        _this.destroyCall();
			    });
			    session.on('ended',function(s_ev){
			    	_this.sessionState = 'ended';
			    	_this.$emit('change','ended',s_ev);
			        _this.destroyCall();
			    });
			    session.on('accepted',function(s_ev){
			       	_this.sessionState = 'accepted';
			    });
			    session.on('confirmed',function(s_ev){
			       	_this.sessionState = 'confirmed';
			    });
			    session.on('sdp',function(s_ev){
			        _this.sessionState = 'sdp';
			       // flow_preview.InternalCheckBandwidth(ev);
		          /*  if (ev.type == 'answer') {
		               // flow_preview.InternalEnableAudioTrack();
		            }*/
			    });

			    let callid = session.id;
			    if (!callid) {
			        session.terminate({ status_code: 603, reason_phrase: 'Decline' });
			        return null;
			    }
			   if (connection) {
			        connection.onaddstream = function(ev){   
					    let remoteStreams = connection.getRemoteStreams();
					    if (remoteStreams.length > 0) {
					       // _this.audio.src = window.URL.createObjectURL(remoteStreams[0]);
					        _this.audio.srcObject = remoteStreams[0]
					    }
			        };
			        connection.onremovestream = function(ev){
			            this.audio.src = '';
			        };
			    }
			    session.bufferedInvite = null;
			}
		},
		beforeDestroy : function(){
			try{
				this.release();
				this.session = null;
				this.audio = null;
				this.fsConfig = null;
				if(this.ua){
					this.ua.stop();
					this.unRegister();
					this.ua = null;
				}
				if(this.socket){
					this.socket.disconnect();
					this.socket = null;
				}
				
			}catch(e){

			}
		},
		mounted : function() {
			loadScript('static/kcdn/jssip/3.0.8/jssip-3.0.8.js').then(() => {
            	this.init();
            });
		}
	}	
</script>