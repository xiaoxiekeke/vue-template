<template>
	<div class="page info" v-loading="loading">
		<h3 class="info__title">基础信息</h3>
        <div class="info__content">
            <h4 class="">头像设置</h4>
            <div class="info__body">
        		<img v-loading="uploading" id="imghead" :src="photoUrl" class="info__photo">
        		<el-upload name="file" class="info__upload" :show-file-list="false" 
                    :data="uploadData" 
                    :action="uploadUrl"
                    :before-upload="beforeUpload" 
                    :on-error="onError"
                    :on-success="onSuccess">
                    <el-button type="text" :loading="uploading">{{uploadTxt}}</el-button>
                </el-upload>
		        <p>您可以选择jpg,png的图片，最大3MB</p>
            </div>

            <div class="info_identification">
	    		<h4>企业认证</h4>
		    	<div class="info__body">
					<div class="info__name">{{business.name}}</div>
				    <div class="info_subcon">
				        <div class="info__bus-status" :class="{success : business.status == 2}">{{authText}}</div>
				        <el-button v-if="business.status == 0 || business.status == 3" @click.stop="show.auth = true" type="text">{{business.status == 3 ? '重新认证' : '立即认证'}}</el-button>
				    </div>
				    <div class="info__fail" v-if="business.status == 3">失败原因：{{remark}}</div>
	    		</div>
	    	</div>
	    	<div class="info_wxbind">
	    		<h4>微信认证</h4>
			    <div class="info_subcon info__body">
			        <div class="info__wx-status" :class="{success : bindStatus == 1}">{{bindText}}</div>
			        <el-button @click.stop="wxbind" v-if="bindStatus == 0" type="text">立即绑定</el-button>
			        <el-button @click.stop="wxunbind" v-else-if="bindStatus == 1" type="text">解除绑定</el-button>
			    </div>
	    	</div>
            	
            <h4 class="">密码修改</h4>
            <div class="info__body">
            	<el-form label-position="left" :model="formData" ref="pwdform" :rules="rules" label-width="100px" >
				  <el-form-item label="原密码" prop="originPassword">
				    <el-input  @keyup.enter.native="submitForm('pwdform')" class="form-input" placeholder="请输入原密码" type="password" v-model="formData.originPassword"  auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item  label="新密码" prop="password">
				    <el-input  @keyup.enter.native="submitForm('pwdform')" placeholder="请输入新密码" class="form-input" type="password" v-model="formData.password" auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="确认新密码" prop="confirmPassword">
				    <el-input @keyup.enter.native="submitForm('pwdform')" placeholder="确认新密码" class="form-input" type="password" v-model="formData.confirmPassword" auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button @click.stop="submitForm('pwdform')" class="form-btn" type="primary">保存</el-button>
				  </el-form-item>
				</el-form>	
            </div>
        </div>
        
        <bus-auth v-if="show.auth" @success="authSuccessDialog=true" v-model="show.auth"></bus-auth>

     
	 	<el-dialog
          title="提交成功"
          :visible.sync="authSuccessDialog"
          :append-to-body="true"
          width="400px" >
          企业认证提交成功 客服将在1个工作日内完成审核
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click.stop="authSuccessDialog=false">确 定</el-button>
          </span>
        </el-dialog>


        <el-dialog
          title="微信扫码绑定"
          :visible.sync="binddialogVisible"
          :append-to-body="true"
          width="400px"
          ><!-- :before-close="handleClose" -->
          <img class="wx_qrcode" id="wx_qrcode" v-show="qrCodeLoded" :src="qrCodeUrl" >
          <div class="wx_qrcode-fake" v-show="!qrCodeLoded" v-loading="loading"><i class="el-icon-loading"></i></div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="binddialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
	</div>

</template>

