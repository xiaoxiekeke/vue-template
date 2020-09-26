<template>
	<div class="page know__info">
		<div class="head">
			<router-link class="link" to="/knowledge"><返回</router-link>
		</div>
		<div class="body">
			<div>
			  <el-form :inline="true">
				  <el-form-item label="关联相近词库">
			    		<el-select :collapse-tags="true" :disabled="state==2" v-model="dicValue" multiple placeholder="请选择">
						    <el-option v-for="item in dicList"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					  	</el-select>
				  </el-form-item>
				  <el-form-item>
			    		<el-button v-if="!isSaving&&state!=2" @click.sotp="save()"  type="primary" >保存</el-button>
				  		<el-button v-if="isSaving&&state!=2" :disabled="true" type="primary" >保存</el-button>
				  		<el-button v-if="state==2" :disabled="true" >保存</el-button>
				  </el-form-item>
				</el-form>
			</div>
			<div class="toolbar">
				<div>
					<div class="toobar__del" v-if="deleteIds.length > 0">
						<el-button @click.stop="batchDelete">删除</el-button>
						<span>已选择{{deleteIds.length}}项</span>
					</div>
					<el-button v-if="refreshLoading" :loading="true" type="text" >刷新</el-button>
					<el-button v-else @click.stop="refresh" type="text" icon="el-icon-refresh">刷新</el-button>
				</div>
				<div>
					<el-button @click.stop="showAuditDialog()" v-if="tableData.length>0&&state!=2" type="primary">提交审核</el-button>
					<el-button v-if="tableData.length>0&&state==2" disabled>提交审核</el-button>
					<el-button @click.stop="addQuestion()" type="primary" v-if="state!=2">添加问题</el-button>
					<el-button   disabled v-if="state==2" >添加问题</el-button>
					<el-button type="text" v-if="state!=2" icon="el-icon-plus" @click.stop="batchKnowledge = true">批量添加</el-button>
					<el-button type="text" v-if="state==2" disabled icon="el-icon-plus">批量添加</el-button>
					<el-button v-if="!isExport&&tableData.length>0"  @click.sotp="exportQuestion()" type="text">导出问题</el-button>
				  	<el-button v-else :disabled="true" type="text" >导出问题</el-button>
				</div>
			</div>
			<div class="content" v-loading="tableLoading">
				<el-table @sort-change="sortChange" :data="tableData" :border="true"
					:default-sort = "{prop: 'tagName', order: 'descending'}"
					@selection-change="handleSelectionChange"
				    stripe
				    style="width: 100%">
			       	<el-table-column
		       	    	align="center"
				      	type="selection"
				      	width="55">
				    </el-table-column>
				    <el-table-column
				    	align="center"
				    	:show-overflow-tooltip="true"
			    	 	sortable="custom"
				      	prop="tagName"
				      	label="类别">
				    </el-table-column>
					<el-table-column
				    	align="center"
				      	prop="name"
				   		:show-overflow-tooltip="true"
				      	label="问题">
				    </el-table-column>	
				     <el-table-column
				     	align="center"
				      	prop="answers"
				      	width="300px"
				      	label="答案">
		      		 	<template slot-scope="scope">
                   	<!-- {{formatAnswwer(scope.row.answers)}} -->
                   	<div class="answer-item" v-for="item in scope.row.answers" v-if="item.description||item.content">
	                     	<el-tooltip class="item" v-if="item.description" :key="item.id"  effect="light" :content="item.description" placement="top-start">
	                 	      <p >{{item.description}}</p>
	                 	    </el-tooltip>
	                 	    <p class="answer-item-null" v-else>--</p>
                   	</div>
                </template>
				    </el-table-column>
				    <el-table-column
				     	align="center"
				      	prop="dics"
			      	   	width="180"
				      	label="录音">
		      		 	<template slot-scope="scope">
		      		 		<div style="display:flex;flex-direction: column;justify-content:space-around;">
		      		 			<div v-for="(item,index) in formatAudio(scope.row.answers)" :key="item.id" v-if="item.description||item.url" class="playerItem">
		      		 				<div v-if="state!=2">
		      		 					<div v-if='item' player-box>
		      		 						<Player class="player-btn" v-if="item.url !== ''&&showPlayer " :src="item.url" :key="item.url" :pause-key="pauseKey"></Player>
		      		 						<upFile :knowId="knowId" :questionId="scope.row.id" :index="index" :answerId="item.id" :src='item.url' @success="refeshTable" @changeE="changeE" @changeS="changeS"></upFile>
		      		 						<a v-if="item.url !== ''"  class="link" :href="item.url" download>下载</a>
		      		 						<el-button @click.stop="deleteAudio(item.id)" v-if="item.url !== ''" type="text" size="small">删除</el-button>
		      		 					</div>
		      		 				</div>
		      		 				<div v-else>
		      		 					<div v-if='item' player-box>
		      		 						<Player class="player-btn" v-if="item.url !== ''&&showPlayer " :src="item.url" :key="item.url" :pause-key="pauseKey"></Player>
		      		 						<upFile :disabled="true" :knowId="knowId" :questionId="scope.row.id" :index="index" :answerId="item.id" :src='item.url' @success="refeshTable" @changeE="changeE" @changeS="changeS"></upFile>
		      		 						<el-button disabled v-if="item.url !== ''" type="text" size="small">删除</el-button>
		      		 					</div>
		      		 				</div>
		      		 				
		      		 			</div>
		      		 		</div>
		      		 		
	                          	<!-- <div v-if='formatAudio(scope.row.answers)' player-box>
	                          		<Player class="player-btn" v-if="formatAudio(scope.row.answers).url !== '' " :src="formatAudio(scope.row.answers).url" :key="formatAudio(scope.row.answers).url" :pause-key="pauseKey"></Player>
	                          		<upFile :knowId="knowId" :questionId="scope.row.id" :answerId="formatAudio(scope.row.answers).id" :src='formatAudio(scope.row.answers).url' @success="refeshTable" @changeE="changeE" @changeS="changeS"></upFile>
	                          		<el-button @click.stop="deleteAudio(formatAudio(scope.row.answers).id)" v-if="formatAudio(scope.row.answers).url !== ''" type="text" size="small">删除</el-button>
	                          	</div> -->
	                    </template>
				    </el-table-column>
				     <el-table-column
				     	align="center"
				      	prop="id"
				      	width="140"
				      	label="操作">
				      	 <template slot-scope="scope">
					        <el-button v-if="state!=2" type="text" size="small" @click.stop="editQuestion(scope.row.id)">编辑
					        </el-button>
					        <el-button v-else disabled type="text" size="small">编辑
					        </el-button>
					        <el-button v-if="state!=2" @click.stop="deleteQuestion(scope.row.id)" type="text" size="small">删除</el-button>
					        <el-button v-else disabled type="text" size="small">删除</el-button>
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
			<question-batch @success="refeshTable" :knowId="knowId" v-if="batchKnowledge" v-model="batchKnowledge"></question-batch>
		</div>

		<question-add @success="reloadTable" :knowId="knowId" v-if="addDialog" :editKnowId="editKnowId" v-model="addDialog" :pauseKey="pauseKey"></question-add>

		<el-dialog
		  title="提示"
		  :append-to-body="true"
		  :visible.sync="dialogAuditVisible"
		  width="30%"
		  :before-close="handleClose">
		  <span>是否将该知识点提交审核？我们将在24小时内对您的知识点进行审核！</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogAuditVisible = false">取 消</el-button>
		    <el-button type="primary" @click="auditConfirm">确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	import {queryQuestionList,deleteQuestionByIds,
			refresh,queryDicList,adddicrelation,exportKbQuestion,recordfileDelete,commitKbToReview} from '@/api/brainkb.js'
	import QuestionAdd from './question__add'
	import BatchKnowledge from './question__batch'
	import {mapActions} from 'vuex'
	import Player from '@/components/common/player/player'
	import UPFile from './upfile'
	export default {
		data : function () {
			return {
				knowId : '',
				tableLoading : false,
				refreshLoading : false,
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				sort : {
					field : 'tagName',
					order : 'desc'
				},
				tableData : [],
				deleteIds : [],
				dicList : [],
				dicValue : [],
				//修改之前的关联词库的值
				oldDivValue : [],
				isSaving : false,
				//
				addDialog : false,
				dialogAuditVisible:false,
				isExport : false,
				batchKnowledge : false,
				audioUrl :null,
				pauseKey: Symbol('pauseKey'),	
				editKnowId : '',
				state:null,
				showPlayer:true
			}
		},
		beforeRouteEnter : function(to, from, next){
			next(vm => {
				vm.page.pageIndex=1;
				vm.knowId = vm.$route.params.id;
				vm.state = vm.$route.params.state;
				vm.reloadTable();
				vm.initDicList();
				vm.showPlayer=true
			});
		},
		beforeRouteLeave :function(to, from, next) {
		    // 导航离开该组件的对应路由时调用
		    this.showPlayer=false
		    next()
		},
		
		methods : {
			...mapActions('user',[
                'addDownTask'
            ]),
			formatAnswwer : function(answers){
				answers = answers || [];
				let result = [];
				for(let a of answers){
					result.push(a.description)
				}
                return result.join('，')
			},
			formatAudio : function(answers){
				var answerArr = answers || [],audioArr = [];
				for(var i=0;i<answerArr.length;i++){
					if(answerArr[i].type == 'audio'){
						audioArr.push({
							url : this.$global.getStaticFileUrl(answerArr[i].content),
							id : answerArr[i].id,
							description : answerArr[i].description
						});
					}else{
						audioArr.push({
							url : '',
							id : answerArr[i].id,
							description:answerArr[i].description
						});
					}
				};
				return audioArr;
			},
			
			//删除录音
			deleteAudio : function(id){
				recordfileDelete({id:id}).then(data =>{
					this.reloadTable()
				})
			},
			refeshTable : function(){
				this.reloadTable();
			},
			changeE : function(){
				this.tableLoading = true
			},
			changeS : function(){
				this.tableLoading = false;
			},
			reloadTable : function(){
				this.tableLoading = true;
				var param = {
                    pageSize : this.page.pageSize,
                    pageIndex : this.page.pageIndex,
                    kbId : this.knowId,
                    sortName: this.sort.field,
                    sortRule: this.sort.order,
                };
				queryQuestionList(param).then((resp) =>{
					this.tableData = this.$lodash.get(resp,'result.rows',[]);
					this.page.total = this.$lodash.get(resp,'result.totalRows',0);
					this.tableLoading = false;
				});
			},
			initDicList : function(){
				let param = {
					pageSize: 500,
					pageIndex: 1,
					kbId: this.knowId
				}
				queryDicList(param).then(resp => {
					let list = this.$lodash.get(resp,'result.rows',[]),
						resultList = [],
						defaultValue = [];
					for(let data of list){
						resultList.push({value : data.id,label : data.cname});
						if(data.selected == 1){
							defaultValue.push(data.id);
						}
					}
					this.dicList = resultList;
					this.dicValue = defaultValue;
					this.oldDivValue = defaultValue;
				});
			},
			//导出问题
			exportQuestion : function(){
				this.isExport = true;
				exportKbQuestion({id:this.knowId,sysType:"2"}).then(data =>{
					if(data.code == 0){
						this.$message({type: 'success',message: '导出成功'});
						this.addDownTask();
						this.isExport = false;
					}else{
						if(data.message){
							this.$message({type: 'error',message: data.message});	
						}else{
							this.$message({type: 'error',message: '导出失败'});	
						}
						
						this.isExport = false;
					}
				})
			},
			//event
			save : function(){
				this.isSaving = true;
				let addIds = [],delIds = this.oldDivValue.slice(0);
				if(this.oldDivValue.length == 0 && this.dicValue.length == 0){
					this.isSaving = false;
					return;
				}
				for(let dicId of this.dicValue){
					let i = delIds.indexOf(dicId);
					if(i >= 0){
						addIds.push(delIds.splice(i,1)[0]);
					}else{
						addIds.push(dicId);
					}
				}

				let addParam = {
						id:this.knowId,
						dicIds : addIds
					},
					delParam = {
						id : this.knowId,
	                    dicIds : delIds,
	                    deleted : 1
					};
				let reqArr = [];
				if(addIds.length > 0){
					reqArr.push(adddicrelation(addParam));
				}
				if(delIds.length > 0){
					reqArr.push(adddicrelation(delParam))
				}
				Promise.all(reqArr).then(values => {
					if(values.length == 1 && values[0].code == 0){
						this.$message({message: '保存成功',type: 'success' });
						this.oldDivValue = this.dicValue;
					}else if(values.length == 2 && values[0].code == 0 
						&& values[1].code == 0){
						this.$message({message: '保存成功',type: 'success' });
						this.oldDivValue = this.dicValue;
					}else{
						this.$message.error('保存失败');
					}
					this.isSaving = false;
				});
			},
			refresh : function(){
				this.refreshLoading = true;
				refresh({kbId : this.knowId}).then(resp => {
					this.refreshLoading = false;
					if(resp.code == 0){
						this.$message({message: '刷新成功',type: 'success' });
					}else{
						this.$message.error('刷新失败');
					}
				});
			},
			batchDelete : function(){
				if(this.deleteIds.length < 0){
					return;
				}
				this.deleteQuestion();
			},
			deleteQuestion : function(id){
				const h = this.$createElement;
				this.$prompt(h('div',null,[
						h('p', null, '将删除此问题，且不可恢复。确认删除吗？'),
						h('p', null, '确认删除请输入"yes"（不含引号）'), 
					]),'提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^yes$/,
					inputValue:'yes',
					inputErrorMessage: '输入不正确'
				}).then(({ value }) => {
					let param = { 
						kbId : this.knowId,
						ids : id ? [id] : this.deleteIds
					};
					deleteQuestionByIds(param).then( resp => {
						if(resp.code == 0){
							this.reloadTable();
							this.deleteIds = [];
							this.$message({message: '删除成功',type: 'success' });
						}else{
							this.$message.error('删除失败');
						}
					});

				}).catch(() => {});
			},
			handleSelectionChange : function(rows){
				if(!rows || rows.length == 0){
					this.deleteIds = [];
				}else{
					let ids = []
					for(let row of rows){
						ids.push(row.id);
					}
					this.deleteIds = ids;
				}
			},
			//添加问题
			addQuestion : function(){
				this.editKnowId = '';
				this.addDialog = true;
			},
			//编辑问题
			editQuestion : function(id){
				this.editKnowId = id;
				this.addDialog = true;
			},
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
			showAuditDialog:function(){
				this.dialogAuditVisible = true;
			},
			auditConfirm:function(){
				let param = { 
					kbId : this.knowId
				};
				commitKbToReview(param).then((resp)=>{
					if(resp.code == 0){
						this.reloadTable();
						this.$message({message: '提交审核成功',type: 'success' });
						this.$router.push({  name:'knowledge'});
					}else{
						this.$message.error(resp.message);
					}
				}).catch((resp)=>{
					this.$message.error('提交审核失败');
				})
				this.dialogAuditVisible = false;
			},
			handleClose:function(){
				this.dialogAuditVisible = false
			}

		},
		components : {
			'question-add' : QuestionAdd,
			'question-batch':BatchKnowledge,
            "Player":Player,
            "upFile" : UPFile
		},
	}
