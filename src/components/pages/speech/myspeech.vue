<template>
	<div class="page myspeech">
		<div class="search">
			<div>
				<el-input @keyup.enter.native="search" v-model="name" class="input-txt" clearable placeholder="话术名称"></el-input>
				<el-button @click.stop="search" class="btn-primary" type="primary">搜索</el-button>
			</div>
			<div>
				<el-button @click="createSpeechDialog = true" type="primary" icon="el-icon-plus">新建话术</el-button>
				<el-button @click.stop="importDialog = true" type="primary"  plain>话术导入</el-button>
			</div>
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
			      	prop="status"
			      	width="100"
			      	sortable="custom"
			      	label="状态">
		      	 <template slot-scope="scope">
			        <el-button @click.stop="seeFailReason(scope.row.id)" v-if="scope.row.status == 2" type="text" size="small">查看</el-button>
			        <span v-else>{{scope.row.statusName}}</span>
			     </template>
			    </el-table-column>
		     	<el-table-column
			     	align="center"
		      	prop="address"
						width="200"
		      	label="操作">
	      	 	<template slot-scope="scope">
							<div class="setting-row">
								<el-button type="text" size="small">
									 <a :href="formatFlowUrl('display',scope.row.id)" class="link" target="_blank">查看</a>
								</el-button>
								<el-button 
									:disabled="scope.row.status == 1 || (scope.row.taskStatus == 1 && master != 2)"
									type="text" 
									@click="editSpeech(scope.row)"
									size="small">编辑</el-button>
								<el-button 
									:loading="scope.row.exporting" 
									@click="exportSpeechSkill(scope.row.id,scope.$index)" 
									type="text" 
									size="small">导出</el-button>
								<el-button 
									type="text" 
									size="small" 
									@click="delSpeech(scope.row.id)"
									:disabled="scope.row.status == 1 || scope.row.taskStatus == 1">删除</el-button>
							</div>
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

		<speech-add @success="reloadTable" v-if="createSpeechDialog" v-model="createSpeechDialog"></speech-add>
		
		<speech-import @success="reloadTable" v-if="importDialog" v-model="importDialog"></speech-import>

		<el-dialog :append-to-body="true":visible.sync="failDialog" 
			width="500px"
			title="失败原因" >
		 	{{remark}}
		</el-dialog>

	</div>
	
</template>

<script>

import {querySpeechSkill,exportSpeech,deleteSpeechSkill,querySpeechSkillReview} from '@/api/brain.js'
import fileDownload from 'js-file-download'

import MySpeechAdd from './myspeech__add'
import MySpeechImport from './myspeech__import'
import {mapState,mapActions} from 'vuex'
	
export default {
	name: 'myspeech',
	data : function () {
		return {
			importDialog : false,
			createSpeechDialog:false,
			//
			tableLoading : false,
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
			failDialog : false,
			remark : ''
		}
	},
	 computed : {
    ...mapState('user',[
    	'master'
    ])
	},
	methods : {
		formatStatus : function(status,taskStatus){
			//status: 1:"审核中",2:"审核未通过",3:"待发布",4:"已发布"
			if(taskStatus == '1'){
				return '任务进行中';
			}
			return ['','审核中','','待发布','已发布'][status] || status;
		},
		formateTime(value){
      if(value === null){
          return ''
      }else{
          return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    editSpeech(row){
    	let url = this.formatFlowUrl('edit',row.id);
    	if(row.taskStatus == 1 && this.master == 2){
    		this.$confirm('当前话术正在被外呼任务使用中，如需修改话术中的动态字段，建议停止任务后进行修改，是否继续修改？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { window.open(url)  }).catch();
    	}else{
    		window.open(url);
    	}
    },
		formatFlowUrl : function(c,id){
			if(c == 'edit'){
				return this.$global.getFlowUrl('/flow/2/'+id);
			}else{
				return this.$global.getFlowUrl('/flow/1/'+id);
			}
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
			querySpeechSkill(param).then(function(data){
				if(data.code == 0){
					let rows = data.result ? data.result.rows || [] : [];
					for(let row of rows){
						dataList.push({
							name : row.name,
							createTime : _this.formateTime(row.createTime),
							modifyTime : _this.formateTime(row.modifyTime),
							type : row.type == '2' ? '动态话术' : '普通话术',
							statusName : _this.formatStatus(row.status,row.taskStatus),
							taskStatus: row.taskStatus,
							status: row.status,
							id:row.id,
							exporting:false
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
		//导出话术
		exportSpeechSkill(id,index){
			let info = this.tableData[index]
			info.exporting = true
			exportSpeech({id:id}).then(res => {
				fileDownload(res, info.name+'.zip')
				info.exporting = false
			})

		},
		//删除话术
		delSpeech(id){
			const h = this.$createElement;
			this.$prompt(h('div',null,[
					h('p', null, '将删除此话术，且不可恢复。确认删除吗？'),
					h('p', null, '确认删除请输入"yes"（不含引号）'), 
				]),'提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^yes$/,
				inputValue:'yes',
				inputErrorMessage: '输入不正确'
			}).then(({ value }) => {
				deleteSpeechSkill({ id: id }).then(res => {
					if(res.code === 0){
						this.$message({type: 'success',message: '删除成功'});
						this.reloadTable();
					}else{
						this.$message.error(res.message || '删除失败');
					}

				})
			}).catch(() => {});
		},
		seeFailReason : function(id){
			querySpeechSkillReview({speechSkillId : id}).then(resp => {
				let remark = this.$lodash.get(resp,'result.rows[0].remark','');
				this.remark = remark;
				this.failDialog = true;
			});
		}
	},
	beforeRouteEnter : function(to, from, next){
		next(vm => {
			vm.reloadTable();
		});
	},
	mounted : function(){
		/*this.reloadTable();*/
	},
	components : {
		'speech-add' : MySpeechAdd,
		'speech-import' : MySpeechImport
	}
}
	
</script>

<style lang="less">

	@import (reference) "../../../assets/less/var.less";

	.setting-row .is-loading span{
		display:none;
	}
	
	.up__speech{
		display: inline-block;
	    color: @base-color;
	    cursor: pointer
	}
	.up__speech-txt{
		padding-left:3px;
	}
	.speechUpload__filename{
		padding-left:10px;
	}
</style>
<style lang="less" scoped>

.myspeech{
	.search{
		display:flex;
	    justify-content: space-between;
		.input-txt{
			width:250px;
		}
	}
	.content{
		margin-top:30px;
	}
	
} 
.setting-row .el-button{
	width: 30px;
	text-align: center;
	

}


</style> 