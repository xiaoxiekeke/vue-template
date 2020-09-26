<template>
	<el-dialog title="话术导入"
		:append-to-body="true"
		:before-close="beforeClose"
		width="500px"
		:visible.sync="show">
			<el-form :model="formData" ref="importForm" :rules="rules" >
			    <el-form-item label="" prop="speechSkillName">
			      <el-input v-model="formData.speechSkillName" placeholder="请输入话术名称" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="" prop="fileName">
			    	<div style="display:none;">
						<input @change="fileChange" id="speechUpload" type="file" />
					</div>
					<label for="speechUpload" class="up__speech">
						<i class="el-icon-upload"></i>
						<span class="up__speech-txt">选择上传文件</span>
					</label>
					<span class="speechUpload__filename">{{fileName}}</span>
					<div v-if="importError" class="el-form-item__error">{{importError}}</div>
			    </el-form-item>
		  	</el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button v-if="!uploading" type="primary"  @click.stop="importSpeech('importForm')">导入</el-button>
				<el-button v-else type="primary" :loading="true" disabled>导入中</el-button>
			</span>
		</el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {importSpeech} from '@/api/brain.js'
	export default {
		name : 'speech-import',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show'],
		data : function(){
			var validateSpeechName  = (rule, value, callback) => {
				const errorTip = ['请输入话术名称','话术名称格式不正确'],
	       			  result = validateRule(value,['require','wordsName']);
				if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
			}
			return {
				formData : {
					speechSkillName : ''
				},
				rules : {
					speechSkillName: [ { validator: validateSpeechName, trigger: 'blur' } ]
				},
				uploading : false,
				fileName : '',
				importError : ''
			}
		},
		methods : {
			importSpeech : function(formName){
				var _this = this;
				_this.$refs[formName].validate((valid) => {
					if(!valid){
			        	return false;
			        }
			        const file = document.getElementById('speechUpload').files[0];
			        if(file == null){
			        	this.importError = '请选择上传的文件！';
			        	return false;
			        }
			        _this.uploading = true;
			        var formData = new FormData();
		            formData.append("sysType",  _this.$config.system.id);
		            formData.append("speechSkillName", _this.formData.speechSkillName);
		            formData.append("OBJECT", file);
		            importSpeech(formData).then(function(data){
		            	if(data.code == 0){
		            		_this.$message({message: '导入成功', type: 'success'});
		            		_this.$emit('success');
		            		_this.$emit('change',false);
		            	}else{
		            		_this.$message.error(data.messageExt || '导入失败');
		            	}
		            	 _this.uploading = false
		            });

				});
			},
			fileChange : function(event){
				const file = event.target.files[0];
				let orgFileName = file ? file.name : '',
	                suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
	            this.fileName = '';
	            if(file == null){
	            	return;
	            }else if(["zip"].indexOf(suffix) < 0){
	                this.importError = '请选择正确的文件格式！';
	                event.target.value = '';
	                return;
	            }else if(file.size / 1024 > 1024 * 20){
	                this.importError = '文件大小不能超过20MB！';
	                event.target.value = '';
	                return;
	            }
	            this.importError = '';
	            this.fileName = orgFileName;
			},
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			}
		}
	}
</script>

<style lang="less">
	
</style>