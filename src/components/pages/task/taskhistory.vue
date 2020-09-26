<template>
	<div class="page taskhistory">
		<div class="search">
			<el-input @keyup.enter.native="search" v-model.trim="name" class="input-txt" clearable placeholder="任务名称"></el-input>
			<el-button @click.stop="search" class="btn-primary" type="primary">搜索</el-button>
		</div>
		<div class="content" v-loading="tableLoading">
			<el-table @sort-change="sortChange" :data="tableData" :border="true"
				 :default-sort = "{prop: 'beginTime', order: 'descending'}"
			    stripe
			    style="width: 100%">
			    <el-table-column
			    	align="center"
			    	:show-overflow-tooltip="true"
		      	prop="name"
            min-width="160"
		      	label="任务名称">
            <template slot-scope="scope">
            	<router-link slot="reference" class="link" :to="'/taskinfo/'+scope.row.businessId+'/' + scope.row.id+'/'+scope.row.speechSkillId">{{ scope.row.name }}</router-link>
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	min-width="160"
		      	prop="createTime"
		      	sortable="custom"
		      	label="任务开始时间">
            <template slot-scope="scope">
              {{ formateTime(scope.row.createTime )}}
            </template>
			    </el-table-column>
			    <el-table-column
			    	align="center"
			    	min-width="160"
		      	prop="finishTime"
		      	sortable="custom"
		      	label="任务结束时间">
            <template slot-scope="scope">
              {{ formateTime(scope.row.finishTime )}}
            </template>
			    </el-table-column>
			     <el-table-column
			     	align="center"
		      	prop="speechSkillName"
            min-width="180"
            :show-overflow-tooltip="true"
		      	label="话术名称">
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="numberCount"
		      	label="号码量">
			    </el-table-column>
			     <el-table-column
			     	align="center"
		      	prop="completionCount"
		      	label="接通量">
            <template slot-scope="scope">
              {{getTotalCount(scope.row)}}
            </template>
			    </el-table-column>
          <el-table-column
            align="center"
            prop="totalCount"
            label="外呼量">
          </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="completionRate"
		      	label="接通率">
            <template slot-scope="scope">
              {{getSuccessRate(scope.row)}}
            </template>
			    </el-table-column>
			 <!--    <el-table-column
			     	align="center"
		      	prop="totalFee"
		      	label="费用">
            <template slot-scope="scope">
                {{ scope.row.totalFee || 0 }}
            </template>
			    </el-table-column> -->
			    <el-table-column
			     	align="center"
		      	prop="statusName"
		      	label="状态">
            <template slot-scope="scope">
                {{ getStatus(scope.row)}}
            </template>
			    </el-table-column>
			    <el-table-column
			     	align="center"
		      	prop="address"
            min-width="160"
  					fixed="right"
		      	label="操作">
  	      	<template slot-scope="scope">
  						<div class="download-row">
  							<!-- <el-button v-if="scope.row.businessId == 0" size="small" type="text">
                	<a class="link" :href="formatUrl2(scope.row.resultFileUrl)" download >导出报表</a>
  							</el-button> -->
                <el-button size="small" type="text"
  								@click.stop="exportHistory(scope.row.id,scope.row.businessId,scope.$index)">导出报表
  							</el-button>
                <el-button size="small" type="text"
                  @click.stop="exportRecord(scope.row.id,scope.row.businessId,scope.$index)">录音下载
                </el-button>
                <!-- <el-button v-if="scope.row.recordFileUrl !== null" 
                	size="small" type="text">
                	<a class="link" :href="formatUrl(scope.row.recordFileUrl)" download >录音下载</a>
  							</el-button>
                <el-button v-else size="small" type="text" disabled>录音下载
  							</el-button> -->
  						</div>
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

	</div>
	
</template>

<script>
import {searchHistoryTaskList} from '@/api/outbound-manage.js'
import {generateRealTimeReport} from '@/api/outbound-report.js'
import {addDownloadTask} from '@/api/download-center-api.js'
import {addDownloadRecordTask} from '@/api/download-center-record.js'
import fileDownload from 'js-file-download'
import {mapState,mapActions} from 'vuex'
import {getHistoryExample} from '@/api/jsondata.js'

import {coverGuide} from '@/api/utils.js'

