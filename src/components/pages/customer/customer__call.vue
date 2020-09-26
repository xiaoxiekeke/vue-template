<template>
	<div class="page customer__info" v-loading="loading">
		<div class="head">
			<router-link class="link" :to="backUrl"><返回</router-link>
		</div>
		<div class="body">
			<div class="info">
				<h3 class="lbl">通话结果</h3>
				<div class="info__item">
					<label>任务名称：</label>
					<span>{{info.task_name}}</span>
				</div>
				<div class="info__item">
					<label>呼叫时间：</label>
					<span>{{formatTime(info.time_trace)}}</span>
				</div>
				<div class="info__item">
					<label>通话结果：</label>
					<span>{{formatCallResult(info.call_result)}}</span>
				</div>
				<div class="info__item">
					<label>通话时长：</label>
					<span>{{info.call_duration}}秒</span>
				</div>
				<h3 class="lbl">客户意向分类</h3>
				<div class="info__tag">
					<div class="info__tag__item">
						<div class="title">AI分类</div>
						<div><tag :disabled="true" v-model="info.tag_ai_intention"></tag></div>
					</div>
					<div class="info__tag__item">
						<div class="title">人工分类</div>
						<div><tag @change="tagChange" v-model="info.tag_cm_intention"></tag></div>
					</div>
				</div>
				<h3 class="lbl">客户详情</h3>
				<div class="info__item">
					<label>客户姓名：</label>
					<span>{{customer.customer_name || '--'}}</span>
				</div>
				<div class="info__item">
					<label>客户手机号码：</label>
					<span>{{customer.tel_number}}</span>
				</div>
			</div>
			<div class="record">
				<h3 class="lbl">录音详情</h3>
				<div class="record__player">
					<x-audio :src="formatAudioUrl(info.voice_url)"></x-audio>
				</div>
				<h3 class="lbl">对话识别结果</h3>
				<div class="record__inter">
					<chat-list :list="interList"></chat-list>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import XAudio from '@/components/common/player/xaudio'
	import ChatList from '@/components/common/chatlist/chatlist'
	import Tag from '@/components/common/tag/tag'

	import {queryCallDetail,updateTagIntention,queryCustomerInfo} from '@/api/crm.js'
	import {searchCallResultList} from '@/api/outbound-manage.js'

	export default {
		data : function () {
			return {
				loading : true,
				traceId : '',
				userId : '',
				taskId : '',
				info : {},
				customer : {},
				interList : [],
				//
				callresultList : [],
				tagUpdateTimer : null
			}
		},
		computed : {
			...mapState('user',[
				'id',
				'surname',
				'business'
            ]),
            backUrl : function(){
            	let telNum = this.customer.tel_number;
            	if(telNum){
            		return '/custinfo/'+telNum+'/'+this.userId+'/'+this.taskId
            	}
            	return '/customer';
            }
		},
		methods : {
			formatTime(value){
	            if(value === null){
	                return ''
	            }else{
	                return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
	            }
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
	        formatAudioUrl : function(voice_url){
	        	return this.$global.getVoiceFileUrl(voice_url);
	        },
			queryCallDetail : function(){
				this.loading = true;
				let param = {trace_id : this.traceId,business_id : this.business.id},
					cParam = {business_id : this.business.id,user_id : this.userId};
				Promise.all([queryCallDetail(param),queryCustomerInfo(cParam)]).then(values => {
					this.info = this.$lodash.get(values[0],'result.rows[0]',{});
					this.interList = this.info.dialog ? JSON.parse(this.info.dialog) : [];
					this.customer = this.$lodash.get(values[1],'result.rows[0]',{});
					this.loading = false;
				});
			},
			updateTagIntention : function(val){
				let param = {
					business_id : this.business.id,
					business_name : this.business.name,
					tel_number : this.customer.tel_number,
					cm_id : this.id,
					cm_name : this.surname,
					task_id : this.info.task_id || '',
					task_name : this.info.task_name || '',
					task_data_id : this.info.task_data_id || '',
					tag_ai_intention : this.info.tag_ai_intention || '',
					trace_id : this.traceId,
					tag_cm_intention : val
				};
				updateTagIntention(param).then(resp => {
					if(resp.code == 0){
						this.$message({type : 'success',message : '保存成功'})
					}else{
						this.$message.error('保存失败');
					}
				});
			},
			tagChange : function(val){
				var _this = this;
				clearTimeout(this.tagUpdateTimer);
				this.tagUpdateTimer = setTimeout(function(){
					_this.updateTagIntention(val);
				},1500);
			}
		},
		mounted : function(){
			searchCallResultList().then(resp => {
				let rows = this.$lodash.get(resp,'result.rows',[]),
					call_result = [];
				for(let row of rows){
					call_result.push({label : row.desc,value : row.code})
				}
				this.callresultList = call_result;
			});
		},
		beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.traceId = vm.$route.params.traceId;
				vm.userId = vm.$route.params.userId;
				vm.taskId = vm.$route.params.taskId;
				vm.info = {};
				vm.interList = [];
				vm.queryCallDetail();
			});
		},
		components: {
			'x-audio' : XAudio,
			'chat-list': ChatList,
			'tag' : Tag
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
			h3.lbl{
				margin:0;
				padding:10px 0 10px 10px
			}
			.info{
				background-color:#fff;
				display:inline-block;
				min-width:300px;
				border:1px solid #eee;
				padding:10px;
			}
			.info__item{
				padding:10px 0 10px 30px;
			}
			.info__tag{
				display:flex;
				justify-content:space-around;
				margin-bottom:10px;
				.info__tag__item{
					text-align:center;
					width:120px;
					.title{
						margin:15px 0;
					}
				}
			}
			.record{
				padding:10px 20px;
				background-color:#fff;
				flex-grow:2;
				margin-left:15px;
				.record__player{
					height:35px;
					padding-left:35px;
					margin:20px 0 10px 0;
				}
				.record__inter{
					padding-left:35px;
				}
			}
		}
	}
	
</style>