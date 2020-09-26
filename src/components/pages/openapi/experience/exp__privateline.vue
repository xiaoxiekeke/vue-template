<template>
  <div class="openapi">
    <div class="exp__call">
      <div>
        <p class="titleTips">可拨打号码 <span>{{lineInfo.phone}}</span> 进行呼入体验</p>
      </div>
    </div>
    <div class="exp__interface">
        <h4>接口体验
          <el-tooltip class="item" effect="dark" placement="right-start">
                <div slot="content">
                  通过能力开发平台的接口，几步完成外呼体验。
                </div>
                <i class="el-icon-question icon-tip"></i>
            </el-tooltip></h4>
        <el-steps :active="step2">
            <el-step @click.native="stepClick(0)" class="exp__step"  title="创建应用"></el-step>
            <el-step @click.native="stepClick(1)" class="exp__step"  title="线路对接"></el-step>
            <el-step @click.native="stepClick(2)" class="exp__step"  title="结果"></el-step>
        </el-steps>

        <div class="form-step step0" v-show="step2 == 0">
            <p class="tip">当前为体验应用信息，可自行前往应用管理<router-link to="/openapi/app" class="link">创建应用</router-link></p>
            <el-form label-width="80px" :model="formData" :rules="rules1" >
              <el-form-item label="应用名称" prop="appId">
              <el-select v-model="formData.appId" @change="appChange"
                  placeholder="请选择应用" filterable clearable class="form-item">
                    <el-option v-for="app in appList"
                      :key="app.app_id"
                      :label="app.app_name"
                      :value="app.app_id"
                    ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="appId">
                <el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.app_id : '--'"></el-input>
              </el-form-item>
               <el-form-item label="业务分类">
                  <el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.tags : '--'"></el-input>
              </el-form-item>
               <el-form-item label="应用类型">
                  <el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.app_typeDesc : '--'"></el-input>
              </el-form-item>
              <el-form-item label="并发数">
                  <el-input class="form-item input-txt" :disabled="true" :value="curApp ? curApp.concurrents : '--'"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!!!formData.appId" type="primary" @click.stop="next(1)">下一步</el-button>
              </el-form-item>
            </el-form>
        </div>

        <div class="form-step" v-show="step2 == 1">
            <div class="sip-call">
              <el-button :loading="!ready" :disabled="calling || !ready" @click.stop="callout" type="primary">拨打</el-button> 
              <div v-if="calling" title="结束通话" @click.stop="hangup()" class="hangup"></div>
            </div>
            <div class="sip-content">
                <div class="step-sip">
                  <h4>SIP信令</h4>
                  <div class="title">请求信息</div>
                  <div class="sip-content">
                      <pre><code>{{invite}}</code></pre>
                  </div>
              </div>
              <div class="step-jsonview">
                  <h4>获取上下文</h4>
                  <exp-jsonview :request="request.context" :response="response.context"></exp-jsonview>
              </div>
            </div>
        </div>

        <div class="form-step" v-show="step2 == 2">
            <div><el-button type="text" @click.stop="back">< 返回</el-button></div>
            <exp-result :receive="receive.callin"></exp-result>
        </div>
        <exp-webrtc :account="account" ref="webrtc" :data="request.context" v-if="step2 == 1" @change="eventChange"></exp-webrtc>

        <push-im :phoneNum="account"></push-im>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {queryAppList,getLineInfo} from '@/api/jsondata.js'
  import ExpJSONView from './exp__jsonview'
  import ExpWebRtc from './exp__webrtc'
  import ExpResult from './exp__result'
  import {getUUID} from '@/api/utils.js'
  import PushIM from '@/components/common/im/pushim'

  export default {
    name : '',
    props : ['phone'],
    computed : {
      ...mapState('user',[
          'account',
          'receive'
      ])
    },
    data : function(){
      return {
        step2 : 0,
        appList : [],
        curApp : null,
        lineInfo : {},
        lineList : [],
        formData : {
          appId : '',
          callRelationId : ''
        },
        request : {
          context : {}
        },
        response : {
          context : {}
        },
        rules1 : {
          appId : [{required : true,message : '请选择应用'}]
        },
        invite : '',
        calling : false,
        ready : false
      }
    },
    methods : {
      ...mapActions('user',[
          'setReceive'
      ]),
      back : function(){
        this.resetData(0);
        this.step2 = 0;
      },
      stepClick : function(step){
        if(parseInt(this.step2) <= parseInt(step)){
          return;
        }
        this.step2 = step;
        this.resetData(step);
      },
      hangup : function(){
          this.$refs.webrtc.release();
          this.calling = false;
      },
      resetData : function(step){
          this.setReceive({type : 'callin',data : null})
          if(parseInt(step) == 0){
            this.request.context = {};
            this.response.context = {};
            this.invite = '';
            this.formData.appId = '';
            this.formData.callRelationId = '';
            this.curApp = null;
          }
      },
      eventChange : function(type,evData){
          if(type == 'newRTCSession' && evData.request.method == 'INVITE'){
              this.invite = this.formatInvite(evData.request);
              this.calling = true;
          }else if(type == 'ended'){
              this.step2 = 2;
              this.calling = false;
          }else if(type == 'failed'){
              this.$message.error('呼叫失败');
              this.calling = false;
          }else if(type == 'registered'){
              this.ready = true;
          }else if(type == 'registrationFailed'){
               this.ready = false;
          }
      },
      formatInvite : function(ev){
        let str = '', o = [];
        str += ev.method + " " + ev.ruri + " SIP/2.0\r\n";
        for (let e in ev.headers)
          for(let t = ev.headers[e].length, n = 0; n < t; n++)
            str += e + ": " + ev.headers[e][n] + "\r\n";
        for (let t = ev.extraHeaders.length,n = 0; n < t; n++){
          str += ev.extraHeaders[n].replace(/(^\s*)|(\s*$)/g, "") + "\r\n";
        }
        ev.ua.configuration.session_timers && o.push("timer"),
          (ev.ua.contact.pub_gruu || ev.ua.contact.temp_gruu) && o.push("gruu"),
              o.push("ice", "replaces");
        o.push("outbound");
        str += "Allow: INVITE,ACK,CANCEL,BYE,UPDATE,MESSAGE,OPTIONS,REFER,INFO\r\n";
        str += "Supported: " + o + "\r\n";
        str += "User-Agent: JsSIP 3.0.8\r\n";
        if(ev.body){
          let len = unescape(encodeURIComponent(e)).length;
          r += "Content-Length: " + t + "\r\n\r\n";
          r += ev.body;
        }else{
          str += "Content-Length: 0\r\n\r\n";
        }   
        return str; 
      },
      next : function(step2){
        this.step2 = step2;
      },
      appChange : function(val){
        if(!val){
          this.curApp = null;
          this.formData.app_key = '';
          this.formData.app_secret = '';
          return;
        }
        let result = null;
        for(let app of this.appList){
          if(app.app_id == this.formData.appId){
            result = app;
            break;
          }
        }
        if(result){
          this.curApp = result;
          this.curApp.app_typeDesc="呼入";
        }
        this.request.context = {
          call_relation_id:getUUID(),
          business_id: this.lineInfo.businessId,
          app_id: this.formData.appId,
          robot_id:this.lineInfo.speechId
        }
        this.response.context = this.lineInfo.dynamic;
      },
      callout : function(){
          this.$refs.webrtc.callout();
          this.$message('正在呼叫您的电脑，请用麦克风进行对话预览！');
      }
    },
    mounted : function(){
      Promise.all([queryAppList(),getLineInfo()]).then(values => {
          let appResp = values[0],
              lineResp = values[1];
          this.appList = this.$lodash.get(appResp,'result.rows',[]);
          this.lineInfo = lineResp;
      });
    },
    components : {
      'exp-jsonview' : ExpJSONView,
      'exp-webrtc' : ExpWebRtc,
      'exp-result' : ExpResult,
      'push-im' : PushIM
    }
  }
