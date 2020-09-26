<template>
    <el-dialog title="批量添加" class="knowForm"
        :append-to-body="true"
        width="500px"
        :visible.sync="show"
        :before-close="beforeClose"
        :close-on-click-modal="false">
        <el-form ref="importForm" >
            <div class="text item">
                <div class="step-one know-icon">请按照模板格式准备需要导入的数据
                    <a class="batch_down know-icon" download @click.once="download($event)" id="downloadA">下载批量添加模板</a>
                </div>
                <div class="step-two know-icon">选择需要导入的数据</div>
            </div>
            <el-form-item label="" prop="fileName">
                <div style="display:none;">
                    <input @change="fileChange" id="dictUpload" type="file" />
                </div>
                <label for="dictUpload" class="up__speech">
                    <i class="el-icon-upload"></i>
                    <span class="up__speech-txt">选择上传文件<i>支持xls,xlsx文件上传，单个文件不得大于2M</i></span>
                </label>
                <div class="dictUpload__filename">{{fileName}}</div>
                <el-progress :percentage="percentage" color="#009f7f" v-if="progress"></el-progress>
                <div v-if="importError" class="el-form-item__error">{{importError}}</div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button v-if="!importLoading" type="primary"  @click.stop="importBatch">导入</el-button>
            <el-button v-else type="primary" :loading="true" disabled>导入中</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {batchtask,queryTask,exportTemplate} from '@/api/brainkb.js'
    import {mapActions} from 'vuex'
    import {validateRule} from '@/api/validate.js'
    export default {
        name : 'question-batch',
        model : {
            prop : 'show',
            event : 'change'
        },
        props:["show","knowId"],
        data : function(){
            return {
                importLoading : false,
                fileName : '',
                importError : '',
                percentage :0,
                dataId : '',
                progress : false,
                status : '',
                timer : null,
                showDown : false,
                pathUrl: ''
            }
        },
        methods : {
            beforeClose : function(){
                this.$emit('change',false);
            },
            cancel : function(){
                this.$emit('change',false);
            },
            download :function(e){
                exportTemplate({}).then(data =>{
                    if(data.code == 0){
                        this.pathUrl = this.$lodash.get(data,'result.rows[0].path','');
                        e.target.setAttribute("href",this.formatStaticUrl(this.pathUrl)); 
                        e.target.click();
                    }
                });
            },
            formatStaticUrl : function(value){
                if(value){
                    return this.$global.getStaticFileUrl(value);
                }else{
                    return '--'
                }
            },
            fileChange : function(event){
                const file = event.target.files[0];
                let orgFileName = file ? file.name : '',
                    suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
                this.fileName = '';
                if(file == null){
                    return;
                }else if(["xls","xlsx"].indexOf(suffix) < 0){
                    this.importError = '请选择正确的文件格式！';
                    event.target.value = '';
                    return;
                }else if(file.size / 1024 > 1024 * 2){
                    this.importError = '文件大小不能超过2MB！';
                    event.target.value = '';
                    return;
                }
                this.importError = '';
                this.fileName = orgFileName;
            },
            importBatch : function(){
                const file = document.getElementById('dictUpload').files[0];
                var _this = this;
                if(file == null){
                    this.importError = '请选择上传的文件！';
                    this.fileName = '';
                    return false;
                }
                _this.importLoading = true;
                var formData = new FormData();
                formData.append("kbId", _this.knowId);
                formData.append("file", file);
                batchtask(formData).then(function(data){
                    if(data.code == 0){
                        _this.importDialog = false;
                        _this.dataId = _this.$lodash.get(data,'result.rows[0].id','');
                        _this.queryTask();
                    }else{
                        _this.$message.error('文件上传错误');
                    }
                });
                document.getElementById('dictUpload').value= '';
            },
            queryTask : function(){
                var _this = this;
                clearTimeout(_this.timer);
                queryTask({id:_this.dataId}).then(data =>{
                    _this.status = _this.$lodash.get(data,'result.rows[0].status','');
                    _this.statusChange(_this.status,function(result){
                        if(result == 'true'){
                            _this.$emit("success");
                            _this.$message({message: '导入成功', type: 'success'});
                            clearTimeout(_this.timer);
                            _this.$emit('change',false);
                        }else if(result == '11'){
                            _this.importError = data.result.rows[0].msg.split("↵")[0];
                            clearTimeout(_this.timer);
                            _this.importLoading = false;
                            _this.progress = false;
                            _this.$emit("success");
                        }else if(result == '1'){
                            _this.progress = true;
                            console.log(data.result.rows[0].process)
                            _this.percentage = _this.$lodash.get(data,'result.rows[0].process',0);
                        }else{
                            _this.importError = result;
                            clearTimeout(_this.timer);
                            _this.importLoading = false;
                            _this.progress = false;
                        }
                    })
                });
                document.getElementById('dictUpload').value= '';
                _this.timer = setTimeout(function(){
                    _this.queryTask();
                },3000);
            },
            statusChange : function(status,callback){
                if(status == '6'){
                    return callback && callback('true');
                }else if(status == '7'){
                    return callback && callback('上传失败');
                }else if(status == '8'){
                    return callback && callback('加载文件失败')
                }else if(status == '9'){
                    return callback && callback('模板格式错误')
                }else if(status == '10'){
                    return callback && callback('模板为空')
                }else if(status == '11'){
                    return callback && callback('11')
                }else if(status == '12'){
                    return callback && callback('超过30个相似问法，不能导入')
                }else if(status == '-1'){
                    return callback && callback('任务不存在')
                }else if(status == '1'){
                    return callback && callback('1')
                }else if(status == '2'){
                    return callback && callback('加载文件成功')
                }
            }
        }
    }
</script>
<style>
.up__speech{color:#00b792;cursor: pointer;}
.up__speech-txt i{font-size: 12px;color:#cdcdcd;}
.know-icon {
    background: url(./images/know-icon.png) 0 0 no-repeat;
    cursor: pointer;
}
.step-one {
    background-position: 0 -226px;
    padding-left: 26px;
    margin-bottom: 8px;
}
.step-two {
    background-position: 0 -257px;
    padding-left: 26px;
    margin-bottom: 8px;
}
.batch_down {
    background-position: 0 -23px;
    padding: 0 0 0 21px;
    color: #00b792;
    text-decoration: none;
}
.knowForm .el-dialog__body{
    overflow-y: auto;
}
</style>