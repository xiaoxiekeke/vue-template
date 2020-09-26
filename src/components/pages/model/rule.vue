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
			<el-page-header @back="goBack" content="模型详情"></el-page-header>
			<el-button icon="el-icon-plus" size="small" @click.stop="addRule">添加规则</el-button>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table
				:data="tableData"
				border>
		    <el-table-column
		    	align="center"
		      prop="name"
		      label="规则名称">
		    </el-table-column>
		    <el-table-column
		    	align="center"
		      prop="typeName"
		      label="规则类型">
		    </el-table-column>
		    <el-table-column
		    	align="center"
		      prop="createTime"
		      label="创建时间">
	       	<template slot-scope="scope">
	          {{ formateTime(scope.row.createTime )}}
	        </template>
		    </el-table-column>
		    <el-table-column
		    	align="center"
		      prop="updateTime"
		      label="最近更新时间">
		      <template slot-scope="scope">
	          {{ formateTime(scope.row.updateTime )}}
	        </template>
		    </el-table-column>
		    <el-table-column
		    	align="center"
		      prop="updateTime"
		      label="操作">
		      <template slot-scope="scope">
	          <el-button size="small" type="text" @click="editRule(scope.row.id)">编辑</el-button>
	          <el-button @click="deleteConfirm(scope.row.id)" size="small" type="text">删除</el-button>
	        </template>
		    </el-table-column>
	  	</el-table>
	  	<el-pagination 
	  		class="pagination"
	  		background
	  		v-if="page.total > 0"  
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
		<rule-add 
			v-if="addDialog" 
			v-model="addDialog" 
			:groupId="groupId"
			:data="editData"
			@success="reloadTable"></rule-add>
	</div>
</template>

<script>
	import {queryRuleList,delRule} from '@/api/brainkb.js'

	import RuleAdd from './rule__add.vue'

	export default {
		data : function(){
			return {
				groupId : '',
				tableLoading : false,
				tableData : [],
				page : {
					pageIndex : 1,
					pageSize : 10,
					total : 0
				},
				addDialog : false,
				editData : null
			}
		},
		methods : {
			deleteConfirm (id){
				this.$confirm('删除规则后将无法恢复，确定删除？', '删除确认').then(()=>{
					delRule({ids : [id]}).then(resp => {
						if(resp.code == 0){
							this.$message({type : 'success',message : '删除成功'})
							this.reloadTable();
						}else{
							this.$message.error('删除失败')
						}
					})
				},() => {});
			},
			addRule (){
				this.editData = null;
				this.addDialog = true;
			},
			editRule (id){
				this.editData = this.tableData.find(item => { return item.id == id});
				this.addDialog = true;
			},
			goBack (){
				this.$router.go(-1);
			},
			formateTime (value){
				if(value === null){
		      return ''
		    }else{
		      return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
		    }
			},
			reloadTable (){
				this.tableLoading = true;
				queryRuleList({
					groupId : this.groupId,
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
		 beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.groupId = vm.$route.params.groupId;
				vm.search();
			});
		},
		mounted : function(){
			
		},
		components : {
			'rule-add' : RuleAdd
		}
	}
</script>