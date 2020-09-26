<template>
	<el-dialog
    :title="this.data ? '编辑规则' : '添加规则'"
    :visible.sync="show"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="close"
    width="500px">
    <el-form ref="modelForm" :model="formData" :rules="rules" label-width="80px">
	    <el-form-item label="规则名称" prop="name">
	      <el-input maxlength="10" v-model.trim="formData.name"  placeholder="请输入规则名称" auto-complete="off"></el-input>
	    </el-form-item>
     	<el-form-item label="规则类型" prop="typeId">
	      <div class="flex-between-center">
	      	<el-select v-model="formData.typeId" filterable clearable>
	      		<el-option 
			     		v-for="item in ruleTypes" 
			     		:key="item.id" 
			     		:label="item.name" 
			     		:value="item.id">
				    </el-option>
	      	</el-select>
	      	<el-button type="text" size="small" icon="el-icon-plus" @click="ruleTypeDialog = true">新增类型</el-button>
	      </div>
	    </el-form-item>
	    <el-form-item label="规则内容" prop="content">
	      <el-input 
	      	auto-complete="off"
	      	placeholder="请输入规则内容"
	      	maxlength="200" 
	      	type="textarea" 
	      	resize="none" 
	      	:rows="5" 
	      	v-model.trim="formData.content"></el-input>
	    </el-form-item>
		</el-form>
   	<span slot="footer" class="dialog-footer">
	    <el-button @click.stop="close">取 消</el-button>
	    <el-button :disabled="isSubmit" type="primary" @click.stop="submitForm">确定</el-button>
		</span>
		<ruletype 
			v-if="ruleTypeDialog" 
			v-model="ruleTypeDialog"
			@success="addTypeSuccess"></ruletype>
  </el-dialog>
</template>

<script>
	import {addRule,queryRuleTypes} from '@/api/brainkb.js'
	import {validateRule} from '@/api/validate.js'

	import RuleType from './ruletype'

	export default {
		name : 'modelAdd',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','groupId','data'],
		data : function () {
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入规则名称','规则名称格式不正确'],
   			  result = validateRule(this.formData.name,['require','name']);
       		if(result >= 0){
       			callback(new Error(errorTip[result]));
       		}else{
       			callback();
       		}
    	}
			return {
				ruleTypeDialog : false,
				formData : {
					typeId : this.data ? this.data.typeId : '',
					name : this.data ? this.data.name : '',
					content : this.data ? this.data.content : ''
				},
				ruleTypes : [],
				rules : {
					name : [{ validator: validateName, trigger: 'blur',required: true }],
					content : [{ required: true, trigger: 'blur',message: '请输入规则内容' }],
					typeId : [{ required: true, trigger: 'change', message: '请选中规则类型' }]
				},
				isSubmit : false
			}
		},
		methods : {
			addTypeSuccess (){
				this.getRuleTypes();
			},
			close : function(){
				this.$emit('change',false);
			},
			submitForm : function(){
				this.$refs['modelForm'].validate((valid) => {
					if(!valid){
						return false;
					}
					this.isSubmit = true;
					let param = {
						groupId : this.groupId,
						typeId : this.formData.typeId,
						name : this.formData.name,
						content : this.formData.content,
						contentMode : 2
					};
					if(this.data){
						param.id = this.data.id;
					}
					addRule(param).then( (data) => {
						if(data.code != 0){
							this.$message.error(data.message);
							this.isSubmit = false;
							return;
						}
						this.$message({ message: '更新成功',type: 'success'});
						this.$emit('success');
						this.$emit('change',false);
					});
				});
			},
			getRuleTypes (){
				queryRuleTypes({pageIndex : 1,pageSize : 500}).then(resp => {
					this.ruleTypes = this.$lodash.get(resp,'result.rows',[]);
				})
			}
		},
		mounted : function(){
			this.getRuleTypes();
		},
		components : {
			'ruletype' : RuleType
		}
	}
</script>