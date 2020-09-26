<style lang="less" scoped>

	.right-box{
		float:right;
	}
	.right-box .el-button{
		width:80px;
		text-align:right;
	}
	.right-box .el-button+.el-button{
		margin-left:0;
	}


	.player-box{
		width:100%;
		height:100%;
		display:flex;
		align-items:center;
		justify-content:center;
	}
	.player-btn{
		width:30px;
		height:30px;
	}
	.search-box{
		display:flex;
		margin-top:20px;
	    flex-wrap: wrap;
		.select-txt{
			width:220px;
		}
		.select-txt-mini{
			width:160px;
		}
		.input-txt{
			width:180px;
		}
		.input-txt-mini{
			width:100px;
		}
		.input-date{
			width:340px;
		}
		.search__item{
		  	display: flex;
		  	justify-content: space-between;
		  	align-items: center;
		  	margin:0 15px 10px 0px;
	  	}
	  	.time-unit{
	  		line-height:32px;
	  	}
	}

	.top-info{
		background: #FFF;
		display:flex;
		height:95px;
		justify-content: center;
	    align-items: center;
	}
	.top-info .item{
		flex:1;
		text-align:center;
		box-sizing: border-box;
		height:40px;
		border-right: 1px solid #dcdcdc;
		display:flex;
		justify-content: center;
		align-items: center;
	}
	.top-info .item .icon{
		width:44px;
		height:40px;
		background:url(./images/task_icon.png) no-repeat;
	}
	.top-info .item .info-box{
		text-align:left;
		margin-left:10px;
	}
	.top-info .item .info-box span{
		display:block;
	}
	.top-info .item .icon-number{
		background-position:6px -58px;
	}

	.top-info .item .icon-out-count{
		background-position:6px -198px
	}

	.top-info .item .icon-out-number{
		background-position:6px -9px;
	}

	.top-info .item .icon-success-count{
		background-position:6px -106px;
	}

	.top-info .item .icon-success-rate{
		background-position:6px -152px;
	}

	.top-info .item:last-child{
		border-right:0;
	}

	.taskinfo .content{
		margin-top:10px;

	}
	.toolbar{
		display:flex;
		background:#fff;
	    flex-direction: row-reverse;
	    padding-right:20px;
	}
	.btn-back{
		font-size:14px;
	}
	.checked-btn{
		color:#0066b7 !important;
	}
	.down-namelist{
		margin-right:10px;
	}
	.node-name,.hit-node{
		font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-bottom: 5px;
	}
	.hit-node{
		margin-bottom: 0;
		margin-top:5px;
	}
