<template>
	<div class="page tasknow" v-loading="loading">
        <div class="tasknow__empty" v-if='business.status != 2'>
            <div class="icon icon-business"></div>
            <p>{{authTip}}</p>
            <el-button v-if="authBtnTip" type="primary" @click.stop="authDialog = true" plain>{{authBtnTip}}</el-button>
        </div>
        <div v-else-if="business.lack" class="tasknow__empty" >
             <div class="icon icon-robot"></div>
             <p>您的账号余额不足，请充值后再来创建任务</p>
             <el-button type="primary" plain>
                <router-link class="link" to="/recharge">立即充值</router-link></el-button>
        </div>
        <div v-else-if="taskList.length == 0" class="tasknow__empty">
            <div class="icon icon-robot"></div>
            <p>当前暂无任务</p>
           <el-button type="primary" @click.stop="createTask" plain>创建任务</el-button>
        </div>
        <div v-else class="tasknow__list">
            <div class="tasknow__item tasknow__create" @click.stop="createTask">
                <div class="tasknow-plus"></div>
                <div class="tasknow__create-txt">创建任务</div>
            </div>
            <div v-for="task in taskList" class="tasknow__item">
                <div>
                   <el-tooltip class="item" effect="dark" :content="task.name" placement="top-start">
                        <span class="task-name">{{task.name}}</span>
                    </el-tooltip>
                    <span class="task-status">
                        {{formatStatus(task.status)}}
                        <el-tooltip v-if="task.status == 5 || task.status == 6 || task.status == 7" placement="top" effect="light">
                            <div slot="content">{{task.reason}}</div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </span>
                </div>
                <div class="task-progress">
                    <el-progress :percentage="task.processRate" color="#00b792"></el-progress>
                    <div v-if="!task.recallMaxCount">进度：{{task.processCount}}/{{task.totalCount}}</div>
                    <div v-else>第{{numberArr[parseInt(task.recallCount)]}}轮：{{task.processCount}}/{{task.totalCount}}</div>
                </div>
                <div class="task-data">
                     <div class="task-data-item">
                        <label class="task-lbl">号码量：</label>
                        <span class="task-value">{{task.numberCount}}</span>
                    </div>
                    <div class="task-data-item">
                        <label class="task-lbl">已外呼号码：</label>
                        <span class="task-value">{{task.processTelCount}}</span>
                    </div>
                    <div class="task-data-item">
                        <label>接通量：</label>
                        <span class="task-value">{{task.completionCount}}</span>
                    </div>
                    <div class="task-data-item">
                        <label>接通率：</label>
                         <span class="task-value">{{task.completionRate}}</span>
                    </div>
                </div>
                <div class="task-desc">{{formateTime(task.beginTime)}}</div>
                <div class="task-opt">
                    <span class="opt">
                        <router-link class="link" :to="'/taskinfo/'+business.id+'/'+task.id+'/'+task.speechSkillId">详情</router-link></span>
                    <span class="opt" @click.stop="pauseTask(task.id)">{{ (task.status == 3 || task.status == 5 || task.status == 6 || task.status == 7)  ? '继续' : '暂停'}}</span>
                    <span class="opt" @click.stop="editTask(task.id)">编辑</span>
                    <span class="opt" @click.stop="delTask(task.id)">删除</span>
                </div>
            </div>
        </div>
        <task-create v-if="dialogVisible" :taskId="editTaskId" @success="loadAllTask" v-model="dialogVisible"></task-create>

        <bus-auth v-if="authDialog" @success="authSuccessDialog=true" v-model="authDialog"></bus-auth>

        <el-dialog
          title="提交成功"
          :visible.sync="authSuccessDialog"
          :append-to-body="true"
          width="400px" >
          企业认证提交成功 客服将在1个工作日内完成审核
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click.stop="authSuccessDialog=false">确 定</el-button>
          </span>
        </el-dialog>

	</div>
</template>