</script>

<style lang="less" scope> 
  .openapi{
    .exp__call{
      height:100px;
      padding: 0px 30px;
      background-color:#fff;
      padding-top:1px;
      .titleTips{
        height:100px;
        line-height:100px;
        font-weight:normal;
        margin:0;
        font-size:20px;
        span{
          color:#00b792;
          font-size:30px;
          vertical-align: -3px;
        }
      }
    }
    .exp__interface{
      margin-top:14px;
      padding: 15px 30px;
      background-color:#fff;
      .tip{
        color:#878a92;
      }
    }
    .form-step{
      margin-top:20px;
      .select-txt{
        width:300px;
      }
      .step-item{
        .lbl{
          display:inline-block;
          width:105px;
          text-align:right;
          font-size: 14px;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
        }
        .content{
        }
      }
      .step-jsonview{
          flex: 1;
      }
      .step-sip{
          flex:1;
          margin-right: 40px;
          position:relative;
          .title{
            background-color: #f6f6f6;
            padding-left: 5px;
            line-height: 30px;
            padding-left:10px;
          }
          .sip-content{
            height:450px;
            overflow:auto;
            border:1px solid #f6f6f6;
          }
      }
      .sip-call{
        position:relative;
        .hangup{
            background: url(./images/uncall-icon.png) 0 0 no-repeat;
            width:40px;
            height:40px;
            border-radius: 50%;
            background-color:red;
            position: absolute;
            top:0px;
            left:110px;
            cursor: pointer;
          }
      }
      .sip-content{
        display:flex;
      }
      .step-interface{
        flex: 1;
        margin-right: 30px;
        .select-txt{
          width:100%;
        }
      }
    }
    .step1{
      display:flex;
    }
    .exp__step{
      .is-finish{
        .el-step__icon.is-text{
          cursor:pointer;
        }
      }
      .el-step__title.is-finish{
        cursor:pointer;
      }
    }
  }
  
</style>

<style type="text/css">
.call-tip{
  color: #999;
  font-size: 12px;
}
</style>