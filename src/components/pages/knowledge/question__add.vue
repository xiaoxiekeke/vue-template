<template>
	<el-dialog
	  :title="title"
	  :visible.sync="show"
	  :append-to-body="true"
	  :before-close="beforeClose"
    :close-on-click-modal="false"
	  top="5vh"
	  width="915px">
		<div class="question__add">
			<div class="question__left">
				<div class="lbl">主问法<em>*</em></div>
				<el-form ref="questionForm" :model="questionForm" :rules="questionRules">
				  <el-form-item label="" prop="question">
				    	<el-input v-model.trim="questionForm.question" placeholder="请输入用户的主问法" maxlength="60"></el-input>
				  </el-form-item>
			  </el-form>
				<div>
					<el-button @click.stop="addExtend" type="text">+添加相似问法</el-button>
				</div>
				<div class="question__near">
					<el-input v-for="(item,index) in questionExtends" :key="index"
						 v-model.trim="item.value" class="input-txt" 
						 placeholder="请输入用户的相似问法" maxlength="200">
						 <i @click.stop="delExtend(index)" slot="suffix" class="el-input__icon el-icon-delete"></i>
					</el-input>
				</div>
			</div>
			<div class="question__right">
				<div class="question__interrupt">
				  <el-checkbox v-model="interrupt">回答支持打断</el-checkbox>
				</div>
				<el-tabs v-model="activeAnswer" >
			    <el-tab-pane label="回答1" name="first">
	  	  			<div class="textareaDiv">
	  		  			<el-input v-model.trim="answer1" :rows="10" class="input-area"  type="textarea" resize='none' maxlength="500"></el-input>
	  		  			<el-form ref="importForm">
	  			  			<el-form-item label="" prop="fileName">
	  			                <div style="display:none;">
	  			                    <input @change="fileChange1" id="dictUpload1" type="file" />
	  			                </div>
	  			                <label for="dictUpload1" class="up__speech">
	  			                    <span class="up__speech-txt" v-show="isUpload1">录音上传</span>
	  			                </label>
	  			            </el-form-item>
	  		        	</el-form>
	  		        	<i class="el-icon-loading" v-show="!isLoading1"></i>
	  		        	<div class="player-box" v-show="isDel1">
	  		        		<Player class="player-btn" v-if="audioUrl1 !== ''" :src="audioUrl1" :key="audioUrl1" :pause-key="pauseKey"></Player>
	  		        	</div>
	  		        	<el-button type='text' @click.stop="delAudio1" v-show="isDel1" class="delAudio">删除</el-button>
	  	        	</div>
					</el-tab-pane>
			    <el-tab-pane label="回答2" name="second">
	  	  			<div class="textareaDiv">
	  		  			<el-input v-model.trim="answer2" :rows="10" class="input-area"  type="textarea" resize='none' maxlength="500"></el-input>
	  		  			<el-form ref="importForm">
	  			  			<el-form-item label="" prop="fileName">
	  			                <div style="display:none;">
	  			                    <input @change="fileChange2" id="dictUpload2" type="file" />
	  			                </div>
	  			                <label for="dictUpload2" class="up__speech">
	  			                    <span class="up__speech-txt" v-show="isUpload2">录音上传</span>
	  			                </label>
	  			            </el-form-item>
	  		        	</el-form>
	  		        	<i class="el-icon-loading" v-show="!isLoading2"></i>
	  		        	<div class="player-box" v-show="isDel2">
	  		        		<Player class="player-btn" v-if="audioUrl2 !== ''" :src="audioUrl2" :key="audioUrl2" :pause-key="pauseKey"></Player>
	  		        	</div>
	  		        	<el-button type='text' @click.stop="delAudio2" v-show="isDel2" class="delAudio">删除</el-button>
	  	        	</div>
					</el-tab-pane>
			    <el-tab-pane label="回答3" name="third">
	  	  			<div class="textareaDiv">
	  		  			<el-input v-model.trim="answer3" :rows="10" class="input-area"  type="textarea" resize='none' maxlength="500"></el-input>
	  		  			<el-form ref="importForm">
	  			  			<el-form-item label="" prop="fileName">
	  			                <div style="display:none;">
	  			                    <input @change="fileChange3" id="dictUpload3" type="file" />
	  			                </div>
	  			                <label for="dictUpload3" class="up__speech">
	  			                    <span class="up__speech-txt" v-show="isUpload3">录音上传</span>
	  			                </label>
	  			            </el-form-item>
	  		        	</el-form>
	  		        	<i class="el-icon-loading" v-show="!isLoading3"></i>
	  		        	<div class="player-box" v-show="isDel3">
	  		        		<Player class="player-btn" v-if="audioUrl3 !== ''" :src="audioUrl3" :key="audioUrl3" :pause-key="pauseKey"></Player>
	  		        	</div>
	  		        	<el-button type='text' @click.stop="delAudio3" v-show="isDel3" class="delAudio">删除</el-button>
	  	        	</div>
					</el-tab-pane>
				</el-tabs>
				<!-- <div class="lbl">回答</div> -->
				
				<div class="lbl">分类<em>*</em></div>
				<div>
					<el-form ref="tagForm" :inline="true" :model="tagForm" :rules="tagRules">
						  <el-form-item label="" prop="tagId" >
					    		<el-select v-model="tagForm.tagId" clearable placeholder="请选择分类">
								    <el-option v-for="item in tagList"
								      	:key="item.value"
								      	:label="item.label"
								      	:value="item.value">
								    </el-option>
							  	</el-select>
						  </el-form-item>
						  <el-form-item>
					    		<el-button @click.stop="addTagDialog = true" type="text" >新建分类</el-button>
						  </el-form-item>
					</el-form>
				</div>

				<div class="lbl2"><el-checkbox v-model="smsForm.isSendSms">发短信</el-checkbox></div>
				<div>
			   <el-select v-if="smsForm.isSendSms" v-model="smsForm.smsTemplateCode" clearable placeholder="请选择短信">
				    <el-option v-for="item in smsList"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value">
				    </el-option>
			  	</el-select>
				</div>

			</div>
		</div>
		<span slot="footer" class="dialog-footer">
	  	<el-button @click="cancel">取 消</el-button>
	  	<el-button :disabled="isSubmit" type="primary" @click="addQuestion">提 交</el-button>
		</span>
		<tag-add 
			@success="addTagSuccess" 
			:knowId="knowId" 
			v-model="addTagDialog"
		 	v-if="addTagDialog"></tag-add>
	</el-dialog>
