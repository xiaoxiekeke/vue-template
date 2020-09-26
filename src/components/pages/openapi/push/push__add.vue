<template>
	<el-dialog
          title="接入设置"
          :visible.sync="show"
          :append-to-body="true"
          custom-class="push-form"
          :before-close="beforeClose"
          width="500px">
        <el-form v-loading="loading" ref="pushForm" class="create-form" label-width="100px" label-position="left"
        		:model="formData" 
        		:rules="rules">
		    <el-form-item label="推送模块" prop="pushModule">
		      	<el-select v-model="formData.pushModule" class="form-item">
		      		<el-option label="话单推送" value="receiveCallRecord"></el-option>
		      		<el-option label="会话推送" value="receiveDialog"></el-option>
		      		<el-option label="录音推送" value="receiveVoice"></el-option>
		      		<el-option label="呼入话术上下文动态数据获取" value="getDialogContext"></el-option>
		      		<el-option label="获取语义" value="getSemantics"></el-option>
		      		<el-option label="对话能力" value="getDialogCommnad"></el-option>
		      	</el-select>
		    </el-form-item>
		    <el-form-item label="所属应用" >
		      	<el-select v-model="formData.appId" filterable clearable class="form-item">
		      		<el-option v-for="app in appList"
		      			:key="app.app_id"
		      			:label="app.app_name"
		      			:value="app.app_id"
		      		></el-option>
		      	</el-select>
		    </el-form-item>
		    <el-form-item label="关联话术" >
	      	<el-select v-model="formData.robotId"
	      		@change="speechChange"
	      		:remote-method="querySpeechList"
	      		:loading="speechLoading" 
	      		filterable clearable remote class="form-item">
				    <el-option v-for="item in speechList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
		    </el-form-item>
		    <el-form-item label="接口地址" prop="url">
		      	<el-input v-model.trim="formData.url" class="form-item" placeholder="请输入接口地址"></el-input>
		    </el-form-item>
		    <el-form-item label="状态">
		      	<el-switch v-model="formData.status" inactive-text="禁用" active-text="启用" >
				</el-switch>
		    </el-form-item>
		</el-form>
	   <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button :disabled="isSubmit" @click.stop="savePush" type="primary">确定</el-button>
		</span>
    </el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {queryAppList,managePushAddress,queryPushAddress} from '@/api/openapi-admin.js'
	import {querySpeechSkill} from '@/api/brain.js'

	export default {
		name : 'push-add',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','id'],
		data : function () {
			return {
				loading : true,
				appList : [],
				speechLoading : false,
				speechList : [],
				formData : {
					pushModule : '',
					appId : '',
					robotId : '',
					url : '',
					status : true
				},
				rules : {
					pushModule : [{ required: true, message: '请选择推送模块', trigger: 'change' }],
					url : [{ required: true, message: '请输入接口地址', trigger: 'blur' }]
				},
				createLoading : false
			}
		},
		methods : {
			querySpeechList : function(keywords){
				this.speechLoading = true;
				let param = {name : keywords,status : 4, pageIndex:1, pageSize:100}
				querySpeechSkill(param).then(resp => {
					let rows = this.$lodash.get(resp,'result.rows',[]),
						speechList = [];
					for(let row of rows){
						speechList.push({label : row.name,value : row.id});
					}
					this.speechList = speechList;
					this.speechLoading = false;
				})
			},
			getSpeechList : function(query){
		    	if (query !== '') {
			          this.speechLoading = true;
			          setTimeout(() => {
		          		let param = {
		                	name : query,
											pageIndex : 1,
											pageSize : 10
			            };
						querySpeechSkill(param).then((data) =>{
							let rows = this.$lodash.get(data,'result.rows',[]),
								speechList = [];
							for(let row of rows){
								speechList.push({label : row.name,value : row.id});
							}
							this.speechList = speechList;
							this.speechLoading = false;
						});
			          }, 200);
		        } else {
		          	this.speechList = [];
		        }
		    },
			//events
			savePush : function(){
				this.$refs.pushForm.validate((valid) => {
					if(!valid){
						return false;
					}
					let param = {
						pushModule : this.formData.pushModule,
						appId : this.formData.appId,
						robotId : this.formData.robotId,
						url : this.formData.url ,
						status : this.formData.status ? 1 : 0
					};
					if(this.id){
						param.id = this.id;
					}
					managePushAddress(param).then(resp => {
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
			beforeClose : function(){
				this.isSubmit = false;
				this.$emit('change',false);
			},
			cancel : function(){
				this.isSubmit = false;
				this.$emit('change',false);
			}
		},
		mounted : function(){
			queryAppList().then(resp => {
				this.appList = this.$lodash.get(resp,'result.rows',[]);
				querySpeechSkill({pageSize:100,status : 4}).then((data) =>{
					let rows = this.$lodash.get(data,'result.rows',[]),
						speechList = [];
					for(let row of rows){
						speechList.push({label : row.name,value : row.id});
					}
					this.speechList = speechList;
					if(this.id){
						queryPushAddress({id : this.id}).then(resp=>{
							let row = this.$lodash.get(resp,'result.rows[0]',{});
							this.formData = {
								pushModule : row.pushModule || '',
								appId : row.appId || '',
								robotId : Number(row.robotId) || '',
								url : row.url || '',
								status : row.status == 1
							}
							this.loading = false;
						});
					}else{
						this.loading = false;
					}
				});
			});

			
		}
	}
</script>

<style lang="less">
	.push-form{
		.form-item{
			width:100%;
		}
	}
</style>