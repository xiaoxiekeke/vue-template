<template>
	<el-dialog
          title="添加知识点"
          :visible.sync="show"
          :append-to-body="true"
          :before-close="beforeClose"
          width="40%"
          >
        <el-form ref="knowform" :model="formData" :rules="rules">
		    <el-form-item label="" prop="cname">
		      <el-input maxlength="10" v-model.trim="formData.cname"  placeholder="请输入知识点名称" auto-complete="off"></el-input>
		    </el-form-item>
		</el-form>

	   	<span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button v-if="!isSubmit" type="primary" @click.stop="addKnowledge('knowform')">确定</el-button>
		     <el-button v-else type="primary" disabled>确定</el-button>
		</span>
    </el-dialog>
</template>

<script>
	import {queryKnowList,addKnow} from '@/api/brainkb.js'
	import {validateRule} from '@/api/validate.js'

	export default {
		name : 'user-add',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show'],
		data : function () {
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入知识点名称','知识点名称格式不正确'],
	       			  result = validateRule(this.formData.cname,['require','name']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
	      	}
			return {
				formData : {
					cname : ''
				},
				rules : {
					cname : [{ validator: validateName, trigger: 'blur' }]
				},
				isSubmit : false
			}
		},
		watch : {
			show : function(val){
				if(val){
					this.formData.cname = '';
            		this.isSubmit = false;
				}
			}
		},
		methods : {
			//events
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			},
			addKnowledge : function(formName){
				var _this = this;
				this.$refs[formName].validate( (valid) => {
					if(!valid){
						return false;
					}
					this.isSubmit = true;
					addKnow({cname : this.formData.cname}).then(function(data){
						if(data.code != 0){
							_this.$message.error(data.message || '添加失败');
							_this.isSubmit = false;
							return;
						}
						_this.$message({ message: '添加成功',type: 'success'});
						_this.$emit('success');
						_this.$emit('change',false);
					});
				});
			}
		}
	}
</script>