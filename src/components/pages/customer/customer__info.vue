<template>
	<div class="page customer__info" v-loading="loading">
		<div class="head">
			<router-link class="link" to="/customer"><返回</router-link>
		</div>
		<div class="body">
			<div class="info">
				<h3 class="lbl">负责人</h3>
				<div class="info__item">
					<label>负责人：</label>
					<span>{{curCmName}}</span>
				</div>
				<h3 class="lbl">基本资料<span @click.stop="editDialog = true" title="修改" class="info-edit el-icon-edit-outline"></span></h3>
				<div class="info__item">
					<label>客户姓名：</label>
					<span>{{customerInfo.customer_name || '--'}}</span>
				</div>
				<div class="info__item">
					<label>客户来源：</label>
					<span>{{customerInfo.source_cm_name || '--'}}</span>
				</div>
				<div class="info__item">
					<label>手机号码：</label>
					<span>{{customerInfo.tel_number || '--'}}</span>
				</div>
				<div class="info__item">
					<label>QQ：</label>
					<span>{{userData.qq || '--'}}</span>
				</div>
				<div class="info__item">
					<label>微信：</label>
					<span>{{userData.wechat || '--'}}</span>
				</div>
				<div class="info__item">
					<label>电子邮件：</label>
					<span>{{userData.email || '--'}}</span>
				</div>
				<div class="info__item">
					<label>备注：</label>
					<span>{{userData.remark || '--'}}</span>
				</div>
			</div>
			<div class="record">
				<div class="record__form">
					<h3>选择任务</h3>
					<div class="record__head">
						 <el-select v-model="taskId" placeholder="请选择">
						    <el-option v-for="item in taskList"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
						  <div>
			  				<span class="record__cur">当前跟进阶段：{{curTrace}}</span>
			  				<span class="record__cur">当前意向等级：{{curTag}}</span>
						  </div>
					</div>

					<h3>跟进记录</h3>
					<div>
						<el-form ref="traceForm" label-width="80px" :model="formData" :rules="rules" :inline="true" >
							<el-row type="flex" class="row-bg" justify="space-between">
	  							<el-col :span="12">
									 <el-form-item label="拜访形式" prop="contact_way">
									    <el-select v-model="formData.contact_way" >
								    	  	<el-option v-for="item in contactWayList"
										      :key="item.value"
										      :label="item.label"
										      :value="item.value">
										    </el-option>
									    </el-select>
									  </el-form-item>
	  							</el-col>
	  							<el-col :span="12">
	  								 <el-form-item label="跟进阶段" prop="trace_stage">
									 	 <el-select v-model="formData.trace_stage" >
								    	  	<el-option v-for="item in traceStageList"
										      :key="item.value"
										      :label="item.label"
										      :value="item.value">
										    </el-option>
									    </el-select>
									  </el-form-item>
	  							</el-col>
							</el-row>
							<el-row type="flex" class="row-bg" justify="space-between">
	  							<el-col :span="12">
									 <el-form-item label="意向等级" prop="tag_intention">
									     <el-select v-model="formData.tag_intention" >
								    	  	<el-option v-for="item in tagIntention"
										      :key="item.value"
										      :label="item.label"
										      :value="item.value">
										    </el-option>
									    </el-select>
									  </el-form-item>
	  							</el-col>
	  							<el-col v-if="formData.contact_way == '0'" :span="12">
	  								 <el-form-item label="通话结果" prop="callresult">
									     <el-select v-model="formData.callresult" >
								    	  	<el-option v-for="item in callresultList"
										      :key="item.value"
										      :label="item.label"
										      :value="item.value">
										    </el-option>
									    </el-select>
									  </el-form-item>
	  							</el-col>
							</el-row>
							<div>
								<el-input v-model="formData.trace_detail" maxlength="100" rows="3" resize="none" type="textarea" placeholder="请输入跟进记录"></el-input>
							</div>
							<div class="record_opt">
								<el-button @click.stop="addTrace" :disabled="isSubmit" type="primary">提 交</el-button>
							</div>
						</el-form>
					</div>
				</div>
				<div class="record__list">
					<template v-for="item in recordList">
						<div v-if="item.trace_type != 'ai'" class="record__item">
							<i class="record-icon icon__people"></i>
							<div class="record__data">
								<span>{{item.cm_name}}-{{formatContanctWay(item.contact_way)}}-{{formatCallResult(item.callresult)}}</span>
								<span class="fr">{{formatTime(item.time_trace)}}</span>
							</div>
							<div class="record__data">
								<span>跟进阶段：{{formatTraceStage(item.trace_stage)}}</span>
								&nbsp;&nbsp;
								<span>意向等级：{{item.tag_cm_intention}}</span>
							</div>
							<div class="record__data">
								{{item.trace_detail}}
							</div>
						</div>
						<div v-else class="record__item">
							<i class="record-icon icon__ai"></i>
							<div class="record__data">
								<span>AI-电话拜访-{{item.customer_name}}-{{formatCallResult(item.call_result)}}</span>

								<span class="fr">{{formatTime(item.time_trace)}}</span>
							</div>
							<div class="record__data">
								<span>跟进阶段：AI初访</span>
								&nbsp;&nbsp;
								<span>意向等级：{{item.tag_ai_intention || '--'}}</span>
								<span class="fr">
									<router-link class="link" :to="'/custcall/'+user_id+'/'+taskId+'/'+item.trace_id"><span v-if="item.call_duration">{{item.call_duration}}秒&nbsp;&nbsp;</span> 通话详情</router-link>
								</span>
							</div>
						</div>
					</template>
					
				</div>
			</div>
		</div>
		<customer-add @success="editSuccess" v-if="editDialog" :userData="userData" :customerData="customerInfo" v-model="editDialog"></customer-add>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import CustomerAdd from './customer__add'
	import {addTrace,queryCustomerInfo,queryCustomerTrace} from '@/api/crm.js'
	import {getCustomerConfig} from '@/api/jsondata.js'
	import {queryLabelOptionList} from '@/api/bm.js'
	import {searchCallResultList} from '@/api/outbound-manage.js'

	export default {
		data : function () {
			return {
				loading : true,
				user_id : '',
				telnum : '',
				taskId : '',
				taskList : [],
				//客户基本信息
				customerInfo : {},
				//扩展数据
				userData : {},
				editDialog : false,
				contactWayList : [],
				traceStageList : [],
				callresultList : [],
				tagIntention : [],
				formData : {
					contact_way : '',
					trace_stage : '',
					callresult : '',
					tag_intention : '',
					trace_detail : ''
				},
				rules : {
					contact_way : [{ required: true, message: '请选择拜访形式', trigger: 'change' }],
					trace_stage : [{ required: true, message: '请选择跟进阶段', trigger: 'change' }],
					tag_intention : [{ required: true, message: '请选择客户意向', trigger: 'change' }],
					callresult : [{ required: true, message: '请选择通话结果', trigger: 'change' }]
				},
				recordList : [],
				isSubmit : false
			}
		},
		computed : {
			...mapState('user',[
				'business',
				'account',
				'id',
				'surname'
            ]),
            curTag : function(){
				let record = this.recordList[0];
				if(record){
					return record.tag_cm_intention || record.tag_ai_intention || '--';
				}
				return '--';
			},
			curTrace : function(){
				let record = this.recordList[0];
				if(record && record.trace_type == 'ai'){
					return 'AI初访';
				}else if(record){
					return this.formatTraceStage(record.trace_stage) || '--';
				}
				return '--';
			},
			curCmName : function(){
				let record = this.recordList[0];
				if(record){
					return record.cm_name || '--';
				}
				return '--';
			},
			taskName : function(){
				let taskName = '';
				for(let task of this.taskList){
					if(task.value == this.taskId){
						taskName = task.label;
						break;
					}
				}
				return taskName;
			}
		},
		watch : {
			taskId : function(val,oldVal){
				this.queryCustomerTrace();
			}
		},
		methods : {
			formatTraceStage : function(trace_stage){
				let result = '--';
	        	for(let c of this.traceStageList){
	        		if(c.value == trace_stage){
	        			result = c.label;
	        			break;
	        		}
	        	}
	        	return result;
			},
			formatCallResult : function(call_result){
	        	let result = '--';
	        	for(let c of this.callresultList){
	        		if(c.value == call_result){
	        			result = c.label;
	        			break;
	        		}
	        	}
	        	return result;
	        },
	        formatContanctWay : function(contact_way){
	        	let result = '--';
	        	for(let c of this.contactWayList){
	        		if(c.value == contact_way){
	        			result = c.label;
	        			break;
	        		}
	        	}
	        	return result;
	        },
			formatTime(value){
	            if(value === null){
	                return ''
	            }else{
	                return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
	            }
	        },
	        resetForm : function(){
	        	this.formData = {
					contact_way : '',
					trace_stage : '',
					callresult : '',
					tag_intention : '',
					trace_detail : ''
				};
	        },
			queryCustomerInfo : function(){
				let param = {business_id : this.business.id,user_id : this.user_id};
				queryCustomerInfo(param).then(resp => {
					let rows = this.$lodash.get(resp,'result.rows',[]);
					if(rows == null || rows.length == 0){
						this.$message.error('获取客户信息失败');
						this.loading = false;
						return;
					}
					let row = rows[0];
					this.customerInfo = {
						user_id : this.user_id,
		                customer_name: row.customer_name,
		                tel_number: row.tel_number,
		                cm_id : row.cm_id,
		                cm_name: row.cm_name,
		                source_cm_name: row.source_cm_name
					};
					this.userData = row.user_extend || {};
					this.loading = false;
				});
			},
			getTaskList : function(){
				let taskList = sessionStorage.getItem('__tasklist');
				if(taskList){
					this.taskList = JSON.parse(taskList);
				}
			},
			queryCustomerTrace : function(){
				let param = {
					business_id : this.business.id,
					tel_number : this.telnum,
					task_id : this.taskId
				}
				queryCustomerTrace(param).then(resp => {
					this.recordList = this.$lodash.get(resp,'result.rows',[]);
				});
			},
			//
			editSuccess : function(formData,userData){
				this.userData = userData;
				this.customerInfo.customer_name = formData.name;
			},
			addTrace : function(){
				this.$refs['traceForm'].validate((valid) => {
					if(!valid){
						return false;
					}
					this.isSubmit = true;
					let param = {
						business_id : this.business.id,
						business_name : this.business.name,
						tel_number : this.customerInfo.tel_number,
						cm_id : this.id,
						cm_name : this.surname || this.account,
						task_id : this.taskId,
						task_name : this.taskName,
						contact_way : this.formData.contact_way,
						trace_stage : this.formData.trace_stage,
						tag_cm_intention : this.formData.tag_intention,
						callresult : this.formData.callresult,
						trace_detail : this.formData.trace_detail 
					}
					addTrace(param).then(resp => {
						if(resp.code == 0){
							this.$message({message : '提交成功',type : 'success'});
							this.resetForm();
							this.queryCustomerTrace();
						}else{
							this.$message.error('提交失败')
						}
						this.isSubmit = false;
					});
				});
			}
		},
		beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.user_id = vm.$route.params.id;
				vm.taskId = parseInt(vm.$route.params.taskId);
				vm.telnum = vm.$route.params.telnum;
				vm.recordList = [];
				vm.taskList = [];
				vm.customerInfo = {};
				vm.userData = {};
				vm.queryCustomerInfo();
				vm.queryCustomerTrace();
				vm.getTaskList();
			});
		},
		mounted : function(){
			getCustomerConfig().then(resp => {
				let traceList = this.$lodash.get(resp,'trace_stage',[]);
				this.traceStageList = traceList.length > 2 ? traceList.slice(2) : traceList;
				//
				this.contactWayList = this.$lodash.get(resp,'contact_way',[]);
			});
			queryLabelOptionList().then(resp => {
				let rows = this.$lodash.get(resp,'result.rows',[]),
					tag_intention = [];
				for(let row of rows){
					tag_intention.push({label : row.name,value : row.name})
				}
				this.tagIntention = tag_intention;
			});
			searchCallResultList().then(resp => {
				let rows = this.$lodash.get(resp,'result.rows',[]),
					call_result = [];
				for(let row of rows){
					call_result.push({label : row.desc,value : row.code})
				}
				this.callresultList = call_result;
			});
		},
		components : {
			'customer-add' : CustomerAdd
		}
	}
