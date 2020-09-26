<template>
	<el-dialog
          title="新增团队成员"
          :visible.sync="show"
          :append-to-body="true"
          :before-close="beforeClose"
          width="530px">
        <el-form ref="usersform" :model="formData" :rules="rules" label-width="120px" label-position="left"
         class="create-form">
		    <el-form-item label="姓名" prop="surname">
		      <el-input v-model.trim="formData.surname" class="form-content" placeholder="请输入姓名" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="手机号码" prop="phone">
		      <el-input v-model.trim="formData.phone"  class="form-content" placeholder="请输入手机号码" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item >
		      <div class="tip">注：该成员的初始密码为手机号的后6位</div>
		    </el-form-item>
		</el-form>
	   
	   <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button v-if="!createLoading" type="primary" @click="addUser">确定</el-button>
		    <el-button v-else :loading="createLoading" type="primary" disabled >提交中</el-button>
		</span>
    </el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {mapState} from 'vuex'
	import {addMember} from '@/api/uc.js'
	export default {
		name : 'user-add',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show'],
		data : function () {
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入姓名','姓名格式不正确','姓名长度不可超过20个字符'],
	       			  result = validateRule(value,['require','name','namelength']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
	      	}
	      	var validatePhoneNum = (rule, value, callback) => {
	      		const errorTip = ['请输入手机号码','手机号码格式不正确'],
	       			  result = validateRule(value,['require','phone']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
	      	}

			return {
				formData : {
					surname : '',
					phone : ''
				},
				rules : {
					surname : [{ validator: validateName, trigger: 'blur' }],
					phone : [{ validator: validatePhoneNum, trigger: 'blur'}]
				},
				createLoading : false
			}
		},
		computed : {
            ...mapState('user',[
                'business'
            ])
		},
		// mount:function(){
		// 	console.log(123)
		// },
		methods : {
			//events
			beforeClose : function(){
				this.$emit('change',false);
				this.createLoading = false;
				
			},
			cancel : function(){
				this.$emit('change',false);
				this.createLoading = false;
			},
			addUser:function(){
				let _this = this;
				_this.createLoading = true;
				this.$refs.usersform.validate((valid) => {
					if(!valid){
						_this.createLoading = false;
						return false;
					}
					let param = {
						..._this.formData,
						businessId:this.business.id
					};
					addMember(param).then(function(data){
						if(data.code == 0){
							_this.formData.surname='';
							_this.formData.phone='';
							_this.$emit("loadList")
						}else{
							if (data.messageExt) {
								_this.$message.error('创建失败，错误信息：'+data.messageExt);	
							}else{
								_this.$message.error('创建失败');	
							}
							
						}
						_this.createLoading = false;
					})
				});
				
			}
		}
	}
</script>