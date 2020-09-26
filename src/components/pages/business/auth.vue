<template>
	<div>
		<el-dialog
		  title="企业认证"
		  custom-class="auth"
		  :visible.sync="show"
		  :append-to-body="true"
		  :before-close="beforeClose"
		  width="530px">
		  	<div class="auth__head">
			  	<el-steps :active="0">
				  <el-step title="提交资料" ></el-step>
				  <el-step title="一个工作日审核"></el-step>
				  <el-step title="审核结果"></el-step>
				</el-steps>
		  	</div>
			<div class="auth__body" v-loading="loading">
				<el-form label-position="left" :model="formData" ref="authform" :rules="rules" label-width="100px" >
				  <el-form-item label="企业名称" prop="enterpriseName">
				    <el-input  @keyup.enter.native="submitForm('authform')" class="form-input" placeholder="请输入企业名称" type="text" v-model="formData.enterpriseName"  auto-complete="off" maxlength="30"></el-input>
				  </el-form-item>
				  <el-form-item  label="法人代表" prop="legalPersonName">
				    <el-input  @keyup.enter.native="submitForm('authform')" placeholder="请输入法人代表" class="form-input" v-model="formData.legalPersonName" auto-complete="off" maxlength="15"></el-input>
				  </el-form-item>
				  <el-form-item label="法人身份证号" prop="legalPersonId">
				    <el-input @keyup.enter.native="submitForm('authform')" placeholder="请输入18位身份证号" class="form-input" v-model="formData.legalPersonId" auto-complete="off" maxlength="18"></el-input>
				  </el-form-item>
				  <el-form-item label="身份证正面照">
				   	<el-upload class="upload__btn" name="attach" :show-file-list="false" 
                            :data="uploadData1" 
                            :action="uploadUrl"
                            :before-upload="beforeUpload" 
                            :on-error="onError"
                            :on-success="onSuccess">
                        <el-button :loading="uploading1" size="small" type="primary" plain>
                        {{uploading1 ? '上传中':'上传'}}</el-button>
                    </el-upload>
                      <a class="link auth__file" v-if="url1" :href="formatUrl(url1)" target="_blank">{{uploadData1.fileName}}</a>
                        <div class="el-form-item__error">{{upError1}}</div>
				  </el-form-item>
				  <el-form-item label="身份证反面照">
					   	<el-upload name="attach" class="upload__btn"  :show-file-list="false" 
	                            :data="uploadData2" 
	                            :action="uploadUrl"
	                            :before-upload="beforeUpload2" 
	                            :on-error="onError2"
	                            :on-success="onSuccess2">
	                        <el-button :loading="uploading2" size="small" type="primary" plain>
	                        {{uploading2 ? '上传中':'上传'}}</el-button>
	                    </el-upload>
	                    <a class="link auth__file" v-if="url2" :href="formatUrl(url2)" target="_blank">{{uploadData2.fileName}}</a>
	                    <div class="el-form-item__error">{{upError2}}</div>
				  </el-form-item>
				   <el-form-item label="营业执照">
					   	<el-upload name="attach" class="upload__btn" :show-file-list="false" 
	                            :data="uploadData3" 
	                            :action="uploadUrl"
	                            :before-upload="beforeUpload3" 
	                            :on-error="onError3"
	                            :on-success="onSuccess3">
	                        <el-button :loading="uploading3" size="small" type="primary" plain>
	                        {{uploading3 ? '上传中':'上传'}}</el-button>
	                    </el-upload>
	                     <a class="link auth__file" v-if="url3" :href="formatUrl(url3)" target="_blank">{{uploadData3.fileName}}</a>
	                     <div class="el-form-item__error">{{upError3}}</div>
				  </el-form-item>
				  <el-form-item>
				  		图片需清晰，支持最大5M的jpg,png格式图片
				  </el-form-item>
				</el-form>	
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="cancel">取 消</el-button>
			    <el-button type="primary" @click="submitForm('authform')">提 交</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {mapState, mapActions} from 'vuex'
	import {queryEntAuthByBusId,enterpriseAuth,getUploadEntAuthAttachUrl} from '@/api/bm.js'
	export default {
		name : 'bus-auth',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show'],
		data : function () {
			var validateBusName = (rule, value, callback) => {
				const result = validateRule(value,['require','company']);
				if(result == 0){
					callback(new Error('请输入企业名称'));
				}else if(result == 1){
					callback(new Error('企业名称不正确'));
				}else{
					callback();
				}
			}
			var validatePersonName = (rule, value, callback) => {
				const result = validateRule(value,['require','representative']);
				if(result == 0){
					callback(new Error('请输入法人代表'));
				}else if(result == 1){
					callback(new Error('格式不正确'));
				}else{
					callback();
				}
			}
			var validatePersonId =(rule, value, callback) => {
				const result = validateRule(value,['require','identification']);
				if(result == 0){
					callback(new Error('请输入法人身份证号'));
				}else if(result == 1){
					callback(new Error('身份证格式不正确'));
				}else{
					callback();
				}
			}
			return {
				loading : true,
				formData : {
					enterpriseName : '',
					legalPersonName : '',
					legalPersonId : '',
			        fileNames : []
				},
				rules : {
					enterpriseName: [ { validator: validateBusName, trigger: 'blur' } ],
			        legalPersonName: [{ validator: validatePersonName, trigger: 'blur' }],
			        legalPersonId: [{ validator: validatePersonId, trigger: 'blur' }]
				},
				uploadData1 : {
					fileName : ''
				},
				uploadData2 : {
					fileName : ''
				},
				uploadData3 : {
					fileName : ''
				},
				uploading1 : false,
				uploading2 : false,
				uploading3 : false,
				url1 : '',
				url2 : '',
				url3 : '',
				upError1 : '',
				upError2 : '',
				upError3 : ''
			}
		},
		computed : {
			...mapState('user',[
				'account'
            ]),
			 uploadUrl : function(){
			 	return getUploadEntAuthAttachUrl();
			 }
		},
		methods : {
			...mapActions('user',[
                'modifyBusiness'
            ]),
            formatUrl : function(url){
            	return this.$global.getStaticFileUrl(url);
            },
			submitForm : function(formName){
				var _this = this;
		        _this.$refs[formName].validate((valid) => {
	        	  	let isError = false;
			        if(_this.uploadData1.fileName == ''){
			        	_this.upError1 = '请上传身份证正面照';
			        	isError = true;
			        }
			        if(_this.uploadData2.fileName == ''){
			        	_this.upError2 = '请上传身份证反面照';
			        	isError = true;
			        }
			        if(_this.uploadData3.fileName == ''){
			        	_this.upError3 = '请上传营业执照';
			        	isError = true;
			        }
			        if(!valid || isError){
			        	return false;
			        }
        			let param = {
        				createUser : _this.account,
        				enterpriseName : _this.formData.enterpriseName,
        				legalPersonName : _this.formData.legalPersonName,
        				legalPersonId : _this.formData.legalPersonId,
        				fileNames : [_this.url1,_this.url2,_this.url3]
        			}
			      	enterpriseAuth(param).then(function(data){
			      		if(data.code == 0){
			      			_this.modifyBusiness({status : 1});
			      			_this.$emit('change',false);
			      			_this.$emit('success');
			      		}else{
	      			        _this.$message.error(data.message || '保存失败');
			      		}
			      	});
		        });
			},
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			},
			checkFile : function(file){
 				let orgFileName = file ? file.name : '',
	                suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
	            if(["png","jpg"].indexOf(suffix) < 0){
	                return '图片格式不正确';
	            }
	            if(file.size / 1024 > 1024 * 5){
	                return '图片大小不能超过5MB';
	            }
	            return '';
			},
			beforeUpload : function(file){
	            let orgFileName = file ? file.name : '',
	            	error = this.checkFile(file);
	            if(error != ''){
	            	this.upError1 = error;
	            	return false;
	            }
	            this.uploading1 = true;
	            this.upError1 = '';
	            this.uploadData1.fileName = orgFileName;
	        },
	        onError : function(err, file, fileList){
	            this.uploading1 = false;
	            this.uploadData1.fileName = '';
	        },
	        onSuccess : function(resp, file, fileLis){
	            this.uploading1 = false;
	            if(resp.code == '0'){
	            	this.url1 = this.$lodash.get(resp,'result.rows[0].attachPath','');
	            }else{
	            	this.upError1 = '上传失败';
	            }
	        },
        	beforeUpload2 : function(file){
	            let orgFileName = file ? file.name : '',
	            	error = this.checkFile(file);
	            if(error != ''){
	            	this.upError2 = error;
	            	return false;
	            }
	            this.uploading2 = true;
	            this.upError2 = '';
	            this.uploadData2.fileName = orgFileName;
	        },
	        onError2 : function(err, file, fileList){
	            this.uploading2 = false;
	            this.uploadData2.fileName = '';
	        },
	        onSuccess2 : function(resp, file, fileLis){
	            this.uploading2= false;
	            if(resp.code == '0'){
              		this.url2 = this.$lodash.get(resp,'result.rows[0].attachPath','');
	            }else{
	            	this.upError2 = '上传失败';
	            }
	        },
        	beforeUpload3: function(file){
	            let orgFileName = file ? file.name : '',
	            	error = this.checkFile(file);
	            if(error != ''){
	            	this.upError1 = error;
	            	return false;
	            }
	            this.uploading3 = true;
	            this.upError3 = '';
	            this.uploadData3.fileName = orgFileName;
	        },
	        onError3 : function(err, file, fileList){
	            this.uploading3 = false;
	            this.uploadData3.fileName = '';
	        },
	        onSuccess3 : function(resp, file, fileLis){
	            this.uploading3 = false;
	            if(resp.code == '0'){
              		this.url3 = this.$lodash.get(resp,'result.rows[0].attachPath','');
	            }else{
	            	this.upError3 = '上传失败';
	            }
	        }
		},
		mounted : function(){
			const _this = this;
			queryEntAuthByBusId().then(function(data){
				const row = _this.$lodash.get(data,'result.rows[0]',null);
				if(row != null){
					_this.formData.enterpriseName = row.enterpriseName || '';
					_this.formData.legalPersonName = row.enterpriseName || '';
					_this.formData.legalPersonId = row.legalPersonId || '';
					let attachmentPath = row.attachmentPath;
					if(attachmentPath){
		                let attachArr = attachmentPath.split(","),
			                idFrontImg = attachArr[0] || '',
			                idBackImg = attachArr[1] || '',
			                licenseImg = attachArr[2] || '';
		                _this.url1 = idFrontImg;
		                _this.url2 = idBackImg;
	                    _this.url3 = licenseImg;
	                    _this.uploadData1.fileName = idFrontImg ? idFrontImg.substr(idFrontImg.lastIndexOf('/') + 1) : '';
	                    _this.uploadData2.fileName = idBackImg ? idBackImg.substr(idBackImg.lastIndexOf('/') + 1) : '';
	                    _this.uploadData3.fileName = licenseImg ? licenseImg.substr(licenseImg.lastIndexOf('/') + 1) : '';
		            }
				}
				_this.loading = false;
			});
		}
	}
</script>

<style lang="less" scope>
	.auth{
		padding:0 20px;
		.el-dialog__body{
			padding:20px 20px 0 20px;
		}
		.upload__btn{
			display:inline-block;
		}
	}

	.auth__body{
		margin-top:20px
	}
	.auth__file{
	    overflow: hidden;
	    white-space: nowrap;
	    text-align: left;
	    text-overflow: ellipsis;
	    max-width: 241px;
	    display: inline-block;
	    vertical-align: top;
	    margin-left:20px;
	}
	.auth__error{
		font-size: 12px;
    	color: #f56c6c;
	}
</style>