<script>
	import CryptoJS from 'crypto-js'
    import {mapState, mapActions} from 'vuex'
	import {queryEntAuthByBusId} from '@/api/bm.js'
	import {updatePassword,uploadHeadPhoto} from '@/api/uc.js'
	import BusAuth from '@/components/pages/business/auth'
	// import {createTmpQrCode,unbindWeixinMp} from '@/api/mockdata.js'
	import {createTmpQrCode} from '@/api/weixin.js'
	import {unbindWeixinMp,queryMemberInfo} from '@/api/uc.js'
	import global from '@/api/global.js'
	export default {
		name : 'info',
		data : function(){
			var validateOldPass = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请输入密码'));
		        } else {
		          callback();
		        }
		    };
		    var validateNewPass = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请输入新密码'));
		        } else if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value)){
		          	callback(new Error('新密码为8-20位，须含字母+数字（不含特殊符号）'));
		        }else{
		        	callback();
		        }
		    };
		    var validateConfirmPass = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请再次输入新密码'));
		        }else if(this.formData.password != this.formData.confirmPassword){
		          	callback(new Error('两次新密码不一致'));
		        }else{
		        	callback();
		        }
		    };
			return {
				loading : true,
				qrCodeLoded:false,
				binddialogVisible:false,
				show : {
					auth : false
				},
				formData : {
					id : '',
		            originPassword : '',
		            password : '',
		            confirmPassword : ''
				},
				rules : {
					originPassword: [ { validator: validateOldPass, trigger: 'blur' } ],
			        password: [{ validator: validateNewPass, trigger: 'blur' } ],
			        confirmPassword: [{ validator: validateConfirmPass, trigger: 'blur' }]
				},
				uploadData : {
					id : '',
					file : ''
	            },
	            uploading : false,
	            uploadError : '',
	            qrCodeUrl:'',
	            remark : '',
	            authSuccessDialog : false
			}
		},
		computed : {
			...mapState('user',[
				'id',
				'business',
        'photo',
        'account',
        'bindStatus'
    	]),
	    uploadUrl : function(){
	    	return uploadHeadPhoto();
	    },
			photoUrl : function(){
				return this.photo ? this.$global.getStaticFileUrl(this.photo) : 'static/images/user.png'
			},
			uploadTxt : function(){
        if(this.uploading){
            return '正在上传'
        }
        return '头像修改';
      },
      authText : function(){
         let status = this.business.status;
          if(status == 1){
              return '认证中';
          }else if(status == 2){
              return '已认证';
          }else if(status == 3){
             	return '认证失败';
          }
          return '未认证'
      },
      bindText:function(){
      	let bindStatus = this.bindStatus
      	if (bindStatus == 1) {
      		return "已绑定"
      	}else if (bindStatus == 0) {
      		return "未绑定"
      	};
      	return "";
      }
		},
	/*	beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.resetForm();
			});
		},*/
		watch: {
			bindStatus: function(a, b) {
				if (a==1) {
					this.binddialogVisible = false
					this.$message.success("微信绑定成功");
				}else if(a==0){
					this.$message.success("微信解绑成功");
				}
			}
		},
		methods : {
			...mapActions('user',[
        'modifyBusiness',
        'modifyUserPhoto',
        'modifyBindState'
      ]),
			beforeUpload : function(file){
	            let orgFileName = file ? file.name : '',
	                suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
	            if(["png","jpg"].indexOf(suffix) < 0){
	                this.$message.error('请选择jpg,png格式的图片！');
	                return false;
	            }
	            if(file.size / 1024 > 1024 * 3){
	                this.$message.error('图片大小不能超过3MB！');
	                return false;
	            }
	            this.uploading = true;
	            this.uploadData.id = this.id;
	            // this.uploadData.file = file;
	            // console.log(file)
	        },
	        onError : function(err, file, fileList){
	            this.uploading = false;
	        },
	        onSuccess : function(resp, file, fileLis){
	            this.uploading = false;
	            if(resp.code != '0'){
	            	this.$message.error(this.$lodash.get(resp,'messageExt','上传失败'));
	                return;
	            }
	            this.modifyUserPhoto(this.$lodash.get(resp,'result.rows[0].headPhoto',''));
	        },
	        resetForm : function(){
				this.formData.originPassword = '';
				this.formData.password = '';
				this.formData.confirmPassword = '';
	        },
	        submitForm(formName) {
	        	var _this = this;
		        _this.$refs[formName].validate((valid) => {
		          if (!valid) {	
		            return false;
		          } 
		          _this.formData.id = this.id;


		          if(!!this.$global.getConfig('encrypt')){
				           let  timestamp = new Date().getTime(),
				                secKey =  'kxjl'+this.account+timestamp;
				           let realKey = (function getKey(key) {
				                var realKey = CryptoJS.SHA1(key);
				                realKey = CryptoJS.SHA1(realKey).toString().substring(0, 32); 
				                return realKey;
				              })(secKey);

			          	let originEncrypt = CryptoJS.AES.encrypt(this.formData.originPassword, CryptoJS.enc.Hex.parse(realKey), {
			              	mode: CryptoJS.mode.ECB,
			              	padding: CryptoJS.pad.Pkcs7
			          	});
			          	let encrypt = CryptoJS.AES.encrypt(this.formData.password, CryptoJS.enc.Hex.parse(realKey), {
			              	mode: CryptoJS.mode.ECB,
			              	padding: CryptoJS.pad.Pkcs7
			          	});
			          	let confirmEncrypt = CryptoJS.AES.encrypt(this.formData.confirmPassword, CryptoJS.enc.Hex.parse(realKey), {
			              	mode: CryptoJS.mode.ECB,
			              	padding: CryptoJS.pad.Pkcs7
			          	});
				        this.formData.originPassword = originEncrypt.ciphertext.toString(CryptoJS.enc.Base64);
						this.formData.password = encrypt.ciphertext.toString(CryptoJS.enc.Base64);
						this.formData.confirmPassword = confirmEncrypt.ciphertext.toString(CryptoJS.enc.Base64);
						this.formData.timestamp = timestamp;
			       }



		          updatePassword(_this.formData).then(function(data){
		          	if(data && data.code == 0){
		          	 	_this.$message({message: '修改成功',type: 'success'});
		          	 	_this.resetForm();
		            }else {
		                var msg = data ? data.messageExt : "";
		                _this.$message({message: msg,type: 'error'});
		            }
		          });
		        });
		    },
		    wxbind : function(){
		    	var _this=this
		    	this.binddialogVisible=true
		    	createTmpQrCode({
		    		id:this.id,
		    		phone:this.account
		    	}).then((resp)=>{
		    		const code = this.$lodash.get(resp,'code','-1'),
		    		      data = this.$lodash.get(resp,'result.rows[0]',null);
		    		if(code == 0 && data != null){
		    			this.qrCodeUrl=data.qrCodeUrl
		    			function imgLoad(img, callback) {
							var timer = setInterval(function() {
								if (img.complete) {
									callback(img)
									clearInterval(timer)
								}
							}, 50)
						}
						var wx_qrcodeImg=document.getElementById("wx_qrcode")
						imgLoad(wx_qrcodeImg, function() {
							console.log("加载完毕")
							_this.qrCodeLoded=true
						})
		    		    // this.modifyBindState(1)
		    		}else{
						this.$message.error(resp.message);
		                return;
	    			}
		    	})
		    },
		    wxunbind : function(){
		    	const h = this.$createElement;
		    	this.$prompt(h('div',null,[
		    			h('p', null, '是否取消绑定微信账号？'),
		    			h('p', null, '确认取消请输入"yes"（不含引号）'), 
		    		]),'提示',{
		    		confirmButtonText: '确定',
		    		cancelButtonText: '取消',
		    		inputPattern: /^yes$/,
		    		inputValue:'yes',
		    		inputErrorMessage: '输入不正确'
		    	}).then(({ value }) => {
		    		console.log(this.id)
		    		unbindWeixinMp({
		    			id:this.id
		    		}).then((resp)=>{
		    			const code = this.$lodash.get(resp,'code','-1');
		    			if(code == 0 ){
		    				this.modifyBindState(0)	
		    			}else{
							this.$message.error(resp.message);
			                return;
		    			}
		    			
		    		})
		    	}).catch(() => {
		    	
		    	});
		    }
		},
		mounted : function(){
			var _this = this;
			queryEntAuthByBusId().then(function(data){
				let status = _this.$lodash.get(data,'result.rows[0].status','');
				_this.remark = _this.$lodash.get(data,'result.rows[0].remark','');
			  	_this.modifyBusiness({status : status});
			  	_this.loading = false;
			});
			var params={
				id:this.id,
				businessId:this.business.id
			}
			queryMemberInfo(params).then(function(data){
				var bindStatus=data.result.rows[0].bindStatus
				_this.modifyBindState(bindStatus)
			})
		},
		components : {
			'bus-auth' : BusAuth
		}
	}
