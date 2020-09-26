<template>
	<div class="page push">
		<div class="content">
			<div class="toobar">
				<el-button @click.stop="addPush" type="primary">接入设置</el-button>
			</div>
			<el-table :data="tableData" :border="true"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="pushModule"
			      	label="推送模块">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="appId"
			      	label="所属应用">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="robotId"
			      	label="话术编码">
			    </el-table-column>
			     <el-table-column
			     	align="center"
			     	min-width="200px"
		     		:show-overflow-tooltip="true"
			      	prop="url"
			      	label="接口地址">
			    </el-table-column>
		       	<el-table-column
			     	align="center"
			      	prop="status"
			      	label="启用状态">
	      	      	 <template slot-scope="scope">
	      				{{scope.row.status=='0'?'无效':''}}
	      				{{scope.row.status=='1'?'有效':''}}
	      		     </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		     		prop="type"
			      label="操作">
			      <template slot-scope="scope">
							<el-button @click.stop="editPush(scope.row.id)" type="text" size="small">编辑</el-button>
							<el-button @click.stop="delPush(scope.row.id)" type="text" size="small">删除</el-button>
				    </template>
			    </el-table-column>
			  </el-table>
			  <el-pagination v-if="Pushlist.total > 0" class="pagination" background
			      prev-text="上一页"
			      next-text="下一页"
			      @size-change="handlePushlistSizeChange"
			      @current-change="handlePushlistCurrentChange"
			      :current-page="Pushlist.pageIndex"
			      :page-sizes="[10,15]"
			      :page-size="Pushlist.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="Pushlist.total">
			  </el-pagination>
		</div>
		<push-add @success="createSuccess" v-if="createDialog" :id="id" v-model="createDialog"></push-add>
	</div>
</template>


<script>
	import PushAdd from './push__add'
	import {queryPushAddress,deletePushAddress} from '@/api/openapi-admin.js'

	export default {
		name : 'openapi_push',
		data : function(){
			return {
				tableData : [],
				id : '',
				Pushlist : {
				  total : 0,
				  pageIndex : 1,
				  pageSize : 10
				},
				createDialog : false
			}
		},
		methods : {
			handlePushlistCurrentChange : function(page){
	      this.Pushlist.pageIndex = page;
	      this.reloadTable();
	    },
	    handlePushlistSizeChange : function(size){
	      this.Pushlist.pageSize = size;
	      this.reloadTable();
	    },
			addPush : function(){
				this.id = '';
				this.createDialog = true;
			},
			editPush : function(id){
				this.id = id;
				this.createDialog = true;
			},
			createSuccess : function(){
				this.reloadTable();
			},
			reloadTable : function(){
				var _this=this
				let param = {
				    pageIndex : this.Pushlist.pageIndex,
				    pageSize : this.Pushlist.pageSize
				};
				queryPushAddress(param).then((resp)=>{
					this.tableData = this.$lodash.get(resp,'result.rows',[]);
					_this.Pushlist.total=resp.result.totalCount;
				});
			},
			delPush:function(id){
			  const h = this.$createElement;
			  var _this=this
			  this.$prompt(h('div',null,[
			      h('p', null, '将删除此自有线路，且不可恢复。确认删除吗？'),
			      h('p', null, '确认删除请输入"yes"（不含引号）'), 
			    ]),'提示',{
			    confirmButtonText: '确定',
			    cancelButtonText: '取消',
			    inputPattern: /^yes$/,
			    inputValue:'yes',
			    inputErrorMessage: '输入不正确'
			  }).then(({ value }) => {
			    deletePushAddress({id:id}).then(function(resp){
			        if (resp.code==0) {
			            _this.reloadTable()    
			        }else{
			            this.$message.error('删除失败');
			        }
			    })
			  }).catch(() => {
			
			  });

			},
		},
		mounted : function(){
			this.reloadTable();
		},
		components : {
			'push-add' : PushAdd
		}
	}
</script>

<style lang="less">
	.push{
		.content{
			.toobar{
				margin-bottom:20px;
				text-align:right;
			}
		}
	}
</style>