</script>

<style lang="less">
	.know__info{ 
		.head{
			height:40px;
			line-height:40px;
		}
		.body{
			.opt{
				margin-bottom:15px;
				text-align:right;
			}
			.toolbar{
				display:flex;
				justify-content:space-between;
				background: #fff;
			    padding: 10px;
			    border: 1px solid #eee;
			    border-bottom: none;
			    .toobar__del{
			    	display:inline-block;
			    	margin-right:10px;
			    }
			}
			.player-box{
	            width:30px;
	            height:30px;
	            display:flex;
	            align-items:center;
	            justify-content:center;
	        }
	        .player-btn{
	            width: 20px;
   	 			height: 20px;
    			display: inline-block;
    			vertical-align: middle;
	        }
		}
		.cell{
			padding:0;
			p{
				display: block;
				border-bottom:1px solid #eee;
				padding:2px 10px;
				box-sizing:border-box;
				margin:0;
				max-width: 300px;
				text-align: left;
				height:50px;
			    overflow:hidden;
			    word-wrap:break-word;
				word-break:break-all;
			}
			p:last-child{
				margin:0;
				border-bottom:none;
			}
			.answer-item{
				border-bottom:1px solid #eee;
				.answer-item-null{
					line-height: 50px;
				    text-align: center;
				}
			}
			.answer-item:last-child{
				margin:0;
				border-bottom:none;
			}
		}
		.playerItem{
			border-bottom:1px solid #eee;
			padding:0;
			box-sizing:border-box;
			margin:0;
			height:50px;
			display: flex;
		    justify-content: space-around;
		    flex-direction: column;
		}
		.playerItem:last-child{
			margin:0;
			border-bottom:none;
		}
		.el-table td{
			padding:0;
		}

	}
</style>


				<!-- word-wrap:break-word;
				word-break:break-all; -->
					<!-- display: flex;
				    justify-content: space-around;
				    flex-direction: column; -->