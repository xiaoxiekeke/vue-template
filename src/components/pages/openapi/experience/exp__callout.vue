<template>
	<div class="openapi">
		<div class="exp__call">
			<div class="call">
				<div class="call-btn" @click="showCallOut()"></div>
				<div class="call-txt">点击体验</div>
			</div>
		</div>
		<div class="exp__interface">
			<h4>接口体验
			 	<el-tooltip class="item" effect="dark" placement="right-start">
		            <div slot="content">
		            	通过能力开放平台的接口，几步完成外呼体验。
		            </div>
		            <i class="el-icon-question icon-tip"></i>
		        </el-tooltip>
			    </h4>
			<el-steps :active="step">
			  	<el-step @click.native="stepClick(0)" class="exp__step" title="创建应用"></el-step>
			  	<el-step @click.native="stepClick(1)" title="获取token" class="exp__step"></el-step>
		  		<el-step @click.native="stepClick(2)" title="查询配置" class="exp__step"></el-step>
			  	<el-step @click.native="stepClick(3)" title="发起外呼" class="exp__step"></el-step>
			  	<el-step @click.native="stepClick(4)" title="人机交互结果" class="exp__step"></el-step>
			</el-steps>

			<div class="form-step step0" v-show="step == 0">
				<p class="tip">当前为体验应用信息，可自行前往应用管理<router-link to="/openapi/app" class="link">创建应用</router-link></p>
				<el-form label-width="80px" :model="formData" :rules="rules1" >
				  <el-form-item label="应用名称" prop="appId">
			 		<el-select v-model="formData.appId" @change="appChange"
		 					placeholder="请选择应用" filterable clearable class="form-item">
			      		<el-option v-for="app in appList"
			      			:key="app.app_id"
			      			:label="app.app_name"
			      			:value="app.app_id"
			      		></el-option>
			      	</el-select>
				  </el-form-item>
				  <el-form-item label="appId">
				  		<el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.app_id : '--'"></el-input>
				  </el-form-item>
				   <el-form-item label="业务分类">
			   			<el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.tags : '--'"></el-input>
				  </el-form-item>
				   <el-form-item label="应用类型">
				   		<el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.app_typeDesc : '--'"></el-input>
				  </el-form-item>
				  <el-form-item label="并发数">
				    	<el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.concurrents : '--'"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button :disabled="!!!formData.appId" type="primary" @click.stop="next(1)">下一步</el-button>
				  </el-form-item>
				</el-form>
			</div>

			<div class="form-step step1" v-show="step == 1">
			  	<div class="step-interface">
			  		<div class="step-item">
			  			<label class="lbl">接口名称</label>
			  			<span class="content">获取Token</span>
			  		</div>
			  		<div class="step-item">
			  			<label class="lbl">POST</label>
			  			<span class="content">/oauth/v1/token</span>
			  		</div>
					<h4>请输入参数</h4>
					<el-form label-width="80px" >
			  			<el-form-item label="app_key">
				 			<el-input :value="formData.app_key" :disabled="true"></el-input>
					  	</el-form-item>
					  	<el-form-item label="app_secret">
				 			<el-input :value="formData.app_secret" :disabled="true"></el-input>
					  	</el-form-item>
					  	<el-form-item >
				 			<el-button @click.stop="token" type="primary" v-if="!formData.token">提交</el-button>
							<el-button @click.stop="next(2)" type="primary" v-else>下一步</el-button>
					  	</el-form-item>
					</el-form>
			  	</div>
			  	<div class="step-jsonview">
			  		<exp-jsonview :request="request.token" :response="response.token"></exp-jsonview>
			  	</div>
			</div>

			<div class="form-step step2" v-show="step == 2">
			  	<div class="step-interface">
			  		<div class="step-item">
			  			<label class="lbl">接口名称</label>
			  			<span class="content">查询配置</span>
			  		</div>
			  		<div class="step-item">
			  			<label class="lbl">POST</label>
			  			<span class="content">/config/v1/query?token=</span>
			  		</div>
					<h4>请输入参数</h4>
					<p class="tip">当前为系统体验信息，可自行前往话术库<router-link to="/myspeech" class="link">创建话术</router-link></p>
					<el-form label-width="80px" >
			  			<el-form-item label="type">
				 			<el-select v-model="cfgType" @change="cfgChange" class="select-txt">
				 				<el-option :value="0" label="全部"></el-option>
				 				<el-option :value="1" label="话术"></el-option>
				 				<el-option :value="2" label="线路"></el-option>
				 				<el-option :value="3" label="接口"></el-option>
				 				<el-option :value="4" label="发音人"></el-option>
				 			</el-select>
					  	</el-form-item>
					  	</el-form-item>
					  	<el-form-item >
				 			<el-button @click.stop="queryConfig" type="primary">提交</el-button>
							<el-button @click.stop="next(3)">下一步</el-button>
					  	</el-form-item>
					</el-form>
			  	</div>
			  	<div class="step-jsonview">
			  		<exp-jsonview :request="request.config" :response="response.config"></exp-jsonview>
			  	</div>
			</div>

			<div class="form-step step3" v-show="step == 3">
			  	<div class="step-interface">
			  		<div class="step-item">
			  			<label class="lbl">接口名称</label>
			  			<span class="content">直接外呼</span>
			  		</div>
			  		<div class="step-item">
			  			<label class="lbl">POST</label>
			  			<span class="content">/outbound/v1/task/callout?token=</span>
			  		</div>
					<h4>请输入参数</h4>
					<el-form label-position="left" ref="calloutForm" label-width="100px" :model="formCallout" :rules="rules2" >
					  	<el-form-item label="line_num" prop="line_num" >
					 			<el-select placeholder="请选择线路号码" :loading="lineList.length == 0" v-model="formCallout.line_num" class="select-txt" filterable >
					 				<el-option v-for="line in lineList"
					 					:key="line.line_num"
					 					:label="line.line_num"
					 					:value="line.line_num"
					 				></el-option>
					 			</el-select>
					  	</el-form-item>
					  	<el-form-item label="voice_code" prop="voice_code">
				 				<el-select placeholder="请选择发音人" :loading="voiceList.length == 0"  v-model="formCallout.voice_code" class="select-txt">
					 				<el-option v-for="voice in voiceList"
					 					:key="voice.code"
					 					:label="voice.name"
					 					:value="voice.code"
					 				></el-option>
					 			</el-select>
					  	</el-form-item>
					  	<el-form-item label="robot_id" prop="robot_id"  >
		  					<el-select placeholder="请选择话术" :loading="robotList.length == 0"  class="select-txt" v-model="formCallout.robot_id" @change="robotChange" filterable>
				 				<el-option v-for="robot in robotList"
				 					:key="robot.robot_id"
				 					:label="robot.robot_name"
				 					:value="robot.robot_id"
				 				></el-option>
				 			</el-select>
					  	</el-form-item>
					  	<el-form-item label="call_list" prop="call_list"  v-if="formCallout.call_column.length > 0">
					  		<el-input v-for="(column,index) in formCallout.call_column" 
					  			:key="column"
					  			v-model="varList[index].value"
					  			:placeholder="index == 0 ? '请输入体验号码' : column" class="varinfo" ></el-input>
					  	</el-form-item>
					  	<el-form-item >
				 			<el-button v-if="!callSuccess" :disabled="submit.callout" @click.stop="callout" type="primary">提交</el-button>
				 		 	<el-button v-if="callSuccess" @click.stop="next(4)" type="primary">下一步</el-button>
					  	</el-form-item>
					</el-form>
			  	</div>
			  	<div class="step-jsonview">
			  		<exp-jsonview :request="formCallout" :response="response.callout"></exp-jsonview>
			  	</div>
			</div>

			<div class="form-step step4" v-show="step == 4">
				<div><el-button type="text" @click.stop="back">< 返回</el-button></div>
				<exp-result :receive="receive.callout"></exp-result>
			</div>
		</div>

		<push-im :phoneNum="phoneNum"></push-im>

		<callout-exp  v-if="expDialog" :phone="phone" :id="id" v-model="expDialog"></callout-exp> 
	</div>
