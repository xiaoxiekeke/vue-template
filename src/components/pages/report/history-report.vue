<template>
  <div class="page taskinfo">
    

    <div class="search-box">

      <div class="right-box">
        <!-- <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            下载名单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">下载已呼名单</el-dropdown-item>
            <el-dropdown-item command="0">下载待呼名单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button @click.stop="downloadTask" class="btn-primary" type="text" :loading='downloadTaskLoading'>下载报表</el-button>
      </div>
    </div>
    <div class="content" v-loading="tableLoading">
      <el-table @sort-change="sortChange" :data="tableData" :border="true"
         :default-sort = "{prop: 'time_callout', order: 'descending'}"
          stripe
          style="width: 100%">
          <el-table-column
            align="center"
            prop="timestemp"
            min-width="100px"
            label="日期">
            <template slot-scope="scope">
              {{formateDate(scope.row.timestemp)}}
            </template>
          </el-table-column>
          <!-- sortable="custom" -->
          <el-table-column
            align="center"
            prop=" telnumcount"
            label="号码量">
            <template slot-scope="scope">
              {{scope.row.telnumcount?scope.row.telnumcount:0}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
              prop="callsuccesscount"
              label="接通量">
              <template slot-scope="scope">
                {{scope.row.callsuccesscount?scope.row.callsuccesscount:0}}
              </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="接听率">
            <template slot-scope="scope">
              {{callCompletionRate(scope.row.callsuccesscount,scope.row.telnumcount)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="outboundcount"
            :show-overflow-tooltip="true"
            label="外呼量">
            <template slot-scope="scope">
              {{scope.row.outboundcount ? scope.row.outboundcount : 0}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalcallduration"
            label="外呼通话总时长">
            <template slot-scope="scope">
              {{scope.row.totalcallduration?durationTransform(scope.row.totalcallduration) : 0}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="avecallduration"
            label="外呼通话平均时长(秒)">
            <template slot-scope="scope">
              {{avecallduration(scope.row.totalcallduration,scope.row.callsuccesscount)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagA"
            label="转化率(A类)">
            <template slot-scope="scope">
              {{conversionRate(scope.row.tagA?scope.row.tagA:0,scope.row.callsuccesscount)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagB"
            label="转化率(B类)">
            <template slot-scope="scope">
              {{conversionRate(scope.row.tagB?scope.row.tagB:0,scope.row.callsuccesscount)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagA+B"
            label="转化率(意向客户)">
            <template slot-scope="scope">
              {{conversionRateAdd(scope.row.tagA,scope.row.tagB,scope.row.callsuccesscount)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagA"
            label="意向A(个数)">
            <template slot-scope="scope">
              {{scope.row.tagA ? scope.row.tagA : "0"}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagB"
            label="意向B(个数)">
            <template slot-scope="scope">
              {{scope.row.tagB ? scope.row.tagB : "0"}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagC"
            label="意向C(个数)">
            <template slot-scope="scope">
              {{scope.row.tagC ? scope.row.tagC : "0"}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagD"
            label="意向D(个数)">
            <template slot-scope="scope">
              {{scope.row.tagD ? scope.row.tagD : "0"}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagE"
            label="意向E(个数)">
            <template slot-scope="scope">
              {{scope.row.tagE ? scope.row.tagE : "0"}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tagF"
            label="意向F(个数)">
            <template slot-scope="scope">
              {{scope.row.tagF ? scope.row.tagF : "0"}}
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

  </div>
  
</template>

<script>


  import {queryTaskReport,downloadCallData} from '@/api/outbound-data.js'
  import {queryLabelOptionList} from '@/api/bm.js'
  import fileDownload from 'js-file-download'
  import {generateRealTimeReport} from '@/api/outbound-report.js'
  import {addDownloadTask} from '@/api/download-center-api.js'
  import {taskStatistics,queryTaskDataReport,historyStatistics} from '@/api/taichi-data-api.js'

  import {mapActions,mapState} from 'vuex'

  export default {
    name: 'agentdata',
    props:['curDate'],
    data : function () {
      return {
        totalLoading : true,
        phone : '',//手机号
        result: [],//结果
        intention:[],//意向
        miniCallTimeLength : '',
        downloadCallLoading:false,
        downloadTaskLoading:false,
        total : {
            numberCount : '',
            processCount : '',
            processTelCount : '',
            procThroughCount : '',
            procThroughRate : ''
        },
        tableLoading : false,
        page : {
          total : 0,
          pageIndex : 1,
          pageSize : 10
        },
        param:{
          begintime:new Date(this.curDate[0]).getTime()-28800001,
          endtime:new Date(this.curDate[1]).getTime()+57600000
        },
        sort : {
          field : 'timestemp',
          order : 'desc'
        },
        tableData : [],
        detailData : [],
        checkedIds:[]
      }
    },
    watch:{
      curDate(){
        this.param.begintime = new Date(this.curDate[0]).getTime()-28800001
        this.param.endtime = new Date(this.curDate[1]).getTime()+57600000
        this.reloadTable()
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
      formateTime(value){
        value=Number(value)
        if(!value){
            return '--'
        }else{
          var timeformter=this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
          return timeformter
        }
      },
      formateDate(value){
        value=Number(value)
        if(!value){
            return '--'
        }else{
          var timeformter=this.$moment(value).format("YYYY-MM-DD")
          return timeformter
        }
      },
      callCompletionRate:function(callsuccesscount,telnumcount){
        if((telnumcount&&telnumcount!=0)&&(callsuccesscount&&callsuccesscount!=0)){
          return Math.round((callsuccesscount/telnumcount)*10000)/100+'%'
        }else{
          return 0+'%'
        }
      },
      avecallduration:function(totalcallduration,callsuccesscount){
        if((totalcallduration&&totalcallduration!=0)&&(callsuccesscount&&callsuccesscount!=0)){
          return Math.round((totalcallduration/callsuccesscount)*100)/100
        }else{
          return 0
        }
      },
      conversionRate:function(tagNum,callsuccesscount){
        if((tagNum&&tagNum!=0)&&(callsuccesscount&&callsuccesscount!=0)){
          return Math.round((tagNum/callsuccesscount)*10000)/100+'%'
        }else{
          return 0+'%'
        }
      },
      conversionRateAdd:function(tagA,tagB,callsuccesscount){
        var tagNum=0
        if (tagA) {
          tagNum+=tagA
        };
        if (tagB) {
          tagNum+=tagB
        };
        if((tagNum&&tagNum!=0)&&(callsuccesscount&&callsuccesscount!=0)){
          return Math.round((tagNum/callsuccesscount)*10000)/100+'%'
        }else{
          return 0+'%'
        }
      },
      durationTransform:function(time){
        let hour = parseInt(time / 3600),
            mins = parseInt((time-hour*3600)/60),
            second=time-hour*3600-mins*60;
        if (hour==0) {
          if (mins==0) {
            return second+"秒";
          }else{
            return mins+"分"+second+"秒";
          }
        }else{
          return hour+"时"+mins+"分"+second+"秒";
        };
      },
      formatMediaPath : function(value){
        if(value){
          return this.$global.getVoiceFileUrl(value);
        }else{
          return '--'
        }
      },
      reloadTable : function(){
        this.tableLoading = true;

        let param = {
          pageIndex : this.page.pageIndex,
          pageSize : this.page.pageSize,
          order : this.sort.field+" "+this.sort.order,
          begintime:this.param.begintime,
          endtime:this.param.endtime,
          channelCode:2
        };

        historyStatistics(param).then((data)=>{
          this.tableLoading = false;
          if(data.code == 0){
            data.result.rows.map(value=>{
                value.exporting = false
            })
            this.tableData = data.result.rows;
            this.page.total = data.result.totalCount;
          }else{
            this.page.total = [];
            this.tableData = 0;
          }
        })
      },
      reloadReport(){
        taskStatistics({taskId:this.$route.params.id,channelCode:2,businessId:this.$route.params.bid},this.$route.params.bid).then((data)=>{
          const row = this.$lodash.get(data,'result.rows[0]',{});
          const answerPercent = row.answerPercent ? parseFloat(row.answerPercent).toFixed(1) +"%" : '--';
          this.total = {
            numberCount : row.totalTel || 0,
            processCount : row.totalCall || 0,
            processTelCount : row.totalCallTel || 0,
            procThroughCount : row.totalAnswer || 0,
            procThroughRate : answerPercent
          }
          this.totalLoading = false;
        })
      },
      search : function(){
        this.page.pageIndex = 1;
        this.reloadTable();
        // this.reloadReport();
      },
      handleSizeChange(size){
        this.page.pageSize = size;
        this.reloadTable();
      },
      handleCurrentChange : function(page){
        this.page.pageIndex = page;
        this.reloadTable();
      },
      sortChange (column) {
        let key = column.prop ? column.prop : 'time_create'
        let order = column.order === 'ascending' ? 'asc' : 'desc'
        if (key !== this.sort.field || this.sort.order !== order) {
            this.sort.field = key
            this.sort.order = order+' ,task_data_id asc '
          // this.reloadTable();
        }
      },
      
      
      // //下载名单
      // downloadCall(){
      //   let params = {
      //     taskId:this.$route.params.id,
      //     telNum : this.phone,
      //     miniCallTimeLength : this.miniCallTimeLength
      //   }
      //   if(this.result.length > 0){
      //     params.callResult = JSON.stringify(this.result);
      //   }
      //   if(this.intention.length > 0){
      //     params.intentionLevel = this.intention.join(',');
      //   }
      //   this.downloadCallLoading = true
      //   downloadCallData(params,this.$route.params.bid).then(res => {
      //     fileDownload(res, params.taskId+'_call.xlsx')
      //     this.downloadCallLoading = false
      //   });
      // },
      // // 下载名单到下载中心
      // downloadCallToCenter(callout){
      //   var _this = this;
      //   _this.downloadTaskLoading = true
        
      //   var param={
      //     businessId:this.$route.params.bid,
      //     sysType:2,
      //     downloadType:5,
      //     channelCode:2,
      //     query:{
      //       callOut:parseInt(callout),
      //       businessId:this.$route.params.bid,
      //       taskId : this.$route.params.id,
      //       pageIndex : this.page.pageIndex,
      //       pageSize : this.page.pageSize,
      //       order : this.sort.field+" "+this.sort.order,
      //       channelCode:2
      //     }
      //   }
      //   if(this.result.length > 0){
      //       param.query.callResult = this.result.join(",");
      //   }
      //   if(this.intention.length > 0){
      //       param.query.tagIntention = this.intention.join(",");
      //   }
      //   if(this.phone != ''){
      //      param.query.telNumber = this.phone;
      //   }
      //   if(this.miniCallTimeLength != ''){
      //     param.query.callDuration = this.miniCallTimeLength;
      //   }
      //   addDownloadTask(param,this.$route.params.bid).then(function(data){
      //     _this.downloadTaskLoading = false
      //     if(data.code != 0){
      //       if(data.code=="30050"){
      //               _this.$message.error('长期任务不能下载');
      //             }else if(data.code == '30051'){
      //               _this.$message.error('下载任务正在进行中，请稍后再试');
      //           }else{
      //                 _this.$message.error('导出报表失败');            
      //             }
      //       return;
      //     }
      //     _this.addDownTask();
      //   });
      // },
      //下载报表
      downloadTask(){
        var _this = this;
        _this.downloadTaskLoading = true
        
        var param={
          sysType:2,
          downloadType:6,
          businessId:this.business.id,
          channelCode:2,
          query:{
                businessId:this.business.id,
                order : this.sort.field+" "+this.sort.order,
                begintime:this.param.begintime,
                endtime:this.param.endtime,
                channelCode:2
              }
        }
        addDownloadTask(param,this.$route.params.bid).then(function(data){
          _this.downloadTaskLoading = false
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
          _this.addDownTask();
        });
      },

      // handleCommand(command) {
      //   this.downloadCallToCenter(command)
      // }   
    },
    beforeRouteEnter : function(to, from, next){
      next(vm => {
        vm.downloadCallLoading = false;
        vm.downloadTaskLoading = false;
        vm.phone = '';
        vm.result = [];
        vm.intention = [];
        vm.miniCallTimeLength = '';
        vm.search();
      });
    },
    mounted : function(){

      var checkedIds= JSON.parse(window.localStorage.getItem('checkedIds'))
      if (checkedIds&&checkedIds.length>0) {
        this.checkedIds=checkedIds
      }else{
        this.checkedIds=[]
      }

      this.search()
    },
    components: {
    }
  }
  
</script>

<style lang="less" scoped>

  .right-box{
    float:right;
  }
  .right-box .el-button{
    width:80px;
    text-align:right;
  }
  .right-box .el-button+.el-button{
    margin-left:0;
  }


  .player-box{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .player-btn{
    width:30px;
    height:30px;
  }
  .search-box{
    margin-top:0px;
    .select-txt{
      width:180px;
    }
    .input-txt{
      width:180px;
    }
  }
  .taskinfo{
    padding:0;
    position: relative;
    top: -30px;
  }
  .taskinfo .content{
    margin-top:0px;

  }
  .btn-back{
    font-size:14px;
  }
  .checked-btn{
    color:#0066b7;
  }

  .el-dropdown-link{
    color:#00b792;
    cursor: pointer;
    font-weight: 500;
  }
</style> 