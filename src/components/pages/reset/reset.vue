<template>
	<div class="reset">
      	<div v-if="!issuccess" class="form">
		  	<div class="login__log" :style="logoStyle" ></div>
		 	<div class="title">密码重置</div>
		 	<div class="error" :style="{visibility: !!errorTxt ? 'visible' : 'hidden'}" >{{errorTxt}}</div>
		 	<div class="form-row">
		 		<el-input v-model.trim="phoneNum" @keyup.enter.native="reset" id="resetPhone" :autofocus="true" class="input-txt"  placeholder="请输入手机号码"></el-input>
		 	</div>
		 	<div class="form-row">
		 		<el-input v-model.trim="smsCode" @keyup.enter.native="reset"  id="resetSms" class="smscode" placeholder="请输入验证码"></el-input>
		 		<el-button v-if="!smsLoading" @click.stop="getSmsCode" class="smsbtn" type="primary">获取验证码</el-button>
		 		<el-button v-else type="info" class="smsbtn"  plain disabled>{{times}}后重试</el-button>
		 	</div>
		 	<div class="form-row">
		 		<el-input v-model.trim="password" @keyup.enter.native="reset" :type="pwdType" id="resetPwd" class="input-txt"  placeholder="请输入8-20位字母和数字组合密码">
		 			 <i v-if="pwdType=='password'" slot="suffix" class="icon-pwd--close" @click.stop="swithPwdType('text')"></i>
		 			 <i v-else slot="suffix" class="icon-pwd--open" @click.stop="swithPwdType('password')"></i>
		 		</el-input>
		 	</div>
		 	<div class="form-row">
		 		<el-button v-if="!resetLoading" @click.stop="reset" class="register__btn" type="primary">确定</el-button>
		 		<el-button v-else :loading="resetLoading" class="register__btn" disabled type="primary">确定</el-button>
		 	</div>
	 	</div>
	 	<div v-else class="form reset__success">
	 		<div class="logo"></div>
 			<div class="icon-success"></div>
 			<p class="success-txt">密码重置成功</p>
 			<p class="success-txt tip">您可以用新密码登陆</p>
 			<div class="cert__opt">
 				<div class="form-row">
 					<el-button @click.stop="toLogin" class="cert-btn" type="primary">立即登录</el-button>
 				</div>
 			</div>
	 	</div>
	    <div>
		    <div class="footer"> &copy;{{copyright}}</div>
		    <div class="bg" :style="bgStyle" ></div>
		</div>
  	</div>
</template>

<script>
	import CryptoJS from 'crypto-js'
	import {resetPassword,sendResetSmsCode} from '@/api/uc.js'
	import {validateRule} from '@/api/validate.js'

	export default {
		data : function(){
			return {
				errorTxt : '',
				phoneNum : '',
				smsCode : '',
				imgCode : '',
				password : '',
			    smsLoading : false,
			    resetLoading : false,
			    times : 60,
			    countTimer : null,
			    errorMap : {
			    	'330028' : '请输入有效的手机号',
			    	'330029' : '密码格式不正确',
			    	'330030' : '图片验证码错误',
			    	'330031' : '短信验证码错误',
			    	'330032' : '图片验证码已过期',
			    	'330033' : '短信验证码已过期',
			    	'50000' : '短信发送频繁'
			    },
			    pwdType : 'password',
			    issuccess : false,
			    logoUrl : '',
		        bgUrl : '',
		        bid : '',
		        copyright : '电话机器人'
			}
		},
		computed : {
		    bgStyle : function(){
		        return {
		          'background-image':  'url('+this.bgUrl+')'
		        }
		      },
		      logoStyle : function(){
		          return {
		            'background-image': 'url('+this.logoUrl+')'
		          }
		      }
	  	},
		methods : {
			validatePhoneNum : function(){
				if(this.phoneNum == ''){
					this.errorTxt = '请输入手机号码';
					document.getElementById('resetPhone').focus();
					return false;
				}
				if(!/^1\d{10}$/.test(this.phoneNum)){
					this.errorTxt = '手机号码格式不正确';
					document.getElementById('resetPhone').focus();
					return false;
				}
				return true;
			},
			validatePwd : function(){
				const result = validateRule(this.password,['require','password']);
				if(result == 0){
					this.errorTxt = '请输入密码';
					document.getElementById('resetPwd').focus();
					return false;
				}
				if(result == 1){
					this.errorTxt = '密码为8-20位，须含字母+数字（不含特殊符号）';
					document.getElementById('resetPwd').focus();
					return false;
				}
				return true;
			},
			validateForm : function(){
				if(!this.validatePhoneNum()){
					return false;
				}
				if(this.smsCode == ''){
					this.errorTxt = '请输入短信验证码';
					document.getElementById('resetSms').focus();
					return false;
				}
				if(!this.validatePwd()){
					return false;
				}
				return true;
			},
			reset : function(){
				var _this = this;
				if(!_this.validateForm()){
					return false;
				}
				var param = {
		            phone : _this.phoneNum,
		            smsCode : _this.smsCode,
		            password : _this.password
		        };
		        _this.resetLoading = true;
		        //

		        if(!!this.$global.getConfig('encrypt')){
			           let  timestamp = new Date().getTime(),
			                secKey =  'kxjl'+_this.phoneNum+timestamp;
			           let realKey = (function getKey(key) {
			                var realKey = CryptoJS.SHA1(key);
			                realKey = CryptoJS.SHA1(realKey).toString().substring(0, 32); 
			                return realKey;
			              })(secKey);
		          	let encrypt = CryptoJS.AES.encrypt(_this.password, CryptoJS.enc.Hex.parse(realKey), {
		              	mode: CryptoJS.mode.ECB,
		              	padding: CryptoJS.pad.Pkcs7
		          	});
					param.password = encrypt.ciphertext.toString(CryptoJS.enc.Base64);
					param.timestamp = timestamp;
		       }


				resetPassword(param).then(function(data){
					_this.resetLoading = false;
					_this.resetSms();
					let code = data.code;
					if(code != 0){
						_this.errorTxt = _this.errorMap[code] || '重置失败';
						return;
					}
					_this.errorTxt = '';
					_this.issuccess = true;
			       	_this.$cookies.set('__account', _this.phoneNum);
				});
			},
			//倒计时
			beginTimeDown : function(){
				var _this = this;
				clearTimeout(_this.countTimer);
				_this.times--;
				if(_this.times <=0 ){
					_this.times = 60;
					_this.smsLoading = false;
					return;
				}
				_this.countTimer = setTimeout(function(){_this.beginTimeDown();},1000);
			},
			resetSms : function(){
				this.smsLoading = false;
				clearTimeout(this.countTimer);
				this.times = 60;
			},
			getSmsCode : function(){
				var _this = this;
				if(!_this.validatePhoneNum()){
					return;
				}
				_this.smsLoading = true;
				let param = {phone : _this.phoneNum};
				_this.beginTimeDown();
				sendResetSmsCode(param).then(function(data){
					if(!data || data.code != 0){
						_this.errorTxt = _this.errorMap[data.code] || '发送失败';
						_this.resetSms();
						return;
					}
					_this.errorTxt = '';
				});
			},
		    swithPwdType : function(type){
		    	this.pwdType = type;
		    },
		    toLogin : function(){
		    	sessionStorage.removeItem('__user');
		    	this.$router.replace({ path: '/'+this.bid+'/login' });
		    }
		},
		beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.bid = vm.$route.params.bid || 'yeta';
		        localStorage.setItem('__bid',vm.bid);
		        vm.logoUrl = 'static/kcdn/logo/'+vm.bid+'/logo.png';
		        vm.bgUrl = 'static/kcdn/logo/'+vm.bid+'/bg.jpg';
			});
		},
		mounted : function(){
			let theme = sessionStorage.getItem('__theme'),
	      themeObj = theme ? JSON.parse(theme) : {};
	    this.copyright = themeObj.name + '电话机器人';
		}
	}
