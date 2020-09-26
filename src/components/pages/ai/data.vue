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
	.checked-btn{
		color:#0066b7 !important;
	}
	.down-namelist{
		margin-right:10px;
	}
	.see__table{
		max-height: 70vh;
  	overflow-y: auto;
	}
</style> 

<template>
	<div class="page">
		<div class="search-box">
			<div class="search__item">
				<el-date-picker
					class="input-date"
					size="small"
	      	v-model="timeRange"
	      	:default-time="['09:00:00','21:00:00']"
	      	type="datetimerange"
	      	range-separator="至"
	      	:clearable="false"
	      	:editable="false"
      		start-placeholder="开始日期"
      		end-placeholder="结束日期">
		    </el-date-picker>
			</div>
			<div class="search__item">
				<el-select 
					class="select-txt-mini" 
					size="small" 
					v-model="callee" 
					placeholder="请选择被叫号码"
				 	multiple 
			 		:collapse-tags="true">
					<el-option
					v-for="item in select.callee"
					:key="item.label"
					:label="item.label"
					:value="item.label">
					</el-option>
				</el-select>
			</div>
			<div class="search__item">
				<el-select class="select-txt-mini" size="small" v-model="intention" placeholder="意向程度" multiple :collapse-tags="true">
					<el-option
					v-for="item in select.intention"
					:key="item.id"
					:label="item.name"
					:value="item.name">
					</el-option>
				</el-select>
			</div>
			<div class="search__item">
			 	<el-select
			 		class="select-txt" 
			 		size="small"
			    v-model="speechId"
			    @change="speechChange" 
			    placeholder="请选择话术"
			    filterable remote reserve-keyword clearable
			    :loading="loading.speechList"
			    :remote-method="getSpeechList">
		     	<el-option 
		     		v-for="item in select.speechList" 
		     		:key="item.value" 
		     		:label="item.label" 
		     		:value="item.value">
			    </el-option>
			  </el-select>
			</div>
			<div class="search__item">
				<el-select class="select-txt-mini" v-model="tags" size="small" placeholder="标签" multiple :collapse-tags="true">
					<el-option
					v-for="(item,index) in select.tagList"
					:key="index"
					:label="item.name"
					:value="item.name">
					</el-option>
				</el-select>
			</div>
			<div class="search__item">
				<el-input v-model.number.trim="phone" size="small" class="input-txt" clearable placeholder="手机号码"></el-input>
			</div>
			<div class="search__item">
				<el-button @click.stop="search" size="small" type="primary" icon="el-icon-search">筛选</el-button>
			</div>
			<div class="search__item">
				<el-button :disabled="downLoading" size="small" icon="el-icon-s-data" @click.stop="downToCenter">导出报表</el-button>
			</div>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table 
				@sort-change="sortChange" 
				:data="tableData" 
				:border="true"
			 	:default-sort = "{prop: 'call_begin_time', order: 'descending'}"
		    stripe
		    style="width: 100%">
		    <el-table-column
		    	align="center"
	      	prop="dnis.keyword"
	      	sortable="custom"
	      	label="被叫号码">
	      	<template slot-scope="scope">
      			{{scope.row.dnis}}
          </template>
		    </el-table-column>
		    <el-table-column
		    	align="center"
	      	prop="tel_number"
	      	label="呼入号码">
		    </el-table-column>
		    <el-table-column
		    	align="center"
		    	sortable="custom"
	      	prop="speechskillid.keyword"
	      	label="话术">
	      		<template slot-scope="scope">
      			{{scope.row.speech_skill_name}}
          </template>
		    </el-table-column>
		    <el-table-column
		    	align="center"
	      	prop="call_begin_time"
	      	sortable="custom"
	      	width="160px"
	      	label="呼入时间">
      		<template slot-scope="scope">
      			{{formateTime(scope.row.call_begin_time)}}
          </template>
		    </el-table-column>
		    <el-table-column
		    	align="center"
	      	prop="connected_duration_sec"
	      	sortable="custom"
	      	label="通话时长">
			  	<template slot-scope="scope">
	  		  	{{formatDuringCall(scope.row.duration_call)}}
          </template>
		    </el-table-column>
		    <el-table-column
		    	align="center"
		    	:show-overflow-tooltip="true"
	      	prop="label_show.keyword"
	      	sortable="custom"
	      	min-width="120"
	      	label="标签">
	      	<template slot-scope="scope">
            {{ scope.row.label_show ? scope.row.label_show.endsWith(',') ? scope.row.label_show.slice(0,-1) : scope.row.label_show : ' --'}}
          </template>
		    </el-table-column>
		    <el-table-column
		     	align="center"
	      	prop="tag.keyword"
	      	sortable="custom"
	      	label="意向程度">
			  	<template slot-scope="scope">
		  		  {{scope.row.tag_intention ? scope.row.tag_intention : "--"}}
          </template>
		    </el-table-column>
	      <el-table-column
		     	align="center"
	      	prop="transfer_mark"
	      	sortable="custom"
	      	label="转人工">
      		<template slot-scope="scope">
		  		  {{scope.row.transfer_mark == 1 ? "是": "否"}}
          </template>
		    </el-table-column>
		    <el-table-column
		     	align="center"
	      	prop="dialog"
	      	label="识别详情">
	      	<template slot-scope="scope" >
					 	<el-button 
						 	v-if="scope.row.dialog" 
						 	@click.stop="see(scope.row,scope.row.dialog,scope.row.voice_url)" 
						 	class="tb-opt"
						 	:class="checkedIds.indexOf(scope.row.calluuid) >= 0 ? 'checked-btn' : ''"
						 	type="text" 
						 	size="small">查看</el-button>
					 	<span v-else>--</span>
          </template>
		    </el-table-column>
		     <el-table-column
		     	align="center"
	      	prop="voice_url"
	      	label="录音">
          <template slot-scope="scope" class="palyer-box">
						<div v-if="scope.row.voice_url">
							<el-button 
								class="tb-opt"
								@click.stop="online(scope.row.voice_url)" 
								type="text">播放</el-button>
							<el-button 
								class="tb-opt"
								type="text">
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
		  	<k-chat :data="detailData"></k-chat>
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
	import {queryCallReport} from '@/api/taichi-data-api.js'
	import {queryLabel} from '@/api/brain.js'
	import {queryCPNInfoWithBus} from '@/api/resmanage.js'
	import {formatSecond} from '@/api/utils.js'
	import {mapState} from 'vuex'
	import {querySpeechSkill} from '@/api/brain.js'

	export default {
		name: 'taskinfo',
		data : function () {
			return {
				totalLoading : true,
				phone: '',//手机号
				intention: [],//意向
				tags: [],//标签
				timeRange : [this.$moment().format('YYYY-MM-DD')+' 09:00:00',this.$moment().format('YYYY-MM-DD') + ' 21:00:00'], //时间范围
				callee: [], //被叫号码，英文逗号分隔
				speechId: '',
				downloadTaskLoading:false,
				select: {
					result : [],
					intention : [],
					callee: [],
					speechList: [],
					tagList: []
				},
				loading: {
					callee: false,
					intention: false,
					tagList: false,
					speechList: false
				},
				tableLoading: true,
				page: {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				sort: {
					field: 'call_begin_time',
					order: 'desc'
				},
				tableData: [],
				//
				seeVisible: false,
				detailData: [],
				curAudioUrl: '',
				detailUrl: '',
				checkedIds: [],
				downLoading: false
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
			formatDuringCall : function(duration_call){
				return formatSecond(duration_call) || '--'
			},
	    formateTime(value){
	    	value = Number(value)
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
					pageIndex: this.page.pageIndex,
					pageSize: this.page.pageSize,
					direction: 0,
					order: this.sort.field+" "+this.sort.order,
					channelCode: 2,
					label: this.tags.join(" "),
					businessId: this.$global.getBusinessId()
				};
				if(this.speechId){
					param.speechSkillId = this.speechId;
				}
				if(this.callee.length > 0){
					param.callee = this.callee.map(item => `'${item}'`).join(',');
				}
      	if(this.intention.length > 0){
        	param.tagIntention = this.intention.map(item => { return '\'' +item + '\''}).join(',');
    		}
      	if(this.phone != ''){
         	param.telNumber = this.phone;
      	}
      	if(this.timeRange && this.timeRange.length == 2){
      		param.callOutBeginTime = new Date(this.timeRange[0]).getTime();
      		param.callOutEndTime = new Date(this.timeRange[1]).getTime();
      	}
      	return param;
			},
			reloadTable : function(){
				this.tableLoading = true;
				queryCallReport(this.getSearchParam()).then( data => {
					if(data.code == 0){
      			this.tableData = data.result.rows;
      			this.page.total = data.result.totalCount;
					}else{
      			this.page.total = [];
      			this.tableData = 0;
  				}
  				this.tableLoading = false;
				})
			},
			search : function(){
				this.page.pageIndex = 1;
				this.reloadTable();
  		},
  		downToCenter(){
				let param = {
					businessId: this.$global.getBusinessId(),
					sysType: 2,
					downloadType: 10,
					channelCode: 2,
					query: this.getSearchParam()
				}
      	if(!param.query.callOutBeginTime || !param.query.callOutEndTime){
      		this.$message.error("日期不能为空");
      		return;
      	}

				this.downLoading = true;
				addDownloadTask(param).then(data => {
					if(data.code != 0){
						this.$message.error('导出报表失败');     
					}else{
						this.$message({type : 'success' , message : '已添加到下载中心，请到下载中心查看'})
					}
					this.downLoading = false;
				})
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
		        this.sort.order = order
			    this.reloadTable();
		    }
			},
			getQueryLabelOptionList(){
				this.loading.intention = true;
				queryLabelOptionList().then(res => {
					if(res.code === 0){
						this.select.intention = res.result.rows
					}
					this.loading.intention = false;
				})
			},
			getDnisList(){
				this.loading.callee = true;
				queryCPNInfoWithBus({businessId: this.$global.getBusinessId(),cpnTypeArr: [1,3],status: 1}).then(resp => {
					this.select.callee = this.$lodash.get(resp,'result.rows',[]).map(item => {
						return {label:item.cpnCode,value: item.cpnCode}
					})
				})
				this.loading.callee = false;
			},
			getSpeechList(keywords){
				this.loading.speechList = true;
				querySpeechSkill({name: keywords || '',pageIndex:1, pageSize:50,sortName:"createTime",sortOrder:"desc",sysType:"2",status: 4}).then( resp => {
					this.select.speechList = this.$lodash.get(resp,'result.rows',[]).map(row => {
						return {value : row.id,label : row.name}
					})
					this.loading.speechList = false;
				})
			},
			speechChange(val){
				if(!val){
					this.select.tagList = [];
					return;
				}
				this.loading.tagList = true;
				queryLabel({id: val}).then(resp => {
	     		this.select.tagList = this.$lodash.get(resp,'result.rows',[]);
	     		this.loading.tagList = false;
	      })
			},
			see (row,dialog,url){			
				if(this.checkedIds.indexOf(row.calluuid) == -1){
					this.checkedIds.length > 100 ? this.checkedIds.splice(0,1,row.calluuid) : this.checkedIds.push(row.calluuid)
				}
				localStorage.setItem('__checkuuids',JSON.stringify(this.checkedIds))
				let chatList = []
    		this.detailData = JSON.parse(dialog).forEach(item => {
    			chatList.push({
    				role: 'robot',
    				nodeName: item.nodeName,
    				msg: item.output
    			},{
    				role: 'customer',
    				nodeName: item.nodeName,
    				msg: item.input
    			})
    		})
    		this.detailData = chatList;
    		this.detailUrl = url;
				this.seeVisible = true;
			}
	  },
		mounted : function(){
			this.getSpeechList();
			this.getQueryLabelOptionList();
			this.getDnisList();
   		let __checked = localStorage.getItem('__checkuuids');
			this.checkedIds = __checked ? JSON.parse(__checked) : [];
			this.search();
		},
		components: {
			'x-audio': XAudio
		}
	}
	
</script>
