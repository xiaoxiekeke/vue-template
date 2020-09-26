<template>
	<div>
    	<div class="consump__condition">
    		<div class="consump__condition__item"><k-date class="consump__date" v-model="curDate" @change="dateChange"></k-date></div>
    		<div class="consump__condition__item">
    			<el-button @click.stop="search" type="primary">查询</el-button>
    		</div>
    	</div>
    	<div class="consump__content" v-loading="loading">
    		<el-table @sort-change="sortChange" :data="tableData" :border="true"
				 :default-sort = "{prop: 'createTime', order: 'descending'}"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			      	prop="orderNumber"
			      	width="265"
			      	label="订单号">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="payChannel"
			      	label="充值方式">
	      	      	<template slot-scope="scope">
                      	{{formatPayChannel(scope.row)}}
                    </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="createTime"
			      	width="200"
			      	label="充值时间">
			      	<template slot-scope="scope">{{formatTime(scope.row.createTime)}}</template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="orderDesc"
			      	label="充值类型">
			    </el-table-column>
			    <el-table-column
			     	align="center"
			      	prop="realPay"
			      	label="金额">
			    </el-table-column>
			    <el-table-column
			     	align="center"
			      	prop="arrivalMoney"
			      	label="到账金额">
			    </el-table-column>
			    <el-table-column
			     	align="center"
			      	prop="payResult"
			      	sortable="custom"
			      	label="状态">
			      	<template slot-scope="scope">
		      			<form id="alipay__form--order" v-if="scope.row.payResult == 0" 
		      				:action="alipayUrl" method="post"   target="_blank">
		                    <input type="hidden" name="businessId" :value="business.id" />
		                    <input type="hidden" name="channelCode" :value="$config.system.id" />
		                    <input type="hidden" name="callBackUrl" :value="callBackUrl" />
		                    <input type="hidden" name="payUser" :value="account" />
		                    <input type="hidden" name="orderNumber" :value="scope.row.orderNumber" />
		                     <el-button @click.stop="alipay" type="text" size="small">待付款</el-button>
	                	</form>
	                	<span>{{formatPayResult(scope.row)}}</span>
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
import {queryOrderList,getAliPayUrl} from '@/api/fee.js'

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
				field : 'createTime',
				order : 'desc'
			},
			tableData : []
		}
	},
	computed : {
		 ...mapState('user',[
            'business',
            'account'
        ]),
		alipayUrl : function(){
			return getAliPayUrl();
		},
		callBackUrl : function(){
			return window.location.href.split("#")[0] + "#/consumption/2"
		}
	},
	methods : {
		dateChange : function(){
			this.page.pageIndex = 1;
			this.search();
		},
		sortChange (column) {
			let field = column.prop,
				order = column.order === 'ascending' ? 'asc' : 'desc';
			if (field !== this.sort.field || this.sort.order !== order) {
				this.sort.field = field;
				this.sort.order = order;
				this.search()
			}
		},
		handleCurrentChange : function(page){
			this.page.pageIndex = page;
			this.search();
		},
		handleSizeChange : function(size){
			this.page.pageSize = size;
			this.search();
		},
		search : function(){
			const _this = this,
				  param = {
		            beginDate: _this.curDate[0],
		            endDate: _this.curDate[1],
		            pageSize: _this.page.pageSize,
		            pageIndex: _this.page.pageIndex,
		            sortName: _this.sort.field,
		            sortOrder: _this.sort.order
		        };
        	_this.loading = true;
			queryOrderList(param).then(function(data){
				_this.loading = false;
				let rows = _this.$lodash.get(data,'result.rows',[]),
					total = 0;
					total = _this.$lodash.get(data,'result.totalRows',0);
				_this.page.total = total;
				_this.tableData = rows;
			});
		},
		formatPayChannel : function(row){
			return row.payChannel == 2 ? '支付宝' : '对公转账'
		},
		formatTime : function(time){
			return this.$moment(time).format("YYYY-MM-DD HH:mm:ss")
		},
		formatPayResult : function(row){
			const payResult = row.payResult;
			if(payResult == 1){
	            return '已付款';
	        }else if(payResult == 2){
	            return '待确认';
	        }else if(payResult == 3){
	            return '已取消';
	        }
		},
		alipay : function(){
			document.getElementById('alipay__form--order').submit()
		}
	},
	mounted : function(){
		this.search();
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

</style>