</template>

<script>

 	import {mapState, mapActions} from 'vuex'
	import {queryAppList} from '@/api/jsondata.js'
	import {token,queryConfig,callout} from '@/api/openapi'
	import ExpJSONView from './exp__jsonview'
	import ExpCalloutExp from './exp__calloutexp'
	import ExpResult from './exp__result'
	import PushIM from '@/components/common/im/pushim'

	export default {
		name : '',
		props : ['phone'],
		data : function(){
			return {
				phoneNum : '', //外呼号码
				step : 0,
				appList : [],
				curApp : null,
				cfgType : 0,
				//
				robotList : [],
				voiceList : [],
				lineList : [],
				formData : {
					appId : '',
					//
					app_key : '',
					app_secret : '',
					//
					token : '',
				},
				formCallout : {
					robot_id : '',
					line_num : '',
					call_column : [],
					call_list : [],
					voice_code : ''
				},
				varList : [],
				callSuccess : false,
				request : {
					token : {},
					config : {type : 0}
				},
				response : {
					token : {},
					config : {},
					callout : {}
				},
				rules1 : {
					appId : [{required : true,message : '请选择应用'}]
				},
				rules2 : {
					robot_id : [{required : true,message : '请选择话术'}],
					line_num : [{required : true,message : '请选择线路'}],
					voice_code:[{required : true,message : '请选择发音人'}],
					call_list : [{required : true}]
				},
				submit : {
					callout : false
				},
				
				expDialog:false
			}
		},
		computed : {
			...mapState('user',[
                'receive'
            ])
		},
		watch : {
			step : function(val,oldVal){
				if(val == 3){
					queryConfig({},null,this.formData.token).then(resp =>{
						this.robotList = this.$lodash.get(resp,'result.robots',[]);
						this.voiceList = this.$lodash.get(resp,'result.voices',[]);
						this.lineList = this.$lodash.get(resp,'result.lines',[]);
					});
				}
			},
			varList : {
				handler : function(val,oldval){
					let varList = [];
					for(let v of val){
						varList.push(v.value);
					}
					this.formCallout.call_list = [varList];
				},
				deep : true
			}
		},
		methods : {
			...mapActions('user',[
                'setReceive'
            ]),
            stepClick : function(step){
            	if(parseInt(this.step) <= parseInt(step)){
            		return;
            	}
            	this.step = step;
            	this.resetData(step);
            },
			next : function(step){
				this.step = step;
			},
			back : function(){
				this.step = 0;
				this.resetData(0);
			},
			resetData : function(step){
				this.setReceive({type : 'callout',data : null})
				if(parseInt(step) <= 3){
					//
					this.formCallout.robot_id = '';
					this.formCallout.line_num = '';
					this.formCallout.call_column = [];
					this.formCallout.call_list = [];
					this.formCallout.voice_code = [];
					//
					this.varList = [];
					this.response.callout = {};
				}
				if(parseInt(step) <= 2){
					this.request.config.type = 0;
					this.response.config = {};
				}
				if(parseInt(step) <= 1){
					this.request.token = {};
					this.response.token = {};
				}
				if(step == 0){
					this.formData.appId = '';
					this.formData.app_key = '';
					this.formData.app_secret = '';
					this.formData.token = '';
					this.curApp = null;
				}
				this.callSuccess = false;
			},
			//获取token
			token : function(){
				token({
					app_key : this.formData.app_key,
					app_secret : this.formData.app_secret
				}).then(resp => {
					this.response.token = resp;
					if(resp.code == 0){
						this.formData.token = this.$lodash.get(resp,'result.token','')
					}
				});
			},
			//查询配置
			queryConfig : function(){
				queryConfig({type : this.cfgType},null,this.formData.token).then(resp =>{
					this.response.config = resp;
				})
			},
			//直接外呼
			callout : function(){
				this.$refs.calloutForm.validate((valid) => {
					if(!valid){
						return false;
					}
					let callList = this.formCallout.call_list,
						result = true;
					for(let v of callList[0]){
							if(!v){
								result = false;
								break;
							}
					}
					if(!result){
						this.$message.error('请输入动态信息');
						return;
					}
				  	if(!/^1[3|4|5|7|8]\d{9}$/.test(callList[0][0])){
			          this.$message.error('号码格式不正确');
			          return;
			      	}
			      	this.phoneNum = callList[0][0];
			  
	      			this.submit.callout = true;
					callout({
						robot_id : this.formCallout.robot_id,
						line_num : this.formCallout.line_num,
						call_column : this.formCallout.call_column,
						call_list : this.formCallout.call_list,
						voice_code : this.formCallout.voice_code
					},null,this.formData.token).then(resp => {
							this.submit.callout = false;
							this.response.callout = resp;
							this.callSuccess = resp.code == 0;
					});
				});
			},
			appChange : function(val){

				if(!val){
					this.curApp = null;
					this.formData.app_key = '';
					this.formData.app_secret = '';
					return;
				}
				let result = null;
				for(let app of this.appList){
					if(app.app_id == this.formData.appId){
						result = app;
						break;
					}
				}
				if(result){
					this.curApp = result;
					this.curApp.app_typeDesc="呼出"
					this.formData.app_key = result.app_key;
					this.formData.app_secret = result.app_secret;
					this.request.token = {app_key : result.app_key,app_secret : result.app_secret};
				}
			},
			cfgChange : function(val){
				this.request.config = {type : val}
			},
			robotChange : function(val){
				if(!val){
					this.formCallout.call_column = [];
				}else{
					let result = null;
					for(let robot of this.robotList){
						if(robot.robot_id == val){
							result = robot;
							break;
						}
					}
					this.formCallout.call_column = result.call_column;
					let varList = [];
					if(result.call_column){
						for(let column of result.call_column){
							varList.push({value : ''});
						}
					}
					//varList[0].value = this.phone;
					this.varList = varList;
				}
			},
			showCallOut:function(){
				this.expDialog=true
			}
		},
		mounted : function(){
			queryAppList().then(resp => {
				this.appList = this.$lodash.get(resp,'result.rows',[]);
			});
		},
		components : {
			'exp-jsonview' : ExpJSONView,
			'callout-exp' : ExpCalloutExp,
			'exp-result' : ExpResult,
			'push-im' : PushIM
		}
	}
