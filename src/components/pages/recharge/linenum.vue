<template>
	<div>
		<div class="toolbar">
			<el-button size="small" type="primary" @click="showDialog">购买更多并发</el-button>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table  :data="tableData" :border="true" stripe style="width: 100%">
			   <el-table-column
			     	align="center"
		      		prop="baseInfo.cpnCode"
            		:show-overflow-tooltip="true"
		      		label="线路号码">
			    </el-table-column>
			 <!--    <el-table-column
			    	align="center"
			      	prop="createTime"
			      	label="购买时间">
		            <template slot-scope="scope">
		              {{ formatTime(scope.row.baseInfo.createTime )}}
		            </template>
			    </el-table-column> -->
			    <el-table-column
			     	align="center"
			      	prop="baseInfo.concurrentShow"
			      	label="并发数">
			      	<template slot-scope="scope">
		              {{ scope.row.baseInfo.concurrentShow || scope.row.baseInfo.concurrent}}
		            </template>
			    </el-table-column>
			     <el-table-column
			    	align="center"
			      	prop="createTime"
			      	label="到期时间">
		            <template slot-scope="scope">
		              {{ formatTime(scope.row.baseInfo.expirationTime )}}
		            </template>
		    	</el-table-column>
		    	 <el-table-column
			     	align="center"
		      		label="操作">
  	      			<template slot-scope="scope">
  						<el-button type="text" @click="showDialog">延期</el-button>
				    </template> 
			    </el-table-column>
			  </el-table>
				<el-pagination v-if="page.total > 0" class="pagination" background
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
	</div>
</template>

<script>
	import {queryCPNInfo} from '@/api/resmanage.js'

	export default {
		data : function () {
			return {
				tableLoading : false,
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				tableData : []
			}
		},
		methods : {
			reloadTable : function(){
				let param = {
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize,
					businessId : this.$global.getBusinessId(),
					status : 1
				};
				queryCPNInfo(param).then(resp => {
					this.tableData = this.$lodash.get(resp,'result.rows',[]);
					this.page.total = this.$lodash.get(resp,'result.totalCount',0);
				});
			},
			showDialog : function(){
				this.$alert('购买和延期，请联系您的项目经理','提示',{type : 'info'})
			},
		 	handleSizeChange(size){
				this.page.pageSize = size;
				this.reloadTable();
			},
    		handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadTable();
			},
			formatTime(value){
		        if(value === null){
		            return ''
		        }else{
		            return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
		        }
		    }
		},
		mounted : function(){
			this.reloadTable();
		}
	}
</script>


<style>
	.toolbar{
		text-align:right;
	    background-color: #fff;
    	padding: 10px 20px;
	}
</style>