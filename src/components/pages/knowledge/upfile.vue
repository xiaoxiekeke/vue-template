<template>
    <el-form ref="importForm" class="voiceFile">
        <el-form-item label="" prop="fileName">
            <div style="display:none;">
                <input @change="fileChange" v-bind:disabled="disabled" :id="'upfile_'+answerId" type="file" />
            </div>
            <label :for="'upfile_'+answerId" v-bind:disabled="disabled" class="up__speech">
                <span class="up__speech-txt" :disabled="disabled" >{{upload.btnTxt}}</span>
            </label>
        </el-form-item>
    </el-form>
</template>

<script>
    import {recordFill} from '@/api/brainkb.js'
    export default {
        name : 'upFile',
        props:["knowId","questionId","answerId","src","disabled"],
        data : function(){
            return {
                fileName : ''
            }
        },
        computed :{
            upload : function(){
                return {
                    btnTxt : this.src ? '重新上传' : '上传',
                }
            },
        },
        methods : {
            fileChange : function(event){
                // return
                const file = event.target.files[0];
                let orgFileName = file ? file.name : '',
                    suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
                this.fileName = '';
                this.$emit("changeE",true)
                if(file == null){
                    this.$message.error('文件不可为空');
                    this.$emit("changeS",false)
                    return;
                }else if(["wav","vox","zip"].indexOf(suffix) < 0){
                    this.$message.error('请选择正确的文件格式！');
                    this.importError = '请选择正确的文件格式！';
                    this.$emit("changeS",false)
                    event.target.value = '';
                    return;
                }else if(file.size / 1024 > 1024 * 10){
                    this.$message.error('文件大小不能超过10MB！');
                    this.importError = '文件大小不能超过10MB！';
                    this.$emit("changeS",false)
                    event.target.value = '';
                    return;
                }else{
                    var formData = new FormData();
                    formData.append("kbId", this.knowId);
                    formData.append("questionId", this.questionId);
                    formData.append("answerId", this.answerId);
                    formData.append("record", file);
                    recordFill(formData).then(data =>{
                        if(data.code == 0){
                            var audioDefultUrl = this.$lodash.get(data,'result.rows[0].path','');
                            var audioUrl = this.$global.getStaticFileUrl(audioDefultUrl);
                            this.$emit("success");
                            this.$emit("changeS",false)
                            this.$message.success('录音上传成功');
                        }else{
                            this.$message.error('文件上传错误');
                        }
                        
                    });
                    event.target.value = '';
                }
                this.importError = '';
                this.fileName = orgFileName;
            }
        },
        mounted:function(){
        }
    }
</script>
<style lang="less">
    .voiceFile{
        display: inline-block;
        .el-form-item{
            margin-bottom:0;
            .up__speech-txt{
                color:#00b792;
                cursor:pointer;
            }

            .up__speech-txt[disabled]{
                color:#c0c4cc;
            }
        }
    }
    .importForm{
        display: inline-block;
    }
</style>