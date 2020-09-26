<template>
	 <el-dialog
          :title="title"
          :visible.sync="show"
          :append-to-body="true"
          :before-close="beforeClose"
          :close-on-click-modal="false"
          width="530px">
        <div v-loading="loading">
        	<el-alert type="warning" :closable="false" show-icon center
				title="短信模板需过运营商审核，审核时间可能比较久，平均审核周期2个工作日，最长可能5个工作日"
			></el-alert>
        	<el-form :model="tempateForm" :rules="rules" ref="tempateForm" class="template__form" label-width="100px">
		  		<el-form-item label="模板名称" prop="simpleDesc">
	    			<el-input v-model.trim="tempateForm.simpleDesc" placeholder="请填写模板名称" maxlength="50" type="text" autocomplete="off"></el-input>
	  			</el-form-item>
	  			<el-form-item label="短信模板" prop="content">
	    			<el-input v-model.trim="tempateForm.content" placeholder="【输入签名】短信内容" maxlength="200" type="textarea" :rows="4" resize="none" ></el-input>
	  			</el-form-item>
	  		</el-form>
	  		<div class="template__msg">共{{tempateForm.content.length}}个字，{{smsCount}}条短信  
	  			<el-tooltip effect="dark" content="运营商将按照短信字数计费,70字为一条" placement="top-end">
      				<i class="el-icon-question"></i>
    			</el-tooltip>
    		</div>
    	</div>
        <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button @click.stop="submit" :disabled="isSubmit" type="primary" >确定</el-button>
		</span>
  	</el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {addSmsTemplet,querySmsTempletInfo,updateSmsTemplet} from '@/api/resmanage.js'

	export default {
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','id'],
		data : function(){
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入模板名称','模板名称格式不正确'],
	     			  result = validateRule(value,['require','name']);
     		if(result >= 0){
     			callback(new Error(errorTip[result]));
     		}else{
     			callback();
     		}
    	}
    	var validateContent = (rule, value, callback) => {
				const errorTip = ['请输入短信内容','格式不正确，包含特殊字符','短信中需要添加签名，eg:【签名内容】','短信签名建议2-8个字'],
       			  result = validateRule(value,['require','sms']);
		  	let signArr = value.match(/【[^(【|】)]+】/g);
		  	let signArr2 = value.match(/【[^(【|】)]+】(.|\n)+/g)
     		if(signArr == null){
					callback(new Error(errorTip[2]));
     		}else if(!/【.{2,8}】/.test(signArr[signArr.length - 1])){
     			callback(new Error(errorTip[3]));
     		}else if(result >= 0){
     			callback(new Error(errorTip[result]));
     		}else if(signArr2 == null){
     			callback(new Error('短信签名后应该加上短信内容'));
     		}else{
     			callback();
     		}
    	}
			return {
				loading : true,
				tempateForm : {
					simpleDesc : '',
					content : ''
				},
				isSubmit : false,
				rules : {
					simpleDesc : [
						{ required: true,message:'请输入模板名称',trigger: 'blur' },
						{ validator: validateName, trigger: 'blur'}
					],
					content : [
						{ required: true,message : '请输入短信内容',trigger: 'blur' },
						{ validator: validateContent, trigger: 'blur'}
					]
				}
			}
		},
		computed : {
			title : function(){
				return this.id ? '编辑短信模板' : '新建短信模板';
			},
			smsCount : function(){
				return Math.ceil(this.tempateForm.content.length / 70);
			},
			signName : function(){
				let signArr = this.tempateForm.content.match(/【[^(【|】)]+】/g);
				if(signArr == null){
					return '';
				}
				return signArr[0].replace(/【|】/g,'').replace(/^\s+|\s+$/g,'');
			},
      content : function(){
        let signArr = this.tempateForm.content.match(/【[^(【|】)]+】(.|\n)+/g);
        if(signArr == null){
          return '';
        }
        return signArr[signArr.length - 1].replace(/【[^(【|】)]+】/,'').replace(/^\s+|\s+$/g,'');
      }
		},
		methods : {
			submit : function(){
				this.$refs['tempateForm'].validate((valid) => {
					 if(!valid) {
			           	return false;
			        }
			        let param ={
			        	simpleDesc : this.tempateForm.simpleDesc,
			        	plateformResId : 'mlrtongSmsPlateform',
			        	content : this.content,
			        	signName : this.signName
			        }
			        if(this.id){
			        	param.id = this.id;
			        	updateSmsTemplet(param).then(resp => {
			        		if(resp.code == '0'){
				        		this.$message({type : 'success' ,message : '修改成功'});
				        		this.$emit('change',false);
				        		this.$emit('success');
				        	}else{
				        		this.$message.error(resp.messageExt || '修改失败');
				        	}
			        	})
			        }else{
			        	addSmsTemplet(param).then(resp => {
				        	if(resp.code == '0'){
				        		this.$message({type : 'success' ,message : '保存成功'});
				        		this.$emit('change',false);
				        		this.$emit('success');
				        	}else{
				        		this.$message.error(resp.messageExt || '保存失败');
				        	}
				        });
			        }
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
			if(this.id){
				querySmsTempletInfo({id:this.id}).then(resp => {
					this.tempateForm.simpleDesc = this.$lodash.get(resp,'result.rows[0].simpleDesc');
					this.tempateForm.content = this.$lodash.get(resp,'result.rows[0].content');
					this.loading = false;
				});
			}else{
				this.loading = false;
			}
		}
	}
</script>

<style>
	.template__form{
		margin-top:20px;
	}
	.template__msg{
		text-align: right;
	}
</style>