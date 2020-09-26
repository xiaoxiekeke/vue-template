<template>
  <div class="page line">
    <div class="content" v-loading="tableLoading">
      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane label="线路对接申请" name="ownlines">
            <p class="notetip"></p>
            <!-- 如需申请线路，请联系电话0551-88888888 -->
            <el-button type="primary" @click="showDialogAddForm('add')" class="addOwnlines">添加线路申请</el-button>
            <el-table  :data="tableDataOwnlines" :border="true"
                stripe  
                style="width: 100%">
                <!-- @sort-change="sortChangeWaitting" -->
                <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                      prop="ip"
                      label="IP"
                      width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="port"
                    label="PORT">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="caller"
                    label="主叫">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="called"
                    label="被叫">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="concurrents"
                    label="并发数">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="appType"
                    label="线路方向">
                    <template slot-scope="scope">
                        {{ scope.row.appType==0?"呼出":""}}
                        {{ scope.row.appType==1?"呼入":""}}
                    </template>
                </el-table-column> 
                <el-table-column
                    align="center"
                    prop="gateway"
                    label="对接网关">
                    <template slot-scope="scope">
                        <!-- {{scope.row.gateway}} -->
                        {{getGatewayNameById(scope.row.gateway)}}
                    </template>
                </el-table-column> 
                <el-table-column
                    align="center"
                    prop="jointStatus"
                    label="对接状态">
                    <template slot-scope="scope">
                        {{ scope.row.jointStatus==1?"对接成功":""}}
                        {{ scope.row.jointStatus==2?"对接失败":""}}
                    </template>
                </el-table-column>          
                <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                    prop="createTime"
                    label="提交时间">
                    <template slot-scope="scope">
                        {{ formateTime(scope.row.createTime )}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="id"
                    fixed="right"
                    width="100"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showDialogEditForm('edit',scope.row)" size="small">
                          编辑
                        </el-button>
                        <el-button type="text" @click="delMemberDialog(scope.row.id)" size="small">
                          删除
                        </el-button>
                     </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="ownlines.total > 0" class="pagination" background
                prev-text="上一页"
                next-text="下一页"
                @size-change="handleOwnlineSizeChange"
                @current-change="handleOwnlineCurrentChange"
                :current-page="ownlines.pageIndex"
                :page-sizes="[10,15]"
                :page-size="ownlines.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="ownlines.total">
            </el-pagination>

        </el-tab-pane>

        <el-tab-pane label="接入网关" name="gateway">
            <p class="notetip"></p>
            <el-table :data="tableDataGateWay" :border="true"
                stripe  
                style="width: 100%">
                <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                    prop="operator"
                    label="运营商">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="area"
                    width="120"
                    label="区域">
                </el-table-column>          
                <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                    prop="ip"
                    label="IP">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="port"
                    width="120"
                    label="PORT">
                </el-table-column>
            </el-table>

        </el-tab-pane>

      </el-tabs>
      
    </div>
    <el-dialog :title="dialogType=='add'? '添加线路申请':'编辑线路申请'" width="500px" :append-to-body="true" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="lineForm">
        <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip">
          <el-input v-model.trim="form.ip" placeholder="请输入IP地址" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="PORT" :label-width="formLabelWidth" prop="port">
          <el-input v-model.trim="form.port" placeholder="请输入端口号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="主叫" :label-width="formLabelWidth" prop="caller">
          <el-input v-model.trim="form.caller" placeholder="请输入主叫" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="被叫" :label-width="formLabelWidth" prop="called">
          <el-input v-model.trim="form.called" placeholder="请输入被叫" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="并发" :label-width="formLabelWidth" prop="concurrents">
          <el-input v-model.trim="form.concurrents" disabled placeholder="请输入并发数" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路方向" :label-width="formLabelWidth" prop="appType">
          <el-select v-model="form.appType" placeholder="请选择线路方向">
            <el-option label="呼入" :value="1"></el-option>
            <el-option label="呼出" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对接网关" :label-width="formLabelWidth" prop="gateway">
          <el-select v-model="form.gateway" placeholder="请选择对接网关" >
            <el-option v-for="item in tableDataGateWay" :label="item.operator" :value="item.id" :key="item.id"></el-option>
            <!-- <el-option label="网关2" value="2"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="对接状态" :label-width="formLabelWidth" prop="jointStatus">
          <el-select v-model="form.jointStatus" placeholder="请选择对接状态">
            <el-option label="对接成功" :value="1"></el-option>
            <el-option label="对接失败" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOwnlines">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {queryKnowList,queryReviewList} from '@/api/brainkb.js'
import {saveLine,selectLine,updateLine,deleteLine,queryGateways} from '@/api/openapi-admin.js'

export default {
  name: 'openapi_line',
  data : function () {
    return {
      name : '',
      expCname : '',
      activeName:'GateWay',
      tableLoading : false,
      tableDataOwnlines : [],
      ownlines : {
        total : 0,
        pageIndex : 1,
        pageSize : 10
      },
      sortWaitting : {
        field : 'commitTime',
        order : 'asc'
      },
      form: {
          ip: '',
          port: '',
          caller:'',
          called:'',
          concurrents:1,
          appType:'',
          gateway:'',
          jointStatus:''
      },
      rules : {
        ip : [{ required: true, message: '请输入IP', trigger: 'blur' }],
        port : [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        caller:[{ required: true, message: '请输入主叫', trigger: 'blur' }],
        called:[{ required: true, message: '请输入被叫', trigger: 'blur' }],
        concurrents:[{ required: true, message: '请输入并发数', trigger: 'blur' }],
        appType:[{ required: true, message: '请选择线路方向', trigger: 'change' }],
        gateway:[{ required: true, message: '请选择对接网关', trigger: 'change' }],
        jointStatus:[{ required: true, message: '请选择对接状态', trigger: 'change' }]
      },
      tableDataGateWay: [],
      dialogFormVisible:false,
      dialogType:"",
      formLabelWidth: '80px'
    }
  },
  watch:{
    activeName:function(newdata,olddata){
      if(newdata=="ownlines"){
        this.loadOwnLines()
      }
      if(newdata=="gateway"){
      }
    }
  },
  methods : {
    
    formateTime(value){

        if(value === null){
            return ''
        }else{
            return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    formatDics(dics){
      if(!dics || dics.length == 0){
        return '未关联';
      }
      return '已关联';
    },
    getGatewayNameById(id){
      if(id === null){
          return ''
      }else{
          if(this.tableDataGateWay){
            for(var i=0;i<this.tableDataGateWay.length;i++){
                if(this.tableDataGateWay[i].id==id){
                    return this.tableDataGateWay[i].operator
                }
            }  
          }else{
            return ''
          }
      } 
    },
    //event
    // sortChangeWaitting:function(column) {
    //   let field = column.prop,
    //     order = column.order === 'ascending' ? 'asc' : 'desc';
    //   if (field !== this.sortWaitting.field || this.sortWaitting.order !== order) {
    //     this.sortWaitting.field = field;
    //     this.sortWaitting.order = order;
    //     this.loadOwnLines()
    //   }
    // },
    handleOwnlineCurrentChange : function(page){
      this.ownlines.pageIndex = page;
      this.loadOwnLines();
    },
    handleOwnlineSizeChange : function(size){
      this.ownlines.pageSize = size;
      this.loadOwnLines();
    },
    loadOwnLines : function(){
        let _this = this;
        let param = {
            pageIndex : this.ownlines.pageIndex,
            pageSize : this.ownlines.pageSize
        };
        
        _this.tableLoading = true;
        selectLine({...param}).then(function(resp){
            _this.tableDataOwnlines = _this.$lodash.get(resp,'result.rows',[]);
            _this.tableLoading = false;
            _this.ownlines.total=resp.result.totalCount;
        })
    },
    loadGatewayList:function(){
        let _this = this;
        _this.tableLoading = true;
        queryGateways({}).then(function(resp){
            if (resp.code==0) {
                _this.tableDataGateWay = _this.$lodash.get(resp,'result.rows',[]);
            };
            
            _this.tableLoading = false;
        })
    },
    showDialogAddForm:function(dialogType){
        this.form={
            ip: '',
            port: '',
            caller:'',
            called:'',
            concurrents:'',
            appType:'',
            gateway:'',
            jointStatus:''
        }
        this.form.concurrents=1
        this.dialogFormVisible=true
        this.dialogType=dialogType
    },
    showDialogEditForm:function(dialogType,row){
        // this.form={
        //     id: row.id,
        //     ip: row.ip,
        //     port: row.port,
        //     caller:row.caller,
        //     called:row.called,
        //     concurrents:row.concurrents,
        //     appType:Number(row.appType),
        //     gateway:row.gateway,
        //     jointStatus:row.jointStatus
        // }
        this.form={
          ...row
        }
        this.form.gateway=Number(row.gateway)
        this.form.concurrents=1
        this.dialogFormVisible=true
        this.dialogType=dialogType
    },
    addOwnlines:function(){
        let _this = this;
        // if(this.form.ip===""){
        //   this.$message.error('请填入Ip');
        //   return
        // }
        // if(this.form.port===""){
        //   this.$message.error('请填入端口号');
        //   return
        // }
        // if(this.form.appType===""){
        //   this.$message.error('请选择线路方向');
        //   return
        // }
        // if(this.form.gateway===""){
        //   this.$message.error('请选择对接网关');
        //   return
        // }
        // if(this.form.jointStatus===""){
        //   this.$message.error('请选择对接状态');
        //   return
        // }
        this.$refs.lineForm.validate((valid) => {
          if(!valid){
            return false;
          }
          if (this.dialogType=='add') {
              saveLine({...this.form}).then(function(resp){
                if (resp.code==0) {
                  _this.loadOwnLines()
                }else{
                  this.$message.error('新增失败');
                }
                _this.dialogFormVisible=false
              })    
          }else if(this.dialogType='edit'){
              updateLine({...this.form}).then(function(resp){
                if (resp.code==0) {
                  _this.loadOwnLines()
                }else{
                  this.$message.error('修改失败');
                }
                _this.dialogFormVisible=false
              })  
          }
        })
        
        
    },
    delMemberDialog:function(id){
      const h = this.$createElement;
      var _this=this
      this.$prompt(h('div',null,[
          h('p', null, '将删除此自有线路，且不可恢复。确认删除吗？'),
          h('p', null, '确认删除请输入"yes"（不含引号）'), 
        ]),'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^yes$/,
        inputValue:'yes',
        inputErrorMessage: '输入不正确'
      }).then(({ value }) => {
        // this.delMember(id)
        deleteLine({id:id}).then(function(resp){
            if (resp.code==0) {
                _this.loadOwnLines()    
            }else{
                _this.$message.error('删除失败');
            }
        })
      }).catch(() => {
    
      });

    },
    handleClick:function(){

    },


    experience : function(cname){
      this.expCname = cname;
    }
  },
  beforeRouteEnter : function(to, from, next){
    next(vm => {
      vm.loadGatewayList()
      vm.loadOwnLines()
      vm.activeName=vm.$route.params.activeName

    });
  },
  mounted:function(){

  },
  components : {
  },
}
  
</script>

<style lang="less" scoped>
  .line{
    .search{
        .input-txt{
            width:250px;
        }
    }
    .content{
        margin-top:20px;
    }
    .notetip{
        color:#909399;
    }
    .addOwnlines{
      position: relative;
      bottom: 10px;
      float:right;
    }
  }
  .el-input{
    width:350px;
  }
  .el-select{
    width:350px;
  }
</style>