</style> 
<style scoped>
  
  .chat-box li{
    list-style: none;
    display: flex;
    margin-bottom: 30px;
    padding: 0 15px;
  }
  .chat-box ul{
    padding-left: 0;
  }
  .chat-box .user{
    flex-direction: row-reverse;
    position:relative;
    margin-bottom: 40px;
  }
  .chat-box .icon-box {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-size: contain;
  }
  .chat-box .robot .icon-box {
    background: url(./images/robot2.png)  -5px -5px no-repeat;
  }
  .chat-box .user .icon-box {
    background: url(./images/customer.png)  -5px -5px no-repeat;
  }
  .chat-box .user .icon-tips{
    position:absolute;
    right: 80px;
    bottom:-20px;
    color: #00b792;
  }
  .chat-box .text-box {
    border-radius: 4px;
    padding: 10px;
    max-width: 50%;
    position: relative;
  }
  .chat-box .role-name{
    position: absolute;
    top: -25px;
    white-space:nowrap;
    color: #d1d1d1;
  }
  .chat-box .text-speed{
    position: absolute;
    bottom: -24px;
    color: #44b3ff;
    font-size: 12px;
     white-space:nowrap;
  }
  .chat-box .robot .role-name{
      left: 0px;
  }
  .chat-box .user .role-name{
      right: 0px;
  }
  .chat-box .robot .text-speed{
     left: 0;
  }
  .chat-box .user .text-speed{
      right: 0px;
  }

  .chat-box .node-box{
    display: flex;
  }
  .chat-box .chat-player-box{
    height: 20px;
    width: 100px;
    margin-left: 10px;
  }
  .chat-box .text-box span{
    display: block;
  }
  .chat-box .text-box .node-name{
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .chat-box .text-box .hit{
    font-size: 12px;
    color: #999;
    margin-top:5px;
  }

  .chat-box .user .text-box{
    margin-right: 20px;
    background: #d0eeff;
    border: 1px solid #acd9f3;

  }

  .chat-box .robot .text-box{
    margin-left: 20px;
    border: 1px solid #eae9e9;
  }

  .chat-box .text-box:after,.chat-box .text-box::before{
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    top: 10px;
  }

  .chat-box .robot .text-box:after{
    left: -12px;
    border-right-color: #fff;
  }
  .chat-box .robot .text-box:before{
    left: -13px;
    border-right-color: #eae9e9;
  }

  .chat-box .user .text-box:after{
    right: -12px;
    border-left-color: #d0eeff;
  }
  .chat-box .user .text-box:before{
    right: -13px;
    border-left-color: #acd9f3;
  }

  .see__table{
		max-height: 70vh;
  	overflow-y: auto;
	}

</style>

<template>
	<div class="page taskinfo">
		<div class="top-bar">
			<el-button @click.stop="$router.go(-1)" class="btn-back" type="text" icon="el-icon-arrow-left">返回</el-button>
		</div>
		<div class="top-info" v-loading="totalLoading">
			<div class="item">
				<div class="icon icon-number"></div>
				<div class="info-box">
					<span>号码量</span>
					<span>{{total.numberCount}}个</span>
				</div>
			</div>
			<div class="item">
				<div class="icon icon-out-count"></div>
				<div class="info-box">
					<span>已外呼次数</span>
					<span>{{total.processCount }}个</span>
				</div>
			</div>
			<div class="item">
				<div class="icon icon-out-number"></div>
				<div class="info-box">
					<span>已外呼号码</span>
					<span>{{total.processTelCount }}个</span>
				</div>
			</div>
			<div class="item">
				<div class="icon icon-success-count"></div>
				<div class="info-box">
					<span>接通量</span>
					<span>{{total.procThroughCount }}个</span>
				</div>
			</div>
			<div class="item">
				<div class="icon icon-success-rate"></div>
				<div class="info-box">
					<span>接通率</span>
					<span>{{total.procThroughRate }}</span>
				</div>
			</div>
		</div>
		<div class="search-box">
			<div class="search__item">
				<div class="search__val">
					<el-select class="select-txt" size="small" v-model="result" placeholder="通话结果" multiple :collapse-tags="true">
						<el-option
						v-for="item in select.result"
						:key="item.code"
						:label="item.desc"
						:value="item.code">
						</el-option>
					</el-select>
				</div>
			</div>

			<div class="search__item">
				<div class="search__val">
					<el-select class="select-txt-mini" size="small" v-model="intention" placeholder="意向程度" multiple :collapse-tags="true">
						<el-option
						v-for="item in select.intention"
						:key="item.id"
						:label="item.name"
						:value="item.name">
						</el-option>
					</el-select>
				</div>
			</div>

			<div class="search__item">
				<div class="search__val">
					<el-select class="select-txt-mini" v-model="tags" size="small" placeholder="标签" multiple :collapse-tags="true">
						<el-option
						v-for="(item,index) in tagList"
						:key="index"
						:label="item.name"
						:value="item.name">
						</el-option>
					</el-select>
				</div>
			</div>
			
			<div class="search__item">
				<div class="search__val">
					<el-input 
						type="number"
						size="small"
						v-model.number.trim="minCallDuration"
						class="input-txt-mini" 
						placeholder="通话时长"
						clearable >
						<div slot="suffix" class="time-unit">秒</div>
					</el-input>
					<span> - </span>
					<el-input 
						v-model.number.trim="maxCallDuration" 
						type="number" 
						size="small"
						class="input-txt-mini" 
						placeholder="通话时长"
						clearable>
						<div slot="suffix" class="time-unit">秒</div>
					</el-input>
				</div>
			</div>
			<div class="search__item">
				<div class="search__val">
					<el-input v-model.number.trim="phone" size="small" class="input-txt" clearable placeholder="手机号码"></el-input>
				</div>
			</div>
			<div class="search__item">
				<div class="search__val">
					<el-date-picker
						class="input-date"
						size="small"
		      	v-model="timeRange"
		      	:default-time="['09:00:00','21:00:00']"
		      	type="datetimerange"
		      	range-separator="至"
	      		start-placeholder="开始日期"
	      		end-placeholder="结束日期">
			    </el-date-picker>
				</div>
			</div>
			<div class="search__item">
				<el-button @click.stop="search" size="small" type="primary">筛选</el-button>
			</div>
		</div>
		<div class="content" v-loading="tableLoading">
			<div class="toolbar">
				<div>
					<el-dropdown class="down-namelist" @command="handleCommand" trigger="click">
				      <span class="el-dropdown-link">
				        下载名单<i class="el-icon-arrow-down el-icon--right"></i>
				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item command="1">下载已呼名单</el-dropdown-item>
				        <el-dropdown-item command="0">下载待呼名单</el-dropdown-item>
				      </el-dropdown-menu>
			    	</el-dropdown>
					<el-button :disabled="downloadTaskLoading" @click.stop="downloadTask" type="text">下载报表</el-button>
				</div>
			</div>
			<el-table @sort-change="sortChange" :data="tableData" :border="true"
				 :default-sort = "{prop: 'time_callout', order: 'descending'}"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
		      	prop="tel_number"
		      	label="号码">
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="time_callout"
		      	sortable="custom"
		      	width="160px"
		      	label="外呼时间">
	      		<template slot-scope="scope">
	      			{{formateTime(scope.row.time_callout)}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="duration_ring"
		      		sortable="custom"
			      	label="振铃时长">
					  	<template slot-scope="scope">
                {{Number(scope.row.duration_ring) ? scope.row.duration_ring +"秒" : "--"}}
              </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="duration_call"
		      	sortable="custom"
		      	label="通话时长">
				  	<template slot-scope="scope">
				  		  	{{formatDuringCall(scope.row.call_result,scope.row.duration_call)}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="call_resultdes"
	      		:show-overflow-tooltip="true"
		      	label="通话结果">
				  	<template slot-scope="scope">
			  		  {{scope.row.call_resultdes ? scope.row.call_resultdes : "--"}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="call_index"
		      	label="拨打次数">
				  	<template slot-scope="scope">
			  		  {{Number(scope.row.call_index) ? scope.row.call_index : "--"}}
	          </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="label_show"
		      	min-width="120"
		      	label="标签">
		      	<template slot-scope="scope">
                {{ scope.row.label_show?scope.row.label_show:"--"}}
            </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="tag_intention"
		      	sortable="custom"
		      	label="意向程度">
				  	<template slot-scope="scope">
			  		  {{scope.row.tag_intention ? scope.row.tag_intention : "--"}}
            </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="dialog"
		      	label="识别详情">
		      	<template slot-scope="scope" >
							 <el-button v-if="scope.row.dialog&&checkedIds.indexOf(scope.row.task_data_id)==-1" @click.stop="see(scope.row,scope.row.dialog,scope.row.voice_url)" type="text" size="small">查看</el-button>
							 <el-button v-else-if="scope.row.dialog&&checkedIds.indexOf(scope.row.task_data_id)!=-1" @click.stop="see(scope.row,scope.row.dialog,scope.row.voice_url)" type="text" class="checked-btn" size="small">查看</el-button>
							 <span v-else>--</span>
            </template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
		      	prop="voice_url"
		      	label="录音">
            <template slot-scope="scope" class="palyer-box">
							<div v-if="scope.row.voice_url">
								<el-button @click.stop="online(scope.row.voice_url)" type="text">播放</el-button>
								<el-button type="text">
									<a class="link" download :href="formatMediaPath(scope.row.voice_url)">下载</a>
								</el-button>
							</div>
							<span v-else>--</span>
            </template>
			    </el-table-column>
			  </el-table>
			<el-pagination 
				v-if="page.total > 0" 
				class="pagination" 
				background
				prev-text="上一页"
				next-text="下一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    		:page-sizes="[10,15]"
    		:page-size="page.pageSize"
    		:current-page="page.pageIndex"
    		layout="total, sizes, prev, pager, next, jumper"
    		:total="page.total">
	    </el-pagination>
		</div>

		<el-dialog 
			title="识别详情" 
			:visible.sync="seeVisible" 
			width="800px" 
			top="3vh"
			:append-to-body="true">
			<div class="margin-bottom-10" style="font-size:16px;" v-if="seeVisible && detailUrl">
				<k-player 
					color="#00b792"
					:src="formatMediaPath(detailUrl)" 
					controls></k-player>
			</div>
			<div class="see__table">
		  	<div class="chat-box">
			    <ul>
			      <template v-for="(item,index) in detailData">
  		        <li v-if="item.role === 'robot'" class="robot" :key="index">
		          	<div class="icon-box"></div>
		          	<div class="text-box">
		          		<div class="node-name">{{item.nodeName}}</div>
		            	<span class="content">{{item.output}}</span>
		          	</div>
  		        </li>
  		        <li v-else class="user" :key="index">
  		          <div class="icon-box"></div>
  		          <div class="text-box" @dblclick="choiceAnswer(item)">
  		            <span class="content">{{item.input}}</span>
  		            <div v-if="item.hits.length > 0" class="hit-node">命中节点：{{item.hits[0].hit}}</div>
  		          </div>
  		        </li>
			      </template>
			    </ul>
				</div>
			</div>
		</el-dialog>

		<el-dialog
		  custom-class="x-audio"
		  :visible.sync="playDialog"
		  :append-to-body="true"
		  :modal="false"
		  top="40%" width="40%"
		  :before-close="playClose">
		  	<k-player 
		  		color="#00b792"
		  		controls
		  		v-if="curAudioUrl" 
		  		:src="formatMediaPath(curAudioUrl)"></k-player>
		</el-dialog>
	</div>
</template>

<script>
	import XAudio from '@/components/common/player/xaudio'
	import {searchCallResultList} from '@/api/outbound-manage.js'
	import {queryLabelOptionList} from '@/api/bm.js'
	import {addDownloadTask} from '@/api/download-center-api.js'
	import {taskStatistics,queryTaskDataReport} from '@/api/taichi-data-api.js'
	import {queryLabel} from '@/api/brain.js'
	import {mapState} from 'vuex'

	export default {
		name: 'taskinfo',
		data : function () {
			return {
				totalLoading : true,
				phone : '',//手机号
				result : [],//结果
				intention : [],//意向
				tags : [],//标签
				timeRange : [], //时间范围
				minCallDuration : '', //最小通话时长
				maxCallDuration : '',//最多通话时长

				downloadTaskLoading:false,
				select : {
					result : [],
					intention : []
				},
		  	total : {
          numberCount : '',
          processCount : '',
          processTelCount : '',
          procThroughCount : '',
          procThroughRate : ''
      	},
				tableLoading : true,
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				sort : {
					field : 'time_callout',
					order : 'desc'
				},
				tableData : [],
				//
				seeVisible : false,
				detailData : [],
				curAudioUrl : '',
				detailUrl : '',
				checkedIds:[],
				speechId:'',//话术ID
				tagList:[]//标签列表
			}
		},
  	computed : {
  		...mapState('user',[
        'id',
      	'master',
        'business'
      ])
		},
		methods : {
			choiceAnswer (item){
				let t = item.userSpeakingTime;
				if(t){
					console.log((t - this.detailData[0].nodeStartTime) / 1000)
				}
			},
			formatDuringCall : function(callresult,duration_call){
				//callResult
				let showCallResult = this.$global.getConfig('callResult') || [];
				if(showCallResult.length > 0 && showCallResult.indexOf(callresult) < 0){
					return '--';
				}
				return Number(duration_call) ? duration_call +"秒" : "--";
			},
	    formateTime(value){
	    	value=Number(value)
	      if(!value){
	          return '--'
	      }else{
	      	var timeformter=this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
          return timeformter
	      }
	    },
			formatMediaPath : function(value){
				if(value){
					return this.$global.getVoiceFileUrl(value);
				}else{
					return '--'
				}
			},
			online : function(url){
				this.playDialog = true;
				this.curAudioUrl = url;
			},
			playClose : function(){
				this.playDialog = false;
				this.curAudioUrl = '';
			},
			getSearchParam : function(){
				let param = {
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize,
					order : this.sort.field+" "+this.sort.order,
					taskId:this.$route.params.id,
					channelCode:2,
					label:this.tags.join(" "),
					businessId:this.$route.params.bid
				};
      	if(this.result.length > 0){
        		param.callResult = this.result.join(",");
      	}
      	if(this.intention.length > 0){
          //	param.tagIntention = this.intention.join(",");
          	param.tagIntention = this.intention.map(item => { return '\'' +item + '\''}).join(',');
    		}
      	if(this.phone != ''){
         	param.telNumber = this.phone;
      	}
    		if(this.minCallDuration != ''){
	      	param.minCallDuration = this.minCallDuration;
      	}
      	if(this.maxCallDuration != ''){
      		param.maxCallDuration = this.maxCallDuration;
      	}
      	if(this.timeRange && this.timeRange.length == 2){
      		param.callOutBeginTime = new Date(this.timeRange[0]).getTime();
      		param.callOutEndTime = new Date(this.timeRange[1]).getTime();
      	}
      	return param;
			},
			reloadTable : function(){
				this.tableLoading = true;
				let param = this.getSearchParam();
				queryTaskDataReport(param,this.$route.params.bid).then((data)=>{
      		this.tableLoading = false;
					if(data.code == 0){
        		data.result.rows.map(value=>{
              value.exporting = false
        		})
      			this.tableData = data.result.rows;
      			this.page.total = data.result.totalCount;
					}else{
      			this.page.total = [];
      			this.tableData = 0;
  				}
				})
			},
			reloadReport(){
				taskStatistics({taskId:this.$route.params.id,channelCode:2,businessId:this.$route.params.bid},this.$route.params.bid).then((data)=>{
					const row = this.$lodash.get(data,'result.rows[0]',{});
		      		const answerPercent = row.answerPercent ? parseFloat(row.answerPercent).toFixed(1) +"%" : '--';
					this.total = {
						numberCount : row.totalTel || 0,
          	processCount : row.totalCall || 0,
          	processTelCount : row.totalCallTel || 0,
          	procThroughCount : row.totalAnswer || 0,
          	procThroughRate : answerPercent
					}
					this.totalLoading = false;
				})
			},
			search : function(){
				this.page.pageIndex = 1;
				this.reloadTable();
				this.reloadReport();
  		},
  		handleSizeChange(size){
				this.page.pageSize = size;
				this.reloadTable();
			},
			handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadTable();
			},
	  	sortChange (column) {
		    let key = column.prop ? column.prop : 'time_create'
		    let order = column.order === 'ascending' ? 'asc' : 'desc'
		    if (key !== this.sort.field || this.sort.order !== order) {
		        this.sort.field = key
		        this.sort.order = order+' ,task_data_id asc '
			    this.reloadTable();
		    }
			},
			//获取筛选条件
			getSearchCallResultList(){
				searchCallResultList().then(res => {
					if(res.code === 0){
						this.select.result = res.result.rows
					}
				})
			},
			//获取意向度
			getQueryLabelOptionList(){
				queryLabelOptionList().then(res => {
					if(res.code === 0){
						this.select.intention = res.result.rows
					}
				})
			},
			// 下载名单到下载中心
			downloadCallToCenter(callout){
				var _this = this;
				var param = {
					businessId : this.$global.getBusinessId(),
					sysType : 2,
					downloadType : 5,
					channelCode : 2,
					query:{
						callOut:parseInt(callout),
        		businessId:this.$route.params.bid,
        		taskId : this.$route.params.id,
        		pageIndex : this.page.pageIndex,
						pageSize : this.page.pageSize,
						order : this.sort.field+" "+this.sort.order,
        		channelCode:2,
        		label:this.tags.join(" ")
      		}
				}
				if(this.result.length > 0){
				    param.query.callResult = this.result.join(",");
				}
				if(this.intention.length > 0){
				    //param.query.tagIntention = this.intention.join(",");
				    param.query.tagIntention = this.intention.map(item => { return '\'' +item + '\''}).join(',');
				}
				if(this.phone != ''){
				   param.query.telNumber = this.phone;
				}
				if(this.minCallDuration != ''){
	      	param.query.minCallDuration = this.minCallDuration;
      	}
      	if(this.maxCallDuration != ''){
      		param.query.maxCallDuration = this.maxCallDuration;
      	}
      	if(this.timeRange && this.timeRange.length == 2){
      		param.query.callOutBeginTime = new Date(this.timeRange[0]).getTime();
      		param.query.callOutEndTime = new Date(this.timeRange[1]).getTime();
      	}
				addDownloadTask(param,this.$route.params.bid).then(function(data){
					if(data.code != 0){
						if(data.code=="30050"){
        			_this.$message.error('长期任务不能下载');
      			}else if(data.code == '30051'){
      				_this.$message.error('下载任务正在进行中，请稍后再试');
     		 		}else{
    	  			_this.$message.error('导出报表失败');            
      			}
						return;
					}else{
						_this.$message({type : 'success' , message : '已添加到下载中心，请到下载中心查看'})
					}
				});
			},
			//下载报表
			downloadTask(){
				var _this = this;
				_this.downloadTaskLoading = true
				var param = {
					businessId : this.$global.getBusinessId(),
					sysType:2,
					downloadType:1,
					channelCode:2,
					query:{
      			businessId:this.$route.params.bid,
      			taskId : this.$route.params.id,
        		pageIndex : this.page.pageIndex,
						pageSize : this.page.pageSize,
						order : this.sort.field+" "+this.sort.order,
        		channelCode:2,
        		label : this.tags.join(" ")
      		}
				}
				if(this.result.length > 0){
				    param.query.callResult = this.result.join(",");
				}
				if(this.intention.length > 0){
				    //param.query.tagIntention = this.intention.join(",");
				    param.query.tagIntention = this.intention.map(item => { return '\'' +item + '\''}).join(',');
				}
				if(this.phone != ''){
				   param.query.telNumber = this.phone;
				}
				if(this.minCallDuration != ''){
	      	param.query.minCallDuration = this.minCallDuration;
      	}
      	if(this.maxCallDuration != ''){
      		param.query.maxCallDuration = this.maxCallDuration;
      	}
      	if(this.timeRange && this.timeRange.length == 2){
      		param.query.callOutBeginTime = new Date(this.timeRange[0]).getTime();
      		param.query.callOutEndTime = new Date(this.timeRange[1]).getTime();
      	}

				addDownloadTask(param,this.$route.params.bid).then(function(data){
					_this.downloadTaskLoading = false
					if(data.code != 0){
						if(data.code=="30050"){
	            _this.$message.error('长期任务不能下载');
          	}else if(data.code == '30051'){
    					_this.$message.error('下载任务正在进行中，请稍后再试');
     		 		}else{
	            _this.$message.error('导出报表失败');            
          	}
						return
					}else{
						_this.$message({type : 'success' , message : '已添加到下载中心，请到下载中心查看'})
					}
				});
			},
			see (row,dialog,url){				
				if(this.checkedIds.indexOf(row.task_data_id)==-1){
					this.checkedIds.push(row.task_data_id)
				}
				if (this.checkedIds.length>100) {
					this.checkedIds.shift()
				};
				window.localStorage.setItem('checkedIds',JSON.stringify(this.checkedIds))
    		const dialogList = JSON.parse(dialog);
    		let info = [];
    		info = dialogList
    		this.detailData = info;
    		this.detailUrl = url;
				this.seeVisible = true;
			},
			handleCommand(command) {
				this.downloadCallToCenter(command)
  		}		
	  },
	  beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.downloadTaskLoading = false;
				vm.phone = '';
				vm.result = [];
				vm.intention = [];
				vm.miniCallTimeLength = '';
				vm.search();
				taskStatistics({taskId:vm.$route.params.id,channelCode:2,businessId:vm.$route.params.bid},vm.$route.params.bid).then(function(data){
					const row = vm.$lodash.get(data,'result.rows[0]',{});
      		const answerPercent = row.answerPercent ? parseFloat(row.answerPercent).toFixed(1) +"%" : '--';
					vm.total = {
						numberCount : row.totalTel || 0,
						processCount : row.totalCall || 0,
						processTelCount : row.totalCallTel || 0,
						procThroughCount : row.totalAnswer || 0,
						procThroughRate : answerPercent
					}
					vm.totalLoading = false;
				})
			});
		},
		mounted : function(){
			this.getSearchCallResultList()
			this.getQueryLabelOptionList()
			this.speechId=this.$route.params.speechId
			queryLabel({id:this.speechId}).then((resp)=>{
        this.tagList= this.$lodash.get(resp,'result.rows')
      })
			var checkedIds = JSON.parse(window.localStorage.getItem('checkedIds'))
			if (checkedIds&&checkedIds.length>0) {
				this.checkedIds=checkedIds
			}else{
				this.checkedIds=[]
			}
		},
		components: {
			'x-audio' : XAudio
		}
	}
	
</script>
