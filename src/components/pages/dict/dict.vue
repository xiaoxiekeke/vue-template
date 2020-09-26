<template>
    <div id="module__keywords" class="page kw__container">
        <div class="kw__top">
            <el-button @click.stop="dialogVisible=true" class="btn-primary" type="primary">新建词库</el-button>
        </div>
        <div class="kw__list content" v-loading="tableLoading">
            <el-table :data="tableData" :border="true"
                style="width: 100%">
                <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                    prop="cname"
                    min-width="160"
                    label="词库名称">
                        <template slot-scope="scope">
                            <router-link slot="reference" class="link" :to="'/dictinfo/' + scope.row.id">{{scope.row.cname }}</router-link>
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    min-width="160"
                    prop="createTime"
                    label="创建时间">
                        <template slot-scope="scope">
                          {{ formateTime(scope.row.createTime )}}
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="address"
                    min-width="150"
                    fixed="right"
                    label="操作">
                     <template slot-scope="scope">
                        <div class="download-row">
                            <el-button size="small" type="text"
                                @click.stop="batchAdd(scope.row.id)">批量添加
                            </el-button>
                            <el-button size="small" type="text"
                                @click.stop="addDict(scope.row.id)">添加
                            </el-button>
                            <el-button v-if="scope.row.termNum != 0" size="small" type="text" @click.stop="exportDict(scope.row.id)">导出</el-button>
                            <el-button v-else size="small" type="text" disabled>导出</el-button>
                            <el-button size="small" type="text" @click.stop="delDict(scope.row.id)">删除</el-button>
                        </div>
                     </template> 
                </el-table-column>
              </el-table>
            <el-pagination v-if="page.total > 0" class="pagination" background
                    prev-text="上一页"
                    next-text="下一页"
                    @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="page.pageIndex"
                  :page-sizes="[10,15]"
                  :page-size="page.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="page.total">
            </el-pagination>
        </div>

        <el-dialog
          title="新建词典"
          :visible.sync="dialogVisible"
          :append-to-body="true"
          :close-on-click-modal="false"
          width="30%">
            <el-form ref="dictform" :model="formData" :rules="rules">
                <el-form-item label="" prop="cname">
                  <el-input @keyup.enter.native="submitDict" :autofocus="true" name="cname" v-model.trim="formData.cname" placeholder="请输入词库名称" maxlength="10"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="dialogVisible = false">取 消</el-button>
                <el-button class="speechtpl__usebtn" v-if="!isSubmit" type="primary" @click.stop="submitDict">确定</el-button>
                <el-button  class="speechtpl__usebtn" v-else type="primary" disabled >提交中...</el-button>
            </span>
        </el-dialog>
        <addsingle-dict v-if="dialogVisibleAdd" :dicId="dicId" @success="loadAllDict" v-model="dialogVisibleAdd"></addsingle-dict>
        <batch-dict v-if="dialogVisibleAddBatch" :dicId="dicId" @success="loadAllDict" v-model="dialogVisibleAddBatch"></batch-dict>
    </div>
</template>
<script>
    import {queryDicList,addDict,delDict,exportDic} from '@/api/brainkb.js'
    import fileDownload from 'js-file-download'
    import {mapActions} from 'vuex'
    import {validateRule} from '@/api/validate.js'
    import addsingleDict from './addsingle__dict'
    import batchDict from './batch__dict'
    export default {
        name : 'kw__container',
        data : function(){
            var validateName = (rule, value, callback) => {
                const errorTip = ['请输入词库名称','词库名称格式不正确'],
                      result = validateRule(this.formData.cname,['require','name']);
                if(result >= 0){
                    callback(new Error(errorTip[result]));
                }else{
                    callback();
                }
            }
            return {
                tableLoading : false,
                dialogVisible : false,
                dialogVisibleAdd : false,
                createLoading : false,
                dialogVisibleAddBatch : false,
                tableData : [],
                dicId : '',
                page : {
                    total : 0,
                    pageIndex : 1,
                    pageSize : 10
                },
                isSubmit : false,
                formData : {
                    cname : ''
                },
                rules : {
                    cname : [{ validator: validateName, trigger: 'blur' }]
                },
            }
        },
        methods : {
             ...mapActions('user',[
                'addDownTask'
            ]),
            handleCurrentChange : function(page){
                this.page.pageIndex = page;
                this.getTableData();
            },
            handleSizeChange : function(size){
                this.page.pageSize = size;
                this.getTableData();
            },
            getTableData : function(callbck){
                let param = {
                    pageSize: this.page.pageSize,
                    pageIndex: this.page.pageIndex
                };
                this.tableLoading = true;
                queryDicList(param).then((data) =>{
                    this.tableData = this.$lodash.get(data,'result.rows',[]);
                    this.page.total = this.$lodash.get(data,'result.totalRows',0);
                    this.tableLoading = false;
                });
            },
            formateTime(value){
                if(value === null){
                    return ''
                }else{
                    return this.$moment(value).format("YYYY-MM-DD HH:mm:ss")
                }
            },
            //新建词库提交
            submitDict : function(){
                var _that = this;
                this.$refs.dictform.validate( (valid) => {
                    if(!valid){
                        return false;
                    }
                    this.isSubmit = true;
                    addDict({cname:_that.formData.cname.replace(/\s+/g, "")}).then((data) =>{
                        if(data.code == 0){
                            _that.$message({message: '新建成功',type: 'success'});
                            _that.dialogVisible = false;
                            _that.getTableData();
                        }else{
                            _that.$message({message: data.message,type: 'error'})
                        }
                        _that.isSubmit = false;
                    });
                });
            },
            //批量添加
            batchAdd : function(id){
                this.dialogVisibleAddBatch = true;
                this.dicId = id;
            },
            //添加
            addDict : function(id){
                this.dicId = id;
                this.dialogVisibleAdd = true;
            },
            loadAllDict : function(){
                this.getTableData();
            },
            //导出
            exportDict : function(id){
                var _this = this;
                exportDic({dicId:id,sysType:"2"}).then(res=>{
                    if(res.code == '0'){
                        this.$message({type: 'success',message: '导出成功'});
                        _this.addDownTask();
                    }else{
                        this.$message({type: 'error',message: res.message});
                    }
                })
            },
            //删除词库
            delDict : function(id){
                const h = this.$createElement;
                this.$prompt(h('div',null,[
                    h('p', null, '将删除此话术，且不可恢复。确认删除吗？'),
                    h('p', null, '确认删除请输入"yes"（不含引号）'), 
                ]),'提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^yes$/,
                    inputValue:'yes',
                    inputErrorMessage: '输入不正确'
                }).then(({ value }) => {
                    delDict({ dicId: id }).then(res => {
                        console.log(res)
                        if(res.code === 0){
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.getTableData();
                        }

                    })
                }).catch(() => {
            
                });
            }
        },
        mounted : function(){
            this.getTableData();
        },
        watch:{
            'page.pageIndex': function (value) {
                // this.getTableData()
            }
        },
        components:{
            'addsingle-dict' : addsingleDict,
            'batch-dict':batchDict
        },
        activated : function(){
            // this.getTableData();
        },
    }
</script>

<style>
    .kw__container .kw__top{
        margin-bottom: 30px;
        text-align:right;
    }
    .form-box .el-form-item {
        display: flex;
        
    }
    .el-form-item__content {
        flex: 1;
    }
    
</style>