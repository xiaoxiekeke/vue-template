<template>
	<div>
		<div class="toolbar">
			<el-alert class="tip" type="warning" :closable="false" show-icon 
				title="因运营商要求，短信内容需审核通过后，方可使用。"
			></el-alert>
			<el-button @click.stop="add()" type="primary" icon="el-icon-plus">新建模板</el-button>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table :data="tableData" :border="true"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="simpleDesc"
			      	label="模板名称">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="createTime"
			      	label="申请时间">
			      	<template slot-scope="scope">
			      		<span>{{formatTime(scope.row.createTime)}}</span>
			      	</template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="status"
			      	label="审核状态">
			      	<template slot-scope="scope">
			      		<span>{{formatStatus(scope.row.rowStatus)}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="descrip"
		      	:show-overflow-tooltip="true"
		      	label="失败原因">
		      		<template slot-scope="scope">
			      		<span>{{scope.row.rowStatus == 2&&scope.row.descrip ? scope.row.descrip : '--'}}</span>
			      	</template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="address"
					width="200"
			      	label="操作">
			      	 <template slot-scope="scope">
						<el-button @click.stop="seeDetail(scope.row.signName,scope.row.content)" type="text" size="small">查看</el-button>
						<!-- <el-button @click.stop="modify(scope.row.id)" type="text" size="small">修改</el-button> -->
						<el-button @click.stop="deleteTemplate(scope.row.id)" type="text" size="small">删除</el-button>
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
		<template-add :id="id" v-model="addDialog" @success="reloadTable" v-if="addDialog"></template-add>
	</div>
</template>

<script>
	import TemplateAdd from './template-add'
	import {querySmsTemplet,deleteSmsTemplet} from '@/api/resmanage.js'

	export default {
		name : '',
		data : function(){
			return {
				tableLoading : false,
				name : '',
				id : '',
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				tableData : [],
				addDialog : false
			}
		},
		methods : {
			seeDetail : function(signName,content){
				this.$alert('【'+signName+'】'+content,'查看内容');
			},
			add : function(){
				this.id = '';
				this.addDialog = true;
			},
			modify : function(id){
				this.id = id;
				this.addDialog = true;
			},
			deleteTemplate : function(id){
				const h = this.$createElement;
				this.$prompt(h('div',null,[
						h('p', null, '将删除此模板，且不可恢复。确认删除吗？'),
						h('p', null, '确认删除请输入"yes"（不含引号）'), 
					]),'提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^yes$/,
					inputValue:'yes',
					inputErrorMessage: '输入不正确'
				}).then(({ value }) => {
					deleteSmsTemplet({ id: id }).then(res => {
						if(res.code === 0){
							this.$message({type: 'success',message: '删除成功'});
							this.reloadTable();
						}else{
							this.$message.error(res.messageExt || '删除失败');
						}
					})
				}).catch(() => {});
			},
			reloadTable : function(){
				this.tableLoading = true;
				querySmsTemplet({
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize,
					delStatus : 1
				}).then(resp => {
					this.tableData = this.$lodash.get(resp,'result.rows',[]);
					this.page.total = this.$lodash.get(resp,'result.totalCount');
					this.tableLoading = false;
				});
			},
			formatTime : function(value){
	            if(value === null){
	                return ''
	            }else{
	                return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
	            }
	        },
	        formatStatus : function(value){
	        	if(value === null){
	                return '--'
	            }else{
	                return ['申请中','已通过','未通过','申请中'][value];
	            }
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
		mounted : function(){
			this.reloadTable();
		},
		components : {
			'template-add' : TemplateAdd
		}
	}
</script>

<style scoped>
	.tip{
		float:left;
		width:380px;
	}
	.toolbar{
		text-align: right;
    	margin: 10px 0;
	}
</style>