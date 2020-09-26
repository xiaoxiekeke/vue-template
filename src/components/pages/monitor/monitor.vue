<template>
  <div class="page monitor" >
    <div v-if="taskList.length == 0" class="task__empty">
        <div class="icon icon-robot"></div>
        <p>当前暂无进行中的任务</p>
    </div>
    <div v-else class="task__content">
      <el-card class="task-card" v-for="(item,index) in taskList" :key="index" :body-style="{ padding: '0px' }">
        <div class="padding">
          <div class="task-title">
            <el-tooltip class="item task-title-content" effect="dark" :content="item.name" placement="top-start">
                <span class="task-name">{{item.name}}</span>
            </el-tooltip>
            <span class="task-state text-color">{{formatStatus(item.status)}}</span>
          </div>
          <el-progress  :percentage="item.processRate"></el-progress>
          <div class="task-info">
            <div class="progress">进度：{{item.processCount}}/{{item.totalCount}}</div>
            <div class="phonenumber-count">号码量：{{item.numberCount}}</div>
            <div class="phonenumber-called-count">已外呼号码：{{item.processTelCount}}</div>
            <div class="phonenumber-connected-count">接通量：{{item.completionCount}}</div>
            <div class="phonenumber-connected-rate">接通率：{{item.completionRate}}</div>  
          </div>
        </div>
        <div class="card-bottom">
          <el-button type="text" @click="gotoDetail(item.id,item.speechSkillId,item.name)" class="button">监控</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>


<script>
  import {mapState, mapActions} from 'vuex'
  import {queryEntAuthByBusId} from '@/api/bm.js'
  import {checkFeeLeft} from '@/api/fee.js'
  import {searchTaskList,pauseTask,runTask,deleteTask} from '@/api/outbound-manage.js'
  export default{
    name:"monitor",
    data:function(){
      return {
        taskList:[],
        getNewDataTimer : null
      }
    },
    computed : {
      ...mapState('user',[
          'id',
          'master',
          'business'
      ])
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
        Promise.all([searchTaskList(param)]).then(function(values){
            let taskRows = _this.$lodash.get(values,'[0].result.rows',[]),
                taskList = [];
            for(let row of taskRows){
                if(row.status != 2){
                    continue;
                }
                taskList.push(_this.getTaskData(row));
            }
            _this.taskList = taskList;
            _this.loading = false;
            _this.getNewDataTimer = setTimeout(function(){ _this.loadAllTask(); },3000); 
        });
    },

    beforeDestroy : function(){
        clearTimeout(this.getNewDataTimer);
    },
    methods:{
      ...mapActions('user',[
          'modifyBusiness'
      ]),
      formatStatus(value){
        //5 等待重复外呼自动暂停 6 不在外呼时间段自动暂停 7号码到期或超过结束时间
        const status = ['未发布','已发布','进行中','暂停中','已完成','暂停中','暂停中','暂停中'];
        return status[value] || '--';
      },
      gotoDetail(id,speechSkillId,name){
        var taskId=id
        this.$router.push({ name: 'monitordetail', params: { taskId,speechSkillId,name }})
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
            if(row.status != 2){
              continue;
            }
            taskList.push(_this.getTaskData(row));
          }
          _this.taskList = taskList;
        });
        _this.getNewDataTimer = setTimeout(function(){_this.loadAllTask();},10000);
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
      }
    }
  }
    
</script>

<style scoped>
  .monitor,.task__content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap ;
    justify-content: flex-start; 
  }
  .padding{
    padding: 20px;
  }
  .task-title{
    overflow: hidden;
  }
  .task-title-content{
    width: 140px;
    display: inline-block;
    overflow:hidden;
    word-break:keep-all;
    white-space:nowrap;
    text-overflow:ellipsis;
    float: left;
    font-weight: bold;
  }
  .task-state{
    float: right;
  }
  .task-card{
    width: 240px;
    margin-bottom: 20px;
    margin-right: 20px;
  }

  .el-progress {
    margin:10px 0;
  }
  .task-info{
    line-height: 25px;
  }
  .card-bottom{
    text-align: center;
    border-top:1px solid #eee;
    height: 40px;
    line-height: 40px;
  }


  .task__empty{
    position:absolute;
    top:0;bottom:0;left:0;right:0;
    text-align:center;
    height:220px;
    margin:auto;
    margin-top: 250px;
  }
  .task__empty .icon{
      position:relative;
      left:0;right:0;
      background:url(../task/images/robot.png) no-repeat;
      margin: auto;
  }
  .task__empty .icon-business {
      margin:auto;
      width: 118px;
      height: 121px;
      background-position: -13px -262px ;
  }
  .task__empty .icon-robot{
      width: 150px;
      height: 132px;
      background-position: 0px -50px;
  }
</style>