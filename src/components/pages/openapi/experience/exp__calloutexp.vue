<template>
  <el-dialog
          :visible.sync="show"
          :append-to-body="true"
          custom-class="push-form"
          :before-close="beforeClose"
          width="500px">

        <el-form v-loading="loading" ref="pushForm" class="create-form" label-width="100px" label-position="left"
          :model="formData" 
          :rules="rules">
          <el-form-item label="话术选择" prop="taskId">
            <el-select v-model="formData.taskId" @change="speechChange"
              clearable placeholder="请选择要体验的话术" class="form-item">
              <el-option v-for="item in speechList"
                :key="item.taskId"
                :label="item.name"
                :value="item.taskId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="formData.phone" id="phoneNum" class="form-item" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="checkIdentifyCode">
            <el-input v-model.trim="formData.checkIdentifyCode" class="form-item checkIdentifyCode" placeholder="请输入手机验证码"></el-input><el-button v-if="!smsLoading" @click.stop="getSmsCode" class="smsbtn" type="primary">获取</el-button>
            <el-button v-else type="info" class="smsbtn"  plain disabled>{{times}}后重试</el-button>
          </el-form-item>
        </el-form>
        <span slot="title" class="dialog-title">开始体验
          <el-tooltip class="item" effect="dark" placement="bottom-start">
            <div slot="content">
              选择话术，输入验证码后，该体验手机号码可接收到来着机器人的外呼。
            </div>
            <i class="el-icon-question icon-tip"></i>
        </el-tooltip>
        </span>
     <span slot="footer" class="dialog-footer">
        <el-button @click.stop="cancel">取 消</el-button>
        <el-button :disabled="isSubmit" @click.stop="startCallOut" type="primary">提交</el-button>
    </span>
    </el-dialog>
</template>

<script>
  import {validateRule} from '@/api/validate.js'

  import {sendIdentifyCode,checkIdentifyCode} from '@/api/yungo-abp.js'
  import {queryExpTasks} from '@/api/jsondata.js'
  import {addLongTermTaskData} from '@/api/outbound-manage.js'

  export default {
    name : 'push-add',
    model : {
      prop : 'show',
      event : 'change'
    },
    props : ['show','phone'],
    data : function () {
      return {
        loading : true,
        speechList : [],
        formData : {
          taskId : '',
          phone:this.phone,
          checkIdentifyCode:''
        },
        businessId : '',
        rules : {
          taskId : [{ required: true, message: '请选择关联话术', trigger: 'blur' }],
          phone : [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
          checkIdentifyCode : [{ required: true, message: '请输入手机验证码', trigger: 'blur' }]
        },
        createLoading : false,
        times : 60,
        smsLoading : false,
        errorTxt:''
      }
    },
    methods : {
      //events
      speechChange : function(val){
          let bId = '';
          for(let t of this.speechList){
              if(t.taskId == val){
                 bId = t.businessId;
                 break;
              }
          }
          this.businessId = bId;
      },
      startCallOut : function(){
        this.$refs.pushForm.validate((valid) => {
          if(!valid){
            return false;
          }
          let param = {
              phone : this.formData.phone,
              checkIdentifyCode : this.formData.checkIdentifyCode,
          };
          this.isSubmit = true;
          checkIdentifyCode(param).then(resp =>{
            if(resp.code == 0){
                addLongTermTaskData({
                  taskId:this.formData.taskId,
                  taskData:[{"客户手机号码":this.formData.phone}],
                  phoneNumberKey:'客户手机号码'
                },this.businessId).then(resp => {
                  if(resp.code == 0){
                     this.$message('电话正在呼叫，请稍等！');
                  }else{
                      this.$message.error('呼叫失败');
                  }
                  this.isSubmit = false;
                  this.$emit('change',false);
                });
            }else{
                this.isSubmit = false;
                this.$message.error(resp.messageExt || '验证失败');
            }
          })
        });
      },
      beforeClose : function(){
        this.isSubmit = false;
        this.$emit('change',false);
      },
      cancel : function(){
        this.isSubmit = false;
        this.$emit('change',false);
      },
      beginTimeDown : function(){
        var _this = this;
        clearTimeout(_this.countTimer);
        _this.times--;
        if(_this.times <=0 ){
          _this.times = 60;
          _this.smsLoading = false;
          return;
        }
        _this.countTimer = setTimeout(function(){_this.beginTimeDown();},1000);
      },
      resetSms : function(){
        this.smsLoading = false;
        clearTimeout(this.countTimer);
        this.times = 60;
      },
      validatePhoneNum : function(){
        if(!this.formData.phone){
            this.$message.error("手机号码格式不正确");
            return
        }
        if(!/^1\d{10}$/.test(this.formData.phone)){
          document.getElementById('phoneNum').focus();
          this.$message.error("手机号码格式不正确");
          return false;
        }
        return true;
      },
      getSmsCode : function(){
        var _this = this;
        if(!_this.validatePhoneNum()){
          return;
        }
        _this.beginTimeDown();
        let param = {
          phone : _this.formData.phone,
          sendTempleteId:'KXJL_TMP_003',
          identifyCodeParamName:'code'
        };
        sendIdentifyCode(param,0).then(function(data){
          if(!data || data.code != 0){
            _this.$message.error("发送失败");
            _this.resetSms();
            return;
          }
          _this.errorTxt = '';
        });
        _this.smsLoading = true;
      }
    },
    mounted : function(){
      queryExpTasks().then((data) =>{
        this.speechList = this.$lodash.get(data,'rows',[]);
        this.loading = false;
      });
    }
  }
</script>

<style lang="less">
  .push-form{
    .form-item{
      width:100%;
    }
    .checkIdentifyCode{
      width:250px;
    }
    .smsbtn{
      float:right;
    }
  }
</style>