</script>

<style lang="less" scope>
	.info{
		.info__title{
			margin: 0;
		    font-size: 16px;
		    line-height: 34px;
		    margin-bottom: 16px;
		    font-weight: bold;
		    color: #585858;
		}
		.info__content{
		    min-width: 550px;
		    background: #fff;
		    box-shadow: 0 0 3px #e2e2e2;
		    padding: 32px;
		}
		.info__body{
			padding-left:40px;
		}
		.info__photo{
			width:40px;
			height:40px;
			border-radius:50%;
		}
		.info__upload{
			display:inline-block;
			padding-left:10px;
			vertical-align: top;
		}
		.form-input{
			width:300px;
		}
		.form-btn{
			width:100px;
		}
		.info__bus-status{
			background: url(../../../assets/images/small-icon.png) 10px -584px no-repeat;		
			min-width: 65px;
		    height: 32px;
		    border: 1px solid #d3d3d3;
		    border-radius: 2px;
		    padding-left: 39px;
		    margin: 0;
		    line-height: 32px;
		    display: inline-block;
		    
		}
		.info__bus-status.success{
			color: #1ab394;
			border-color: #1ab394;
	    	background-position: 10px -616px;
	    	background-color: #dbfdf6;
	    }
    	.info__wx-status{
    		background: url(../../../assets/images/wx-sm-icon.jpg) 10px 8px no-repeat;		
    		min-width: 65px;
    	    height: 32px;
    	    border: 1px solid #d3d3d3;
    	    border-radius: 2px;
    	    padding-left: 39px;
    	    margin: 0;
    	    line-height: 32px;
    	    display: inline-block;
    	    
    	}
    	.info__wx-status.success{
    		color: #1ab394;
    		border-color: #1ab394;
        	background-position: 10px -20px;
        	background-color: #dbfdf6;
        }
	    .info__fail{
	    	margin-top:10px;
	    }
	    .info__name{
	    	margin-bottom:10px;
	    }
	    .info_subcon{
	    	height:40px;
	    	line-height:40px;
	    }
	}
	.wx_qrcode{
		width:360px;
	}
	.wx_qrcode-fake{
		width:360px;
		height:360px;
		text-align:center;
		line-height:360px;
		.el-icon-loading{
			font-size:30px;
		}
	}
</style>