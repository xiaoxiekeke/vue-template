<template>
  <div class="page monitordetail" >
    <div class="detailheader">
      <div class="detailheader-back text-color" @click="goBack()"><i class="el-icon-arrow-left"></i>{{name}}</div>
      <div class="detailheader-right">
        <el-select v-model="selectColor" multiple size="mini" @change="handleChangeSelectColor" placeholder="显示状态">
          <el-option
            v-for="item in colorList"
            :key="item.key"
            :label="item.key"
            :value="item.key">
          </el-option>
        </el-select>
        <el-button type="primary" plain size="mini" @click="config">配置</el-button>
      </div>
    </div>
    <div v-if="realTimeData.length == 0" class="task__empty">
        <div class="icon icon-robot"></div>
        <p>当前暂无通话</p>
    </div>
    <div class="detailcontent">
      <el-card class="monitor-card" :class="transCountToColor(item.no_pass_count)" v-for="(item,index) in realTimeData" :key="index" :body-style="{ padding: '0px' }">
        <div class="padding">
          <div class="monitor-phoneNumber">{{item.dnis}}</div>
          <div class="monitor-status" v-if="transCountToColor(item.no_pass_count)!='green'">状态：多次未识别&nbsp;{{!!item.no_pass_count?item.no_pass_count:0}}&nbsp;次</div>
          <div class="monitor-status" v-else>状态：正常</div>
          <div class="monitor-ddetail" v-if="transCountToColor(item.no_pass_count)!='green'">{{!!item.dialog_nodename?item.dialog_nodename:""}}&nbsp;出现未识别</div>
        </div>
        <div class="card-bottom">
          <el-button @click="doMonitorDialog(item)" type="primary" plain size="mini">监控</el-button>
          <el-button @click="doTakeoverDialog(item)" type="primary"  size="mini">接管</el-button>
        </div>
      </el-card>
         
    </div>
    <monitor-config @success="configSuccess" v-if="configDialog" :taskId="task_id" :speechSkillId="speechSkillId" v-model="configDialog"></monitor-config>
    <monitor-dialog @takeover="takeoverFromDialog" v-if="dialogDialog" :telNumber="tel_number" :calluuId="calluuId" v-model="dialogDialog"></monitor-dialog>
    <monitor-takeover @success="" v-if="takeoverDialog" :calluuId="calluuId" :speechSkillId="speechSkillId" :lineConnectedTime="line_connected_time" :taskName="name" :telNumber="tel_number" v-model="takeoverDialog"></monitor-takeover>
  </div>
</template>


