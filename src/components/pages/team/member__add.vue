<template>
  <el-dialog
    :title="userId ? '编辑成员' : '添加成员'"
    :visible.sync="show"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    width="500px">
    <el-form 
      v-loading="loading" 
      size="small"
      ref="groupForm" 
      label-width="80px" 
      :model="formData"
      :rules="rules">
      <el-form-item label="角色" prop="ifMonitor">
        <el-select 
          class="select-txt-90"
          v-model="formData.ifMonitor"   
          clearable 
          placeholder="请选择">
          <el-option
            v-for="item in ifMonitorList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        <el-tooltip placement="right" effect="light">
          <div slot="content">
            <div class="tooltip-content">
              <p><span>操作员：</span>可在平台建立话术，创建外呼任务</p>
              <p><span>人工坐席：</span>可在平台建立话术，创建外呼任务实时监控人机交互，并可实时接管，同时可外呼客户和接收机器人转人工的通话</p>
              <p><span>坐席班长：</span>拥有操作员和人工坐席的所有权限同时可监控人工坐席和客户的交互</p>  
            </div>
          </div>
          <el-button class="tooltip-btn"><i class="el-icon-question"></i></el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="姓名" prop="surname">
        <el-input v-model.trim="formData.surname"  type="text"  placeholder="请输入成员名称"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="formData.phone" :disabled="!!userId"  type="text"  placeholder="请输入手机号"></el-input>
        <div class="phone-tip">该成员的初始密码为手机号的后6位</div>
      </el-form-item>
      <el-form-item label="工号" v-if="!!Number(formData.ifMonitor)" prop="code">
        <el-input maxlength="8" v-model.trim="formData.code"  type="text"  placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="所属分组" v-if="!!Number(formData.ifMonitor)" prop="acdModels">
        <el-select 
          class="select-txt "
          v-model="formData.acdModels" multiple  placeholder="请选择">
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="呼叫方式" v-if="!!Number(formData.ifMonitor)">
        <el-select 
          class="select-txt"
          v-model="formData.dnConnectType" 
          placeholder="请选择">
          <el-option label="按需呼叫" value="bridge"></el-option>
          <el-option label="预先呼通" value="uuid_bridge"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click.stop="cancel">取 消</el-button>
      <el-button 
        size="small"
        :disabled="isSubmit" 
        @click.stop="saveGroup" 
        type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  
  import {validateRule} from '@/api/validate.js'
  import {mapState, mapActions} from 'vuex'
  import { acdQuery,acdCreate,acdUpdate,acdDelete,queryByAgentId,agentCreate,agentUpdate } from '@/api/kxjl-ac.js'
  export default {
    name : 'group-add',
    model : {
      prop : 'show',
      event : 'change'
    },
    props : ['show','userId','agentId'],
    data : function () {
      var validatePhone = (rule, value, callback) => {
          const errorTip = ['请输入姓名手机号','手机号格式不正确'],
              result = validateRule(value,['require','phone']);
          if(result >= 0){
            callback(new Error(errorTip[result]));
          }else{
            callback();
          }
      }
      var validateNumber = (rule, value, callback) => {
        if(!value){
          callback()
          return;
        }
        const errorTip = ['工号只能为数字'],
            result = validateRule(value,['number']);
        if(result >= 0){
          callback(new Error(errorTip[result]));
        }else{
          callback();
        }
      }
      return {
        loading : true,
        formData : {
          ifMonitor: '',
          surname: '',
          phone: '',
          code: '',
          acdModels: [],
          dnConnectType: ''
        },
        rules : {
          ifMonitor:[{required:true,message: '请选择角色',trigger: 'blur' }],
          surname:[{required:true,message: '请输入成员名称',trigger: 'blur' },{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
          phone:[{required:true,message: '请输入手机号',trigger: 'blur' },
                {validator:validatePhone,trigger: "blur" }],
          code : [{validator:validateNumber,trigger: "blur" }],
          acdModels:[{required:true,message: '请选择分组',trigger: 'blur' }]
        },
        isSubmit : false,
        data: [],
        ifMonitorList:[{
          name:"操作员",
          code:"0"
        },{
          name:"人工坐席",
          code:"1"
        },{
          name:"坐席班长",
          code:"2"
        }],
        groupList:[]
      }
    },
    computed : {
      ...mapState('user',[
        'business'
      ]),
      totalAgentOfBusiness:function(){
        var totalAgentOfBusiness=this.$lodash.get(JSON.parse(sessionStorage.__p),'__agent.count');
        if(totalAgentOfBusiness){
          return totalAgentOfBusiness
        }else{
          return 0
        }
      }
    },
    methods : {
      //events
      beforeClose : function(){
        this.isSubmit = false;
        this.$emit('change',false);
      },
      cancel : function(){
        this.isSubmit = false;
        this.$emit('change',false);
      },
      saveGroup : function(){
        this.$refs.groupForm.validate((valid) => {
          if(!valid){
            return false;
          }
          var acdModels=[]
          for(var i=0;i<this.formData.acdModels.length;i++){
            acdModels.push({id:this.formData.acdModels[i]})
          }
          if (this.formData.ifMonitor==0) {
            acdModels=[]
            this.formData.code=''
          }
          if(!!this.userId){
            agentUpdate({
              agentModel: {
                id: this.agentId,
                businessId: this.business.id,
                code: this.formData.code,
                ifMonitor: this.formData.ifMonitor,
                dnConnectType: this.formData.dnConnectType,
                totalAgentOfBusiness:this.totalAgentOfBusiness
              },
              ucUserDto: {
                id: this.userId,
                businessId: this.business.id,
                surname: this.formData.surname,
                phone: this.formData.phone
              },
              acdModels: acdModels
            }).then((resp)=>{
              if (resp.code==0) {
                this.$message({type : 'success',message : '编辑成功'});
                this.$emit('success',this.formData.name);
                this.$emit('change',false);
              }else{
                this.$message.error(resp.messageExt || '编辑失败');
              }
            })
          }else{
            agentCreate({
              agentModel: {
                businessId: this.business.id,
                code: this.formData.code,
                ifMonitor: this.formData.ifMonitor,
                dnConnectType: this.formData.dnConnectType,
                totalAgentOfBusiness:this.totalAgentOfBusiness
              },
              ucUserDto: {
                businessId: this.business.id,
                surname: this.formData.surname,
                phone: this.formData.phone
              },
              acdModels: acdModels
            }).then((resp)=>{
              if (resp.code==0) {
                this.$message({type : 'success',message : '保存成功'});
                this.$emit('success',this.formData.name);
                this.$emit('change',false);
              }else{
                this.$message.error(resp.messageExt || '保存失败');
              }
            })
          }
        })
      }
    },
    mounted : function(){
      acdQuery({
        businessId:this.business.id
      }).then((res)=>{
        if (res.code==0) {
          this.groupList=this.$lodash.get(res,'result.rows'); 
        }
      })
      if (!!this.userId) {
        queryByAgentId({
          "agentId": this.agentId,
          "businessId": this.business.id,
          "userId": this.userId
        }).then((res)=>{
          var obj=this.$lodash.get(res,'result.rows[0]');
          this.formData.ifMonitor=String(obj.agentModel.ifMonitor) 
          this.formData.surname=obj.ucUserDto.surname
          this.formData.phone=obj.ucUserDto.phone
          this.formData.code=obj.agentModel.code
          this.formData.dnConnectType = obj.agentModel.dnConnectType;
          var acdModels=[]
          for(var i=0;i<obj.acdModels.length;i++){
            acdModels.push(obj.acdModels[i].id)
          }
          this.formData.acdModels=acdModels
          this.loading = false;
        })
      }else{
        this.loading = false;
      }
      
    }
  }
</script>

<style scoped>
.form-item{
  width: 100px;
}
.select-txt {
  width: 100%;
}
.select-txt-90 {
  width: 90%;
}
.phone-tip{
  height: 20px;
  line-height: 20px;
  color: #999;
}

.tooltip-btn{
  border:none;
  font-size: 20px;
  background-color: none;
  padding: 0;
  position: relative;
  top:5px;
}
.tooltip-content{
  width: 300px;
}
.tooltip-content span{
  font-weight: bold;
}
</style>