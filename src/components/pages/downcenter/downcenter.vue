<template>
	<div class="downcenter">
		<p class="tip">导出记录保存7天，7天后自动清除</p>
		<div>
			<div v-loading="loading" v-if="loading" class="empty"></div>
			<div v-else-if="downList.length == 0" class="empty">暂无下载任务</div>
			<div v-else v-loading="dataLoading" class="down__list">
				<div v-for="(item,index) in downList" class="down__item " :class="{ down__zip: item.downloadType==4 }">
        	<div style="height:24px;">
        		<el-tooltip :open-delay="1000" class="item" effect="dark" :content="item.fileName" placement="top-start">
          		<span class="report-name">{{item.fileName}}</span>
          	</el-tooltip>
       	    <a class="link fr" @click.stop="cancel(item.id)" v-if="item.taskStatus!=3&&item.taskStatus!=5" >取消</a>
       	    <a class="link fr" v-if="item.taskStatus==3" download :href="item.filePath">下载文件</a>
        	</div>
        	<div v-if="item.taskStatus == 0||item.taskStatus == 1||item.taskStatus == 2">
      			<el-progress :percentage="item.progress" color="#00b792"></el-progress>
        	</div>
          <div v-if="item.taskStatus===4" class="report-desc error">下载失败</div>
          <div v-if="item.taskStatus==3" class="report-desc">
          	<span>{{formatSize(item.fileSize)}}KB</span>
          	<span>{{formateTime(item.createTime)}}</span>
          </div>
    		</div>
			</div>
    	<el-pagination v-if="page.total > 0" class="pagination" background
				prev-text="上一页"
				next-text="下一页"
				:pager-count="5"
	      @current-change="handleCurrentChange"
	      :current-page="page.pageIndex"
	      :page-sizes="[10]"
	      :page-size="page.pageSize"
	      layout="prev, pager, next"
	      :total="page.total">
	    </el-pagination>
		</div>
    </div>
</template>

<script>
	import {queryRealTimeReport,deleteRealTimeReport} from '@/api/outbound-report.js'
	import {queryDownloadTask,deleteDownloadTask} from '@/api/download-center-api.js'
	import {mapState} from 'vuex'

	export default {
		data : function(){
			return {
				loading : true,
				dataLoading : false,
				downList : [],
				page : {
					total : 0,
					pageIndex : 1,
					pageSize : 10
				},
				timer : null
			}
		},
		computed : {
      ...mapState('user',[
      	'master',
        'business'
      ])
		},
		methods : {
			formateTime:function(value){
        if(value === null){
            return ''
        }else{
          return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
        }
      },
			formatProgressRate : function(process){
				return parseInt(item.progressRate) * 100;
			},
			formatSize: function (num) {
        var number = (num/1024).toFixed(2);
        return number;
      },
			queryRealTimeReport : function(callback){
				var _this = this;
				clearTimeout(_this.timer);
				// var param = {
    //         curPage: _this.page.pageIndex,
    //         pageSize : _this.page.pageSize
    //     };
		  // 	queryRealTimeReport(param).then(function (data) {
		  // 		_this.downList = _this.$lodash.get(data,'result.rows',[]);
		  // 		_this.page.total = _this.$lodash.get(data,'result.totalRows',0);
		  // 		callback && callback();
    //   	});
				var param = {
            pageIndex: _this.page.pageIndex,
            pageSize : _this.page.pageSize,
            businessId:this.business.id,
            sysType:2
        };
		  	queryDownloadTask(param).then( (data) => {
		  		var downList = _this.$lodash.get(data,'result.rows',[]);
		  		for (var i = 0; i < downList.length; i++) {
		  			let down = downList[i];
		  			if (down.filePath) {
		  				down.filePath = this.$global.getDownCenterUrl(down.filePath);
		  			}
		  		};
		  	_this.downList=downList
		  		_this.page.total = _this.$lodash.get(data,'result.totalCount',0);
		  		callback && callback();
      	});
      	_this.timer = setTimeout(function(){
      		_this.queryRealTimeReport();
      	},3000);
			},
			handleCurrentChange : function(page){
				this.page.pageIndex = page;
				this.dataLoading = true;
				this.queryRealTimeReport(() => {
					 this.dataLoading = false;
				});	
			},
			cancel : function(id){
				console.log(id)
				var _this = this;
				deleteDownloadTask({id : id}).then(function(data){
					if(data.code == 0){
						_this.queryRealTimeReport();
					}
				});
			}
		},
		beforeDestroy : function(){
			clearTimeout(this.timer);
		},
		mounted : function(){
			var _this = this;
			_this.queryRealTimeReport(function(){
				_this.loading = false;
			});
		}
	}
</script>

<style lang="less" scope>
	.downcenter{
		cursor: default; 
		.tip{
			background: #fdf4e9;
		    color: #fa9c3c;
		    height: 30px;
		    line-height: 30px;
		    margin: 0;
		}
		.empty{
			position: absolute;
		    text-align: center;
		    width: 100%;
		    top: 50%;
		}
		.down__list{
			padding:10px;
		}
		.down__item{
			margin-bottom:10px;
			padding-left:40px;
			background:url(./images/know-icon.png) 0 -168px no-repeat;
			text-align:left;
			.report-name{
				width: 250px;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			    display: inline-block;
			}
			.report-desc{
				font-size: 12px;
			    display: flex;
			    justify-content: space-between;
			    color:#b5b5b5;
			}
			.report-desc.error{
				color:#f56c6c;
			}
		}
    .down__zip{
      background:url(./images/know-icon.png) 0 -222px no-repeat;
    }
	}
	.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
		margin:0 3px;
	}
</style>