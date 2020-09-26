<template>
	<el-dialog
		  title="新建分类"
		  :visible.sync="show"
		  :append-to-body="true"
		  :before-close="beforeClose"
		  :close-on-click-modal="false"
		  width="30%">
		  <el-form ref="form__tag" :model="formData" :rules="rules">
			  <el-form-item label="" prop="name">
			    <el-input maxlength="10" v-model="formData.name" placeholder="请输入分类名称"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button v-if="!isSubmit" :disabled="isSubmit" type="primary" @click.stop="addTag('form__tag')">确定</el-button>
		  </span>
	</el-dialog>
</template>

<script>
	import {addTag} from '@/api/brainkb.js'
	import {validateRule} from '@/api/validate.js'

	export default {
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','knowId'],
		data : function(){
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入分类名称','分类名称格式不正确'],
	       			  result = validateRule(value,['require','name']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
			}
			return {
				isSubmit : false,
				rules : {
					name : [ { validator: validateName, trigger: 'blur' } ]
				},
				formData : {
					name : ''
				}
			}
		},
		methods : {
			//
			addTag : function(formName){
			    this.$refs[formName].validate((valid) => {
	        		if(!valid){
	        			return false;
	        		} 
	        		addTag({  
	        			name : this.formData.name,
                        kbId : this.knowId
                    }).then(resp => {
                    	let id = this.$lodash.get(resp,'result.rows[0]','');
                    	if(resp.code == 0 && id){
                			this.$message({message: '新建成功',type: 'success' });
                			this.$emit('success',id,this.formData.name);
                			this.$emit('change',false);
                    	}else{
                    		this.$message.error(resp.message || '新建失败');
                    	}
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
		mounted : function(){
			
		}
	}
</script>
