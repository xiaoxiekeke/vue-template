<template>
    <el-dialog
        title="单个添加"
        :visible.sync="show"
        :append-to-body="true"
        :before-close="beforeClose"
        :close-on-click-modal="false"
        width="50%">
        <div class="form-box">
            <el-form :model="form" :rules="formRules" ref="createDictForm">
                <el-form-item prop="term" label="标准词">
                    <el-input v-model.trim="form.term" placeholder="请输入标准词" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="synonyms" label="相似词">
                    <el-input type="textarea" rows="10" v-model.trim="form.synonyms" placeholder="多个请以“，”逗号分隔，不区分半角圆角"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click.stop="cancel">取 消</el-button>
            <el-button class="speechtpl__usebtn" v-if="!createLoading" type="primary" @click.stop="addBatchDict">确定</el-button>
            <el-button class="speechtpl__usebtn" v-else :loading="createLoading" type="primary" disabled >提交中...</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import {addSingle,queryDetail} from '@/api/brainkb.js'
    import {mapActions} from 'vuex'
    import {validateRule} from '@/api/validate.js'
    export default {
        name : 'addsingle-dict',
        model : {
            prop : 'show',
            event : 'change'
        },
        props:["show","dicId","id"],
        data : function(){
            var validateSpeechName  = (rule, value, callback) => {
                const result = validateRule(value,['require','wordsName']);
                if(result == 0){
                    callback(new Error('请输入标准词'));
                }else if(result == 1){
                    callback(new Error('标准词格式不正确'));
                }else{
                    callback();
                }
            }
            var synonymsCheck = (rule, value, callback) => {
                callback();
            }
            return {
                createLoading : false,
                form : {
                    term : '',
                    synonyms : ''
                },
                formRules : {
                    term: [ { validator: validateSpeechName, trigger: 'blur' } ],
                    synonyms : [{validator:synonymsCheck ,trigger : 'blur'}]
                }
            }
        },
        methods : {
            beforeClose : function(){
                this.$emit('change',false);
            },
            cancel : function(){
                this.$emit('change',false);
            },
            addBatchDict : function(){
                this.$refs.createDictForm.validate((valid) => {
                    if(!valid){
                        return false;
                    }
                    this.createLoading = true;
                    let params = {
                        dicId : this.dicId,
                        term : this.form.term,
                        synonyms:this.form.synonyms.replace(/，/g,',')
                    };
                    if(this.id){
                        params["id"] = this.id;
                    }
                    addSingle(params).then(res=>{
                        this.createLoading = false;
                        if(res.code === 0){
                            this.$message({type: 'success',message: this.id ? '编辑成功':'添加成功'});
                            this.$emit('change',false);
                            this.$emit("success");
                        }else{
                            this.$message.error('创建失败，错误信息：'+res.message);
                        }
                    }); 
                });
            }
        },
        mounted : function(){
            var _this = this;
            queryDetail({dicId:_this.dicId,id:_this.id}).then(data =>{
                if(data.code == 0){
                    let d = _this.$lodash.get(data,'result.rows[0]'),
                            term = d ? d.term : '',
                            synonymsArr = d ? d.synonyms : [],
                            synonymsItemArr = [];
                    if(synonymsArr && synonymsArr.length>0){
                        for(var i=0;i<synonymsArr.length;i++){
                            synonymsItemArr.push(synonymsArr[i].term);
                        }
                    }
                    _this.form.term = term;
                    _this.form.synonyms = synonymsItemArr.join(",");
                }
            })
        }
    }
</script>