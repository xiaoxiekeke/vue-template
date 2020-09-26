<template>
	 <div class="page report" v-loading="loading">
        <div class="report__title">
    		<h3 class="report__head">意向筛选</h3>
        	<div class="report__search">
	         	<div class="report__date">
	         		<k-date v-model="curDate" @change="dateChange"></k-date>
	         	</div>
	         	<div class="report__select">
	         		<!-- <el-select @change="speechChange" multiple collapse-tags v-model="speech" placeholder="所有话术">
					    <el-option
					      v-for="item in speechList"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					 </el-select> -->
					 <el-select
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
					  </el-select>
	         	</div>
	        </div>
        </div>
	    <div class="report__item report__taglist">
			<div class="report__tag" v-for="tag in tagList">
				<div class="report__level" :style="{'background-color' : tag.color}">{{tag.name}}</div>
				<div class="report__count"><span class="report__value">{{tag.num || '--'}}</span>通</div>
			</div>
	   	</div>
        <h3 class="report__head">数据总览</h3>
        <div class="report__item report__overview">
        	<div class="report__data">
	            <div class="report__data__content">
	            	<i class="report__icon icon-call"></i>
		            <div class="report__desc">
		                <p class="report__lbl">通话量</p>
		                <span class="report__value">{{connectTotalNum}}</span>次
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	            <div class="report__data__content">
	            	<i class="report__icon icon-totaltime"></i>
		            <div class="report__desc">
		                <p class="report__lbl">通话总时长</p>
		                <span v-if="!!callTotalTime[0]">
		                	<span class="report__value">{{callTotalTime[0]}}</span>小时</span>
		                <span class="report__value">{{callTotalTime[1]}}</span>分钟
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	            <div class="report__data__content">
	            	<i class="report__icon icon-avgtime"></i>
		            <div class="report__desc">
		                <p class="report__lbl">平均通话时长</p>
		                <span v-if="!!callAverTime[0]">
		                	<span class="report__value">{{callAverTime[0]}}</span>分钟</span>
		                <span class="report__value">{{callAverTime[1]}}</span>秒
		            </div>
	            </div>
	        </div>
	        <div class="report__data">
	        	<div class="report__data__content">
	            	<i class="report__icon icon-transfer"></i>
		            <div class="report__desc">
		                <p class="report__lbl">转人工量</p>
		                <!-- 敬请期待 -->
		                <span class="report__value">{{callData.transferNum}}</span>次
		            </div>
	            </div>
	        </div>
        </div>
        <h3 class="report__head">通话量趋势</h3>
        <div v-if="chartIsNull" class="report__item report__chart">
        	<span class="empty">暂无数据</span>
        </div>
        <div v-show="!chartIsNull" class="report__item report__chart"></div>

        <h3 class="report__head">历史报表</h3>
        <history-report :cur-date="curDate" ></history-report>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import HistoryReport from '@/components/pages/report/history-report'

import {queryLabelOptionList} from '@/api/bm.js'
import {queryIntention,queryCallNum} from '@/api/outbound-data.js'
import {indexStatistics} from '@/api/taichi-data-api.js'
import {querySpeechSkill} from '@/api/brain.js'
import KDate from '@/components/common/date/k-date'
import {milliFormat} from '@/api/utils.js'
import {transferCount} from '@/api/taichi-data-api.js'

