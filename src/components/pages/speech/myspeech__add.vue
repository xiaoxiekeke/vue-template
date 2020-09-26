<template>
	<el-dialog
		title="新建话术"
		:append-to-body="true"
		:visible.sync="show"
		:before-close="beforeClose"
		width="550px">
		<div class="speech-form">
			<el-form :model="form" :rules="formRules" ref="createSpeechForm">
				<el-form-item prop="name">
					<el-input v-model="form.name" maxlength="50" placeholder="请输入话术名称"></el-input>
				</el-form-item>
				<el-form-item prop="select">
					<el-select v-model="form.select" placeholder="请选择话术所属行业">
						<el-option 
							v-for="item in industryType"
							v-if="item.label"
							:key="item.value"
							:label="item.label" 
							:value="item.value"></el-option>
					</el-select>
					<el-popover
						placement="bottom-end"
						width="200"
						trigger="hover"
						content="如果您的话术属于金融行业可选择金融，机器人更聪明。">
						<div class="tips-box" slot="reference">
							<div class="tips-button">?</div>
						</div>
					</el-popover>
				</el-form-item>
				<el-form-item prop="type">
					<el-radio-group v-model="form.type" class="type-radio-box">
						<el-radio label="1" border>普通话术</el-radio>
						<el-radio label="2" border>动态话术</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancel">取 消</el-button>
			<el-button :createLoading="createLoading" type="primary" @click.stop="createSpeech">保存</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {saveSpeechSkill,querMcpConfig} from '@/api/brain.js'
	import {validateRule} from '@/api/validate.js'

	export default {
		name : 'speech-add',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show'],
		data : function(){
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入话术名称','话术名称格式不正确'],
	       			  result = validateRule(value,['require','wordsName']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
	      	}
			return {
				form:{
					name: '',
					select: '',
					type: ''
				},
				formRules:{
					name: [{ validator: validateName, trigger: 'blur' }],
					select: [{ required: true, message: '请选择话术所属行业', trigger: 'change' }
					],
					type: [{ required: true, message: '请选择话术类型', trigger: 'change' }
					]
				},
				createLoading: false,
				industryType: []
			}
		},
		methods : {
			createSpeech :function(){
				var _this = this;
				_this.createLoading = false;
				this.$refs.createSpeechForm.validate((valid) => {
					if(!valid){
						return false;
					}
					_this.createLoading = true;
					let params = {
						name : this.form.name,
						type : this.form.type,
						industryType:this.form.select,//select
						jsonData : '{}',
						version:1
					};
					saveSpeechSkill(params).then(res=>{
						if(res.code === 0){
							this.$message({type: 'success',message: '创建成功'});
						/*	const id = _this.$lodash.get(res,'result.rows[0].id','')
							_this.newId = id;*/
							 this.$emit('success');
							 this.$emit('change',false);
						}else{
							this.$message.error('创建失败，错误信息：'+res.messageExt);
						}
						_this.createLoading = false;
					}); 
				});
			},
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			}
		},
		mounted: function(){
			querMcpConfig().then(resp => {
				this.industryType = this.$lodash.get(resp,'result.rows',[]).map(item => {
					return {
						value: item.industryType,
						label: item.description
					}
				})
			})
		}
	}
</script>

<style lang="less">
	.speech-form{
		padding-right:30px;
		.tips-box{
			top:12px;
			width:16px;
			height:16px;
			padding:0 10px;
			right: -35px;
			position:absolute;
		}
		.tips-button{
			border-radius:8px;
			text-align:center;
			line-height:16px;
			color:#FFF;
			background:#ccc;
			font-size:12px;
			cursor: pointer;
		}
		.el-select{
			width:100%;
		}
		.type-radio-box .el-radio__input{
			display:none;
		}
	}
	
</style>