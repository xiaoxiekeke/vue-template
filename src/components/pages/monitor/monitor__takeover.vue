<template>
  <el-dialog
    :title="taskName"  
    width="80%"
    :visible.sync="show"
    :append-to-body="true"
    :close-on-click-modal="false"
    :closeOnPressEscape="false"
    :show-close="false">
    <div class="see__table">
      <div class="chat-box">
        <k-chat :data="detailData" :auto="true"> </k-chat>
      </div>
      <div class="submit-box">
        <h4>客户号码</h4>
        <div class="submit-field">{{tel_number}}</div>
        <h4>客户姓名</h4>
        <div class="submit-field">{{customer_name}}</div>
        <h4>客户意向度</h4>
        <div class="submit-field">
          <el-select size="small" v-model="tag_cm_intention" placeholder="客户意向程度" :collapse-tags="true">
            <el-option
            v-for="item in select.intention"
            :key="item.id"
            :label="item.name"
            :value="item.name">
            </el-option>
          </el-select>
          <span class="necessery">*</span>
        </div>
        <h4>客户标签</h4>
        <div class="submit-field">
          <el-select v-model="label" size="small" placeholder="客户标签" multiple :collapse-tags="true">
            <el-option
            v-for="(item,index) in select.tagList"
            :key="index"
            :label="item.name"
            :value="item.name">
            </el-option>
          </el-select>
        </div>
        <h4>跟进内容</h4>
        <div class="submit-field">
          <el-input
            :autosize="{ minRows: 4, maxRows: 10}"
            type="textarea"
            placeholder="请输入跟进内容"
            v-model="trace_detail">
          </el-input>
        </div>
        <div class="submit-field">
          <el-button @click.stop="submitAndHangup" :disabled="isSubmit" type="primary">提交并挂断</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState} from 'vuex'
  import {queryLabelOptionList} from '@/api/bm.js'
  import {queryLabel} from '@/api/brain.js'
  import {queryRealTimeCallDetail,takeControl,queryCustomerInfo,updateTrace} from '@/api/kylin.js'
  export default {
    name : 'monitor__takeover',
    model : {
      prop : 'show',
      event : 'change'
    },
    props : ['show','speechSkillId','calluuId','taskName','telNumber','lineConnectedTime'],
    data : function () {
      return {
        detailData:[],
        agentUUID : '',
        select : {
          tagList : [],
          intention : []
        },
        customer_name:"",//客户名称
        cm_id:"",//经理id
        cm_name:"",//经理姓名
        task_id:"",//任务id
        task_name:this.taskName,//任务名称
        tel_number:this.telNumber,
        time_trace:this.lineConnectedTime,//跟踪时间
        tag_cm_intention : "",//客户意向度
        label : [],//客户标签
        trace_stage:"6",//跟进阶段，人工接管
        trace_detail:"",//跟进内容
        contact_way:"0",//拜访形式，电话拜访
        callresult:"0",//通话结果,成功
        transcript : 0
      }
    },
    computed : {
      ...mapState('user',[
        'business',
        'id',
        'surname'
      ])
    },
    mounted(){
      this.task_id = this.$route.params.taskId;
      this.getQueryLabelOptionList();
      this.getQueryLabel();
      this.searchRealTimeDetailData()

      queryCustomerInfo({
        business_id: this.business.id,
        sys_type: this.$config.system.id,
        tel_number: this.tel_number
      }).then((res)=>{
        this.customer_name = this.$lodash.get(res,'result.rows[0].customer_name');
        this.cm_id = this.$lodash.get(res,'result.rows[0].cm_id');
        this.cm_name = this.$lodash.get(res,'result.rows[0].cm_name');
      })

      this.$global.checkPermission('__fun.transcript').then(result => {
        if(!result){
          return;
        }
        this.transcript = 2;
        this.$phone.on('message',(res) => {
          if(res.msgType == 'EventTranscript'){
            this.detailData.push({
              role: res.userData.uuid == this.agentUUID ? 'agent' : 'customer',
              msg: res.userData.content,
              type : 2
            });
          }
        })
      })
    },
    methods : {
      //获取意向度
      getQueryLabelOptionList(){
        queryLabelOptionList().then(res => {
          if(res.code === 0){
            this.select.intention = res.result.rows
          }
        })
      },
      getQueryLabel(){
        queryLabel({id:this.speechSkillId}).then((resp)=>{
          this.select.tagList= this.$lodash.get(resp,'result.rows')
        })
      },
      //接管
      doTakeControl(){
        takeControl({
          business_id:this.business.id,
          sys_type:this.$config.system.id,
          calluuid:this.calluuId,
          transcript : this.transcript
        }).then((res)=>{
          if (res.code != 0) {
            this.$message.error(res.messageExt || '接管失败');
          }else{
            this.agentUUID = this.$lodash.get(res,'result.rows[0].originate_calluuid','');
          }
        })
      },
      //查询实时对话文本
      searchRealTimeDetailData(){
        queryRealTimeCallDetail({
          business_id : this.business.id,
          sys_type : this.$config.system.id,
          calluuid : this.calluuId
        }).then((res)=>{
          if(res.code ==0 ){
            this.detailData = this.$lodash.get(res,'result.rows',[]).map(item => {
              return {
                role: item.role,
                msg: item.role == 'robot' ? item.output : item.input,
                nodeName: item.nodeName,
                hit : item.role == 'customer' && item.hits && item.hits[0] ?  item.hits[0].hit : ''
              }
            })
            if(this.transcript == 2){
              this.detailData.push({ role: 'line', msg: '以上为人机交互'  });
            }
            this.doTakeControl()
          }else{
            this.$message.error(res.messageExt || '接管失败');
          }
        })
      },
      cancel : function(){
        this.$emit('change',false);
      },
      beforeClose : function(){
        this.$emit('change',false);
      },
      submitAndHangup:function(){
        var params={
          business_id:this.business.id,
          business_name:this.business.name,
          sys_type:this.$config.system.id,
          cm_id:this.cm_id || this.id,
          cm_name:this.cm_name || this.surname,
          task_id:this.task_id,
          task_name:this.task_name,
          tel_number:this.tel_number,
          time_trace:this.time_trace,
          tag_cm_intention:this.tag_cm_intention,
          label:this.label.join(','),
          trace_stage:this.trace_stage,
          trace_detail:this.trace_detail,
          contact_way:this.contact_way,
          callresult:this.callresult
        }
        
        if (!this.tag_cm_intention) {
          this.$message.error("客户意向度不能为空");
          return
        }
        updateTrace({
          ...params
        }).then((res)=>{
          if (res.code==0) {
            this.$message.success('提交成功');
            this.$emit('change',false);
          }else{
            this.$message.error(res.messageExt);
          }
        })
        this.$phone.handup()
      }
		},
    beforeDestroy : function(){
      this.$phone.handup()
    }
	}
