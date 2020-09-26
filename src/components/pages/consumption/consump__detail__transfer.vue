<template>
	<div class="consump__detail__call">
		<div class="cdc__condition">
			<!-- <div class="cdc__condition__item">
				<el-input v-model.trim="condition.phoneNumber" clearable placeholder="请输入号码"></el-input>
			</div>
			<div class="cdc__condition__item">
				<el-input v-model.trim="condition.callTime"  clearable placeholder="通话时长"></el-input>
			</div> -->
			<div class="cdc__condition__item">
				<k-date class="cdc__condition__date" v-model="curDate" @change="dateChange"></k-date>
			</div>
			<div class="cdc__condition__item">
				<el-button @click.stop="search" type="primary">查询</el-button>
			</div>
			<div class="cdc__condition__item cdc__condition__right">
				<el-button @click.stop="exportData" type="text">导出</el-button>
			</div>
		</div>
		<div class="cdc__table" v-loading="tableLoading">
			<div class="cdc__toolbar">
				总消费金额：<i class="cdc__price">{{totalPrice}}</i>元
			</div>
			<el-table @sort-change="sortChange" :data="tableData" :border="true" stripe >
			    <el-table-column
			    	align="center"
		      	prop="dnis"
		      	:show-overflow-tooltip="true"
		      	label="号码">
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="item.keyword"
		      	sortable="custom"
		      	:show-overflow-tooltip="true"
		      	label="话术">
		      	<template slot-scope="scope">
              {{ scope.row.itemDesc ? scope.row.itemDesc:'--' }}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
		      	prop="itemTrigerTime"
		      	sortable="custom"
		      	label="转人工时间">
		      	<template slot-scope="scope">
              {{ formatTime(scope.row.itemTrigerTime )}}
            </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="transferTime"
		      	label="通话时长">
	      		<template slot-scope="scope">
      				{{ formatCallTime(scope.row.transferTime)}}
            </template>
			    </el-table-column>
		     	<el-table-column
			     	align="center"
		      	prop="transferAmount"
		      	sortable="custom"
		      	label="消费金额">
		      	<template slot-scope="scope">
              {{ scope.row.transferAmount ? scope.row.transferAmount+'元':'--' }}
            </template>
			    </el-table-column>
		  	</el-table>
			<el-pagination v-if="page.total > 0" class="pagination" background
					prev-text="上一页" next-text="下一页"
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
	import KDate from '@/components/common/date/k-date'
	import {queryTaskFeeDetail} from '@/api/taichi-data-api.js'
	import {addDownloadTask} from '@/api/download-center-api.js'
	import {mapState, mapActions} from 'vuex'

	export default{
		// props : ['parentItem'],
		data : function(){
			return {
				tableLoading : false,
				curDate : [this.$moment(new Date().getTime()-30*1000*3600*24).format("YYYY-MM-DD"),this.$moment(new Date()).format("YYYY-MM-DD")],
				condition : {
					phoneNumber : '',
					callTime : ''
				},
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				sort : {
					field : 'itemTrigerTime',
					order : 'desc'
				},
				tableData : [],
				totalPrice : '0'
			}
		},
		methods : {
			...mapActions('user',[
	        'addDownTask'
	    ]),
			sortChange : function(column) {
				let field = column.prop ? column.prop : 'itemTrigerTime',
					order = column.order === 'ascending' ? 'asc' : 'desc';
				if (field !== this.sort.field || this.sort.order !== order) {
					this.sort.field = field;
					this.sort.order = order;
					this.reloadTable()
				}
			},
			handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadTable();
			},
			handleSizeChange : function(size){
				this.page.pageSize = size;
				this.reloadTable();
			},
			reloadTable : function(){
				this.tableLoading = true;
				let beginTime = this.curDate[0] ? Date.parse(this.curDate[0] + ' 00:00:00') : 0,
					endTime = this.curDate[1] ? Date.parse(this.curDate[1] + ' 23:59:59') : 0;
				let param = {
					// parentItem : this.parentItem,
					// dnis : this.condition.phoneNumber,
					// transferTime : this.condition.callTime,
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize,
					feeItemType : 3,
					order : this.sort.field + ' ' + this.sort.order
				}
				if(beginTime > 0){
					param.beginTime = beginTime;
				}
				if(endTime > 0){
					param.endTime = endTime;
				}
				queryTaskFeeDetail(param).then(resp => {
					this.totalPrice = this.$lodash.get(resp,'result.totalFee',0);
					this.page.total = this.$lodash.get(resp,'result.totalCount',0);
					this.tableData = this.$lodash.get(resp,'result.rows',[]);
					this.tableLoading = false;
				});
			},
			search : function(){
				if(!this.curDate[0] || !this.curDate[1]){
      		this.$message.error("日期不能为空");
      		return;
      	}
				this.page.pageIndex = 1;
				this.reloadTable();
			},
			formatTime : function(value){
	            if(value === null){
	                return ''
	            }else{
	                return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
	            }
	        },
	        formatCallTime : function(callTime){
		 		callTime = callTime || 0;
			 	let secondLong = Math.ceil(callTime / 1000),
			 		min = parseInt(secondLong / 60),
			 		second = secondLong % 60;
		 		return  min > 0 ? `${min}分${second}秒` : `${second}秒`;
	    },
	    exportData:function(){
      	let param = {
					businessId: this.$global.getBusinessId(),
					sysType: 2,
					downloadType: 11,
					channelCode: 2,
					query: {
						pageIndex: this.page.pageIndex,
						pageSize: this.page.pageSize,
						order: this.sort.field+" "+this.sort.order,
						channelCode: 2,
						feeItemType : 3,
						businessId: this.$global.getBusinessId()
					}
				}
				if(this.curDate && this.curDate.length == 2){
					let beginTime = this.curDate[0] ? Date.parse(this.curDate[0] + ' 00:00:00') : 0,
					endTime = this.curDate[1] ? Date.parse(this.curDate[1] + ' 23:59:59') : 0;
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
						this.addDownTask();
						this.$message({type : 'success' , message : '已添加到下载中心，请到下载中心查看'})
					}
					this.downLoading = false;

				})
      }
		},
		mounted : function(){
			// this.curDate = [];
			// this.condition.phoneNumber = '';
			// this.condition.callTime = '';
			this.search();
		},
		components : {
			'k-date' : KDate
		}
	}
</script>

<style scope>
	.cdc__condition{
		display:flex;
		position: relative;
	}
	.cdc__condition__item{
		margin-right:10px;
	}
	.cdc__condition__right{
		position:absolute;
		right: 10px;
	}
	.cdc__table{
		margin-top:20px;
	}
	.cdc__toolbar{
		line-height: 40px;
	    background: #fff;
	    text-align: right;
	    padding-right: 20px;
	}
	.cdc__condition__date{
		width:240px;
	}
	.cdc__price{
	    font-size: 16px;
	    color: #00b792;
	    padding-right: 5px;
	}
</style>