<template>
	<div class="page knowledge">
		<div class="search">
			<el-input v-model.trim="name" @keyup.enter.native="search" class="input-txt" clearable placeholder="搜索知识点关键词"></el-input>
			<el-button @click.stop="search" class="btn-primary" type="primary">搜索</el-button>
			<div class="fr">
				<el-button @click="createDialog = true" type="primary">添加</el-button>
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
			      	prop="cname"
			      	label="知识点名称">
			    </el-table-column>
				<el-table-column
			    	align="center"
			      	prop="questionCount"
			      	width="120"
			      	label="知识点数">
			    </el-table-column>			    
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
			      	prop="updateTime"
			      	sortable="custom"
			      	label="最近更新时间">
			      	 <template slot-scope="scope">
                          {{ formateTime(scope.row.updateTime )}}
                    </template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="dics"
		      	   	width="120"
			      	label="关联相近词库">
	      		 	<template slot-scope="scope">
                          {{formatDics(scope.row.dics )}}
                    </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
			      	prop="dics"
		      	   	width="120"
			      	label="状态">
	      		 	<template slot-scope="scope">
                          
                          <!-- <el-button v-if="scope.row.state==4" @click.stop="showReason(scope.row.reason)" type="text" size="small">查看</el-button> -->
                         <p class="p">
                          	{{scope.row.stateName}}
	                        <el-popover
	                          	v-if="scope.row.state==4"
	                            placement="left"
	                            title="原因"
	                            trigger="hover"
	                            :content="scope.row.reason">
	                            <i class="icon-help-circled" slot="reference"></i>
	                        </el-popover>
	                     </p>
                          
                    </template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
			      	prop="id"
			      	width="200"
			      	label="操作">
			      	 <template slot-scope="scope">
				        <el-button type="text" size="small">
				        	<router-link class="link" :to="'/knowinfo/' + scope.row.id+'/'+scope.row.state">编辑</router-link>
				        </el-button>
				        <el-button @click.stop="deleteKnow(scope.row.id)" type="text" size="small">删除</el-button>
				        <el-button @click.stop="experience(scope.row.cname)" type="text" size="small">体验</el-button>
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

		<knowledge-add @success="search()" v-model="createDialog"></knowledge-add>
		<knowledge-exp v-if="expDialog" v-model="expDialog" :cname="expCname"></knowledge-exp>
		<!-- <el-dialog
		  title="审核不通过原因"
		  :append-to-body="true"
		  :visible.sync="showReasonDialog"
		  width="30%"
		  :before-close="handleClose">
		  <span>{{reason}}</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="showReasonDialog=false">确 定</el-button>
		  </span>
		</el-dialog> -->
	</div>
</template>

<script>

import {queryKnowList,deleteKnowledgeByIds} from '@/api/brainkb.js'
import KnowLedgeAdd from './knowledge__add'
import KnowLedgeExp from './knowledge__exp'

export default {
	name: 'knowledge',
	data : function () {
		return {
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
			createDialog : false,
			expDialog : false,
			expCname : '',
			reason:'',
			showReasonDialog:false
		}
	},
	methods : {
		close : function(){
			alert(1)
		},
		formateTime(value){
            if(value === null){
                return ''
            }else{
                return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
            }
        },
        formatDics(dics){
        	if(!dics || dics.length == 0){
        		return '未关联';
        	}
        	return '已关联';
        },
		//event
		sortChange (column) {
			let field = column.prop,
				order = column.order === 'ascending' ? 'asc' : 'desc';
			if (field !== this.sort.field || this.sort.order !== order) {
				this.sort.field = field;
				this.sort.order = order;
				this.loadTabel()
			}
		},
		handleCurrentChange : function(page){
			this.page.pageIndex = page;
			this.loadTabel();
		},
		handleSizeChange : function(size){
			this.page.pageSize = size;
			this.loadTabel();
		},
		loadTabel : function(){
			let _this = this;
			let param = {
	    		pageIndex : this.page.pageIndex,
				pageSize : this.page.pageSize,
	            sortRule: this.sort.order
	    	};
	    	if(_this.name){
	            param.name = _this.name;
	        }
	        _this.tableLoading = true;
			queryKnowList(param).then(function(resp){
				_this.page.total = _this.$lodash.get(resp,'result.totalRows',0);
				_this.tableData = _this.$lodash.get(resp,'result.rows',[]);
				_this.tableLoading = false;
			});
		},
		search : function(){
			this.page.pageIndex = 1;
			this.loadTabel();
		},
		deleteKnow : function(id){
			const h = this.$createElement;
			this.$prompt(h('div',null,[
					h('p', null, '将删除此知识点，且不可恢复。确认删除吗？'),
					h('p', null, '确认删除请输入"yes"（不含引号）'), 
				]),'提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^yes$/,
				inputValue:'yes',
				inputErrorMessage: '输入不正确'
			}).then(({ value }) => {
				deleteKnowledgeByIds({ ids: [id] }).then(res => {
					if(res.code === 0){
						this.$message({type: 'success',message: '删除成功'});
						this.loadTabel();
					}
				})
			}).catch(() => {
		
			});
		},
		experience : function(cname){
			this.expCname = cname;
			this.expDialog = true;
		},
		showReason:function(reason){
			this.reason=reason
			this.showReasonDialog = true;
		},
		handleClose:function(){
	        this.showReasonDialog = false;
	    }

	},
	beforeRouteEnter : function(to, from, next){
		next(vm => {
			vm.loadTabel();
		});
	},
	components : {
		'knowledge-add' : KnowLedgeAdd,
		'knowledge-exp' : KnowLedgeExp
	},
	mounted : function(){
		this.loadTabel();
	}
}
	
</script>

<style lang="less" scoped>
	.knowledge{
		.search{
			.input-txt{
				width:250px;
			}
		}
		.content{
			margin-top:20px;
		}
	}
	.p{
		margin:0;
		.icon-help-circled{
	        background:url("../../../assets/images/small-icon.png") -77px -185px no-repeat;
	        width:18px;
	        height:18px;
	        position:relative;
	        top:3px;
	        display:inline-block;
	        cursor:pointer;
	    }
	}
	
</style>