</script>


<style scoped>
  .assist-robot{
    position:fixed;
    bottom: 0;
    left: 20px;
  }
  .el-dialog__header{
    text-align:center;
  }
  .task-title{
    text-align: center;
  }
  .see__table{
    overflow: hidden;
  }
  .chat-box{
    width: 50%;
    border-right:1px solid #cfcfcf;
    float: left;
    height:550px;
    overflow: auto;
  }
  .chat-box li{
    list-style: none;
    display: flex;
    margin-bottom: 30px;
    padding: 0 15px;
  }
  .chat-box ul{
    padding-left: 0;
  }
  .chat-box .user{
    flex-direction: row-reverse;
    position:relative;
    margin-bottom: 40px;
  }
  .chat-box .icon-box {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-size: contain;
  }
  .chat-box .robot .icon-box {
    background: url(./images/robot2.png)  -5px -5px no-repeat;
  }
  .chat-box .user .icon-box {
    background: url(./images/customer.png)  -5px -5px no-repeat;
  }
  .chat-box .user .icon-tips{
    position:absolute;
    right: 80px;
    bottom:-20px;
    color: #00b792;
  }
  .chat-box .text-box {
    border-radius: 4px;
    padding: 10px;
    max-width: 50%;
    position: relative;
  }
  .chat-box .role-name{
    position: absolute;
    top: -25px;
    white-space:nowrap;
    color: #d1d1d1;
  }
  .chat-box .text-speed{
    position: absolute;
    bottom: -24px;
    color: #44b3ff;
    font-size: 12px;
     white-space:nowrap;
  }
  .chat-box .robot .role-name{
      left: 0px;
  }
  .chat-box .user .role-name{
      right: 0px;
  }
  .chat-box .robot .text-speed{
     left: 0;
  }
  .chat-box .user .text-speed{
      right: 0px;
  }

  .chat-box .node-box{
    display: flex;
  }
  .chat-box .chat-player-box{
    height: 20px;
    width: 100px;
    margin-left: 10px;
  }
  .chat-box .text-box span{
    display: block;
  }
  .chat-box .text-box .node-name{
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .chat-box .text-box .hit{
    font-size: 12px;
    color: #999;
    margin-top:5px;
  }

  .chat-box .user .text-box{
    margin-right: 20px;
    background: #d0eeff;
    border: 1px solid #acd9f3;

  }

  .chat-box .robot .text-box{
    margin-left: 20px;
    border: 1px solid #eae9e9;
  }

  .chat-box .text-box:after,.chat-box .text-box::before{
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    top: 10px;
  }
  .necessery{
    position: absolute;
    right: -13px;
    top:8px;
    font-size: 20px;
    color: red;
  }

  .chat-box .robot .text-box:after{
    left: -12px;
    border-right-color: #fff;
  }
  .chat-box .robot .text-box:before{
    left: -13px;
    border-right-color: #eae9e9;
  }

  .chat-box .user .text-box:after{
    right: -12px;
    border-left-color: #d0eeff;
  }
  .chat-box .user .text-box:before{
    right: -13px;
    border-left-color: #acd9f3;
  }
  .chat-icon{
    padding-right:2px;
    cursor:pointer;
  }
  
  .submit-box{
    float: left;
  }
  .submit-box h4{
    padding-left: 20px;
    margin-top: 30px;
  }
  .submit-box .submit-field{
    padding-left: 80px;
    width: 90%;
    position: relative;
  }
  .submit-box .submit-field .el-select{
    width: 100%;
  }
  .submit-box .submit-field .el-button{
    margin-top: 30px;
  }
</style>