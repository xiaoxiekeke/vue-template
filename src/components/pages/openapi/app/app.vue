<template>
	<div class="page app">
		<div class="content">
			<div class="toobar">
				<el-button @click.stop="addApp()" type="primary">添加应用</el-button>
			</div>
			<el-table :data="tableData" :border="true"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="app_name"
			      	label="应用名称">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="app_id"
			      	label="appId">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="app_key"
			      	label="appKey"
			      	width="250">
  			      	<template slot-scope="scope">
  			      		<div v-if="scope.row.hideappKey">******<el-button @click.stop="toogleappKey(scope.row.app_id)" type="text" size="small">显示</el-button></div>
  			      		<div class="showappSecretorKey" v-else>{{ scope.row.app_key}}<!-- <el-button @click.stop="toogleappKey(scope.row.app_id)" type="text" size="small">隐藏</el-button> --></div>
  	      		    </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			      	prop="app_secret"
			      	label="appSecret"
			      	width="245">
			      	<template slot-scope="scope">
			      		<div v-if="scope.row.hideappSecret">******<el-button @click.stop="toogleappSecret(scope.row.app_id)" v-if="scope.row.hideappSecret" type="text" size="small">显示</el-button></div>
			      		<div class="showappSecretorKey" v-else>{{ scope.row.app_secret}}<!-- <el-button @click.stop="toogleappSecret(scope.row.app_id)" type="text" size="small">隐藏</el-button> --></div>
	      		    </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="tags"
			      	label="业务分类">
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="app_type"
			      	label="类型">
	      	      	<template slot-scope="scope">
	      	      		{{ scope.row.app_type==0?"呼出":""}}
                        {{ scope.row.app_type==1?"呼入":""}}
                        {{ scope.row.app_type==2?"呼入+呼出":""}}
	      		    </template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="concurrents"
			      	label="并发数">
			    </el-table-column>
			     <el-table-column
			     	align="center"
		     		prop="type"
			      	label="操作"
			      	fixed="right"
			      	width="150">
			      	 <template slot-scope="scope">
						<el-button @click.stop="editApp(scope.row.app_id)" type="text" size="small">编辑</el-button>
						<!-- <el-button @click.stop="resetSecret(scope.row.app_id)" type="text" size="small">重置秘钥</el-button> -->
				     </template>
			    </el-table-column>
			  </el-table>
			  <el-pagination v-if="Applist.total > 0" class="pagination" background
			      prev-text="上一页"
			      next-text="下一页"
			      @size-change="handleApplistSizeChange"
			      @current-change="handleApplistCurrentChange"
			      :current-page="Applist.pageIndex"
			      :page-sizes="[10,15]"
			      :page-size="Applist.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="Applist.total">
			  </el-pagination>
		</div>
		<app-add v-if="createDialog" :id="appId" @success="createSuccess" v-model="createDialog"></app-add>
	</div>
</template>

<script>
	import AppAdd from './app__add'
	import {queryAppList} from '@/api/openapi-admin.js'


	export default {
		name : 'openapi_app',
		data : function(){
			return {
				tableData : [],
				appId : '',
				createDialog : false,
				Applist : {
				  total : 0,
				  pageIndex : 1,
				  pageSize : 10
				}
			}
		},
		mounted : function(){
			this.reloadTable();
		},
		methods : {
			handleApplistCurrentChange : function(page){
	      this.Applist.pageIndex = page;
	      this.reloadTable();
	    },
	    handleApplistSizeChange : function(size){
	      this.Applist.pageSize = size;
	      this.reloadTable();
	    },
			addApp : function(){
				this.appId = '';
				this.createDialog = true;
			},
			editApp : function(appId){
				this.appId = appId;
				this.createDialog = true;
			},
			reloadTable : function(){
				var _this=this
				let param = {
				    pageIndex : this.Applist.pageIndex,
				    pageSize : this.Applist.pageSize
				};
				queryAppList(param).then((resp) => {
					var tableData = this.$lodash.get(resp,'result.rows',[]);
					_this.Applist.total=resp.result.totalCount;
					var newtableData=[]
					for(var i=0;i<tableData.length;i++){
						tableData[i].hideappSecret=true;
						tableData[i].hideappKey=true;
						newtableData.push(tableData[i])
					}
					this.tableData=newtableData;
				});
			},
			createSuccess : function(){
				this.reloadTable();
			},
			toogleappKey:function(id){
				var newtableData=[]
				for(var i=0;i<this.tableData.length;i++){
					if(this.tableData[i].app_id==id){
						this.tableData[i].hideappKey=!this.tableData[i].hideappKey
					}
					newtableData.push(this.tableData[i])
				}
				this.tableData=newtableData
			},
			toogleappSecret:function(id){
				var newtableData=[]
				for(var i=0;i<this.tableData.length;i++){
					if(this.tableData[i].app_id==id){
						this.tableData[i].hideappSecret=!this.tableData[i].hideappSecret
					}
					newtableData.push(this.tableData[i])
				}
				this.tableData=newtableData
			},
			resetSecret(){
				
			}

		},
		components : {
			'app-add' : AppAdd
		}
	}

</script>

<style lang="less">
	.app{
		.content{
			.toobar{
				margin-bottom:20px;
				text-align:right;
			}
		}
		.showappSecretorKey{
			line-height:20px;
			.el-button--small, .el-button--small.is-round{
				padding:0px;
			}
		}
	}
</style>