<template>
	 <div class="report" v-loading="loading">
        <div class="report__title">
    		<h3 class="report__head">数据总览</h3>
        	<div class="report__search">
	         	<div class="report__date">
	         		<k-date v-model="curDate" @change="dateChange"></k-date>
	         	</div>
	         	<div class="report__select">
					 <!-- <el-select
				  		class="form-content"
					    v-model="speech"
					    @change="speechChange" 
					    multiple collapse-tags filterable remote reserve-keyword clearable
					    placeholder="所有话术"
					    :remote-method="getSpeechList">
				     	<el-option 
				     		v-for="item in speechList" 
				     		:key="item.value" 
				     		:label="item.label" 
				     		:value="item.value">
					    </el-option>
					  </el-select> -->
					  	<el-select 
					  		class="select-txt-mini" 
					  		v-model="callee" 
					  		placeholder="所有被叫号码"
					  		@change="calleeChange" 
					  	 	multiple 
					   		:collapse-tags="true">
					  		<el-option
					  		v-for="item in calleeList"
					  		:key="item.label"
					  		:label="item.label"
					  		:value="item.label">
					  		</el-option>
					  	</el-select>
	         	</div>
	         	<div class="report__right">
					<el-button :disabled="downLoading" @click.stop="exportData" size="small" type="primary">导出</el-button>
				</div>
	        </div>
        </div>
        <div class="report__item report__overview">
        	<div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">接待量</p>
		                <span class="report__value">{{summary.totalAnswer}}</span>通
		            </div>
	            </div>
	        </div>
	        <!-- <div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">平均通话时长</p>
		                <span v-if="!!avgDuration[0]">
		                	<span class="report__value">{{avgDuration[0]}}</span>分钟</span>
		                <span class="report__value">{{avgDuration[1]}}</span>秒
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">通话总时长</p>
		                <span v-if="!!totalDuration[0]">
		                	<span class="report__value">{{totalDuration[0]}}</span>小时</span>
		                <span class="report__value">{{totalDuration[1]}}</span>分钟
		            </div>
	            </div>
	        </div> -->
	        <div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">平均通话时长</p>
		                <span v-if="!!avgDuration[0]"><span class="report__value">{{avgDuration[0]}}</span>小时</span>
		                <span v-if="!!avgDuration[1]"><span class="report__value">{{avgDuration[1]}}</span>分钟</span>
		                <span class="report__value">{{avgDuration[2]}}</span>秒
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">通话总时长</p>
		                <span v-if="!!totalDuration[0]"><span class="report__value">{{totalDuration[0]}}</span>小时</span>
		                <span v-if="!!totalDuration[1]"><span class="report__value">{{totalDuration[1]}}</span>分钟</span>
		                <span class="report__value">{{totalDuration[2]}}</span>秒
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	        	<div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">转人工量</p>
		                <span class="report__value">{{summary.transferCount?summary.transferCount:0}}</span>通
		            </div>
	            </div>
	        </div>
        </div>
        <div class="report__item report__overview">
        	<div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">A类客户占比</p>
		                <span class="report__value">{{summary.A?summary.A:0}}</span>%
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	            <div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">B类客户占比</p>
		                <span class="report__value">{{summary.B?summary.B:0}}</span>%
		            </div>
	            </div>
	        </div>
	        
	        <div class="report__data">
	        	<div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl">短信发送量</p>
		                <span class="report__value">{{summary.smsCount?summary.smsCount:0}}</span>次
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	        	<div class="report__data__content">
		            <div class="report__desc">
		                <p class="report__lbl"></p>
		                <span class="report__value"></span>
		            </div>
	            </div>
	        </div>
        </div>


        <h3 class="report__head">意向客户</h3>
	   	<div class="report__item report__taglist">
			<div class="report__tag" :style="{'background' : tag.color}" v-for="tag in tagList">
				<div class="report__count"><span class="report__value">{{tag.num}}</span>通</div>
				<div class="report__level" >{{tag.name}}</div>
			</div>
	   	</div>


	   	<h3 class="report__head">通话分析</h3>
		<div class="report__item report__callAnalysis">
			<div class="callDurationIn pie"></div>
			<div class="interactCountIn pie"></div>
	   	</div>
        
        
        <!-- <h3 class="report__head">通话量趋势</h3> -->
        <div v-if="chartIsNull" class="report__item report__chartIn">
        	<span class="empty">暂无数据</span>
        </div>
        <div v-show="!chartIsNull" class="report__item report__chartIn"></div>

    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

