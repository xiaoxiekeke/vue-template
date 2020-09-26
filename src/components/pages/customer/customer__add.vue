<template>
	<el-dialog
          title="编辑信息"
          :visible.sync="show"
          :append-to-body="true"
          :before-close="beforeClose"
          width="530px">
        <el-form ref="customerForm" :model="formData" :rules="rules" label-width="120px" label-position="left"
         class="customer-form">
		    <el-form-item label="客户姓名" prop="name">
		      <el-input v-model.trim="formData.name" class="form-content" placeholder="请输入客户姓名" auto-complete="off"></el-input>
		    </el-form-item>
	        <el-form-item label="微信号" prop="wechat">
		      <el-input v-model.trim="formData.wechat" class="form-content" placeholder="请输入微信号" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="QQ" prop="qq">
		      <el-input v-model.trim="formData.qq"  class="form-content" placeholder="请输入qq号码" auto-complete="off"></el-input>
		    </el-form-item>
		     <el-form-item label="电子邮件" prop="email">
		      <el-input v-model.trim="formData.email"  class="form-content" placeholder="请输入电子邮件" auto-complete="off"></el-input>
		    </el-form-item>
		      <el-form-item label="备注" prop="">
		      <el-input v-model.trim="formData.remark" type="textarea" :rows="4" class="form-content" placeholder="请输入备注信息" auto-complete="off"></el-input>
		    </el-form-item>
		</el-form>
	   
	   <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button @click.stop="submit" :disabled="isSubmit" type="primary" >确定</el-button>
		</span>
    </el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {updateCustomer} from '@/api/crm.js'
	import {mapState} from 'vuex'
	export default {
		name : 'user-add',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','userData','customerData'],
		data : function () {
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入姓名','姓名格式不正确'],
	       			  result = validateRule(value,['require','name']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
	      	}
	      	var validateWechat = (rule, value, callback) => {
				const errorTip = ['微信号格式不正确'];
	       		if(value && validateRule(value,['wechat']) >= 0){
	       			callback(new Error(errorTip[0]));
	       		}else{
	       			callback();
	       		}
	      	}
	      	var validateQQ = (rule, value, callback) => {
				const errorTip = ['qq格式不正确'];
	       		if(value && validateRule(value,['qq']) >= 0){
	       			callback(new Error(errorTip[0]));
	       		}else{
	       			callback();
	       		}
	      	}
	      	var validateEmail = (rule, value, callback) => {
				const errorTip = ['邮箱格式不正确'];
	       		if(value && validateRule(value,['email']) >= 0){
	       			callback(new Error(errorTip[0]));
	       		}else{
	       			callback();
	       		}
	      	}
			return {
				formData : {
					id : this.customerData.user_id,
					name : this.customerData.customer_name || '',
					wechat : this.userData.wechat || '',
					qq : this.userData.qq || '',
					email : this.userData.email || '',
					remark : this.userData.remark || ''
				},
				extendData : this.userData || {},
				rules : {
					name : [{ validator: validateName, trigger: 'blur' }],
					wechat : [{ validator: validateWechat, trigger: 'blur' }],
					qq : [{ validator: validateQQ, trigger: 'blur' }],
					email : [{ validator: validateEmail, trigger: 'blur' }]
				},
				isSubmit : false
			}
		},
		computed : {
			...mapState('user',[
				'business'
            ])
		},
		methods : {
			//events
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			},
			submit : function(){
		     	this.$refs['customerForm'].validate((valid) => {
		     		if(!valid){
		     			return false;
		     		}
		     		this.extendData.qq = this.formData.qq;
		     		this.extendData.wechat = this.formData.wechat;
		     		this.extendData.email = this.formData.email;
		     		this.extendData.remark = this.formData.remark;
		     		let param = {
		     			user_id : this.formData.id,
		     			business_id : this.business.id,
		     			business_name : this.business.name,
		     			customer_name : this.formData.name,
		     			user_data : this.extendData
		     		}
		     		updateCustomer(param).then(resp => {
		     			if(resp.code == 0){
		     				this.$message({message : "保存成功",type : 'success'})
		     				this.$emit('success',this.formData,this.extendData)
		     				this.$emit('change',false)
		     			}else{
		     				this.$message.error('保存失败')
		     			}
		     		});
		     	});
			}
		}
	}
</script>

<style lang="less">
	.customer-form{
		.form-content{
			width:310px;
		}
	}

</style>