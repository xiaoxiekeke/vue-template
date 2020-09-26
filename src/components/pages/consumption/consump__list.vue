<template>
	<div>
		<div class="consump__condition">
    		<div class="consump__condition__item"><k-date class="consump__date" v-model="curDate" :limitLastOneYear="true" @change="dateChange"></k-date></div>
    		<div class="consump__condition__item">
    			<el-button @click.stop="search" type="primary">查询</el-button>
    		</div>
    	</div>
  <!--   	<div class="total_statistics">
    		<span>总合计：{{totalStatistics.totalAmount}}</span>
    		<span>任务外呼金额合计：{{totalStatistics.callAmount}}</span>
    		<span>短信费用合计：{{totalStatistics.smsAmount}}</span>
    		<span>转人工费用合计：{{totalStatistics.transferAmount}}</span>
    	</div> -->
    	<div class="consump__content" v-loading="loading">
    		<el-table @sort-change="sortChange" :data="tableData" :border="true"
				 :default-sort = "{prop: 'itemCreateTime', order: 'descending'}" stripe style="width: 100%">
			    <el-table-column
			    	align="center"
			      	prop="itemDesc"
			      	:show-overflow-tooltip="true"
			      	label="任务名称">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="itemCreateTime"
			      	:show-overflow-tooltip="true"
			      	label="创建时间">
			      	<template slot-scope="scope">
		              {{ formatTime(scope.row.itemCreateTime )}}
		            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="callAmount"
			      	:show-overflow-tooltip="true"
			      	label="任务外呼金额">
			      	<template slot-scope="scope">
		              {{ scope.row.callAmount ? scope.row.callAmount+'元':'--' }}
		            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="callTime"
			      	:show-overflow-tooltip="true"
			      	label="任务外呼时长">
			      	<template slot-scope="scope">
		             {{ formatCallTime(scope.row.callTime)}}
		            </template>
			    </el-table-column>
				<el-table-column
			    	align="center"
			      	prop="smsFeeCount"
			      	:show-overflow-tooltip="true"
			      	label="短信条数">
		      		<template slot-scope="scope">
		              {{ scope.row.smsFeeCount ? scope.row.smsFeeCount+'条':'--' }}
		            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="smsAmount"
			      	:show-overflow-tooltip="true"
			      	label="短信费用">
			      	<template slot-scope="scope">
		              {{ scope.row.smsAmount ? scope.row.smsAmount+'元':'--' }}
		            </template>
			    </el-table-column>

			     <el-table-column
			    	align="center"
			      	prop="callAmount"
			      	:show-overflow-tooltip="true"
			      	label="转人工费用">
			      	<template slot-scope="scope">
		              {{ scope.row.transferAmount ? scope.row.transferAmount+'元':'--' }}
		            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="callTime"
			      	:show-overflow-tooltip="true"
			      	label="转人工时长">
			      	<template slot-scope="scope">
		             {{ formatCallTime(scope.row.transferTime)}}
		            </template>
			    </el-table-column>

		     	<el-table-column
			     	align="center"
			      	prop="measure"
			      	label="操作">
			      	 	<template slot-scope="scope">
			      	 		<router-link :to="'/consumpdetail/1/'+scope.row.parentItem" class="link" >查看明细</router-link>
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
import {mapState} from 'vuex'
import KDate from '@/components/common/date/k-date'
import {queryTaskFeeStatistics,queryFeeTotalStatistics} from '@/api/taichi-data-api.js'

export default {
	data : function () {
		return {
			loading : true,
			curDate : [this.$moment().format('YYYY-MM-DD'),this.$moment().format('YYYY-MM-DD')],
			page : {
				total : 0,
				pageIndex : 1,
				pageSize : 10
			},
			sort : {
				field : 'itemCreateTime',
				order : 'desc'
			},
			tableData : [],
			totalStatistics:{
				totalAmount:0,
				callAmount:0,
				smsAmount:0,
				transferAmount:0
			}
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
		dateChange : function(){
			//this.search();
		},
		sortChange (column) {
			let field = column.prop,
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
			const _this = this,
					beginTime = _this.curDate[0] ? Date.parse(_this.curDate[0] + ' 00:00:00') : 0,
					endTime = _this.curDate[1] ? Date.parse(_this.curDate[1] + ' 23:59:59') : 0,
				  	param = {
			            pageSize: _this.page.pageSize,
			            pageIndex: _this.page.pageIndex,
			            order : _this.sort.field + ' ' + _this.sort.order
			        };
			if(beginTime > 0 && endTime > 0){
				param.beginTime = beginTime;
				param.endTime = endTime;
			}
        	_this.loading = true;
        	let tableList = [];
			queryTaskFeeStatistics(param).then(function(data){
				_this.loading = false;
				let rows = _this.$lodash.get(data,'result.rows',[]),
					total = _this.$lodash.get(data,'result.totalCount',0);
				_this.page.total = total;
				_this.tableData = rows;
			});
		},
		loadFeeTotalStatistics:function(){
			const 	beginTime = this.curDate[0] ? Date.parse(this.curDate[0] + ' 00:00:00') : 0,
					endTime = this.curDate[1] ? Date.parse(this.curDate[1] + ' 23:59:59') : 0,
				  	param = {
			            pageSize: 20,
			            pageIndex: 1,
			            businessId:this.business.id,
			            channelCode:2
			        };
			if(beginTime > 0 && endTime > 0){
				param.beginTime = beginTime;
				param.endTime = endTime;
			}
			queryFeeTotalStatistics(param).then((data)=>{
				var rows = this.$lodash.get(data,'result.rows',[]);
				if (rows.length==0) {
					return
				}
				var obj=rows[0];
				this.totalStatistics.totalAmount=obj.totalAmount||0;
				this.totalStatistics.callAmount=obj.callAmount||0;
				this.totalStatistics.smsAmount=obj.smsAmount||0;
				this.totalStatistics.transferAmount=obj.transferAmount||0;
			});
		},
		search : function(){
			this.page.pageIndex = 1;
			this.reloadTable();
			//this.loadFeeTotalStatistics()
		},
		formatTime : function(value){
            if(value == null||value=='0'){
                return '--'
            }else{
                return this.$moment(parseInt(value)).format("YYYY-MM-DD HH:mm:ss")
            }
        },
        formatCallTime : function(callTime){
	 		callTime = callTime || 0;
		 	let secondLong = Math.ceil(callTime / 1000),
		 		min = parseInt(secondLong / 60),
		 		second = secondLong % 60;
	 		return  min > 0 ? `${min}分${second}秒` : `${second}秒`;
        }
	},
	mounted : function(){
		this.reloadTable();
		//this.loadFeeTotalStatistics()
	},
	components : {
		'k-date' : KDate
	}
}
</script>

<style scope>
	.consump__condition{
		display:flex;
		margin:10px 0 20px 0;
	}
	.consump__condition__item{
		margin-right:10px;
	}
	.total_statistics span{
		margin-right: 30px;
		margin-left: 5px;
		color: #303133;
	    font-size: 14px;
    	font-weight: 500;
	}
</style>