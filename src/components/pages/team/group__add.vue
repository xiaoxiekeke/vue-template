<style scoped>
  .hight-icon{
    padding-left:10px;
  }
  .hight-icon-btn{
    padding: 0;
    margin-bottom: 18px;
  }
  .select-txt {
    width: 100%;
  }
</style>

<template>
  <el-dialog
    :title="id ? '编辑分组' : '创建分组'"
    :visible.sync="show"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="close"
    width="500px">
    <el-form 
      v-loading="loading" 
      ref="groupForm" 
      label-width="100px" 
      size="small"
      :model="formData"
      :rules="rules">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model.trim="formData.name"  type="text"  placeholder="请输入分组名称"></el-input>
      </el-form-item>
      <el-form-item label="转坐席策略" prop="strategy">
        <el-select 
          class="select-txt"
          v-model="formData.strategy" 
          filterable
          clearable 
          placeholder="请选择转坐席策略">
          <el-option
            v-for="item in strategyList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="flex-center-center">
        <el-button 
          @click="toggleHight"
          type="text" 
          class="hight-icon-btn">高级
          <i class="hight-icon" :class="isHight ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></el-button>
      </div>
      <el-form-item v-show="isHight" label="知识库">
        <el-select 
          class="select-txt"
          v-model="know" 
          filterable
          clearable 
          placeholder="请选择知识点">
          <el-option
            v-for="item in knowList"
            :key="item.id"
            :label="item.cname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="isHight" label="常用语">
        <el-select 
          class="select-txt"
          v-model="silence" 
          filterable
          clearable 
          placeholder="请选择知识点">
          <el-option
            v-for="item in knowList"
            :key="item.id"
            :label="item.cname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="isHight" label="质检">
        <el-select 
          class="select-txt"
          v-model="model" 
          filterable
          clearable 
          placeholder="请选择质检规则">
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click.stop="close">取 消</el-button>
      <el-button size="small" :disabled="isSubmit" @click.stop="saveGroup" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {validateRule} from '@/api/validate.js'
  import {mapState, mapActions} from 'vuex'
  import {acdQuery,acdCreate,acdUpdate,acdDelete } from '@/api/kxjl-ac.js'
  import {queryModeList,querylistByBus} from '@/api/brainkb.js'

  export default {
    name : 'group-add',
    model : {
      prop : 'show',
      event : 'change'
    },
    props : ['show','id'],
    data : function () {
      return {
        loading : false,
        formData : {
          name : '',
          strategy: '',
          arConfig : '',
          maxTries : 30
        },
        rules : {
          name: [
            { required:true, message: '请输入分组名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          strategy: [
            {required: true, message: '请选择转坐席策略',trigger: 'blur' }
          ]
        },
        isSubmit : false,
        data: [],
        strategyList:[{
          name:"最近联系人",
          code:"recent-contacts"
        },{
          name:"最长空闲",
          code:"longest-idle-agent"
        },{
          name:"分机轮选",
          code:"dn-round-robin"
        },{
          name:"工号轮选",
          code:"code-round-robin"
        },{
          name:"随机",
          code:"random"
        }],
        isHight : false,
        modelList : [],
        model: '',
        knowList: [],
        know: '',
        silence: ''
      }
    },
    computed : {
      ...mapState('user',[
        'business'
      ]),
    },
    methods : {
      //events
      close (){
        this.isSubmit = false;
        this.$emit('change',false);
      },
      toggleHight (){
        this.isHight = !this.isHight;
      },
      saveGroup : function(){
        this.$refs.groupForm.validate((valid) => {
          if(!valid){
            return false;
          }
          let fn = acdCreate;
          let param = {
            businessId: this.business.id,
            ...this.formData
          }
          if(!!this.id){
            fn = acdUpdate;
            param.id = this.id;
          }
          param.arConfig = JSON.stringify({ model : this.model,know : this.know,silence:this.silence });
          fn.call(this,param).then(resp => {
            if (resp.code == 0) {
              this.$message({type : 'success',message : '保存成功'});
              this.$emit('success',this.formData.name);
              this.$emit('change',false);
            }else{
              this.$message.error(resp.messageExt || '保存失败');
            }
          })
        })
      },
      initModelList (){
        queryModeList({
          pageIndex : 1,
          pageSize : 1000
        }).then(resp => {
          this.modelList = this.$lodash.get(resp,'result.rows',[]);
        })
      },
      initKnowList (){
        querylistByBus({
          pageIndex : 1,
          pageSize : 1000
        }).then(resp => {
          this.knowList = this.$lodash.get(resp,'result.rows',[]);
        })
      }
    },
    mounted : function(){
      this.initModelList();
      this.initKnowList();
      if(!this.id){
        return;
      }
      this.loading = true;
      acdQuery({ businessId: this.business.id, id: this.id }).then((res)=>{
        if (res.code == 0) {
          let obj = this.$lodash.get(res,'result.rows[0]'); 
          this.formData.name = obj.name;
          this.formData.strategy = obj.strategy;
          this.formData.maxTries = obj.maxTries || 30;
          if(obj.arConfig){
            let arConfigObj = JSON.parse(obj.arConfig)
            this.model = arConfigObj.model;
            this.know = arConfigObj.know;
            this.silence = arConfigObj.silence || '';
            this.isHight = this.model || this.know || this.silence;
          }
          this.loading = false;
        }
      })
      
    }
  }
</script>