<script>
    import {mapState, mapActions} from 'vuex'

	import {queryEntAuthByBusId} from '@/api/bm.js'
	import {checkFeeLeft} from '@/api/fee.js'
	import {searchTaskList,pauseTask,runTask,deleteTask} from '@/api/outbound-manage.js'
    import TaskCreate from './taskcreate'
    import BusAuth from '@/components/pages/business/auth'

	export default {
        name : 'tasknow',
		data : function(){
			return {
                authDialog : false,
                dialogVisible : false,
				loading : true,
				currentTaskId : '',
                taskList : [],
                editTaskId : '',
                //定时更新数据
                getNewDataTimer : null,
                authSuccessDialog : false,
                numberArr : ['一','二','三','四','五','六','七','八','九','十']
			}
		},
		computed : {
			authTip : function(){
				if(this.business.status == 1){
					return '企业正在审核中，暂时无法创建任务'
				}
				if(this.business.status == 3){
					return '企业认证失败，暂时无法创建任务';
				}
				return '您尚未进行企业认证，暂时无法创建任务';
			},
			authBtnTip : function(){
				if(this.business.status == 3){
					return '重新认证';
				}
				if(this.business.status != 1){
					return '立即认证'
				}
				return '';
			},
            ...mapState('user',[
                'id',
                'master',
                'business'
            ])
		},
		methods : {
            ...mapActions('user',[
                'modifyBusiness'
            ]),
            formateTime(value){
                if(value === null){
                    return ''
                }else{
                    return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
                }
            },
            formatStatus(value){
                //5 等待重复外呼自动暂停 6 不在外呼时间段自动暂停 7号码到期或超过结束时间
                const status = ['未发布','已发布','进行中','暂停中','已完成','暂停中','暂停中','暂停中'];
                return status[value] || '--';
            },
			getTaskData : function(rowData){
                let _this = this;
                let totalCount = parseInt(rowData.totalCount || 0),
                    numberCount = parseInt(rowData.numberCount || 0),
                    processCount = parseFloat(rowData.processCount || 0),
                    processTelCount =parseInt(rowData.processTelCount || 0),
                    completionCount = parseFloat(rowData.completionCount || 0),
                    completionRate = rowData.completionRate ? (parseFloat(rowData.completionRate)*100).toFixed(2) +"%" : "0",
                    noMoreProcessCount = parseFloat(rowData.noMoreProcessCount || 0),
                    prev = totalCount == 0 ? 0 :  (processCount / totalCount * 100).toFixed(2),
                    prevFul = totalCount == 0 ? 0: (noMoreProcessCount / totalCount) * 100;
                return {
                    id : rowData.id,
                    name : rowData.name,
                    beginTime : rowData.beginTime,
                    status : rowData.status,
                    reason : rowData.reason,
                    totalCount : totalCount,
                    numberCount : numberCount,       //号码量
                    processCount : processCount,      //已外呼次数
                    processTelCount : processTelCount,   //已外呼号码量
                    completionCount : completionCount,  //接通量
                    completionRate : completionRate,   //接通率
                    processRate : Math.min(parseFloat(prev),100),       //外呼比率
                    noMoreProcessRate : prevFul, //已完成比率
                    recallCount : rowData.recallCount,
                    recallMaxCount : rowData.recallMaxCount,
                    speechSkillId : rowData.speechSkillId
                }
            },
            loadAllTask : function(){
                var _this = this;
                clearTimeout(_this.getNewDataTimer);
                let param = {
                    sysType:_this.$config.system.id,
                   // accountId : this.id
                    accountId : this.master == '2' ? '': this.id,
                    pageIndex : 1,
                    pageSize : 50
                };
                searchTaskList(param).then(function(data){
                    const taskRows = _this.$lodash.get(data,'result.rows',[]);
                    let taskList = [];
                    for(let row of taskRows){
                        if(row.status == 4){
                            continue;
                        }
                        taskList.push(_this.getTaskData(row));
                    }
                    _this.taskList = taskList;
                });
                _this.getNewDataTimer = setTimeout(function(){_this.loadAllTask();},10000);
            },
            getTaskDataById : function(taskId){
                let result = null;
                for(let i = 0,len = this.taskList.length; i < len; i++){
                    let task = this.taskList[i];
                    if(task.id == taskId){
                        result = task;
                        break;
                    }
                }
                return result;
            },
            updateTaskData : function(taskId,data){
                let taskData = this.getTaskDataById(taskId);
                for(let key in data){
                    taskData[key] = data[key];
                }
            },
            createTask : function(){
                var _this = this;
                _this.editTaskId = '';
                _this.dialogVisible = true;
            },
            editTask : function(taskId){
                var _this = this;
                _this.editTaskId = taskId;
                _this.dialogVisible = true;
            },
            pauseTask : function(taskId){ //暂停
                var _this = this;
                var taskData = this.getTaskDataById(taskId),
                    originalStatus = taskData.status,
                    beginTime = taskData.beginTime,
                    now = new Date().getTime();
                let curStatus = now > beginTime ? "2" : "1",
                    status = ['3','5','6','7'].indexOf(originalStatus+'') < 0 ? "3" : curStatus,
                    operateType = originalStatus != "3" ? "4" : "5";

                if(originalStatus == '3' || originalStatus == '5' || originalStatus == '6' || originalStatus == '7'){
                    runTask({taskId: taskId}).then(data =>{
                        if(data && data.code == "0"){
                            _this.updateTaskData(taskId,{status : status});
                            _this.$message({message: '保存成功', type: 'success'});
                            return;
                        }
                        if(data.code == '10101'){
                            _this.$message.error({message: '任务已完成'});
                            return;
                        }
                        if(data.code == '10102'){
                            _this.$message.error({message: '任务已删除'});
                            return;
                        }
                        if(data.code == '10102'){
                            _this.$message.error({message: '余额不足，请先充值'});
                            return;
                        }
                         _this.$message.error(data.messageExt || '保存失败');
                    })
                }else{
                    pauseTask({taskId: taskId}).then(data =>{
                        if(data && data.code == "0"){
                            _this.updateTaskData(taskId,{status : status});
                            _this.$message({message: '保存成功', type: 'success'});
                            return;
                        }else{
                            _this.$message.error(data.messageExt || '保存失败');
                        }
                    })
                }  
            },
            deleteTaskById : function(taskId){
                let index = -1;
                for(let i = 0;i < this.taskList.length; i++){
                    if(this.taskList[i].id == taskId){
                        index = i;
                        break;
                    }
                }
                this.taskList.splice(index,1);
                this.currentTaskId = this.taskList.length > 0 ? this.taskList[0].id : '';
            },
            delTask : function(taskId){
                const _this = this;
                const h = this.$createElement;
                _this.$prompt(h('div',null,[
                        h('p', null, '将删除此任务，且不可恢复。确认删除吗？'),
                        h('p', null, '确认删除请输入"yes"（不含引号）'), 
                    ]),'删除确认',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^yes$/,
                    inputValue:'yes',
                    inputErrorMessage: '输入不正确'
                }).then(({ value }) => {
                    deleteTask({
                        taskId: taskId
                    }).then(function(data){
                        if(data && data.code == "0"){
                            _this.deleteTaskById(taskId);
                            _this.$message({message: '删除成功', type: 'success'});
                        }else{
                            _this.$message.error({message: '删除失败'});
                        }
                    })
                }).catch(() => {
            
                });
            }
		},
	  	mounted : function(){
            const _this = this;
            let param = {
                sysType:_this.$config.system.id,
               // accountId : this.id
                accountId : this.master == '2' ? '': this.id,
                pageIndex : 1,
                pageSize : 50
            };
            Promise.all([queryEntAuthByBusId(),checkFeeLeft(),searchTaskList(param)]).then(function(values){
                let status = _this.$lodash.get(values,'[0].result.rows[0].status',''),
                    lack = _this.$lodash.get(values,'[1].result.rows[0].lack',true),
                    taskRows = _this.$lodash.get(values,'[2].result.rows',[]),
                    taskList = [];
                for(let row of taskRows){
                    if(row.status == 4){
                        continue;
                    }
                    taskList.push(_this.getTaskData(row));
                }
                _this.modifyBusiness({status : status,lack : lack});
                _this.taskList = taskList;
                _this.loading = false;
                _this.getNewDataTimer = setTimeout(function(){ _this.loadAllTask(); },10000); 
            });
        },
        beforeDestroy : function(){
            clearTimeout(this.getNewDataTimer);
        },
        components:{
            'task-create' : TaskCreate,
             'bus-auth' : BusAuth
        }
	}
