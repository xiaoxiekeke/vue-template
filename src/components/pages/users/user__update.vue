<template>
  <el-dialog
      title="编辑团队成员"
      :visible.sync="show"
      :append-to-body="true"
      :before-close="beforeClose"
      width="530px">
    <el-form ref="usersform" :model="formData" :rules="rules" label-width="120px" label-position="left"
     class="create-form">
      <el-form-item label="姓名" prop="surname">
        <el-input v-model.trim="formData.surname" class="form-content" placeholder="请输入姓名" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
   
   <span slot="footer" class="dialog-footer">
      <el-button @click.stop="cancel">取 消</el-button>
      <el-button v-if="!updateLoading" type="primary" @click="updateUser">确定</el-button>
      <el-button v-else :loading="updateLoading" type="primary" disabled >提交中</el-button>
  </span>
</el-dialog>
</template>

<script>
  import {validateRule} from '@/api/validate.js'
  import {mapState,mapActions} from 'vuex'
  import {updateMember} from '@/api/uc.js'
  export default {
    name : 'user-update',
    model : {
      prop : 'show',
      event : 'change'
    },
    props : ['show','row'],
    data : function () {
        var validateName = (rule, value, callback) => {
            const errorTip = ['请输入姓名','姓名格式不正确','姓名长度不可超过20个字符'],
                result = validateRule(value,['require','name','namelength']);
            if(result >= 0){
              callback(new Error(errorTip[result]));
            }else{
              callback();
            }
        }

      return {
        formData : {
          surname : '',
          id:''
        },
        rules : {
          surname : [{ validator: validateName, trigger: 'blur' }],
        },
        updateLoading : false
      }
    },
    mounted(){
        this.formData.surname=this.row.surname
        this.formData.id=this.row.id
    },
    computed : {
        ...mapState('user',[
            'id',
            'business'
        ])
    },
    methods : {
      ...mapActions('user',[
          'modifySurName'
      ]),
      //events
      beforeClose : function(){
        this.$emit('change',false);
        this.updateLoading = false;
      },
      cancel : function(){
        this.$emit('change',false);
        this.updateLoading = false;
      },
      updateUser:function(){
        let _this = this;
        _this.updateLoading = true;
        this.$refs.usersform.validate((valid) => {
          if(!valid){
            _this.updateLoading = false;
            return false;
          }
          let param = {
            ..._this.formData,
            businessId:this.business.id
          };
          updateMember(param).then(function(data){
            if(data.code == 0){
              if(_this.formData.id == _this.id){
                  _this.modifySurName(_this.formData.surname);
              }
              _this.$emit("loadList")
            }else{
              if (data.messageExt) {
                _this.$message.error('编辑失败，错误信息：'+data.messageExt); 
              }else{
                _this.$message.error('编辑失败'); 
              }
              
            }
            _this.updateLoading = false;
          })
        });
        
      }
    }
  }
</script>