</script>

<style lang="less" scope>
	@import (reference) "../../../assets/less/var.less";

	.customer__info{
		.head{
			height:40px;
			line-height:40px;
		}
		.body{
			display:flex;
			.info-edit{
				color:@base-color;
				cursor:pointer;
			}
			.info{
				display:inline-block;
				min-width:300px;
				border:1px solid #eee;
				padding:10px;
				background-color:#fff;
				h3.lbl{
					margin:0;
					padding:10px 0 10px 10px;
					display:flex;
					justify-content:space-between;
					align-items:center;
				}
			}
			.info__item{
				padding:10px 0 10px 30px;
			}
			.record{
				background-color:#fff;
				flex-grow:2;
				margin-left:15px;
				.record__form{
					border:1px solid #eee;
					padding:20px;
					.record_opt{
						text-align:right;
						margin-top:10px;
					}
					.record__head{
						display: flex;
					    align-content: center;
					    justify-content: space-between;
					}
					.record__cur{
						padding:0 20px;
						line-height:40px;
					}
				}
			
				.record__list{
					.record__item{
						position:relative;
						margin-top:6px;
						padding:20px;
						padding-left:60px;
						border:1px solid #eee;
						.record__data{
							padding:7px 0;
						}
					}
					.record-icon{
						background:url(./images/icon-customer.png) 0 0 no-repeat;
						width:24px;
						height:24px;
						display: inline-block;
					    position: absolute;
					    left: 19px;
					    width: 28px;
					    height: 28px;
					    top: 24px;
					}
					.icon__people{
						background-position:0 -34px;
					}

					.icon__ai{
						background-position:0 0;
					}
				}
			}
		}
	}
	
</style>