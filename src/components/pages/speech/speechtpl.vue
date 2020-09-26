<template>
	<div class="page speechtpl">
		<div class="search">
			<el-input v-model="name" @keyup.enter.native="search" class="input-txt" clearable placeholder="话术名称"></el-input>
			<el-button @click.stop="search" class="btn-primary" type="primary">搜索</el-button>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table @sort-change="sortChange" :data="tableData" :border="true"
				 :default-sort = "{prop: 'createTime', order: 'descending'}"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="name"
			      	label="话术名称">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="createTime"
			      	sortable="custom"
			      	label="创建时间">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="modifyTime"
			      	sortable="custom"
			      	label="更新时间">
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="type"
			      	width="100"
			      	label="话术类型">
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="id"
			      	width="200"
			      	label="操作">
			      	 <template slot-scope="scope">
				        <el-button type="text" size="small">
							<a :href="formatFlowUrl('display',scope.row.id)" class="link" target="_blank">查看</a> 
							<!-- <router-link :to="formatFlowUrl('display',scope.row.id)" class="link" >查看</router-link> -->
						</el-button>
				        <el-button @click.stop="useSpeech(scope.row.id,scope.row.name)" type="text" size="small">使用</el-button>
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

		<el-dialog
		  title="使用话术"
		  :visible.sync="dialogVisible"
		  :append-to-body="true"
		  :close-on-click-modal="false"
		  width="30%">
		  <el-input @keyup.enter.native="copySeech" :autofocus="true" name="copyName" v-model.trim="copyName" placeholder="请输入新的话术名称" ></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="dialogVisible = false">取 消</el-button>
		    <el-button class="speechtpl__usebtn" v-if="!isSubmit" type="primary" @click.stop="copySeech">开始使用</el-button>
		    <el-button  class="speechtpl__usebtn" v-else type="primary" disabled >提交中...</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>

import {queryTemplateSpeechSkill,copy} from '@/api/brain.js'
import{formatLongDate} from '@/api/utils.js'

export default {
	name: 'speechtpl',
	data : function () {
		return {
			tableLoading : false,
			dialogVisible : false,
			name : '',
			page : {
				total : 0,
				pageIndex : 1,
				pageSize : 10
			},
			sort : {
				field : 'createTime',
				order : 'desc'
			},
			tableData : [],
			copyName : '',
			speechId : '',
			isSubmit : false
		}
	},
	methods : {
		formatFlowUrl : function(type,id){
			//return '/flow/4/'+id;
			return this.$global.getFlowUrl('/flow/4/'+id);
		},
		//event
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
			let _this = this;
			_this.tableLoading = true;
			let param = {
				name : this.name,
				pageIndex : this.page.pageIndex,
				pageSize : this.page.pageSize,
				sortName : this.sort.field,
				sortOrder : this.sort.order
			}
			let dataList = [],total = 0;
			queryTemplateSpeechSkill(param).then(function(data){
				if(data.code == 0){
					let rows = data.result ? data.result.rows || [] : [];
					for(let row of rows){
						dataList.push({
							id: row.id,
							name : row.name,
							createTime : formatLongDate(row.createTime),
							modifyTime : formatLongDate(row.modifyTime),
							type : row.type == '2' ? '动态话术' : '普通话术'
						});
					}
					total = data.result ? data.result.totalRows : 0;
				}
				_this.page.total = total;
				_this.tableData = dataList;
				_this.tableLoading = false;
			});
		},
		search : function(){
			this.page.pageIndex = 1;
			this.reloadTable();
		},
		useSpeech : function(id,name){
			this.dialogVisible = true;
			this.copyName = name + '副本';
			this.speechId = id;
			setTimeout(function(){
				document.querySelector('input[name="copyName"]').focus();},10);
		},
		copySeech : function(id){
			var _this = this;
			if(_this.copyName == ''){
				_this.$message({message: '请输入新的话术名称',type: 'warning'});
				document.querySelector('input[name="copyName"]').focus();
				return;
			}
			_this.isSubmit = true;
			copy({ name : _this.copyName,id : _this.speechId}).then(function(data){
				const code = data.code;
				if(code == 0){
					_this.$message({message: '新建成功',type: 'success'});
					_this.dialogVisible = false;
					 _this.$router.push({ path: '/myspeech' });
				}else{
					_this.$message.error(data.messageExt);
				}
				_this.isSubmit = false;
			});
		}
	},
	mounted : function(){
		this.reloadTable();
	}
}
	
</script>
<style src="@/assets/less/common.less" lang="less"></style>
<style lang="less">
	.speechtpl__usebtn{
		min-width:100px;
	}
</style>
<style lang="less" scoped>
	.speechtpl{
		.search{
			.input-txt{
				width:250px;
			}
		}
		.content{
			margin-top:30px;
		}
		
	}

</style>