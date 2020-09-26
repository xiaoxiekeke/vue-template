<template>
	<div>
		<div class="condition">
			<div class="condition__item">
				<el-input v-model="condition.phone" class="condition-input" placeholder="手机号码"></el-input>
			</div>
			<div class="condition__item">
				<div class="condition-date">
					<k-date v-model="condition.sendDate"></k-date>
				</div>
			</div>
			<div class="condition__item" v-model="condition.status">
				<el-select placeholder="发送状态">
					<el-option :value="1" label="发送成功"></el-option>
					<el-option :value="0" label="发送失败"></el-option>
				</el-select>
			</div>
			<div class="condition__item">
				<el-button type="primary">查询</el-button>
			</div>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table :data="tableData" :border="true"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="客户姓名">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="手机号码">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="createTime"
			      	sortable="custom"
			      	label="发送时间">
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="status"
			      	sortable="custom"
			      	label="发送状态">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="模板名称">
			    </el-table-column>
			     <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="所属任务">
			    </el-table-column>
			     <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="计费条数">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="费用">
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="address"
					width="200"
			      	label="操作">
			      	 <template slot-scope="scope">
						<el-button type="text" size="small">查看</el-button>
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
		<template-add v-model="addDialog" v-if="addDialog"></template-add>
	</div>
</template>

<script>
import KDate from '@/components/common/date/k-date'

	export default {
		name : '',
		data : function(){
			return {
				tableLoading : false,
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				tableData : [],
				condition : {
					phone : '',
					status : '',
					sendDate : []
				}
			}
		},
		methods : {
			reloadTable : function(){

			},
			handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadTable();
			},
			handleSizeChange : function(size){
				this.page.pageSize = size;
				this.reloadTable();
			}
		},
		components : {
			'k-date' : KDate
		}
	}
</script>

<style scoped>
	.condition{
		display:flex;
	}
	.condition__item{
		margin-right:10px;
	}
	.condition-input{
		width:210px;
	}
	.condition-date{
		display:inline-block;
		width:230px;
	}
	.content{
		margin-top:20px;
	}
</style>