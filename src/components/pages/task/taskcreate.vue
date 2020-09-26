<template>
 	<el-dialog
    :title="title"
    :visible.sync="show"
    :append-to-body="true"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    top="2%"
    width="530px">
    <el-form 
    	v-loading="loading" 
    	ref="taskform" 
    	:model="formData" 
    	:rules="rules" 
    	label-width="120px" 
    	label-position="left"
      class="create-form">
	    <el-form-item label="任务名称" prop="name">
	      <el-input v-model.trim="formData.name" :disabled="isEdit" class="form-content" placeholder="请输入任务名称" auto-complete="off"></el-input>
	    </el-form-item>
	    <el-form-item  label="话术" prop="robotCallProcId">
		  	<el-select
		  		class="form-content"
			    v-model="formData.robotCallProcId"
			    @change="speechChange" 
			    :disabled="isEdit"
			    filterable remote reserve-keyword clearable
			    placeholder="请选择话术"
			    :remote-method="querySpeechList"
			    :loading="speechLoading">
		     	<el-option 
		     		v-for="item in speechList" 
		     		:key="item.value" 
		     		:label="item.label" 
		     		:value="item.value">
			    </el-option>
			  </el-select>
	    </el-form-item>
	    <el-form-item  label="外呼数据" prop="fileName" class="is-required">
	      	  <div v-if="isEdit" class="form-content">{{orgFileName}}</div>
	          <span v-else-if="!formData.robotCallProcId" class="form-content">请先选择话术</span>
	          <div v-else class="form-content" >
	      			<a v-if="!orgFileName" class="form-down" :href="template.url" 
	          			:download="template.name">模板下载</a>
	          		<span class="form__fileName" v-else>{{uploading ? '上传校验中...' : orgFileName}}</span>
	             	<el-upload ref="upload" v-if="!taskId" 
	             		:on-change="onChange"
	             		:auto-upload="false"
	             		:show-file-list="false" 
	             		:action="upload.url"
	             		:before-upload="beforeUpload" 
	             		:on-error="onError"
	             		:on-success="onSuccess"
	             		:data="uploadData" name="OBJECT"  class="form-upload" >
	             		<el-button type="text">{{upload.btnTxt}}</el-button>
	             	</el-upload>
	          </div>
	          <div class="el-form-item__error">{{uploadError}} </div>
	    </el-form-item>
	    <el-form-item label="未接通再次外呼" prop="recall">
    	 	<div class="form-content">
	    		<el-select :disabled="isEdit" v-model="formData.recallMaxCount" clearable placeholder="外呼次数" class="recallMaxCount" >
				    <el-option 
				    	v-for="item in recallMaxCountList"
				      :key="item.value" 
				      :label="item.label" 
				      :value="item.value">
				    </el-option>
					</el-select>
					<el-select :disabled="isEdit" v-model="formData.recallWaitTime" placeholder="外呼间隔时间" clearable class="recallWaitTime" >
				    <el-option 
				    	v-for="item in recallWaitTimeList"
				      :key="item.value" 
				      :label="item.label" 
				      :value="item.value">
				    </el-option>
					</el-select>
	    	</div>
	    </el-form-item>
			<el-form-item label="意向客户推送" prop="pushIntention" class="pushIntention-checkbox">
				<el-tooltip placement="top" effect="light">
			  	<div slot="content" class="pushIntention-tip">
			  	绑定微信后可获取意向用户通知</div>
			  	<i class="el-icon-question"></i>
				</el-tooltip>
				<el-checkbox-group v-model="formData.pushIntention" :disabled="isEdit || bindStatus =='0'">
			    <el-checkbox v-for="item in intentionList" :label="item" :key="item">{{item}}</el-checkbox>
				</el-checkbox-group>
				<span v-if="bindStatus == '0'" class="push__info">未绑定微信，<a @click.stop="goToInfo" href="javascript:;" class="link">去绑定</a></span>
			</el-form-item>
	    <el-form-item label="外显号码" prop="telnum">
      	<el-select 
      		multiple 
      		collapse-tags
    			v-model="formData.telnum" 
    			@change="telnumChange" 
    			class="form-content" 
    			placeholder="外显号码">
		    	<el-option 
		    		v-for="item in telnumList"
		      	:key="item.value" 
		      	:label="item.label" 
		      	:value="item.value" 
		      	:disabled="item.disabled">
		      	<span>{{ item.label }}</span>
  					<span style="float: right;">{{ item.usedDesc }}</span>
		    	</el-option>
				</el-select>
	    </el-form-item>
	    <el-form-item label="预设开始时间" prop="beginTime">
  			<k-time :disabled="isEdit" v-model="formData.beginTime" placeholder="设置开始时间" class="form-content" ></k-time>
	    </el-form-item>
			<el-form-item label="预设结束时间" prop="endTime">
      	<k-time  :quick="false" :default="formData.endTime" v-model="formData.endTime" placeholder="设置结束时间" class="form-content"></k-time>
	    </el-form-item>
	    <el-form-item label="机器人工作时间" prop="timeRange">
      	<div class="rangetime">
	     		<div class="rangetime-am">
           	<el-time-select 
           		class="rangetime__begin" 
           		placeholder="起始时间" 
            	v-model="formData.rangeBegin" 
            	:editable="false" 
             :picker-options="{start: timeConf.begin || '09:00',step: '00:30', end: timeConf.end || '12:00',maxTime:formData.rangeEnd}">
            </el-time-select> -
            <el-time-select  
            	class="rangetime__end" 
            	placeholder="结束时间" 
            	v-model="formData.rangeEnd" :editable="false" 
            	:picker-options="{start: timeConf.begin || '09:00',step: '00:30',end: timeConf.end || '12:00',minTime: formData.rangeBegin }">
            </el-time-select>
          </div>
          <div class="rangetime-pm">
            <el-time-select 
            	class="rangetime__begin" 
            	placeholder="起始时间" 
            	v-model="formData.rangeBegin1" 
            	:editable="false" 
            	:picker-options="{start: timeConf.begin1 || '12:00',step: '00:30',end: timeConf.end1 || '21:00',maxTime: formData.rangeEnd1}">
            </el-time-select> -
            <el-time-select 
            	class="rangetime__end" 
            	placeholder="结束时间" 
            	v-model="formData.rangeEnd1" 
            	:editable="false"
          	 	:picker-options="{start:  timeConf.begin1 || '12:00', step: '00:30', end: timeConf.end1 || '21:00',minTime: formData.rangeBegin1}">
            </el-time-select>
          </div>
	     	</div>
	    </el-form-item>
	    <el-form-item label="高性能模式" >
	    	<div class="form-item-record">
	    		<el-switch 
	    			:disabled="isEdit" 
	    			v-model="formData.isRecord"
					  active-color="#13ce66">
					</el-switch>
					<span class="form-record-tip">开启高性能模式将不会产生通话录音</span>
	    	</div>
			</el-form-item>
	    <el-form-item label="" prop="read">
	     	<el-checkbox 
	     		v-if="!isEdit" 
	     		v-model="formData.read">
	     		<a class="link" href="static/html/protocal.html" target="_blank">请阅读《Yeta外呼协议》</a>
	     	</el-checkbox>
	     	<a v-else class="link" href="static/html/protocal.html" target="_blank">请阅读《Yeta外呼协议》</a>
	    </el-form-item>
		</el-form>
   	<span slot="footer" class="dialog-footer">
	    <el-button @click.stop="cancel">取 消</el-button>
	    <el-button v-if="isEdit" :disabled="isSubmit" type="primary" @click.stop="editForm('taskform')">保存</el-button>
	    <el-button v-else-if="formData.read" :disabled="isSubmit" type="primary" @click.stop="submitForm('taskform')">开始创建</el-button>
	    <el-button v-else type="info" disabled>开始创建</el-button>
		</span>
  	<el-dialog width="350px" title="提示" append-to-body
  		:close-on-click-modal="false"
    	:show-close="false" :visible.sync="innerVisible" >
    	<div class="upload__error-txt">您上传的外呼数据，超过5%的号码格式错误！请检验您的外呼数据</div>
    	<div class="upload__error-file">
    		<a class="link" :href="errorFile" download><span class="el-icon-download"></span>错误名单</a>
  		</div>
    	<span slot="footer">
    		<el-button @click.stop="reUpload()">重新上传</el-button>
  			<el-button type="primary" @click.stop="ignore()">忽略错误号码</el-button>
    	</span>
  	</el-dialog>
  </el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import KTime from '@/components/common/date/k-time'
	import {querySpeechSkill} from '@/api/brain.js'
	import {queryLabelOptionList,queryBusinessConfig} from '@/api/bm.js'
	import {getTaskConfig,getTelNum} from '@/api/jsondata.js'
	import {createTaskWithFile,searchTaskList,getUploadExcelUrl,modifyTask,searchSpeaker,searchTel} from '@/api/outbound-manage.js'

	import global from '@/api/global.js'
	import config from '@/api/config.js'
	import {mapState} from 'vuex'

	export default {
		name : 'task-create',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','taskId'],
		data : function(){
			var validateName = (rule, value, callback) => {
				const errorTip = ['请输入任务名称','任务名称格式不正确'],
					result = validateRule(value,['require','name']);
				if(result >= 0){
					callback(new Error(errorTip[result]));
				}else{
					callback();
				}
			}

			var validateRecall = (rule, value, callback) => {
				if(this.formData.recallMaxCount && !this.formData.recallWaitTime){
					callback(new Error('请选择外呼间隔时间'));
				}else if(!this.formData.recallMaxCount && this.formData.recallWaitTime){
					callback(new Error('请选择外呼次数'));
				}else{
					callback();
				}
			}

    	var validateTimeRange = (rule,value,callback) => {
    		let rangeBegin = this.formData.rangeBegin,
					rangeEnd = this.formData.rangeEnd,
					rangeBegin1 = this.formData.rangeBegin1,
					rangeEnd1 = this.formData.rangeEnd1;
				if(rangeBegin && rangeEnd && rangeBegin1 && rangeEnd1){
					callback();
				}else{
					callback(new Error('请选择机器人工作时间'));
				}
    	}

    	var validateBeginTime = (rule,value,callback) => {
      	if(!this.formData.beginTime){
					callback(new Error('请设置开始时间'))
      	}else if(this.formData.endTime && this.formData.beginTime > this.formData.endTime){
    			callback(new Error('开始时间不能大于结束时间'))
    		}else{
    			callback()
    		}
    	}

    	var validateEndTime = (rule,value,callback) => {
      	if(!this.formData.endTime){
					callback(new Error('请设置结束时间'))
      	}else if(this.formData.endTime && this.formData.beginTime > this.formData.endTime){
    			callback(new Error('结束时间不能小于开始时间'))
    		}else{
    			callback()
    		}
    	}

			return {
				innerVisible : false,
				loading : true,
				formData : {
					read : !!this.taskId,
					name : '',
					robotCallProcId : '',
					telnum : [],
					pushIntention : [],
					beginTime : '',
					endTime : '',
					recallMaxCount : '',
					recallWaitTime : '',
					rangeBegin:'09:00',
					rangeEnd : '12:00',
					rangeBegin1 : '13:30',
					rangeEnd1 : '20:00',
					isRecord : false
				},
				rules : {
					name : [
						{ required: true, message: '请输入任务名称', trigger: 'blur' },
						{validator: validateName, trigger: 'blur'}
					],
					robotCallProcId : [{ required: true, message: '请选择话术', trigger: 'change' }],
					telnum : [{ required: true, message: '请选择外显号码', trigger: 'change' }],
					beginTime : [{ required: true,validator:validateBeginTime, message: '请选择预设开始时间', trigger: 'change' }],
					endTime : [{ required: true, validator:validateEndTime, trigger: 'change' }],
					recall : [{validator: validateRecall, trigger: 'change'}],
					timeRange :[{required: true, validator: validateTimeRange, trigger: 'change'}]
				},
				//
				orgFileName : '',
				fileName : '',
				uploadError : '',
				errorFile : '',
				uploading : false,
				//
				parallelCount : 0,
				//
				speechList : [],
				telnumList : [],
				recallMaxCountList : [],
				recallWaitTimeList : [],
				intentionList : [],
				//
				uploadData : {
					fileSuffix : '',
					robotCallProcId : ''
				},
				isSubmit : false,
				speechLoading : false,
				timeConf: {
					begin: '09:00',
					end: '12:00',
					begin1: '12:00',
					end1: '21:00'
				}
			}
		},
		computed : {
			...mapState('user',[
				'id',
				'surname',
        'bindStatus'
      ]),
			isEdit : function(){
				return !!this.taskId;
			},
			title : function(){
				return this.isEdit ? '编辑任务' : '创建任务';
			},
			curSpeech : function(){
				let result = null;
				for(let speech of this.speechList){
					if(speech.value == this.formData.robotCallProcId){
						result = speech;
						break;
					}
				}
				return result;
			},
			template : function(){
				let speech = this.curSpeech,
					url = speech ? global.getStaticFileUrl(speech.url) : '',
					suffix = url ? url.substring(url.lastIndexOf('.') + 1).toLowerCase() : '',
					name = speech ? speech.label + '.' + suffix : '';
				return {
					name : name,
					suffix : suffix,
					url : url || 'javascript:;'
				}
			},
			upload : function(){
				return {
					data : {
						fileSuffix : this.template.suffix,
						speechSkillId : this.formData.robotCallProcId
					},
					btnTxt : this.orgFileName ? '重新上传' : '点击上传',
					url : getUploadExcelUrl()
				}
			},
			mcp : function(){
				let speech = this.curSpeech;
				return speech ? speech.mcp : '';
			}
		},
		methods : {
			querySpeechList : function(keywords){
				this.speechLoading = true;
				let param = {name : keywords,status : 4, pageIndex:1, pageSize:10}
				querySpeechSkill(param).then(resp => {
					this.initSpeechList(this.$lodash.get(resp,'result.rows',[]))
					this.speechLoading = false;
				})
			},
			initSpeechList : function(speechList){
				let tmpList = [];
				for(let row of speechList){
					tmpList.push({
						value : row.id,
						label : row.name,
						id : row.id,
						mcp : row.mcp,
          	url : row.templateFileUrl,
          	people : row.transferPeopleFlag || '0',
          	silence : row.transferSilenceSeatFlag || '0'
					});
				}
				this.speechList = tmpList;
			},
			initTelnumList : function(telnumList){
				let tmpList = [];
				for(let tmp of telnumList){
					let telNum = tmp.cpnCode,
						lineName = tmp.lineName || '',
						concurrentName = tmp.concurrentName,
            parallelCount = tmp.concurrentShow || tmp.concurrent,
            usedDesc = this.taskId ? '' : tmp.expired == 1 ? '已过期' : ( tmp.used == '1' ? '占用中' : '');
          let label = lineName ? lineName : telNum;
          label += '  ';
          label += concurrentName ? concurrentName : `${parallelCount}路并发`;
					tmpList.push({
						label : label,
						value : telNum,
						parallelCount : parallelCount,
						usedDesc : usedDesc,
						disabled : tmp.used == '1' || tmp.expired == 1
						//disabled : this.taskId ? true : (tmp.used == '1' || tmp.expired == 1)
					});
				}
        this.telnumList = tmpList;
			},
			initTaskConfig : function(taskConfig){
				this.recallMaxCountList = taskConfig.recallMaxCountList || [];
				this.recallWaitTimeList = taskConfig.recallWaitTimeList || [];
			},
			//events
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			},
			submitForm : function(formName){
				var _this = this;
				this.$refs[formName].validate((valid) => {
					 if(!_this.fileName){
			        	_this.uploadError = '请上传外呼数据';
			        }
			        if(!valid || !_this.fileName) {
			           	return false;
			        }
			        let timeRange = _this.formData.rangeBegin+'-'+_this.formData.rangeEnd,
			        	timeRange2 = _this.formData.rangeBegin1+'-'+_this.formData.rangeEnd1;

			        if(_this.formData.rangeBegin && _this.formData.rangeEnd){
			        	timeRange = _this.formData.rangeBegin+':00-'+_this.formData.rangeEnd+':00';
			        }
			        if(_this.formData.rangeBegin1 && _this.formData.rangeEnd1){
			        	timeRange2 = _this.formData.rangeBegin1+':00-'+_this.formData.rangeEnd1+':00';
			        }
			        let params = {
			        	accountId : this.id,
			        	accountName :  this.surname,
			        	name : _this.formData.name,
			        	sysType : _this.$config.system.id,
			        	fileName : _this.fileName,
			        	orgFileName : _this.orgFileName,
			        	taskConfig : {
			        		telNum : _this.formData.telnum.join(';'),
			        		mcp : _this.mcp,
			        		speechSkillId : _this.formData.robotCallProcId,
			        		beginTime : new Date(_this.formData.beginTime).getTime(),
			        		endTime : new Date(_this.formData.endTime).getTime(),
			        		timeRange : [timeRange,timeRange2],
			        		recallMaxCount : _this.formData.recallMaxCount || 0,
			        		recallWaitTime : _this.formData.recallWaitTime,
			        		miniConnectRate : '',
			        		transferAgent : {flag: 0,type: '',number: []},
			        		transferSilenceAgent: {flag: 0,number: []},
			        		pushIntention : _this.formData.pushIntention,
			        		connectRateAlarmTel : '',
			        		recallStatus : [],
			        		isRecord : _this.formData.isRecord ? 0 : 1
			        	}
			        }
			        _this.isSubmit = true;
			        createTaskWithFile(params).then(function(data){
			        	_this.isSubmit = false;
			        	const taskId = _this.$lodash.get(data,'result.rows[0].taskId');
			        	if(taskId){
			        		_this.$message({ message: '创建成功',type: 'success'});
			        		_this.$emit('success');
			        	}else{
			        		_this.$message.error('创建失败');
			        	}
			        	_this.$emit('change',false);
			        });
        		});
			},
			editForm : function(formName){
				var _this = this;
				this.$refs[formName].validate((valid) => {
			        if(!valid) {
			           	return false;
			        }
			        let timeRange = _this.formData.rangeBegin+'-'+_this.formData.rangeEnd,
			        	timeRange2 = _this.formData.rangeBegin1+'-'+_this.formData.rangeEnd1;

			        if(_this.formData.rangeBegin && _this.formData.rangeEnd){
			        	timeRange = _this.formData.rangeBegin+':00-'+_this.formData.rangeEnd+':00';
			        }
			        if(_this.formData.rangeBegin1 && _this.formData.rangeEnd1){
			        	timeRange2 = _this.formData.rangeBegin1+':00-'+_this.formData.rangeEnd1+':00';
			        }
			        let param = {
			        	//operateType: 2,
	    					taskId: _this.taskId,
	    					sysType: _this.$config.system.id,
			        	taskConfig: {
			        		telNum : _this.formData.telnum.join(';'),
					        endTime: new Date(_this.formData.endTime).getTime(),
	                timeRange :[timeRange,timeRange2]
					    	}
			        }
			        _this.isSubmit = true;
			        modifyTask(param).then(function(data){
			        	_this.isSubmit = false;
			        	if(data.code == 0){
			        		_this.$message({message: '保存成功',type: 'success'});
		        			_this.$emit('success');
			        	}else{
			        		_this.$message.error('保存失败');
			        	}
			        	_this.$emit('change',false);
			        });
        		});
			},
			speechChange : function(val){
				this.fileName = '';
				this.orgFileName = '';
			},
			telnumChange : function(val){
				let count = 0;
				for(let i = 0,len = this.telnumList.length; i < len;i++){
					let telnum = this.telnumList[i];
					if(val && val.length > 0 && val.indexOf(telnum.value) >= 0){
						count += telnum.parallelCount
					}
				}
				this.parallelCount = count;
			},
			resetUpload : function(){
				this.uploadError = '';
				this.fileName = '';
				this.orgFileName = '';
			},
			onChange : function(file,filelist){
				if(file.status == 'ready'){
					let orgFileName = file ? file.name : '',
					suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
					this.uploadData = {
						fileSuffix : suffix,
						speechSkillId : this.formData.robotCallProcId
					}
					setTimeout(()=>{
						this.$refs.upload.submit();
					},0)
				}
			},
			beforeUpload : function(file){
				let orgFileName = file ? file.name : '',
					suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
				this.resetUpload();
				if(['csv','xlsx','xls'].indexOf(suffix) < 0){
					this.uploadError = '文件格式不正确';
					return false;
				}
				this.orgFileName = orgFileName;
				this.uploading = true;
			},
			onError : function(err, file, fileList){
				this.resetUpload();
				this.uploadError = '上传失败';
				this.uploading = false;
			},
			onSuccess : function(resp, file, fileLis){
				this.uploading = false;
				if(resp.code != '0'){
					this.resetUpload();
					this.uploadError = this.$lodash.get(resp,'messageExt','上传失败');
					return;
				}
				const errorRate = this.$lodash.get(resp,'result.rows[0].errorRate'),
					  errorFilePath = this.$lodash.get(resp,'result.rows[0].errorFilePath');
				if(errorRate >= 0.05){
					this.innerVisible = true;
					this.uploadError = '上传数据有误';
					this.errorFile = this.$global.getStaticFileUrl(errorFilePath);
				}
				this.fileName = this.$lodash.get(resp,'result.rows[0].fileName','');
			},
			ignore : function(){
				this.uploadError = '';
				this.innerVisible = false;
			},
			reUpload : function(){
				this.innerVisible = false;
				document.querySelector('.form-upload button').click();
			},
			goToInfo : function(){
				this.$emit('change',false);
				this.$router.replace({ path: '/info'});
			},
			//获取意向程度
			getQueryLabelOptionList : function(){
				var _this = this;
				queryLabelOptionList().then(res => {
					if(res.code === 0){
						for(let i = 0,len = res.result.rows.length ; i < len; i++){
							let row = res.result.rows[i];
							if(row.talkScriptFlag != 0) {
               continue;
            	}
	          	if(_this.intentionList.length >= 2){
	          		break;
	          	}
							_this.intentionList.push(row.name);
						}
					}
				})
			},
			initTimeConf(conf){
				if(!conf){
					return
				}
				let arr = JSON.parse(conf)
				this.timeConf.begin = arr[0].begin;
				this.timeConf.end = arr[0].end;
				this.timeConf.begin1 = arr[1].begin;
				this.timeConf.end1 = arr[1].end;

				this.formData.rangeBegin = this.timeConf.begin <= '09:00' && this.timeConf.end >= '09:00' ? '09:00' : this.timeConf.begin;
				this.formData.rangeEnd = this.timeConf.end >= '12:00' && this.timeConf.begin <= '12:00' ? '12:00' : this.timeConf.end;
				this.formData.rangeBegin1 = this.timeConf.begin1 <= '13:30' && this.timeConf.end1 >= '13:30' ? '13:30' : this.timeConf.begin1;
				this.formData.rangeEnd1 = this.timeConf.end1 >= '20:00' && this.timeConf.begin1 <= '20:00' ? '20:00' : this.timeConf.end1;
			}
		},
		mounted : function(){
			this.getQueryLabelOptionList();
			const _this = this;
			Promise.all([searchTel(),getTaskConfig(),queryBusinessConfig({
				businessId: this.$global.getBusinessId(),
				key: '__calltime'
			})]).then(values => {
				const telnumList = _this.$lodash.get(values,'[0].result.rows',[]),
					taskConfig = _this.$lodash.get(values,'[1]',{}),
					tconf = this.$lodash.get(values,'[2].result.rows[0].value');
				_this.initTelnumList(telnumList);
				_this.initTaskConfig(taskConfig);
				_this.initTimeConf(tconf);

				if(!!!_this.taskId){
					querySpeechSkill({status: 4, pageIndex:1, pageSize:50}).then(resp => {
						_this.initSpeechList(_this.$lodash.get(resp,'result.rows',[]));
						_this.loading = false;
					})
					return;
				}
				searchTaskList({taskId:_this.taskId}).then(data => {
					const rowData = _this.$lodash.get(data,'result.rows[0]'),
					  dateRange = JSON.parse(rowData.timeRange),
					  range1 = dateRange && dateRange[0] ? dateRange[0].split('-') : [],
					  range2 = dateRange && dateRange[1] ? dateRange[1].split('-') : [];

					if(rowData.speechSkillId){
						querySpeechSkill({id : rowData.speechSkillId}).then(resp => {
							_this.initSpeechList(_this.$lodash.get(resp,'result.rows',[]));
						})
					}

					_this.formData.name = rowData.name;
					_this.formData.robotCallProcId = rowData.speechSkillId;
					_this.formData.telnum =  rowData.telNum ? rowData.telNum.split(";") : [];
					if(_this.formData.telnum.length > 0){
						this.telnumList.forEach(item => {
							if(_this.formData.telnum.indexOf(item.value) >= 0){
								item.disabled = false;
							}
						})
					}

					_this.formData.beginTime = _this.$moment(rowData.beginTime).format('YYYY-MM-DD HH:mm:ss');
					_this.formData.endTime = _this.$moment(rowData.endTime).format('YYYY-MM-DD HH:mm:ss');
					_this.formData.recallMaxCount = rowData.recallMaxCount;
					_this.formData.recallWaitTime = rowData.recallWaitTime;
					_this.formData.pushIntention = JSON.parse(rowData.pushIntention);
					_this.formData.rangeBegin = !range1[0] || range1[0] == 'null' ? '' : range1[0].substr(0,5);
					_this.formData.rangeEnd = !range1[1] || range1[1] == 'null' ? '' : range1[1].substr(0,5);
					_this.formData.rangeBegin1 = !range2[0] || range2[0] == 'null' ? '' : range2[0].substr(0,5);
					_this.formData.rangeEnd1 = !range2[1] || range2[1] == 'null' ? '' : range2[1].substr(0,5);;
					_this.formData.isRecord = !!!rowData.isRecord;
	        _this.fileName = rowData.uploadFileName;
	        _this.orgFileName = rowData.fileName;
					_this.loading = false;
				})
			})
		},
		components : {
			'k-time' : KTime
		}
	}

</script>
<style lang="less" src="./taskcreate.less"></style>