</script>

<style lang="less" scope>
    @import (reference) "../../../assets/less/var.less";

    .tasknow{
        min-height: calc(100vh - 57px);
        box-sizing: border-box;

        .tasknow__empty{
            position:absolute;
            top:0;bottom:0;left:0;right:0;
            text-align:center;
            height:220px;
            margin:auto;
            .icon{
                position:relative;
                left:0;right:0;
                background:url(./images/robot.png) no-repeat;
                margin: auto;
            }
            .icon-business {
                margin:auto;
                width: 118px;
                height: 121px;
                background-position: -13px -262px ;
            }
            .icon-robot{
                width: 150px;
                height: 132px;
                background-position: 0px -50px;
            }
        }

        .tasknow__list{
            display:flex;
            flex-wrap:wrap;
            
            .tasknow-plus{
                width: 4px;
                height: 66px;
                border-radius: 2px;
                background: #ebebeb;
                position: absolute;
                top: 58px;left: 97px;
            }
            .tasknow-plus:after{
                content: "";
                width: 66px;
                height: 4px;
                border-radius: 2px;
                background: #ebebeb;
                position: absolute;
                top: 31px;
                left: -31px;
            }
            
            .tasknow__item{
                width:197px;
                height:233px;
                background-color:#fff;
                border:1px solid #ebebeb;
                padding:12px;
                box-sizing: border-box;
                color:#707070;
                position:relative;
                border-radius: 2px;
                margin-bottom: 20px;
                margin-right:1%;
                overflow:hidden;

                .task-name {
                    font-size:14px;
                    width:118px;
                    font-weight:400;
                    color:#535353;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                }
                .task-status{
                    font-size: 12px;
                    float: right;
                    color:@base-color;
                }
                .task-progress{
                    padding:10px 0 5px 0;
                }
                .task-data-item{
                    line-height:24px;
                }
                .task-opt{
                    display:none;
                    justify-content:space-between;
                    align-items:center;
                    position:absolute;
                    opacity: 0.9;
                    bottom:0;left: 0;right: 0;
                    height:0;
                    background-color:@base-color;
                    height:40px;
                    .opt{
                        color: #fff;
                        min-width: 48px;
                        text-align: center;
                        cursor: pointer;
                         .link{
                           color: #fff; 
                           text-decoration: none;
                        }
                    }
                    .opt:hover{
                         text-decoration: underline;
                    }
                }
                .task-value{
                    font-weight:bold;
                }
                .task-data{
                    margin-top:15px;
                }
                .task-desc{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 30px;
                    border-top: 1px solid #ebebeb;
                    line-height: 30px;
                    text-align: right;
                    padding: 0 10px
                }
            }

            .tasknow__item:hover{
                border-color:@base-color;
                .task-opt{
                    animation-name: fadeInTop;
                    animation-duration: .6s;
                    animation-fill-mode: both;
                    display:flex;
                }

            }
            .tasknow__item.tasknow__create{
                
                text-align:center;
                cursor:pointer;
            }
            .tasknow__create-txt{
                position:relative;
                top:130px;
            }
        }
    }
</style>