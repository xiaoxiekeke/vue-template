<template>
	<div class="page users">
		<div class="search">
			<el-input @keyup.enter.native="search" v-model.trim="phone" class="input-txt" clearable placeholder="手机号码"></el-input>
			<el-button @click.stop="search" class="btn-primary" type="primary">搜索</el-button>

			<div class="fr">
				<el-button :disabled="master == 0" @click.stop="createDialog = true" type="primary" icon="el-icon-plus">新增成员</el-button>
			</div>
		</div>
		<div class="content" v-loading="tableLoading">
			 <!-- @sort-change="sortChange" -->
			 <!-- :default-sort = "{prop: 'createTime', order: 'descending'}" -->
			<el-table :data="tableData" :border="true"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="surname"
		      	label="姓名">
			    </el-table-column>
			     <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="phone"
		      	label="手机号码">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="createTime"
		      	label="创建时间">
		      	<!-- sortable="custom" -->
			    </el-table-column>
			     <el-table-column
			     	align="center"
		      	prop="address"
						width="200"
		      	label="操作">
		      	<template slot-scope="scope">
		      		
		      		<span v-if="master == 1">
		      			<el-button type="text" @click="updateMemberDialog(scope.row)" size="small" >编辑</el-button>
		      		</span>
		      		<span v-else>
		      			<el-button type="text" disabled size="small" >编辑</el-button>
		      		</span>
					<span v-if="master == 1">
						<el-button v-if="scope.row.master==0" type="text" @click="delMemberDialog(scope.row.id,scope.row.master)" size="small" >删除</el-button>
						<el-button v-if="scope.row.master==1" type="text" disabled size="small" >删除</el-button>
					</span>
					<span v-else>
						<el-button type="text" disabled size="small" >删除</el-button>
					</span>
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

		<user-add  v-model="createDialog" v-on:loadList="loadList($event)"></user-add>
		<user-update v-if="updateDialog" v-model="updateDialog" v-bind:row="editRow" v-on:loadList="loadList($event)"></user-update>
	</div>
</template>

<script>
	import UserAdd from './user__add'
	import UserUpdate from './user__update'
	import {mapState} from 'vuex'
	import {queryMember,deleteMember} from '@/api/uc.js'
	import{formatLongDate} from '@/api/utils.js'
	export default {
		data : function(){
			return {
				surname:'',
				phone : '',
				tableLoading : false,
				tableData : [],
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				sort : {
					field : 'createTime',
					order : 'desc'
				},
				createDialog : false,
				updateDialog : false,
				editRow:{}
			}
		},
		computed : {
      ...mapState('user',[
      	'master',
          'business'
      ])
		},
		methods : {
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
				let _this = this;
				_this.tableLoading = true;

				let param = {
					surname : this.surname,
					phone : this.phone,
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize,
					sortName : this.sort.field,
					sortOrder : this.sort.order,
					businessId : this.business.id
				}
				let dataList = [],total = 0;
				queryMember(param).then(function(data){
					if(data.code == 0){
						let rows = data.result ? data.result.rows || [] : [];
						for(let row of rows){
							dataList.push({
								id: row.id,
								surname : row.surname,
								phone:row.phone,
								master:row.master,
								createTime : formatLongDate(row.createTime),
								modifyTime : formatLongDate(row.modifyTime)
							});
						}
						total = data.result ? data.result.totalCount : 0;
					}
					_this.page.total = total;
					_this.tableData = dataList;
					_this.tableLoading = false;
				})
			},
			loadList: function(){
				this.createDialog=false
				this.updateDialog=false
				this.search()
			},
			delMember:function(id){
				let _this = this;
				_this.tableLoading = true;
				let param = {
					id :id,
					businessId:this.business.id
				}
				deleteMember(param).then(function(data){
					if(data.code == 0){
						_this.search()
					}else{
						if (data.messageExt) {
							_this.$message.error('删除失败，错误信息：'+data.messageExt);	
						}else{
							_this.$message.error('删除失败');	
						}
					}
					_this.tableLoading = false;
				})
			},
			//删除话术
			delMemberDialog:function(id){
				const h = this.$createElement;
				this.$prompt(h('div',null,[
						h('p', null, '将删除此成员，且不可恢复。确认删除吗？'),
						h('p', null, '确认删除请输入"yes"（不含引号）'), 
					]),'提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^yes$/,
					inputValue:'yes',
					inputErrorMessage: '输入不正确'
				}).then(({ value }) => {
					this.delMember(id)
				}).catch(() => {
			
				});

			},
			updateMemberDialog:function(row){
				this.editRow=row
				this.updateDialog=true
			}
		},
		mounted : function(){
			this.search();
		},
		components : {
			'user-add' : UserAdd,
			'user-update' : UserUpdate
		}
	}
</script>

<style lang="less" scope>
	.users{
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