export default {
	name: 'report',
	data : function () {
		return {
			myChart : null,
			tagColorList : ['#ffc12b','#3dbdff','#13cd9f','#73a1b9'],
			loading : true,
			tagList : [],
			speechList : [],

			curDate : [this.$moment().format('YYYY-MM-DD'),this.$moment().format('YYYY-MM-DD')],
			speech : [],
			callData : {
				callAverTime : 0,
        callTotalTime : 0,
        connectTotalNum : 0,
        transferNum: 0
			},
			chartIsNull : true,
			reportData:null
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
		callAverTime : function(){
			let callAverTime = this.callData ? this.callData.callAverTime || 0 : 0,
    		tsec = Math.round(callAverTime),
    		tmins = parseInt(tsec / 60);
    	if(tmins == 0){
    		return [0,tsec];
    	}
    	tsec = tsec % 60;
    	return [tmins,tsec];
		},
		callTotalTime : function(){
			let callTotalTime = this.callData ? this.callData.callTotalTime || 0 : 0,
				mins = parseInt((callTotalTime + 59)/60),
				hour = parseInt(mins / 60);
			if(hour == 0){
				return [0,mins];
			}
			mins = mins % 60;
			return [hour,mins];
		},
		connectTotalNum : function(){
			let num = this.callData ? this.callData.connectTotalNum || 0 : 0;
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
		initData:function(){
			var _this = this;
			var param={
				"businessId":this.business.id,
				"channelCode":2,
				"speechSkillId":this.speech,
				"beginTime":parseInt(this.curDate[0].replace(/-/g,"")),
				"endTime":parseInt(this.curDate[1].replace(/-/g,""))
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
				let tag_intention = this.$lodash.get(data,'result.rows[0].tag_intention'),
					chartData = _this.reportData[this.returnType],
					call = this.$lodash.get(data,'result.rows[0].call',{}); 
				let newTagList = [];
				// 意向标签数据
				for(let tag of _this.tagList){
					tag.num = 0;
					for(let key in tag_intention){
						if(tag.name == key){
							tag.num = tag_intention[key];
						}
					}
					newTagList.push(tag)
				}
				_this.tagList  = newTagList;

				// 数据总览
				_this.callData.connectTotalNum =call.count || 0;
				_this.callData.callTotalTime =call.duration_call || 0;
				_this.callData.callAverTime =call.avg_duration_call || 0; 

				//通话量趋势
				//补全维度
				chartData = this.completeDim(chartData);
				var chartList = []
				for(var i in chartData){
					chartList.push({
						connectNum: chartData[i],
						time : i
					});
				}
				chartList.sort(function(a,b){return parseInt(a.time) - parseInt(b.time)})
				_this.chartIsNull = chartList == 0;
				_this.loading = false;
				if(!_this.chartIsNull){
					setTimeout(function(){_this.loadCallChart(_this.transferToChatData(chartList))},0);
				}
			})
			//查询转人工
			transferCount({
				...param,
				beginTime:new Date(this.curDate[0]).getTime()-28800001,
				endTime:new Date(this.curDate[1]).getTime()+57600000
			}).then((data)=>{
				if(data.code!=0){
					_this.$message.error('转人工量加载失败');
			   	return
				}
				this.callData.transferNum = _this.$lodash.get(data,'result.rows[0]',{})||0;
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
						newKey = md.format('MMDD'),
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
	    loadCallChart : function(chartData){
	    	if(chartData == null)
	    		return;
	        var _this = this;
	        var option = {
	            color : ['#15A6FF','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
	            tooltip : {
	                trigger: 'axis'
	            },
	            textStyle:{
	                fontSize:15,
	                color:'#333'
	            },
	            grid: {
	                left: '3%',
	                right: '4%',
	                bottom: '3%',
	                containLabel: true
	            },
	            yAxis : [{
	                type : 'value' ,
	                axisLine: {
	                    lineStyle: {
	                        type: 'solid',
	                        color: '#b7b7b7',//左边线的颜色
	                        width:'1'//坐标线的宽度
	                    }
	                }
	            }],
	             legend : {
	                 data:['通话量'],
	                 left : 50,
	                 top:10,
	                 x: 'left'
	             },
	             xAxis : [{
	                 type : 'category',
	                 boundaryGap : false,
	                 data : chartData.xAxis,
	                 axisLine: {
	                     lineStyle: {
	                         type: 'solid',
	                         color: '#b7b7b7',//左边线的颜色
	                         width:'1'//坐标线的宽度
	                     }
	                 }
	             }],
	             series :[{
	                 name:'通话量',
	                 type:'line',
	                 stack: '总量',
	                 areaStyle: {normal: {color:"#CCECFF"}},
	                 data:chartData.series
	             }]
	        };
	       	_this.myChart = echarts.init(document.querySelector('.report__chart'));
	       	_this.myChart.setOption(option);
            window.onresize = function () {
               _this.myChart && _this.myChart.resize();
            }
	    },
		//event
		dateChange : function(val){
			this.initData();
		}, 
		speechChange : function(val){
			this.initData();
		}
	},
	/*beforeRouteEnter : function(to, from, next){
		next(vm => {
			vm.initData();
		});
	},*/
	mounted : function(){
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
			_this.initData();
		});
		this.getSpeechList();
	},
	components : {
		'k-date' : KDate,
    'history-report' : HistoryReport
	}
}
</script>
<style lang="less" scoped>
	.report{
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
		}
		.report__head{
			margin: 0;
		    font-size: 16px;
		    line-height: 34px;
		    font-weight: 700;
		    color: #585858;
		}
		.report__item{
			margin-top:15px;
			margin-bottom:20px;
		    box-sizing: border-box;
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
		  	height: 100px;

		  	.report__tag{
				border-right: 1px solid #ccc;
			    flex-grow: 1;
			    align-self: center;
			}
			.report__tag:last-child{
				border:none;
			}
			.report__level {
			    display: inline-block;
			    width: 50px;
			    height: 50px;
			    border-radius: 50%;
			    text-align: center;
			    color: #fff;
			    line-height: 50px;
			    font-size: 26px;
			    margin-left: 31px;
			}
			.report__count {
			    display: inline-block;
			    padding-left: 5px;
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
			    box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
			    width:24%;
			    font-size:14px;
			    .report__data__content{
			    	padding:25px;
			    	height:50px;
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
		.report__chart{
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