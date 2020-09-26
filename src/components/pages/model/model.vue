<style scoped>
	.input-txt{
		width:250px;
		margin-right: 10px;
	}
	.page .content{
		margin-top:20px;
	}
</style>

<template>
	<div class="page">
		<div class="flex-between-center">
			<div class="flex-center">
				<el-input @keyup.enter.native="search" v-model.trim="name" class="input-txt" clearable placeholder="模型名称"></el-input>
				<el-button @click.stop="search" type="primary">搜索</el-button>
			</div>
			<div>
				<el-button icon="el-icon-plus" size="small" @click.stop="addDialog = true">新建模型</el-button>
			</div>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table
				:data="tableData"
				border>
		    <el-table-column
		    	align="center"
		      prop="name"
		      label="模型名称">
		    </el-table-column>
		    <el-table-column
		    	align="center"
		      prop="createTime"
		      label="创建时间">
	       	<template slot-scope="scope">
	          {{ formateTime(scope.row.createTime )}}
	        </template>
		    </el-table-column>
		    <!-- <el-table-column
		    	align="center"
		      prop="updateTime"
		      label="最近更新时间">
		      <template slot-scope="scope">
	          {{ formateTime(scope.row.updateTime )}}
	        </template>
		    </el-table-column> -->
		    <el-table-column
		    	align="center"
		      prop="updateTime"
		      label="操作">
		      <template slot-scope="scope">
     		   	<el-button size="small" type="text">
     		   		<router-link class="link" :to="'/rule/'+scope.row.id">编辑</router-link>
     		   	</el-button>
	          <el-button @click="deleteConfirm(scope.row.id)" size="small" type="text">删除</el-button>
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
		<model-add v-model="addDialog" @success="reloadTable"></model-add>
	</div>
</template>

<script>
	import {queryModeList,delModel} from '@/api/brainkb.js'

	import ModelAdd from './model__add.vue'

	export default {
		data : function(){
			return {
				tableLoading : false,
				tableData : [],
				name : '',
				page : {
					pageIndex : 1,
					pageSize : 10,
					total : 0
				},
				addDialog : false
			}
		},
		methods : {
			formateTime (value){
				if(value === null){
		      return ''
		    }else{
		      return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
		    }
			},
			deleteConfirm (id){
				this.$confirm('删除模型后将无法恢复，确定删除？', '删除确认').then(()=>{
					delModel({ids : [id]}).then(resp => {
						if(resp.code == 0){
							this.$message({type : 'success',message : '删除成功'})
							this.reloadTable();
						}else{
							this.$message.error('删除失败')
						}
					})
				},() => {});
			},
			reloadTable (){
				this.tableLoading = true;
				queryModeList({
					name : this.name,
					pageIndex : this.page.pageIndex,
					pageSize : this.page.pageSize
				}).then(resp => {
					this.tableData = this.$lodash.get(resp,'result.rows',[]);
					this.page.total = this.$lodash.get(resp,'result.totalRows',0);
					this.tableLoading = false;
				})
			},
			search (){
				this.pageIndex = 1;
				this.reloadTable();
			},
			handleSizeChange(size){
				this.page.pageSize = size;
				this.reloadTable();
			},
	    handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadTable();
			}
		},
		mounted : function(){
			this.search();
		},
		components : {
			'model-add' : ModelAdd
		}
	}
</script>