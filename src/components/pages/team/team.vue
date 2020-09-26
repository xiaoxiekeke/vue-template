<template>
	<div class="page">
		<div class="team">
			<div class="group">
				<div class="content">
					<div class="toolbar" >
						<el-button 
							:disabled="master != 1"
							icon="el-icon-plus"
							@click.stop="addGroup()" type="text">新建分组</el-button>
					</div>
					<div class="group-list">
						<div 
							class="group-item" 
							@click="searchUser()">
						  <span class="group-name" 
						  	:class="{ active: !activeAcdId }">未分组（{{defaultGroupCount || 0}}）</span>
					  </div>
						<div 
							v-for="o in groupList" 
							:key="o.id" 
							class="group-item" 
							@click="searchUser(o.id)">
							  <span 
							  	class="group-name" 
							  	:class="{ active: activeAcdId == o.id }">{{o.name}}（{{o.agentsCountOfAcd}}）</span>
							  <div class="group-opt" v-if="master == 1">
							  	<i class="group-icon el-icon-edit" @click="editGroup(o.id)"></i>
									<i class="group-icon el-icon-delete" @click="groupDeleteConfirm(o.id)"></i>
							  </div>
					  </div>
					</div>
				</div>
				<group-add 
					v-if="createGroupDialog" 
					:id="groupId" 
					@success="createSuccess" 
					v-model="createGroupDialog"></group-add>
			</div>
			<div class="memberlist">
				<div class="content" v-loading="tableLoading">
					<div class="toolbar">
						<el-button 
							:disabled="master != 1"
							icon="el-icon-plus"
							size="small"
							@click.stop="addUser()">新增客服账号</el-button>
					</div>
					<el-table 
						:data="tableData" 
						:border="true"
				    stripe>
					    <el-table-column
					    	align="center"
					    	:show-overflow-tooltip="true"
				      	prop="agentCode"
				      	label="工号">
				      	<template slot-scope="scope">
									{{scope.row.agentCode ? scope.row.agentCode:"--"}}
						    </template>
					    </el-table-column>
					    <el-table-column
					    	align="center"
					    	:show-overflow-tooltip="true"
				      	prop="userName"
				      	label="姓名">
				      	<template slot-scope="scope">
									{{scope.row.userName ? scope.row.userName:"--"}}
						    </template>
					    </el-table-column>
					    </el-table-column>
					    <el-table-column
					    	align="center"
					    	:show-overflow-tooltip="true"
				      	prop="phoneNo"
				      	label="手机号">
				      	<template slot-scope="scope">
									{{scope.row.phoneNo ? scope.row.phoneNo:"--"}}
						    </template>
					    </el-table-column>
					    <el-table-column
					    	align="center"
					    	:show-overflow-tooltip="true"
				      	prop="acdName"
				      	label="所属分组">
				      	<template slot-scope="scope">
									{{scope.row.acdName ? scope.row.acdName:"--"}}
						    </template>
					    </el-table-column>
					    <el-table-column
					    	align="center"
					    	:show-overflow-tooltip="true"
				      	prop="ifMonitor"
				      	label="角色">
				      	<template slot-scope="scope">
									{{scope.row.master==1?"管理员":formatRole(scope.row.ifMonitor)}}
						    </template>
					    </el-table-column>
					    <el-table-column
					     	align="center"
				     		prop="type"
				      	label="操作"
				      	width="150">
					      <template slot-scope="scope">
									<el-button 
										@click.stop="editUser(scope.row.userId,scope.row.agentId)"
										:disabled="master != 1"
										type="text" 
										size="small">编辑</el-button>
									<el-button 
	                	:disabled="master != 1 || scope.row.master == 1"
	                	@click.stop="userDeleteConfirm(scope.row.userId,scope.row.agentId)" 
	                	type="text" 
	                	size="small">删除</el-button>
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
				<member-add 
					v-if="createUserDialog" 
					:userId="userId" 
					:agentId="agentId" 
					@success="createSuccess" 
					v-model="createUserDialog"></member-add>
			</div>
		</div>
	</div>
</template>