</script>

<style lang="less" scope> 
	.openapi{
		.exp__call{
			height:100px;
			padding: 0px 30px;
			background-color:#fff;
			.call{
				width:60px;
				position: relative;
    			top: 8px;
    			cursor:pointer;
				.call-btn{
					background:url(./images/call-icon.png) 3px 1px no-repeat;
					height:60px;
					width:60px;
					background-color: #d6f7f1;
	    			border-radius: 50%;
				}
				.call-txt{
					line-height:30px;
					text-align:center;
				}
			}
			.call:hover{
				.call-txt{
					color:#02cfa5
				}
				.call-btn{
					background-color: #02cfa5;
					background-position: -5px -50px;
				}
			}
		}
		.exp__interface{
			margin-top:14px;
			padding: 15px 30px;
			background-color:#fff;
			.tip{
				color:#878a92;
			}
		}
		.form-step{
			margin-top:20px;
			.select-txt{
				width:300px;
			}
			.step-item{
				.lbl{
					display:inline-block;
					width:80px;
					text-align:right;
					font-size: 14px;
				    color: #606266;
				    line-height: 40px;
				    padding: 0 12px 0 0;
				    box-sizing: border-box;
				}
				.content{

				}
			}
			.step-jsonview{
			    flex: 1;
			}
			.step-interface{
				flex: 1;
				margin-right: 30px;
				.varinfo{
					margin-bottom:10px;
					margin-right:5px;
					width:45%;
				}
				.select-txt{
					width:100%;
				}
			}
			.form-item.input-txt{
				width:218px;
			}
		}
		.step1,.step2,.step3{
			display:flex;
		}
		.exp__step{
			.is-finish{
				.el-step__icon.is-text{
					cursor:pointer;
				}
			}
			.el-step__title.is-finish{
				cursor:pointer;
			}
		}
	}
	
</style>