export default {
	name: 'taskhistory',
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
			exampleData : null
		}
    },
  computed : {
    ...mapState('user',[
      'id',
    	'master',
      'business'
    ])
	},
	methods : {
		 ...mapActions('user',[
            'addDownTask'
        ]),
		reloadTable : function(){
			this.tableLoading = true;
			let param = {
                sysType : this.$config.system.id,
               // accountId : this.id,
                accountId : this.master == '2' ? '': this.id,
                taskName : this.name,
				pageIndex : this.page.pageIndex,
				pageSize : this.page.pageSize,
				sortName : this.sort.field,
				sortOrder : this.sort.order
            };
			searchHistoryTaskList(param).then((data) =>{
				let rows = this.$lodash.get(data,'result.rows',[]),
					totalRows = this.$lodash.get(data,'result.totalRows',0);
				if(rows.length == 0 && this.page.pageIndex == 1 && this.name == ''){
					rows = this.exampleData.result.rows;
					totalRows = this.exampleData.result.totalRows;
				}else{
					rows.map(value=>{ value.exporting = false });
				}
				this.tableData = rows;
                this.page.total = totalRows;
                this.tableLoading = false;
			});
		},
		search : function(){
			this.page.pageIndex = 1;
			this.reloadTable();
    },
    handleSizeChange(size){
			this.page.pageSize = size;
			this.reloadTable();
		},
    sortChange (column) {
        let key = column.prop ? column.prop : 'createTime'
        let order = column.order === 'ascending' ? 'asc' : 'desc'
        if (key !== this.sort.field || this.sort.order !== order) {
            this.sort.field = key
            this.sort.order = order
            this.reloadTable()
        }
    },
    handleCurrentChange : function(page){
			this.page.pageIndex = page;
			this.reloadTable();
		},
		formatUrl2 : function(url){
    	return this.$global.getStaticFileUrl(url);
    },
    formatUrl : function(url){
    	return this.$global.getVoiceFileUrl(url);
    },
    //接通量
    getTotalCount(row){
        let completionCount = ''
        if(row.status && Number(row.status) !== 0){
            if(row.completionCount){
                completionCount = row.completionCount
            }else{
                completionCount = 0
            }
        }
        return completionCount
    },
    //接通率
    getSuccessRate(row){
        let completionRate = row.completionRate || 0;
        completionRate =  completionRate ? (completionRate * 100).toFixed(2) + "%" : "0.00%";
        if(row.status && Number(row.status) === 0){
            completionRate = "";
        }
        return completionRate;
    },
    //获取类型
    getStatus(row){
        let isDel = row.deleted && row.deleted == '1';
        if(isDel){
            return "已删除";
        }
        if(row.status !== undefined){
            let statusArr = ['未发布','已发布','进行中','暂停中','已完成','暂停中','暂停中','暂停中']
            return statusArr[Number(row.status)]
        } else {
            return ''
        }

    },
    formateTime(value){
        if(value === null){
            return ''
        }else{
            return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
        }
    },
		//导出报表
		exportHistory(id,bid,index){
			var _this = this;
			let info = _this.tableData[index];
			info.exporting = true
      addDownloadTask({
        businessId: this.$global.getBusinessId(),
        sysType:2,
        downloadType:1,
        channelCode:2,
        query:{
          businessId:bid,
          taskId : id,
          channelCode:2
        }
      }).then(function(data){
        if(data.code != 0){
          if(data.code=="30050"){
            _this.$message.error('长期任务不能下载');
          }else if(data.code == '30051'){
            _this.$message.error('下载任务正在进行中，请稍后再试');
          }else{
            _this.$message.error('导出报表失败');            
          }
          return
        }
         info.exporting = false;
         _this.addDownTask();
      })
			// generateRealTimeReport({taskId : id},bid).then(function(data){
			// 	if(data.code != 0){
			// 		_this.$message.error('导出报表失败');
			// 	}
			// 	info.exporting = false;
			// 	_this.addDownTask();
			// });
		},
    
    //导出录音
    exportRecord(id,bid,index){
      var _this = this;
      let info = _this.tableData[index];
      info.exporting = true
      addDownloadRecordTask({businessId:this.$global.getBusinessId(),sysType:2,downloadType:4,channelCode:2,query:{
        businessId:bid,
        taskId : id,
        channelCode:2
      }}).then(function(data){
         if(data.code != 0){
           if(data.code=="30050"){
             _this.$message.error('长期任务不能下载');
           }else if(data.code == '30051'){
            _this.$message.error('下载任务正在进行中，请稍后再试');
          }else{
             _this.$message.error('导出录音失败');            
           }
           return
         }
         info.exporting = false;
         _this.addDownTask();
      })
    },
  },
  activated : function(){
   	this.reloadTable();
  },
  mounted : function(){
  	getHistoryExample().then((data) => {
  		this.exampleData = data;
  	});
  }
}
	
</script>

<style>
.setting-row .is-loading span{
    display:none;
}
.type-radio-box .el-radio__input{
    display:none;
}
</style>
<style lang="less" scoped>
   @import (reference) "../../../assets/less/var.less";
   
.tips-box{
	top:12px;
	width:16px;
	height:16px;
	padding:0 10px;
	right: -35px;
	position:absolute;
}
.tips-button{
	border-radius:8px;
	text-align:center;
	line-height:16px;
	color:#FFF;
	background:#ccc;
	font-size:12px;
	cursor: pointer;
}
.el-select{
	width:100%;
}
.form-box{
	padding-right:30px;
}
.right-box{
	float: right;
}
.taskhistory{
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