</template>

<script>
	import {validateRule} from '@/api/validate.js'
	import {queryTags,addSingleQuestion,recordFill,questionDetail,editSingleQuestion} from '@/api/brainkb.js'
	import {querySmsTemplet} from '@/api/resmanage.js'
	import TagAdd from './tag__add'
	import Player from '@/components/common/player/player'

	export default {
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','knowId','editKnowId','pauseKey'],
		data : function(){
			var validateQues = (rule, value, callback) => {
				const errorTip = ['请输入主问法'],
	       			  result = validateRule(value,['require']);
	       		if(result >= 0){
	       			callback(new Error(errorTip[result]));
	       		}else{
	       			callback();
	       		}
			}
			return {
				questionExtends : [{value:''}],
        answerArr:[],
				tagList : [],
				smsList:[],
				tagForm : {
					tagId : ''
				},
				smsForm:{
					smsTemplateCode:"",
					isSendSms:false
				},
				tagRules : {
					tagId : [ { required: true, message: '请选择分类',trigger: 'change' }]
				},
				questionForm : {
					question : ''
				},
				questionRules : {
					question : [{ validator: validateQues,trigger: 'blur' }]
				},
				answer : '',
				answer1 : '',
				answer2 : '',
				answer3 : '',
        answerId1 : '',
        answerId2 : '',
        answerId3 : '',
				addTagDialog : false,
				isSubmit : false,
				fileName1 : '',
				fileName2 : '',
				fileName3 : '',
				isLoading1 :true,
				isLoading2 :true,
				isLoading3 :true,
				audioUrl1 :'',
				audioUrl2 :'',
				audioUrl3 :'',
				audioDefultUrl1 : '',
				audioDefultUrl2 : '',
				audioDefultUrl3 : '',
				isUpload1 : true,
				isUpload2 : true,
				isUpload3 : true,
				isDel1 :false,
				isDel2:false,
				isDel3 :false,
				activeAnswer: 'first',
				interrupt : false
			}
		},
		methods : {
			initTagList : function(){
				queryTags({kbId : this.knowId}).then(resp => {
					let rows = this.$lodash.get(resp,'result.rows',[]),
						resultList = [];
					for(let row of rows){
						resultList.push({label : row.name,value : row.id});
					}
					this.tagList = resultList;
				});
			},
			addTagSuccess : function(id,name){
				this.tagList.push({label : name,value : id});
    			this.addTagDialog = false;
			},
			fileChange1 : function(event){
          const file = event.target.files[0];
          let orgFileName = file ? file.name : '',
              suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
          this.fileName1 = '';
          this.isLoading1 = false;
          this.isUpload1 = false;
          if(file == null){
          	this.isLoading1 = true;
            this.isUpload1 = true;
              return;
          }else if(["wav","vox"].indexOf(suffix) < 0){
          	this.isLoading1 = true;
            this.isUpload1 = true;
              this.$message.error("请选择正确的文件格式！")
              event.target.value = '';
              return;
          }else if(file.size / 1024 > 1024 * 2){
          	this.isLoading1 = true;
            this.isUpload1 = true;
          	this.$message.error("文件大小不能超过2MB！")
              event.target.value = '';
              return;
          }else{
          	var formData = new FormData();
          	formData.append("kbId", this.knowId);
              formData.append("answerId", this.answerId1);
          	formData.append("record", file);
              console.log(formData)
          	recordFill(formData).then(data =>{
                if(data.code == 0){
                	this.isLoading1 = true;
                	this.isDel1 = true;
                    this.audioDefultUrl1 = this.$lodash.get(data,'result.rows[0].path','');
                    this.audioUrl1 = this.$global.getStaticFileUrl(this.audioDefultUrl1);
                    this.$message.success('录音上传成功');
                }else{
                    this.$message.error('文件上传错误');
                    this.isLoading1 = true;
                	this.isUpload1 = true;
                }
                
            });
            event.target.value = '';
          }
          this.importError = '';
          this.fileName1 = orgFileName;
      },
			fileChange2 : function(event){
          const file = event.target.files[0];
          let orgFileName = file ? file.name : '',
              suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
          this.fileName2 = '';
          this.isLoading2 = false;
          this.isUpload2 = false;
          if(file == null){
          	this.isLoading2 = true;
            this.isUpload2 = true;
              return;
          }else if(["wav","vox"].indexOf(suffix) < 0){
          	this.isLoading2 = true;
            this.isUpload2 = true;
              this.$message.error("请选择正确的文件格式！")
              event.target.value = '';
              return;
          }else if(file.size / 1024 > 1024 * 2){
          	this.isLoading2 = true;
            this.isUpload2 = true;
          	this.$message.error("文件大小不能超过2MB！")
              event.target.value = '';
              return;
          }else{
          	var formData = new FormData();
          	formData.append("kbId", this.knowId);
              formData.append("answerId", this.answerId2);
          	formData.append("record", file);
          	recordFill(formData).then(data =>{
                if(data.code == 0){
                	this.isLoading2 = true;
                	this.isDel2 = true;
                    this.audioDefultUrl2 = this.$lodash.get(data,'result.rows[0].path','');
                    this.audioUrl2 = this.$global.getStaticFileUrl(this.audioDefultUrl2);
                    this.$message.success('录音上传成功');
                }else{
                    this.$message.error('文件上传错误');
                    this.isLoading2 = true;
                	this.isUpload2 = true;
                }
                
            });
            event.target.value = '';
          }
          this.importError = '';
          this.fileName2 = orgFileName;
      },
      fileChange3 : function(event){
          const file = event.target.files[0];
          let orgFileName = file ? file.name : '',
              suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
          this.fileName3 = '';
          this.isLoading3 = false;
          this.isUpload3 = false;
          if(file == null){
          	this.isLoading3 = true;
            this.isUpload3 = true;
              return;
          }else if(["wav","vox"].indexOf(suffix) < 0){
          	this.isLoading3 = true;
            this.isUpload3 = true;
              this.$message.error("请选择正确的文件格式！")
              event.target.value = '';
              return;
          }else if(file.size / 1024 > 1024 * 2){
          	this.isLoading3 = true;
            this.isUpload3 = true;
          	this.$message.error("文件大小不能超过2MB！")
              event.target.value = '';
              return;
          }else{
          	var formData = new FormData();
          	formData.append("kbId", this.knowId);
            formData.append("answerId", this.answerId3);
          	formData.append("record", file);

          	recordFill(formData).then(data =>{
                if(data.code == 0){
                	this.isLoading3 = true;
                	this.isDel3 = true;
                    this.audioDefultUrl3 = this.$lodash.get(data,'result.rows[0].path','');
                    this.audioUrl3 = this.$global.getStaticFileUrl(this.audioDefultUrl3);
                    this.$message.success('录音上传成功');
                }else{
                    this.$message.error('文件上传错误');
                    this.isLoading3 = true;
                	this.isUpload3 = true;
                }
                
            });
            event.target.value = '';
          }
          this.importError = '';
          this.fileName3 = orgFileName;
      },
      delAudio1 : function(){
      	this.audioUrl1 = '';
      	this.isUpload1 = true;
      	this.isDel1 = false;
      	this.isLoading1 = true;
      },
      delAudio2 : function(){
      	this.audioUrl2 = '';
      	this.isUpload2 = true;
      	this.isDel2 = false;
      	this.isLoading2 = true;
      },
      delAudio3 : function(){
      	this.audioUrl3 = '';
      	this.isUpload3 = true;
      	this.isDel3 = false;
      	this.isLoading3 = true;
      },
			//
			addQuestion : function(){
				var _this = this;
				this.$refs['questionForm'].validate((v1) => {
					this.$refs['tagForm'].validate((v2) => {
						if(!v1 || !v2){
							return false;
						}
						if((!_this.isLoading1)||(!_this.isLoading2)||(!_this.isLoading3)){
							_this.$message.warning("录音正在上传");
							return false;
						}
						let questArr = [],answerArr = [];
						for(let extQues of _this.questionExtends){
							questArr.push({question:extQues.value,id:extQues.id});
						}
						if(_this.audioUrl1){
								answerArr.push({
									content: _this.audioDefultUrl1,
	                description: _this.answer1,
	                name:'回答1',
	                rule:'',
	                id:_this.answerArr[0]&&_this.answerArr[0].id?_this.answerArr[0].id:"",
	                type:'audio'
							})
						}else{
							answerArr.push({
						    content: _this.answer1,
	              description: _this.answer1,
	              name:'回答1',
	              rule:'',
	              id:_this.answerArr[0]&&_this.answerArr[0].id?_this.answerArr[0].id:"",
	              type:'text'
							});
						}
						if(_this.audioUrl2){
							answerArr.push({
								content: _this.audioDefultUrl2,
                description: _this.answer2,
                name:'回答2',
                rule:'',
                id:_this.answerArr[1]&&_this.answerArr[1].id?_this.answerArr[1].id:"",
                type:'audio'
							})
						}else{
							answerArr.push({
						    content: _this.answer2,
                description: _this.answer2,
                name:'回答2',
                rule:'',
                id:_this.answerArr[1]&&_this.answerArr[1].id?_this.answerArr[1].id:"",
                type:'text'
							});
						}
						if(_this.audioUrl3){
							answerArr.push({
								content: _this.audioDefultUrl3,
                description: _this.answer3,
                name:'回答3',
                rule:'',
                id:_this.answerArr[2]&&_this.answerArr[2].id?_this.answerArr[2].id:"",
                type:'audio'
							})
						}else{
							answerArr.push({
						    content: _this.answer3,
	              description: _this.answer3,
	              name:'回答3',
	              rule:'',
	              id:_this.answerArr[2]&&_this.answerArr[2].id?_this.answerArr[2].id:"",
	              type:'text'
							});
						}
						let param = {
							kbId : _this.knowId,
							question : _this.questionForm.question,
              questionExtends : questArr,
							answers : answerArr,
              tagId : _this.tagForm.tagId,
              interrupt : this.interrupt ? 1 : 0
						};

						//判断是否选择了短信
						if (!!_this.smsForm.isSendSms) {
							if (!_this.smsForm.smsTemplateCode) {
								_this.$message.error("请选择短信");
								return;
							}
							param.isSendSms=1;
							param.smsTemplateCode=_this.smsForm.smsTemplateCode;
						}else{
							param.isSendSms=0;
							param.smsTemplateCode="";
						}

						if(_this.editKnowId){
							param["id"] = _this.editKnowId;
							editSingleQuestion(param).then(resp =>{
								if(resp.code == 0){
									_this.$message({message: '编辑成功',type: 'success' });
									_this.$emit('success');
									_this.$emit('change',false);
								}else{
									_this.$message.error(resp.message || '编辑失败');
								}
							})
						}else{
							addSingleQuestion(param).then(resp => {
								if(resp.code == 0){
									_this.$message({message: '保存成功',type: 'success' });
									_this.$emit('success');
									_this.$emit('change',false);
								}else{
									_this.$message.error(resp.message || '保存失败');
								}
							})
						}
					});
				});
				
			},
			addExtend : function(){
				if(this.questionExtends.length >= 30){
					this.$message({ message: '最多增加添加30个相似问法', type: 'warning' });
	        return;
				}
				this.questionExtends.push({value : ''});
			},
			delExtend : function(index){
				this.questionExtends.splice(index,1);
			},
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			}
		},	
		mounted : function(){
			var _this = this;
			_this.initTagList();
			if(!this.editKnowId){
				return
			}
			questionDetail({id:this.editKnowId}).then(data =>{
				console.log(data);
				if(data.code == 0){
					var dataArr = _this.$lodash.get(data,'result.rows[0]','');
					this.interrupt = dataArr.interrupt == 1 ? true : false;

					_this.questionForm.question = dataArr.name
					if(dataArr.questionExtends && dataArr.questionExtends.length>0){
            let questionExtends = dataArr.questionExtends;
            let questionArr = [];
            for(let i = 0;i<questionExtends.length;i++){
              if(questionExtends[i].question){
                questionArr.push({value:questionExtends[i].question,id:questionExtends[i].id})
              }else{
                questionArr.push({value:'',id:''})
              }
            }
            _this.questionExtends = questionArr;
          }
          _this.tagForm.tagId= dataArr.tagId;
          if(dataArr.answers && dataArr.answers.length>0){
            let answer = dataArr.answers,answerArr = [];
            _this.answerArr=answer
            for(let j = 0;j<answer.length;j++){
            	var k = j+1
              _this['answerId'+k] = answer[j].id || '';
             	_this['answer'+k] = answer[j].description || '';
							if(answer[j].content && answer[j].content.toLowerCase().indexOf("wav")>0){
								_this['audioUrl'+k] = this.$global.getStaticFileUrl(answer[j].content);
								_this['audioDefultUrl'+k] = answer[j].content;
	              _this['isUpload'+k] = false;
	              _this['isDel'+k] = true;
							}
	       		}
          }
          //加载短信编码
          _this.smsForm.smsTemplateCode=dataArr.smsTemplateCode;
          _this.smsForm.isSendSms=!!dataArr.isSendSms?true:false;
				}
			});

			querySmsTemplet({
				pageIndex : 1,
				pageSize : 999,
				rowStatus:1,
				delStatus : 1
			}).then(resp => {
				this.smsList = this.$lodash.get(resp,'result.rows',[]).map((item)=>{
					return {
						value:item.name,
						label:item.simpleDesc
					}
				});
			});
		},
		components : {
			'tag-add' : TagAdd,Player
		},
		computed : {
      title : function(){
				return this.editKnowId ? '编辑问题' : '添加问题';
			},
    }
	}
