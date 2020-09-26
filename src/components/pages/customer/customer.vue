<template>
	<div class="page customer">
		<div class="condition" :class="[more ? 'advance' : '']">
			<div class="conditon__item">
				<label class="lbl">手机号码</label>
				<el-input size="small" @keyup.enter.native="search" v-model.trim="condition.tel_number" clearable type="text" class="input-txt" placeholder="请输入手机号码"></el-input>
			</div>
			<div class="conditon__item">
				<label class="lbl">意向程度</label>
				<el-select size="small" v-model="condition.tag_intention" multiple :collapse-tags="true" class="input-txt" 
					placeholder="请选择">
				    <el-option v-for="item in select.tag_intention" :key="item.value"
				    	:label="item.label" 
				    	:value="item.value"></el-option>
				</el-select>
			</div>
			<div class="conditon__item">
				<label class="lbl">客户标签</label>
				<el-input size="small" @keyup.enter.native="search" v-model.trim="condition.label"  clearable type="text" class="input-txt" placeholder="标签名称，多个以逗号隔开"></el-input>
			</div>

			<div v-show="more" class="conditon__item">
				<label class="lbl">客户姓名</label>
				<el-input size="small" @keyup.enter.native="search" v-model.trim="condition.customer_name"  clearable type="text" class="input-txt" placeholder="请输入客户姓名"></el-input>
			</div>
			<div v-show="more" class="conditon__item">
				<label class="lbl">客户来源</label>
				<el-select size="small" :remote-method="getMembers" v-model="condition.source_cm_id" 
					:loading="memberLoading" filterable remote clearable
					class="input-txt" placeholder="请输入">
				   	<el-option v-for="item in select.members" :key="item.value"
				    	:label="item.label" 
				    	:value="item.value"></el-option>
				</el-select>
			</div>
			<div v-show="more" class="conditon__item">
				<label class="lbl">跟进阶段</label>
				<el-select size="small" class="input-txt"  v-model="condition.trace_stage" multiple :collapse-tags="true" placeholder="请选择">
				     <el-option v-for="item in select.trace_stage" :key="item.value"
				    	:label="item.label" 
				    	:value="item.value"></el-option>
				</el-select>
			</div>
			<div v-show="more" class="conditon__item">
				<label class="lbl">通话结果</label>
				<el-select size="small" class="input-txt"  v-model="condition.call_result" multiple :collapse-tags="true" placeholder="请选择">
				    <el-option v-for="item in select.call_result" :key="item.value"
				    	:label="item.label" 
				    	:value="item.value"></el-option>
				</el-select>
			</div>
			<div v-show="more"  class="conditon__item">
				<label class="lbl">外呼任务</label>
				<el-select size="small" :remote-method="getTaskList" v-model="condition.task_id" 
					:loading="taskLoading" filterable clearable remote class="input-txt" placeholder="请输入">
				   	<el-option v-for="item in select.taskList" :key="item.value"
				    	:label="item.label" 
				    	:value="item.value"></el-option>
				</el-select>
			</div>
			<div v-show="more && master == 1" class="conditon__item">
				<label class="lbl">负责人</label>
				<el-select size="small" :remote-method="getMembers" v-model="condition.cm_id" 
					:loading="memberLoading" filterable remote clearable
					class="input-txt" placeholder="请输入">
				   	<el-option v-for="item in select.members" :key="item.value"
				    	:label="item.label" 
				    	:value="item.value"></el-option>
				</el-select>
			</div>
			<div v-show="more" class="conditon__item">
				<label class="lbl">外呼时间</label>
				<div class="input-date">
					<k-date size="small" v-model="condition.curDate"></k-date>
				</div>
			</div>
			<div class="conditon__item">	
				<div class="lbl">
					<el-button size="small" @click.stop="search" type="primary">搜索</el-button>
				</div>
				<el-button size="small" v-show="!more" @click.stop="more = true" type="text">更多搜索</el-button>
				<el-button size="small" v-show="more" @click.stop="more = false" type="text">收起</el-button>
			</div>
		</div>
		<div class="content" v-loading="tableLoading">
			<div class="toolbar">
				<div>
					<el-checkbox v-model="isAll" @change="changeIsAll" class="isAllCheckoutbox">全部</el-checkbox>
					<span class="total">共{{page.total}}客户</span>
				</div>
				<div>
					
					<el-button @click.stop="exportExcel" :disabled="selected.length==0&&isAll==false" type="primary">导出Excel</el-button>
					<!-- <el-button @click.stop="exportToDownloadCenter" :disabled="page.total==0" type="primary">导出全部到下载中心</el-button> -->
				</div>
			</div>
			<el-table @sort-change="sortChange" :data="tableData" :border="true"
					ref="multipleTable"
					:default-sort = "{prop: 'time_create', order: 'descending'}"
			    :span-method="spanMethod"
			    @select="handleSelect"
			    @select-all="handleSelectAll"
			    stripe
			    style="width: 100%">
		        <el-table-column
		          align="center"
			      type="selection"
			      width="50">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="tel_number"
	      			min-width="120"
			      	label="手机号码">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="customer_name"
			      	min-width="90"
			      	label="客户姓名">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="source_cm_name"
			      	min-width="90"
			      	label="客户来源">
			    </el-table-column>
				<el-table-column
			    	align="center"
			      	prop="time_create"
			      	:show-overflow-tooltip="true"
			      	min-width="110"
			      	sortable="time_create"
			      	label="创建时间">
		      	   <template slot-scope="scope">
                      {{ formatTime(scope.row.time_create )}}
                    </template>
			    </el-table-column>
		        <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="cm_name"
			      	min-width="90"
			      	label="负责人">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	min-width="200"
	      		prop="task_name"
	      		label="任务名称">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="call_result"
		      	min-width="120"
		      	label="通话结果">
		      	<template slot-scope="scope">
              {{ formatCallResult(scope.row.call_result )}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="trace_stage"
		      	min-width="120"
		      	label="跟进阶段">
	      	 	<template slot-scope="scope">
              {{ formatTraceStage(scope.row.trace_stage)}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="tag_cm_intention"
		      	min-width="80"
		      	label="客户意向">
	      	  <template slot-scope="scope">
              {{ formatTagIntention(scope.row.tag_ai_intention,scope.row.tag_cm_intention )}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			    	min-width="200"
		      	prop="label_show"
		      	label="标签">
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="time_trace"
		      	:show-overflow-tooltip="true"
		      	min-width="110"
		      	label="外呼时间">
      	   	<template slot-scope="scope">
              {{ formatTime(scope.row.time_callout )}}
            </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="customer_id"
		      	min-width="80"
						fixed="right"
		      	label="操作">
	      	 	<template slot-scope="scope">
		      	 	<el-button @click.stop="seeDetail(scope.row.user_id,scope.row.task_id,scope.row.tel_number)" type="text">详情</el-button>
			     	</template>
			    </el-table-column>
			  </el-table>
			<el-pagination v-if="page.total > 0" class="pagination" background
					prev-text="上一页"
					next-text="下一页"
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="page.pageIndex"
			      :page-sizes="[10,15]"
			      :page-size="page.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="page.total">
		    </el-pagination>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import KDate from '@/components/common/date/k-date'
	import {queryCustomer} from '@/api/crm.js'
	import {queryMember} from '@/api/uc.js'
	import {getCustomerConfig} from '@/api/jsondata.js'
	import {queryLabelOptionList} from '@/api/bm.js'
	import {searchHistoryTaskList,searchCallResultList} from '@/api/outbound-manage.js'
	import ExportJsonExcel from 'js-export-excel'
	import {addDownloadTask} from '@/api/download-center-api.js'
	
	export default {
		data : function () {
			return {
				more : false,
				value : '',
				condition : {
					customer_name : '',
					tel_number : '',
					source_cm_id : '',
					cm_id : '',
					curDate : [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'),this.$moment().format('YYYY-MM-DD')],
					trace_stage : [],
					tag_intention : [],
					call_result : [],
					task_id : '',
					label : ''
				},
				select : {
					members : [],
					trace_stage : [],
					tag_intention : [],
					call_result : [],
					contact_way : [],
					taskList : []
				},
				tableLoading : false,
				tableData : [],
				page : {
					total : 1,
					pageIndex : 1,
					pageSize : 10
				},
				sort : {
					field : 'time_create',
					order : 'desc'
				},
				taskLoading : false,
				memberLoading : false,
				//当前选中
				selected : [],
				//导出的条件
				outputCondition:'',
				isAll:false
			}
		},
		computed : {
			...mapState('user',[
				'master',
				'id',
				'business'
      ])
		},
		methods : {
			formatTraceStage : function(trace_stage){
				let result = '--';
      	for(let c of this.select.trace_stage){
      		if(c.value == trace_stage){
      			result = c.label;
      			break;
      		}
      	}
      	return result;
			},
			formatTagIntention : function(ai,cm){
				return cm || ai;
			},
			formatTime(value){
        if(value === null){
            return ''
        }else{
            return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
        }
      },
      formatCallResult : function(call_result){
      	let result = '--';
      	for(let c of this.select.call_result){
      		if(c.value == call_result){
      			result = c.label;
      			break;
      		}
      	}
      	return result;
      },
			//合并单元格
			spanMethod ({ row, column, rowIndex, columnIndex }) {
				if(columnIndex < 5 ){
					if(row.rowspan){
						return { rowspan: row.rowspan,colspan:1};
					}else{
						return { rowspan: 0,colspan:0};
					}
				}
			},
			reloadTable : function(){
				this.tableLoading = true;
				let param = {
					business_id : this.business.id,
					orderBy : this.sort.field+" "+this.sort.order,
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize
				}
				if(this.master != 1 && this.master != 2){
					param['cm_id'] = this.id;
				}
				if(this.more){
					for(let key in this.condition){
						let val = this.condition[key];
						if(!val || val.length == 0){
							continue;
						}
						if(key == 'curDate' && this.condition.curDate.length > 0){
							param.beginTime = Date.parse(this.condition.curDate[0] + " 00:00:00");
							param.endTime = Date.parse(this.condition.curDate[1] + " 23:59:59");
							continue;
						}
						if( key == 'label'){
							param.label = this.condition.label.split(/,|，/).join(' ');
							continue;
						}
						param[key] = val instanceof Array ? val.join(',') : val;
					}
				}else{
					param.tel_number = this.condition.tel_number;
					param.tag_intention = this.condition.tag_intention.join(',');
					param.label = this.condition.label.split(/,|，/).join(' ');
				}
				
				queryCustomer(param).then(resp => {
					let rows = this.$lodash.get(resp,'result.rows',[]),
						totalCount = this.$lodash.get(resp,'result.totalCount',0);
					//
					let dataList = [];
					for(let row of rows){
						let task_trace = row.task_trace || [{}],
							taskIds = [];
						for(let i = 0,len = task_trace.length; i < len; i++){
							let trace = task_trace[i];
							dataList.push({
								rowspan : i == 0 ? len : 0,
								user_id : row.user_id,
								tel_number : row.tel_number,
								customer_name : row.customer_name,
								
								source_cm_name : row.source_cm_name,
								time_create : row.time_create,
								user_extend : row.user_extend || {},
								//
								cm_name : trace.cm_name,
								task_id : trace.task_id || '',
								task_name : trace.task_name || '',	
								call_result : trace.call_result || '',
								trace_stage : trace.trace_stage || '',
								tag_ai_intention : trace.tag_ai_intention || '',
								tag_cm_intention : trace.tag_cm_intention || '',
								time_callout : trace.time_callout,
								label_show : trace.label_show
							});
						}
					}
					this.tableData = dataList;
					this.page.total = totalCount;
					this.tableLoading = false;
					// 翻页的时候判断是否全选
					if (this.isAll && this.tableData) {
		  				setTimeout(() => {
		  					this.tableData.forEach(r => {
		  		        		this.$refs.multipleTable.toggleRowSelection(r,true);
		  		      		});
		  				},250);
		    		}
				});
			},
			//
			seeDetail : function(userId,taskId,telNum){
				let taskList = [];
				for(let row of this.tableData){
					if(row.user_id == userId){
						taskList.push({label : row.task_name,value : row.task_id})
					}
				}
				sessionStorage.setItem('__tasklist',JSON.stringify(taskList));
				this.$router.push({ path: '/custinfo/'+telNum+'/'+userId+'/'+taskId });
			},
			search : function(){
				this.page.pageIndex = 1;
				this.selected=[]
				this.reloadTable();
			},
			handleSelect : function(selection,row){
				this.selected = selection;
				if (this.tableData.length != selection.length) {
					this.isAll = false
				}
			},
			handleSelectAll : function (selection) {
				this.selected = selection;
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
	    //获取下拉框数据
	    getMembers : function (query) {
				if (query !== '') {
          this.memberLoading = true;
          setTimeout(() => {
        		let param = {
                surname : query,
								pageIndex : 1,
								pageSize : 10,
								businessId : this.business.id
            };
            queryMember(param).then(resp => {
							let rows = this.$lodash.get(resp,'result.rows',[]),
									members = [];
							for(let row of rows){
								members.push({label : row.surname,value : row.id});
							}
							this.select.members = members;
							this.memberLoading = false;
						});
          }, 200);
        } else {
          	this.select.members = [];
        }
	    },
	    getTaskList : function(query){
	    	if (query !== '') {
          this.taskLoading = true;
          setTimeout(() => {
        		let param = {
              	sysType : this.$config.system.id,
               	accountId : this.id,
                taskName : query,
								pageIndex : 1,
								pageSize : 10
            };
						searchHistoryTaskList(param).then((data) =>{
							let rows = this.$lodash.get(data,'result.rows',[]),
								taskList = [];
							for(let row of rows){
								taskList.push({label : row.name,value : row.id});
							}
							this.select.taskList = taskList;
							this.taskLoading = false;
						});
          }, 200);
        } else {
        	this.select.taskList = [];
        }
	    },
	    exportExcel : function(){
	    	if (this.isAll) {
	    		this.exportToDownloadCenter()
	    		return
	    	};
	    	let sheetData = [];
	    	for(let row of this.selected){
	    		if(row.rowspan == 0){
	    			continue;
	    		}
	    		let userExtend = row.user_extend || {};
	    		sheetData.push({
	    			customer_name : row.customer_name || '',
	    			tel_number : row.tel_number || '',
	    			qq : userExtend.qq || '',
	    			wechat : userExtend.wechat || '',
	    			email : userExtend.email || ''
	    		})
	    	}
	    	let option = {
    			fileName : '客户列表',
    			datas : [{
    				sheetHeader:['客户姓名','手机号码','QQ','微信','电子邮件'],
    				sheetName:'客户信息',
    				sheetFilter:['customer_name','tel_number','qq','wechat','email'],
    				sheetData : sheetData || []
    			}]
    		};
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel(); 
	    },
	    changeIsAll:function(){
	    	if (this.isAll && this.tableData) {
      		this.tableData.forEach(row => {
        		this.$refs.multipleTable.toggleRowSelection(row,true);
      		});
	    	}else{
	    		this.$refs.multipleTable.clearSelection();
	    	}
	    },
  		exportToDownloadCenter:function(){
  			var bid=this.business.id
  			let param = {
  				business_id : this.business.id,
  				pageIndex : this.page.pageIndex,
  				pageSize : this.page.pageSize
  			}
  			if(this.master != 1 && this.master != 2){
					param['cm_id'] = this.id;
				}
  			if(this.more){
  				for(let key in this.condition){
  					let val = this.condition[key];
  					if(!val || val.length == 0){
  						continue;
  					}
  					if(key == 'curDate' && this.condition.curDate.length > 0){
  						param.beginTime = Date.parse(this.condition.curDate[0] + " 00:00:00");
  						param.endTime = Date.parse(this.condition.curDate[1] + " 23:59:59");
  						continue;
  					}
  					if( key == 'label'){
							param.label = this.condition.label.split(/,|，/).join(' ');
							continue;
						}
  					param[key] = val instanceof Array ? val.join(',') : val;
  				}
  			}else{
  				param.tel_number = this.condition.tel_number;
  				param.tag_intention = this.condition.tag_intention.join(',');
  				param.label = this.condition.label.split(/,|，/).join(' ');
  			}
  			var _this = this;
        addDownloadTask({
        	businessId:bid,
        	sysType:2,
        	downloadType:3,
        	channelCode:2,
        	query:{
            ...param
          }}).then( (data) => {
           	if(data.code != 0){
           		if(data.code == '30051'){
								_this.$message.error('下载任务正在进行中，请稍后再试');
				 			}else{
				 				_this.$message.error('导出到下载中心失败');
				 			}
           		return
           	}
           	this.$message({type : 'success' ,message : '已添加到下载中心，请前往下载中心'})
        })
  		}
		},
		beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.reloadTable();
			});
		},
		mounted : function(){
			searchCallResultList().then(resp => {
				let rows = this.$lodash.get(resp,'result.rows',[]),
					call_result = [];
				for(let row of rows){
					call_result.push({label : row.desc,value : row.code})
				}
				this.select.call_result = call_result;
				this.reloadTable();
			});

			getCustomerConfig().then(resp => {
				this.select.trace_stage = this.$lodash.get(resp,'trace_stage',[]);
				this.select.contact_way = this.$lodash.get(resp,'contact_way',[]);
			});
			queryLabelOptionList().then(resp => {
				let rows = this.$lodash.get(resp,'result.rows',[]),
					tag_intention = [];
				for(let row of rows){
					tag_intention.push({label : row.name,value : row.name})
				}
				this.select.tag_intention = tag_intention;
			});
			
		},
		components : {
			'k-date' : KDate
		}
	}
</script>

<style lang="less" scope>
	.customer{
		.search{
			display:flex;
			flex-wrap:wrap;
	    align-items: flex-start;
		}
		.condition{
			display:flex;
			flex-wrap:wrap;
	    align-items: center;
			background:#fff;
			padding: 15px 0;
			max-height:75px;
			transition:all 0.6s;
		}
		.condition.advance{
			max-height:210px;
		}
		.condition.min{
			max-height:75px;
		}
		.conditon__item{
			margin: 0 10px 5px 0;
			.lbl{
				width:86px;
				text-align:right;
			    display: inline-block;
			    color: #606266;
			    padding-right: 4px;
			}
			.input-txt{
				width:230px;
			}
			.input-date{
				display:inline-block;
				width:230px;
			}
		}
		.content{
			margin-top:10px;
			.toolbar{
			    display: flex;
			    justify-content: space-between;
			    background: #fff;
			    padding: 10px;
			    border: 1px solid #eee;
			    border-bottom: none;
			    .total{
			    	line-height:40px;
			    }
			}
		}
		.isAllCheckoutbox{
			margin:0 8px 0 7px;
		}
	}
</style>