<template>
	<el-dialog
    title="新增规则类型"
    :visible.sync="show"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="close"
    width="300px">
    <el-form ref="ruleTypeForm" :model="formData" :rules="rules">
	    <el-form-item label="" prop="name">
	      <el-input maxlength="10" v-model.trim="formData.name"  placeholder="请输入规则类型名称" auto-complete="off"></el-input>
	    </el-form-item>
		</el-form>
   	<span slot="footer" class="dialog-footer">
	    <el-button @click.stop="close">取 消</el-button>
	    <el-button :disabled="isSubmit" type="primary" @click.stop="submitForm">确定</el-button>
		</span>
    </el-dialog>
</template>

<script>
	import {addRuleType} from '@/api/brainkb.js'
	import {validateRule} from '@/api/validate.js'

	export default {
		name : 'ruletype',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show'],
		data : function () {
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入规则类型名称','规则类型名称格式不正确'],
   			  result = validateRule(this.formData.name,['require','name']);
       		if(result >= 0){
       			callback(new Error(errorTip[result]));
       		}else{
       			callback();
       		}
    	}
			return {
				formData : {
					name : ''
				},
				rules : {
					name : [{ validator: validateName, trigger: 'blur' }]
				},
				isSubmit : false
			}
		},
		watch : {
			show : function(val){
				if(val){
					this.formData.name = '';
      		this.isSubmit = false;
				}
			}
		},
		methods : {
			close : function(){
				this.$emit('change',false);
			},
			submitForm : function(){
				this.$refs['ruleTypeForm'].validate((valid) => {
					if(!valid){
						return false;
					}
					this.isSubmit = true;
					addRuleType({name : this.formData.name}).then( (data) => {
						if(data.code != 0){
							this.$message.error(data.message || '添加失败');
							this.isSubmit = false;
							return;
						}
						this.$message({ message: '添加成功',type: 'success'});
						this.$emit('success');
						this.$emit('change',false);
					});
				});
			}
		}
	}
</script>