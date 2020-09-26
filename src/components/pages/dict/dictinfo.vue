<template>
    <div class="page kw__detail">
        <div class="top-title">
            <el-button @click.stop="$router.go(-1)" class="btn-back" type="text" icon="el-icon-arrow-left">返回</el-button>
        </div>
        <div class="top-bar">
            <div class="top-bar_fl" v-if="length>0">
                <el-button @click.stop="delDict" class="btn-primary">删除</el-button>
                <span>已选择{{length}}项</span>
            </div>
            <div class="top-bar_fr">
                <el-input v-model.trim="keywords" class="input-txt" clearable placeholder="请输入关键字"></el-input>
                <el-button @click.stop="searchByButton" class="btn-primary" type="primary">搜索</el-button>
                <el-button @click.stop="refreshDict" class="btn-primary" type="text" icon="el-icon-refresh" v-if="!loading">刷新词典</el-button>
                <el-button class="btn-primary" type="text" icon="el-icon-refresh" v-else :loading="loading">刷新词典</el-button>
            </div>
        </div>
        <div class="jsDetailTable" v-loading="tableLoading">
            <el-table :data="tableData" :border="true"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                ref="multipleTable">
                 <el-table-column
                    type="selection"
                    width="35"
                    prop="id">
                </el-table-column>
                <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                    prop="term"
                    label="标准词">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="synonyms"
                    label="相近词">
                        <template slot-scope="scope">
                            {{ fomtData(scope.row.synonyms)}}
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="address"
                    width="150"
                    fixed="right"
                    label="操作">
                     <template slot-scope="scope">
                        <div class="download-row">
                            <el-button size="small" type="text" @click.stop="editDictKey(scope.row.id)">编辑</el-button>
                            <el-button size="small" type="text" @click.stop="delDictKey(scope.row.id)">删除</el-button>
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
        <addsingle-dict v-if="dialogVisibleAdd" :dicId="dicId" :id="id" @success="loadAllDict" v-model="dialogVisibleAdd"></addsingle-dict>
    </div>
</template>
<script>
    import {queryDicDetail,queryByterm,delDicbyids,addTask} from '@/api/brainkb.js'
    import {mapActions} from 'vuex'
    import {validateRule} from '@/api/validate.js'
    import addsingleDict from './addsingle__dict'
    export default {
        data : function(){
            return {
                deleteIds : [],
                keywords : '',
                tableData : [],
                tableLoading :false,
                dialogVisibleAdd : false,
                loading :false,
                multipleTable : [],
                dicId : '',
                id : '',
                length : '',
                page : {
                    total : 0,
                    pageIndex : 1,
                    pageSize : 10
                },
            }
        },
        methods : {
            /*选择*/
            handleSelectionChange : function(val){
                this.multipleTable = val;
                let ids = [];
                for(var i=0;i<val.length;i++){
                    ids.push(val[i].id);
                }
                this.length = this.multipleTable.length;
                this.deleteIds = ids;
            },
            delDict : function(){
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
                    delDicbyids({ ids: this.deleteIds }).then(res => {
                        if(res.code === 0){
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.search();
                        }
                    })
                }).catch(() => {
            
                });
            },
            handleCurrentChange : function(page){
                this.page.pageIndex = page;
                this.search();
            },
            handleSizeChange : function(size){
                this.page.pageSize = size;
                this.search();
            },
            search : function(callbck){
                let param = {
                    pageSize : this.page.pageSize,
                    pageIndex : this.page.pageIndex
                }
                if(this.keywords ==''){
                    param["id"] = this.$route.params.id;
                    this.tableLoading = true;
                    queryDicDetail(param).then(res =>{
                        if(res.code == 0){
                            this.tableData = this.$lodash.get(res,'result.rows[0].terms',[]),
                            this.page.total = this.$lodash.get(res,'result.totalRows',0);
                            this.tableLoading = false;
                        }
                    })
                }else{
                    param["dicId"] = this.$route.params.id;
                    param["term"] =  this.keywords.replace(/\s+/g, "");
                    queryByterm(param).then(data =>{
                        this.tableLoading = false;
                        if(data.code == '0'){
                            this.tableData = data.result.rows;
                            this.page.total = data.result.totalRows;
                        }else{
                            this.page.total = [];
                            this.tableData = 0;
                        }
                    })
                }
            },
            searchByButton:function(){
                this.page.pageIndex=1
                this.search()
            },
            fomtData : function(data){
                var synonymsArr = [],result = '';
                if(data && data.length>0){
                    for(var i=0;i<data.length;i++){
                        synonymsArr.push(data[i].term);  
                    }
                    result = ""+synonymsArr.join('，')+"";
                }
                return result;
            },
            refreshDict :  function(){
                this.loading = true;
                addTask({dicId:this.$route.params.id}).then(data=>{
                    if(data.code==0){
                        this.loading = false;
                        this.$message({type: 'success',message: '刷新成功'})
                    }
                })
            },
            //删除词
            delDictKey : function(id){
                console.log(id);
                this.deleteIds.push(id);
                this.delDict();
            },
            //编辑
            editDictKey : function(id){
                this.id = id;
                this.dicId = this.$route.params.id;
                this.dialogVisibleAdd = true;
            },
            loadAllDict : function(){
                this.search();
            }
        },
        watch:{
            'page.pageIndex': function (value) {
                this.search()
            }
        },  
        beforeRouteEnter : function(to, from, next){
            next(vm => {
                vm.search();
            });
        },
        components:{
            'addsingle-dict' : addsingleDict
        }
    }
</script>
<style>
    .top-bar{
        width:100%;
        display: flex;    
        position: relative;
        height: 60px;
    }
    .top-bar_fl{flex: 1;}
    .top-bar .el-input{
        width: 53%;
        margin-bottom: 20px;
    }
    .top-bar_fr{
        position: absolute;
        right: 0;
        width: 35%;
        text-align: right;
    }
</style>