<script>
	import MemberAdd from './member__add'
	import GroupAdd from './group__add'

	import {mapState, mapActions} from 'vuex'
	import {acdQuery,acdCreate,acdUpdate,acdDelete,
		queryAgentsAcdsByPage,queryByAgentId,agentDelete} from '@/api/kxjl-ac.js'
	
	export default {
		name : 'team',
		data : function(){
			return {
				tableLoading: false,
				tableData : [],
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				groupList:[],
				roleList:[{
          name:"操作员",
          code:"0"
        },{
          name:"人工坐席",
          code:"1"
        },{
          name:"坐席班长",
          code:"2"
        }],
				defaultGroupCount : 0,
				userId : '',
				agentId: '',
				groupId: '',
				createGroupDialog : false,
				createUserDialog: false,
				activeAcdId: "" //选中的分组
			}
		},
		computed : {
      ...mapState('user',[
      	'master',
        'id',
        'business'
      ])
    },
		mounted : function(){
			this.reloadGroupTable();
			this.searchUser();
		},
		methods : {
			groupDeleteConfirm (id){
				this.$confirm('删除规则组后将无法恢复，确定删除？', '删除确认').then(()=>{
					acdDelete({id : id}).then((resp)=>{
						if (resp.code == 0) {
	            this.$message({type : 'success',message : '删除成功'});
	            this.reloadGroupTable()
	          }else{
	            this.$message.error('删除失败');
	          }
					})
				},() => {});
			},
			userDeleteConfirm (userId,agentId){
				this.$confirm('删除该成员后将无法恢复，确定删除？', '删除确认').then(()=>{
					agentDelete({
						agentId: agentId,
						businessId: this.business.id,
						userId: userId
					}).then((res)=>{
						if (res.code == 0) {
							this.$message.success('删除成功');
							this.reloadGroupTable();
							this.reloadUserTable();
						}else{
							this.$message.error('删除失败');
						}
					})
				},() => {});
			},
			handleSizeChange(size){
				this.page.pageSize = size;
				this.reloadUserTable();
			},
	    handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadUserTable();
			},
			searchUser: function(acdId){
				this.page.pageIndex = 1;
				this.activeAcdId = acdId;
				this.reloadUserTable();
			},
			addGroup : function(){//增加分组
				this.groupId = "";
				this.createGroupDialog = true;
			},
			editGroup:function(id){//编辑分组
				this.groupId = id;
				this.createGroupDialog = true;
			},
			addUser : function(){
				this.userId = "";
				this.agentId = ""
				this.createUserDialog = true;
			},
			editUser : function(userId,agentId){
				this.userId = userId;
				this.agentId = agentId;
				this.createUserDialog = true;
			},
			reloadGroupTable : function(){//查询分组
				acdQuery({
					businessId:this.business.id
				}).then((res)=>{
					if(res.code == 0) {
						this.groupList = this.$lodash.get(res,'result.rows');	
						this.defaultGroupCount = res.defaultGroupCount;
					}
				})
			},
			reloadUserTable (){ 
				this.tableLoading = true;
				let isDefault = this.activeAcdId  ? 0 : 1;
				queryAgentsAcdsByPage({
					pageSize: this.page.pageSize,
					pageIndex: this.page.pageIndex,
					businessId: this.business.id,
					isDefault: isDefault,
					acdId: this.activeAcdId
				}).then((res)=>{
					this.tableData = this.$lodash.get(res,'result.rows');	
					this.page.total = this.$lodash.get(res,'result.totalRows');	
					this.tableLoading = false;
				})
			},
			createSuccess : function(name){
				this.reloadGroupTable();
				this.reloadUserTable();
			},
			formatRole(code){
				let role = this.roleList.find(item => item.code == code)
				return role ? role.name : '--';
			},
			handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.reloadUserTable();
			},
			handleSizeChange : function(size){
				this.page.pageSize = size;
				this.reloadUserTable();
			}
		},
		components : {
			'member-add' : MemberAdd,
			'group-add' : GroupAdd
		}
	}
</script>

<style scoped>
	.team{
		background-color: #fff;
		min-height:calc(100vh - 100px);
	}
	.group{
		width: 190px;
		position:absolute;
		border-right:1px solid #ecedf0;
		box-sizing:border-box;
		top: 20px;
    bottom: 20px;
	}
	.memberlist{
		padding-left:210px;
		padding-right:20px;
	}
	.group .toolbar{
		text-align: center;
		margin-top:10px;
	}
	.group-item{
		position: relative;
		height: 36px;
		line-height: 36px;
	}
	.group-item:hover,.group-item .active{
		background-color:#f5f6f7;
	}
	.group-name{
		padding: 0 15px;
		display: block;
		overflow: hidden;
		white-space: nowrap;  
		text-overflow:ellipsis;
		cursor: pointer;
	}
	.group-opt{
		display:none;
		position: absolute;
    right: 5px;
    top: 0;
	}
	.group-item:hover .group-opt{
		display:block;
	}
	.group-icon{
		cursor: pointer;
		margin:0 2px;
		color:var(--base-color,#00b792)
	}
	.memberlist .toolbar{
		padding:20px 0;
		text-align: right;
	}
	
</style>