</script>

<style lang="less" scope>
	.reset{
		background:#5D6C6E;
      	min-height:100vh;
      	overflow:hidden;
		.form{
			position:absolute;
		    top:50%;left:50%;
		    transform: translate(-50%,-50%);
		    width:400px;
		    min-height:400px;
		    background:#fff;
		    box-sizing: border-box;
		    z-index:10;
		    padding: 40px 42px;
		    border-radius: 5px;
			.logo{
				position: absolute;
			    height: 60px;
			    background: url(./images/logoBig.png) no-repeat center center;
			    z-index: 10;
			    margin-top: -120px;
			    width: 100%;
			    left: 0;
			}
			.title{
				text-align: center;
			    color: #333;
			    font-size: 22px;
			    font-weight: 600;
			}
			.error{
				text-align: left;
		      	border-radius: 3px;
		      	height:30px;
		      	line-height: 30px;
		      	margin-bottom: 8px;
		      	background: #f89fb6;
		      	font-size: 12px;
		      	text-indent: 15px;
		      	color: #a92f4f;
			}
			.form-row{
				 margin-bottom:22px;
				.smscode,.imgcode{
					width:185px;
				}
				.smsbtn{
					float:right;
					width:112px;
				}
				.verify__img{
					float:right;
					cursor: pointer;
				}
				.icon-pwd--close{
					display:inline-block;
					background:url(./images/pwd-close.png) 0 0 no-repeat;
					line-height: 40px;
    				height: 40px;
    				background-position: 2px 20px;
    				width: 22px;
    				cursor:pointer;
				}
				.icon-pwd--open{
					display:inline-block;
					background:url(./images/pwd-open.png) 0 0 no-repeat;
					line-height: 40px;
    				height: 40px;
    				background-position: 2px 12px;
    				width: 22px;
    				cursor:pointer;
				}
			}
			.register__btn{
				width:100%;
			    font-size: 16px;
			}
			.register__opt{
				text-align: center;
			    font-size: 14px;
			    color: #767676;
			}
		}
		.reset__success{
			min-height:340px;
			.icon-success{
				background:url(./images/success-img.png) center center no-repeat;
				height:48px;
				margin-top:30px;
			}
			.success-txt{
				text-align:center;
				color: #767676;
				font-size: 14px;
				.jump-time{
					font-weight:bold;
					font-size:16px;
					margin:0 2px;
				}
			}
			.form-row{
				margin-bottom:10px;
			}
			.cert__opt{
				margin-top:30px;
			}
			.cert-btn{
				width:100%;
				height:46px;
			}
		}
		.auth {
			min-height:310px;
		}
		.footer{
			position: fixed;
		    bottom: 20px;
		    text-align: center;
		    width: 100%;
		    z-index: 10;
		    color: #fff;
		    font-size: 16px;
		}
		.bg{
			position: absolute;
		    top: 0;left: 0;right: 0;bottom: 0;
		    background: url(./images/login-bg.jpg) 0 0 no-repeat;
		    background-size: cover;
		    z-index:0;	
		}
	}
</style>