<script>
  import MonitorConfig from './monitor__config.vue'
  import MonitorDialog from './monitor__dialog.vue'
  import MonitorTakeover from './monitor__takeover.vue'
  import {queryRealTimeData,queryConfig,monitorDialog,queryRealTimeCallDetail} from '@/api/kylin.js'
  import {mapState, mapActions} from 'vuex'
  export default{
    name:"monitordetail",
    data:function(){
      return {
        colorList:[],
        selectColor:[],
        configDialog:false,
        dialogDialog:false,
        takeoverDialog:false,
        task_id:"",
        speechSkillId:"",
        name:"",
        no_match:[],
        realTimeData:[],
        getNewDataTimer : null,
        calluuId:"",
        tel_number:"",
        line_connected_time:""
      }
    },
    computed : {
      ...mapState('user',[
          'id',
          'master',
          'business'
      ]),
    },
    mounted(){
      this.task_id=this.$route.params.taskId;
      this.speechSkillId=this.$route.params.speechSkillId;
      this.name=this.$route.params.name;

      queryConfig({
        business_id:this.business.id,
        sys_type:this.$config.system.id,
        task_id:this.task_id
      }).then(res=>{
        var colorList=this.$lodash.get(res,'result.rows[0].color',{});
        if (colorList&&colorList.length>0) {
          this.colorList=colorList;
          this.selectColor=["红色","橙色"]
          this.transSelectColorToNomatch(this.selectColor)
        }
        this.searchRealTimeData()
      });
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      config(){
        this.configDialog=true;
      },
      doMonitorDialog(item){
        this.calluuId=item.calluuid;
        this.tel_number=item.dnis;
        this.line_connected_time=item.line_connected_time
        this.$global.checkPermission('__fun.monitor').then(result => {
        // result 为 true 代表有权限
          if (!!result) {
            if(!!this.$phone.isOpen()){
              queryRealTimeCallDetail({
                business_id:this.business.id,
                sys_type:this.$config.system.id,
                calluuid:item.calluuid,
              }).then((res)=>{
                if(res.code==0){
                  monitorDialog({
                    business_id:this.business.id,
                    sys_type:this.$config.system.id,
                    task_id:this.task_id,
                    calluuid:item.calluuid,
                    caller:item.dnis
                  }).then((res)=>{
                    if (res.code!=0) {
                      this.$message.error('监控失败');
                    }else{
                      this.dialogDialog=true;    
                    }
                  });
                }else{
                  if (res.code=='500000') {//判断是不是已经被他人接管
                    this.$message.error(res.messageExt);
                  }else{
                    this.$message.error('监控失败');  
                  }
                }
              })
              
            }else{
              this.$message.error('电话功能未开启');
            }
          }else{
            this.$alert('当前企业没有开通人工客服功能,请联系商务人员开通。客服电话：0551-69101456', '提示', {
              confirmButtonText: '确定',
            });
          }
        })
      },
      doTakeoverDialog(item){
        this.calluuId=item.calluuid;
        this.tel_number=item.dnis;
        this.line_connected_time=item.line_connected_time
        this.$global.checkPermission('__fun.monitor').then(result => {
        // result 为 true 代表有权限
          if (!!result) {
            if(!!this.$phone.isOpen()){
              queryRealTimeCallDetail({
                business_id:this.business.id,
                sys_type:this.$config.system.id,
                calluuid:item.calluuid
              }).then((res)=>{
                if(res.code==0){//判断是不是已经被他人接管
                  this.takeoverDialog=true;
                }else{
                  if (res.code=='500000') {
                    this.$message.error(res.messageExt);
                  }else{
                    this.$message.error('接管失败');  
                  }
                }
              })
            }else{
              this.$message.error('电话功能未开启');
            }
          }else{
            this.$alert('当前企业没有开通人工客服功能,请联系商务人员开通。客服电话：0551-69101456', '提示', {
              confirmButtonText: '确定',
            });
          }
        })
      },
      searchRealTimeData(){
        queryRealTimeData({
          business_id:this.business.id,
          sys_type:this.$config.system.id,
          task_id:this.task_id,
          page_index : 1,
          page_size : 50,
          end: 0,
          no_match: this.no_match,
          order:"no_pass_count desc,timestamp desc"
        }).then((res)=>{
          this.realTimeData=this.$lodash.get(res,'result.rows',{}).filter(item => {
            return item.dnis != this.$global.getUserInfo('dn')
          });
          if (!this.getNewDataTimer) {
            this.getNewDataTimer = setInterval(()=>{ this.searchRealTimeData(); },3000);   
          }
        });
      },
      transSelectColorToNomatch(selectColor){//将选中的颜色转化成区间范围数组
        var no_match=[]
        if (selectColor.indexOf("绿色")>=0) {
          var objGreen={}
          for (var i = 0; i < this.colorList.length; i++) {
            if (this.colorList[i].key=="绿色") {
              objGreen.min_no_match=0
            }
            if (this.colorList[i].key=="橙色") {
              objGreen.max_no_match=this.colorList[i].value-1
            }
          }
          no_match.push(objGreen)
        }

        if (selectColor.indexOf("橙色")>=0) {
          var objorange={}
          for (var i = 0; i < this.colorList.length; i++) {
            if (this.colorList[i].key=="橙色") {
              objorange.min_no_match=Number(this.colorList[i].value)
            }
            if (this.colorList[i].key=="红色") {
              objorange.max_no_match=this.colorList[i].value-1
            }
          }
          no_match.push(objorange)
        }

        if (selectColor.indexOf("红色")>=0) {
          var objRed={}
          for (var i = 0; i < this.colorList.length; i++) {
            if (this.colorList[i].key=="红色") {
              objRed.min_no_match=Number(this.colorList[i].value)
            }
            
          }
          // objRed.max_no_match=""
          no_match.push(objRed)
        }
        this.no_match=no_match
        this.searchRealTimeData()
      },
      transCountToColor(count){//将数字转化成颜色
        var orangeValue=0,redValue=0;
        for (var i = 0; i < this.colorList.length; i++) {
          if (this.colorList[i].key=="橙色") {
            orangeValue=Number(this.colorList[i].value)
          }
          if (this.colorList[i].key=="红色") {
            redValue=Number(this.colorList[i].value)
          }
        }
        if (count>=redValue) {
          return 'red'
        }else if(count>=orangeValue){
          return 'orange'
        }else{
          return 'green'
        }
      },
      handleChangeSelectColor(e){
        this.transSelectColorToNomatch(e)
      },
      configSuccess(){
        queryConfig({
          business_id:this.business.id,
          sys_type:this.$config.system.id,
          task_id:this.task_id
        }).then(res=>{
          var colorList=this.$lodash.get(res,'result.rows[0].color',{});
          if (colorList&&colorList.length>0) {
            this.colorList=colorList;
            this.transSelectColorToNomatch(this.selectColor)
          }
        });
      },
      takeoverFromDialog(){
        // this.dialogDialog=false;
        this.takeoverDialog=true;
      }
    },
    beforeDestroy(){
      // this.takeoverDialog=false;
      // this.dialogDialog=false;
    },
    beforRouteLeave(){

    },
    destroyed(){
        if(this.getNewDataTimer) { //如果定时器在运行则关闭
            clearInterval(this.getNewDataTimer)
        }
        
    },
    components : {
      'monitor-config' : MonitorConfig,
      'monitor-dialog':MonitorDialog,
      'monitor-takeover':MonitorTakeover
    }
  }
    
</script>

<style scoped>
  .el-select{
    width: 200px;
  }
  .monitor{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap ;
    justify-content: flex-start; 
  }
  .detailheader{
    overflow: hidden;
  }
  .detailheader-back{
    cursor: pointer;
    display: inline-block;
  }
  .detailheader-right{
    display: inline-block;
    float: right;
  }
  
  .detailcontent{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap ;
    justify-content: flex-start; 
    margin-top: 20px;
  }
  .monitor-card{
    width: 240px;
    margin-bottom: 20px;
    margin-right: 20px;
    text-align: center;
  }
  .padding{
    padding: 20px;
  }
  .padding div{
    height:40px;
    line-height: 40px;

  }
  .card-bottom{
    text-align: center;
    border-top:1px solid #eee;
    height: 80px;
    line-height: 80px;
  }
  .green{
    border:1px solid #67C23A;
  }
  .red{
    border:1px solid #F56C6C;
  }
  .orange{
    border:1px solid #E6A23C;
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