</script>

<style lang="less">
	@import (reference) "../../../assets/less/var.less";

	.question__add{
		display:flex;
		justify-content:space-between;
		.lbl{
			margin-bottom:20px;
		}
		.lbl2{
			margin-bottom:10px;
		}
		.question__left{
			width:385px;
			.question__near{
				overflow-y: auto;
    			height: 259px;
				.input-txt{
					margin:5px 0;
					.el-icon-delete{
						color:@base-color;
						cursor:pointer;
					}
				}
			}
		}
		.question__right{
			width:443px;
			position:relative;
			.textareaDiv{
				height: 220px;
    			margin-bottom: 10px;
    			border: 1px solid #dcdfe6;
    			border-radius: 5px;
    			position: relative;
				.el-icon-loading{
					position: absolute;
    				right: 18px;
    				bottom: 5px;
				}
				.delAudio{
					position: absolute;
    				right: 10px;
    				bottom: -8px;
				}
			}
			.input-area{
				height: 186px;

				.el-textarea__inner{
					height:100%;
					border:none
				}
			}
			.question__interrupt{
	      position: absolute;
	      right: 3px;
	      top: 10px;
	      z-index:1;
	    }
		}
		.up__speech{color:#00b792;float: right;margin-right: 10px;cursor:pointer;}
		.player-box{
            width:30px;
            height:30px;
            display:flex;
            align-items:center;
            justify-content:center;
            position: absolute;
    		right: 45px;
    		bottom: -3px;
        }
        .player-btn{
            width:20px;
            height:20px;
        }
	}
</style>