import {queryLabelOptionList} from '@/api/bm.js'
import {queryIntention,queryCallNum} from '@/api/outbound-data.js'
import {indexStatistics} from '@/api/taichi-data-api.js'
import {addDownloadTask} from '@/api/download-center-api.js'
import {querySpeechSkill} from '@/api/brain.js'
import {queryCPNInfoWithBus} from '@/api/resmanage.js'
import KDate from '@/components/common/date/k-date'
import {milliFormat} from '@/api/utils.js'

export default {
	name: 'report',
	data : function () {
		return {
			myChart : null,
			tagColorList : ['#ffc12b','#3dbdff','#13cd9f','#73a1b9'],
			tagColorList : ['linear-gradient(45deg,rgba(58,133,255,1),rgba(61,161,255,1))',
							'linear-gradient(45deg,rgba(108,115,255,1),rgba(138,144,255,1))',
							'linear-gradient(45deg,rgba(71,215,223,1),rgba(92,235,242,1))',
							'linear-gradient(45deg,rgba(255,173,96,1),rgba(255,194,138,1))'],
			loading : true,
			tagList : [],
			speechList : [],
			callee:[],
			calleeList:[],
			curDate : [this.$moment().format('YYYY-MM-DD'),this.$moment().format('YYYY-MM-DD')],
			speech : [],
			summary : {
				totalAnswer:0,
				totalTel:0,
				avgDuration : 0,
		        totalDuration : 0,

				A:0,
				B:0,
		        transferCount: 0,
		        smsCount:0
			},
			callAnalysis:{
				callDuration:{},
				interactCount:{},
				callTotal:{},
				callAnswer:{}
			},
			chartIsNull : true,
			reportData:null,
			downLoading:false
		}
	},
	watch : {
		isCollapse : function(val,oldVal){
			var _this = this;
			if(_this.myChart){
				setTimeout(function(){_this.myChart.resize()},500)
			}
		}
	},
	computed : {
	 	...mapState('user',[
      		'isCollapse',
      		'business'
  		]),
		// avgDuration : function(){
		// 	let avgDuration = this.summary ? this.summary.avgDuration || 0 : 0,
  //   		tsec = Math.round(avgDuration),
  //   		tmins = parseInt(tsec / 60);
	 //    	if(tmins == 0){
	 //    		return [0,tsec];
	 //    	}
	 //    	tsec = tsec % 60;
	 //    	return [tmins,tsec];
		// },
		// totalDuration : function(){
		// 	let totalDuration = this.summary ? this.summary.totalDuration || 0 : 0,
		// 		mins = parseInt((totalDuration + 59)/60),
		// 		hour = parseInt(mins / 60);
		// 	if(hour == 0){
		// 		return [0,mins];
		// 	}
		// 	mins = mins % 60;
		// 	return [hour,mins];
		// },
		avgDuration : function(){
			let avgDuration = this.summary ? this.summary.avgDuration || 0 : 0,
    		tsec = Math.ceil(avgDuration),
    		thours=parseInt(tsec / 3600),
    		tmins = parseInt((tsec-thours*3600)/60);
	    	tsec = tsec % 60;
	    	return [thours,tmins,tsec];
		},
		totalDuration : function(){
			let totalDuration = this.summary ? this.summary.totalDuration || 0 : 0,
				sec = Math.ceil(totalDuration),
				hour = parseInt(sec / 3600),
				min = parseInt((sec-hour*3600)/60);
			sec = sec % 60;
			return [hour,min,sec];
		},
		connectTotalNum : function(){
			let num = this.summary ? this.summary.connectTotalNum || 0 : 0;
			return milliFormat(num);
		},
		lStartTime : function(){
			return Date.parse(this.curDate[0]);
		},
		lEndTime : function(){
			return Date.parse(this.curDate[1]);
		},
		returnType : function(){
			let timeDiff = this.lEndTime - this.lStartTime,
            	dayDiff = 86400000;
	        if(this.curDate[0] == this.curDate[1]){
	            return 'hour';
	        }else if(timeDiff >= dayDiff  && timeDiff <= dayDiff * 30){
	           	return 'day';
	        }else if(timeDiff > dayDiff * 30){
	            return 'month'
	        }
			return 'day';
		},
		//开始和结束时间中的月份数
		monthCount : function(){
		   	let date1 = this.curDate[0].split("-"),
		    	date2 = this.curDate[1].split("-");
		    let year1 = parseInt(date1[0]) , 
		        month1 = parseInt(date1[1]) , 
		        year2 = parseInt(date2[0]) , 
		        month2 = parseInt(date2[1]), 
		        months = (year2 - year1) * 12 + (month2-month1) + 1;
		    return months; 
		}
	},
	methods : {
		...mapActions('user',[
	        'addDownTask'
	    ]),
		initData:function(){
			var _this = this;
			var param={
				"businessId":this.business.id,
				"channelCode":2,
				"callee":this.callee,
				"beginTime":parseInt(this.curDate[0].replace(/-/g,"")),
				"endTime":parseInt(this.curDate[1].replace(/-/g,"")),
				"direction": 0
			}
			indexStatistics({
				...param	
			}).then((data) => {
				if(data.code!=0){
					_this.$message.error('报表数据加载失败');
				   	_this.loading = false;
				   	return
				}
				_this.reportData = _this.$lodash.get(data,'result.rows[0]',{});
				let tagIntention = this.$lodash.get(data,'result.rows[0].tagIntention'),
					chartData = _this.reportData[this.returnType],
					summary = this.$lodash.get(data,'result.rows[0].summary',{});
				this.callAnalysis=this.$lodash.get(data,'result.rows[0].callAnalysis',{}); 
				let newTagList = [];
				// 意向标签数据
				for(let tag of _this.tagList){
					tag.num = 0;
					for(let key in tagIntention){
						if(tag.name == key){
							tag.num = tagIntention[key];
						}
					}
					newTagList.push(tag)
				}
				_this.tagList  = newTagList;

				// 数据总览
				_this.summary.totalAnswer =summary.totalAnswer || 0;
				_this.summary.totalTel =summary.totalTel || 0;
				_this.summary.totalDuration =summary.totalDuration/1000 || 0;
				_this.summary.avgDuration =summary.avgDuration/1000 || 0; 
				_this.summary.A =summary.A || 0;
				_this.summary.B =summary.B || 0;
				_this.summary.transferCount =summary.transferCount || 0;
				_this.summary.smsCount =summary.smsCount || 0;


				//通话分析
				this.loadCallDurationChart();
				this.loadInteractCountChart();


				//通话量趋势折线图
				this.loadCallChart()

				
			})
		},
		//补全维度
		completeDim : function(chartData = {}){
			let newChatData = {},
				startDay = this.curDate[0].replace(/-/g,''),
				endDay = this.curDate[1].replace(/-/g,'');
			if(this.returnType == 'hour'){
				for(let i = 0; i < 24; i++){
					let key = i < 10 ? '0' + i : i + '';
					newChatData[key] = chartData[startDay+key] || 0;
				}
			}else if(this.returnType == 'day'){
				let dayLen = parseInt((this.lEndTime - this.lStartTime)/86400000) + 1;
				for(let i = 0; i < dayLen; i++){
					let md = this.$moment(startDay).add(i,'days'),
						newKey = md.format('MM-DD'),
						oldKey =md.format('YYYYMMDD');
					newChatData[newKey] = chartData[oldKey] || 0;
				}
			}else if(this.returnType == 'month'){
				for(let i = 0; i < this.monthCount; i++){
					let key = this.$moment(startDay).add(i,'M').format('YYYYMM');
					newChatData[key] = chartData[key] || 0;
				}
			}
			return newChatData;
		},
		getSpeechList : function(keywords){
			let _this = this;
			keywords = keywords || '';
			querySpeechSkill({name : keywords,status : 4, pageIndex:1, pageSize:100}).then(function(data){
				if(data.code == 0){
					let rows = data.result ? data.result.rows || [] : [],
						speechList = [];
					for(let row of rows){
						speechList.push({value : row.id,label : row.name});
					}
					_this.speechList = speechList;
				}
			});
		},
		getCalleeList:function(){
			queryCPNInfoWithBus({businessId: this.$global.getBusinessId(),cpnTypeArr: [1,3],status: 1}).then(resp => {
				this.calleeList = this.$lodash.get(resp,'result.rows',[]).map(item => {
					// this.callee.push(item.cpnCode);
					return {label:item.cpnCode,value: item.cpnCode}
				})
			})
		},
		transferToChatData : function(list){
	        if(list == null || list.length == 0)
	            return null;
	        let chartData = {xAxis : [],series : []};
	        let xAxis = [],series = [];
	        for(let i = 0,len = list.length; i < len; i++){
	            let row = list[i];
	            xAxis.push(row.time);
	            series.push(row.connectNum);
	        }
	        chartData.xAxis = xAxis;
	        chartData.series = series;
	        return chartData;
	    },
	    loadCallDurationChart:function(){//通话时长饼图
	    	var callDuration=this.callAnalysis.callDuration;
	    	var data=[]
	    	for (let key in callDuration) {
	    		data.push({name:key,value:callDuration[key]})
	    	}
	    	this.CallDurationChart = echarts.init(document.querySelector('.callDurationIn'));
	    	var option = {
	    		color:['#3AA0FF','#6C88FF','#48D8E0','#F67FF5','#FFAD60'],
			    title : {
			        text: '通话时长',
			        textStyle:{
			        	fontSize:14,
						fontFamily:'PingFang',
						color:'rgba(153,153,153,1)',
						lineHeight:72
			        },
			        subtext: '',
			        x:'center',
			        bottom:40,
			        left:'33%'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'right',
			        top:'20%'
			        // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
			    },
			    series : [
			        {
			            name: '通话时长',
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data:data,
			            label:{
			            	show:false
			            },
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
			this.CallDurationChart.setOption(option);
	    },
	    loadInteractCountChart:function(){//对话轮次饼图
	    	var interactCount=this.callAnalysis.interactCount;
	    	var data=[]
	    	for (let key in interactCount) {
	    		data.push({name:key,value:interactCount[key]})
	    	}
	    	this.InteractCountChart = echarts.init(document.querySelector('.interactCountIn'));
	    	var option = {
	    		color:['#3AA0FF','#6C88FF','#48D8E0','#FFAD60'],
			    title : {
			        text: '对话轮次',
			        textStyle:{
			        	fontSize:14,
						fontFamily:'PingFang',
						color:'rgba(153,153,153,1)',
						lineHeight:72
			        },
			        subtext: '',
			        x:'center',
			        bottom:40,
			        left:'33%'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'right',
			        top:'20%'
			        // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
			    },
			    series : [
			        {
			            name: '对话轮次',
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data:data,
			            label:{
			            	show:false
			            },
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
			this.InteractCountChart.setOption(option);
	    },
	    loadCallChart : function(){
	    	this.loading = false;
	    	//补全维度
	    	var callTotalData = this.completeDim(this.callAnalysis.callTotal[this.returnType]);
			var callTotalList = []
			for(var i in callTotalData){
				callTotalList.push({
					connectNum: callTotalData[i],
					time : i
				});
			}
			callTotalList.sort(function(a,b){return parseInt(a.time) - parseInt(b.time)})
			
			callTotalData=this.transferToChatData(callTotalList)
			Array.prototype.max = function(){//获取数组中的最大值
			  var max = this[0];
			  var len = this.length;
			  for(var i=1; i<len; i++){
			    if(this[i] > max){
			      max = this[i];
			    }
			  }
			  return max;
			}

	        var option = {
	        	color:['#3AA0FF'],
			    title : {
			        text: '',
			        subtext: '',
			        x: 'center',
			        align: 'right'
			    },
			    grid: {
			        bottom: 80
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'cross',
			            animation: false,
			            label: {
			                backgroundColor: '#505765'
			            }
			        }
			    },
			    legend: {
			        data:['通话量'],
			        // x: 'right'
			        right:110
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            axisLine: {onZero: false},
			            data : callTotalData.xAxis,
			            axisLine:{
			            	lineStyle:{
			            		color:'#999'
			            	}
			            }
			        }
			    ],
			    yAxis: [
			        {
			            name: '',
			            max: callTotalData.series.max()?callTotalData.series.max():100,
			            type: 'value',
			            splitNumber:5,
			            minInterval: 1,
			            axisLine:{
			            	lineStyle:{
			            		color:'#999'
			            	}
			            }
			        }
			    ],
			    series: [
			        {
			            name:'通话量',
			            type:'line',
			            animation: false,
			            areaStyle: {
			            	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
			                	{ offset: 0, color: "rgba(58,160,255, 1)"},
			                    { offset: 1, color: "rgba(58,160,255, 0)"}
			                ])
			            },
			            lineStyle: {
			                width: 1
			            },
			            data:callTotalData.series
			        }
			    ]
			};
	       	this.myChart = echarts.init(document.querySelector('.report__chartIn'));
	       	this.myChart.setOption(option);
	       	var _this=this
	       	window.onresize = function () {
	       		_this.CallDurationChart&&_this.CallDurationChart.resize();
                _this.InteractCountChart&&_this.InteractCountChart.resize();
                _this.myChart && _this.myChart.resize();
            }
	    },
	    exportData:function(){
	      	let param = {
				businessId: this.$global.getBusinessId(),
				sysType: 2,
				downloadType: 9,
				channelCode: 2,
				query: {
					channelCode: 2,
					businessId: this.$global.getBusinessId(),
					callee:this.callee,
					direction: 0
				}
			}
			if(this.curDate && this.curDate.length == 2){
				let beginTime = parseInt(this.curDate[0].replace(/-/g,"")),
					endTime = parseInt(this.curDate[1].replace(/-/g,""));
	      		param.query.beginTime = beginTime;
	      		param.query.endTime = endTime;
	      	}

	      	if(!param.query.beginTime || !param.query.endTime){
	      		this.$message.error("日期不能为空");
	      		return;
	      	}

			this.downLoading = true;
			addDownloadTask(param).then(data => {
				if(data.code != 0){
					this.$message.error('导出报表失败');     
				}else{
					this.$message({type : 'success' , message : '已添加到下载中心，请到下载中心查看'})
					this.addDownTask();
				}
				this.downLoading = false;
			})
	    },
		//event
		dateChange : function(val){
			this.initData();
		}, 
		calleeChange : function(val){
			this.initData();
		}
	},
	/*beforeRouteEnter : function(to, from, next){
		next(vm => {
			vm.initData();
		});
	},*/
	mounted : function(){
		console.log('mountedIn')
		var _this = this;
		queryLabelOptionList().then(function(data){
			if(data.code == 0){
				let rows = data.result ? data.result.rows || [] : [],
					tagList = [],index = 0;
				for(let row of rows){
					if(row.talkScriptFlag != 0) {
	                     continue;
                	}
                	tagList.push({
                		code : row.contextId,
                		name : row.name,
                		desc : row.description,
                		color : _this.tagColorList[index] || '#73a1b9',
                		num : 0
                	});
                	index++;
				}
				_this.tagList  = tagList;
			}
			// setTimeout(()=>{
			// 	_this.initData();
			// },0)
			
		});
		this.getCalleeList();
		// this.getSpeechList();
	},
	components : {
		'k-date' : KDate
	}
}
</script>
<style lang="less" scoped>
	.report{
		margin-top: 20px;
		.report__title{
			display:flex;
			justify-content:space-between;
		}
		.report__search{
			.report__date{
				display:inline-block;
				width:230px;
			}
			.report__select{
				display:inline-block;
				margin-left:10px;
			}
			.report__right{
				float: right;
				margin-left: 10px;
				height: 40px;
				line-height:40px;
			}
		}
		.report__head{
			margin: 0;
		    font-size: 16px;
		    line-height: 34px;
		    font-weight: 700;
		    color: #585858;
		    border-left: 5px solid #01cfa5;
		    height: 18px;
		    line-height:18px;
		    padding-left: 20px;
		    margin-left: 10px;
		}
		.report__item{
			margin-top:15px;
			margin-bottom:20px;
		    box-sizing: border-box;
		    
		}
		.report__callAnalysis{
			overflow: hidden;
			padding-left: 50px;
			.pie{
		    	width: 35%;
		    	float: left;
		    	height: 400px;
		    	margin:0 80px 30px 20px;
		    }
		}
		.report__value{
			font-size:22px;
			padding-right:2px;
		}
		.report__lbl{
			margin:0;
			padding:1px 0 4px 0;
			color: #585858;
		}
		.report__taglist{
		  	display: flex;
		  	background: #fff;
		  	// height: 100px;
		  	justify-content: space-between;
		  	padding:20px 30px;
		  	box-sizing: border-box;

			.report__tag{
			    flex-grow: 0;
			    align-self: center;
			    width:24%;
				height:94px;
				border-radius:5px;
				position: relative;
			}
			.report__level {
			    font-size:72px;
				font-family:DIN Medium;
				font-weight:normal;
				color:rgba(255,255,255,.5);
				line-height:72px;
				position: absolute;
				right: 30px;
				top:20px;
			}
			.report__count {
			    display: inline-block;
			    margin-left: 20px;
			    font-size:12px;
				font-family:PingFang;
				color:rgba(255,255,255,1);
				line-height:72px;
				.report__value{
					font-size:30px;
					font-family:Arial;
					font-weight:bold;
					color:rgba(255,255,255,1);
					line-height:72px;
				}
			}
		}
		.report__overview{
			display: flex;
		  	height: 100px;
  		    justify-content:space-between;

			.report__data{
			    border-radius: 3px;
			    box-sizing:border-box;
			    height: 100px;
			    background-color: #fff;
			    width:24%;
			    font-size:14px;
			    .report__data__content{
			    	padding:25px;
			    	height:50px;
			    	background:rgba(250,252,252,1);
			    	border-radius:5px;
			    }
			    .report__desc{
			    	display:inline-block;
			    	vertical-align:top;
			    	padding-left:5px;
			    }
			    .report__icon{
			    	width: 50px;
				    height: 50px;
				    border-radius: 50%;
				    background: url(./images/report-icon.png) no-repeat;
  					display:inline-block;
			    }
			    .icon-call{
					background-color: #3dbdff;
					background-position:13px 14px;
		    	}
		    	.icon-transfer{
	    		    background-color: #13cd9f;
	    		    background-position:13px -172px;
		    	}
		    	.icon-avgtime{
		    		background-color: #348bde;
		    		background-position:9px -111px;
		    	}
		    	.icon-totaltime{
		    		background-color: #a86afc;
		    		background-position:11px -48px;
		    	}
			}

		}
		.report__chartIn{
			background-color: #fff;
			height:340px;
			position:relative;
			text-align:center;
			.empty{
				background:url(./images/report-icon.png) 0px -251px no-repeat;
			    height: 30px;
			    color:#c7c7c7;
			    margin: auto;
			    position: absolute;
			    top: 0;
			    bottom: 0;
			    padding-left: 34px;
			    padding-top: 10px;
			    line-height: 30px
			}
		}
		
	}
	
</style>