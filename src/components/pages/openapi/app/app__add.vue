<template>
	<el-dialog
          :title="id ? '修改应用' : '添加应用'"
          :visible.sync="show"
          :append-to-body="true"
          custom-class="app-form"
          :before-close="beforeClose"
          width="500px">
        <el-form v-loading="loading" ref="appForm" class="create-form" label-width="100px" label-position="left"
        		:model="formData" 
        		:rules="rules">
		    <el-form-item label="应用名称" prop="appName">
	      	<el-input v-model.trim="formData.appName" class="form-item" placeholder="请输入应用名称" maxlength="20"></el-input>
		    </el-form-item>
		    <el-form-item label="业务分类" prop="tags">
	      	<el-checkbox-group 
			    	v-model="formData.tags">
				    <el-checkbox v-for="tag in tagList" class="form-tag"
			    		:label="tag.tag_name" 
			    		:key="tag.tag_name">{{tag.tag_name}}</el-checkbox>
				   	<el-input class="input-new-tag" size="small"
				   		maxlength="8"
						  v-model="inputValue"
						  v-if="inputVisible"
						  @keyup.enter.native="handleInputConfirm"
						  @blur="handleInputConfirm">
						</el-input>
						<el-button v-else type="text" size="small" @click="inputVisible = true">+添加分类</el-button>
						<el-button class="tip" type="text">（选择1-3个）</el-button>
			  	</el-checkbox-group>
		    </el-form-item>
		    <el-form-item label="应用类型" prop="appType">
		      	<el-select v-model="formData.appType" class="form-item">
		      		<el-option label="呼入" value="1"></el-option>
		      		<el-option label="呼出" value="0"></el-option>
		      		<el-option label="呼入+呼出" value="2"></el-option>
		      	</el-select>
		    </el-form-item>
		    <el-form-item label="并发数">
		      <span>1</span>
		    </el-form-item>
		    <el-form-item label="应用描述">
		      	<el-input v-model.trim="formData.description" maxlength="100" type="textarea"
  						:rows="3" class="form-item" placeholder="请输入应用描述"></el-input>
		    </el-form-item>
		</el-form>
	   <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button :disabled="isSubmit" @click.stop="saveApp" type="primary">确定</el-button>
		</span>
    </el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {queryTags,createAppKey,queryApp} from '@/api/openapi-admin.js'
	import {queryDefaultTags} from '@/api/jsondata.js'

	export default {
		name : 'push-add',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','id'],
		data : function () {
			var validateAppName = (rule, value, callback) => {
				const errorTip = ['请输入应用名称','应用名称格式不正确'],
	     			  result = validateRule(value,['require','name']);
     		if(result >= 0){
     			callback(new Error(errorTip[result]));
     		}else{
     			callback();
     		}
    	}
			var validateTagName = (rule, value, callback) => {
				// const errorTip = ['请输入分类名称','分类名称格式不正确'],
	   //   			  result = validateRule(value,['require','name']);
	   //   	if (value) {};
    //  		if(result >= 0){
    //  			callback(new Error(errorTip[result]));
    //  		}else{
    //  			callback();
    //  		}
    		if(value.length>3){
    			callback(new Error("业务分类不得超过三个"));
    		}else if(value.length<1){
    			callback(new Error("请选择业务分类"));
    		}else{
    			callback();
    		}
    	}
			return {
				loading : true,
				tagList : [],
				formData : {
					appName : '',
					appType : '0',
					tags : [],
					description : ''
				},
				rules : {
					appName :[{required:true,validator: validateAppName,trigger: 'blur' }],
					tags : [{required:true,validator: validateTagName,trigger: 'change' }],
					appType:[{required:true,message: '请选择应用类型',trigger: 'change' }]
				},
				inputVisible : false,
				inputValue : '',
				//
				isSubmit : false
			}
		},
		methods : {
			//events
			beforeClose : function(){
				this.isSubmit = false;
				this.$emit('change',false);
			},
			cancel : function(){
				this.isSubmit = false;
				this.$emit('change',false);
			},
			isDefault : function(tag2,defaultTags){
				let result = false;
				for(let tag of defaultTags ){
					if(tag.tag_name == tag2){
						result = true;
						return true;
					}
				}
				return false;
			},
			saveApp : function(){
				this.$refs.appForm.validate((valid) => {
					if(!valid){
						return false;
					}
					let param = {
						app_name : this.formData.appName,
						app_type : this.formData.appType,
						tags : this.formData.tags.join(','),
						concurrents : 1,
						description : this.formData.description
					};
					if(this.id){
						param.app_id = this.id;
					}
					createAppKey(param).then(resp => {
						if(resp.code == 0){
							this.$message({type : 'success',message : '保存成功'});
							this.$emit('change',false);
							this.$emit('success');
						}else{
							this.$message.error('保存失败');
						}
					});
				});
			},
			handleInputConfirm() {
		        let inputValue = this.inputValue;
		        for(let tag of this.tagList){
		        	if(tag.tag_name == inputValue){
		        		this.$message.error('业务分类已存在');
		        		return false;
		        	}
		        }
		        var reg=/^[\u4e00-\u9fa5_a-zA-Z0-9\u0800-\u4e00]+$/;
		        if (inputValue) {
		        	if(reg.test(inputValue)){
		        		this.tagList.push({tag_name : inputValue});
		        		this.inputVisible = false;
				        this.inputValue = '';
		        	}else{
		        		this.$message.error('业务分类格式不正确');
		        	}
		        }
		        
		      }
		},
		mounted : function(){
			//
			Promise.all([queryTags(),queryDefaultTags()]).then(values => {
				let resp = values[0],
					defaultTags = values[1] || [];
				let rows = this.$lodash.get(resp,'result.rows',[]);
				for(let row of rows){
					if(!this.isDefault(row.tag_name,defaultTags)){
						defaultTags.push(row);
					}
				}
				this.tagList = defaultTags;
				if(this.id){
					queryApp({app_id : this.id}).then(resp => {
						let row = this.$lodash.get(resp,'result.rows',{});
						this.formData = {
							appName : row.app_name,
							appType : row.app_type + '',
							tags : row.tags ? row.tags.split(',') : [],
							description : row.description
						}
						this.loading = false;
					})
				}else{
					this.loading = false;
				}
			});
		}
	}
</script>

<style lang="less">
	.app-form{
		.form-item{
			width:100%;
		}
		.form-tag{
			margin-right:20px;
			margin-left:0;
		}
		.input-new-tag{
			width:90px
		}
		.tip{
			color: gray;
    		cursor: default;
		}
	}
	.el-checkbox__label{
		white-space: normal;
		display: inline-flex;
	}
</style>