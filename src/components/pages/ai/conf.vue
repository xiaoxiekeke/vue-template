<style scoped>
	.blank{
    height: calc(100vh - 120px);
	}
	.blank-bg{
		background: url(./images/blank.png) center center no-repeat;
		width: 132px;
    height: 132px;
	}
	.blank-txt{
    color: #9b9ea3;
    margin: 18px 0;
	}
	.ai-item{
		position: relative;
		margin: 20px 0px 10px 20px;
		border:1px solid #ebebeb;
		border-radius: 4px;
		height: 222px;
		width:196px;
		background-color: #fff;
		color:#535353;
		box-sizing: border-box;
		overflow: hidden;
		padding: 0 16px;
	}
	.ai-item:hover{
		border-color: #00b792;
	}
	.ai-item-choice{
		padding-top: 30px;
	}
	.ai-icon{
		background: url(./images/ai.png) center center no-repeat;
		width:73px;
		height: 67px;
	}
	.ai-icon-choice{
		background: url(./images/ai-choice.png) center center no-repeat;
		width:73px;
		height: 67px;
		position: absolute;
		right: -17px;
		top:0px;
	}
	.ai-phone{
		margin-top: 14px;
	}
	.ai-btn{
		margin-top: 20px;
	}
	.ai-speech{
		margin-top: 15px;
	 	overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    width:100%;
    text-align: center;
	}
	.ai-item-choice .el-button{
		padding: 7px;
	}
	.ai-item-choice .ai-phone{
		margin-top:0;
	}
	.ai-item-choice .ai-btn{
		margin-top: 37px;
	}
</style>

<template>
	<fee-tip text="您的账号余额不足，请充值后再来配置接待话术">
		<div v-loading="loading">
			<div v-if="cpnInfo.length == 0" class="blank flex-center-center">
				<div class="flex-column-center">
					<div class="blank-bg"></div>
					<p class="blank-txt">当前还没有AI接待，如有需要可联系客户经理开通</p>
				</div>
			</div>
			<div v-else class="flex wrap">
				<template v-for="item in cpnInfo">
					<div
						v-if="item.speechSkillId"
						:key="item.num" 
						class="ai-item ai-item-choice flex-center-center column">
						<div class="ai-icon-choice"></div>
						<div class="ai-phone">{{item.cpnCode}}</div>
						<div class="ai-speech">话术：{{item.speechSkillName || item.speechSkillId}}</div>
						<div class="ai-btn">
							<el-button size="mini" type="primary" @click="showDialog(item.id)" plain>更换话术</el-button>
							<el-button size="mini" type="primary" @click="showConfrim(item.id)" plain>停止接待</el-button>
						</div>
					</div>
					<div
						v-else
						:key="item.num" 
						class="ai-item flex-center-center column">
						<div class="ai-icon"></div>
						<div class="ai-phone">{{item.cpnCode}}</div>
						<div class="ai-btn">
							<el-button size="mini" type="primary" @click="showDialog(item.id)">请选择接待话术</el-button>
						</div>
					</div>
				</template>
			</div>

			<el-dialog
			  title="选择接待话术"
			  :visible.sync="dialogVisible"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  width="40%"
			  :before-close="close">
			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
			  	<el-form-item label="" prop="speechSkillId">
				    <el-select
							class="w100"
							v-model="ruleForm.speechSkillId"
							filterable remote reserve-keyword clearable
					    :loading="speechLoading"
					    :remote-method="getSpeechList"
							placeholder="请选择接待话术">
							<el-option
								v-for="item in speechList"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
				  </el-form-item>
			  </el-form>
			  <span slot="footer">
			    <el-button @click="close">取 消</el-button>
			    <el-button type="primary" @click="save">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</fee-tip>
</template>

<script>
	import {queryCPNInfoWithBus} from '@/api/resmanage.js'
	import {querySpeechSkill} from '@/api/brain.js'
	import {getRuleTemplate} from '@/api/jsondata.js'
	import {saveRule,deleteRule} from '@/api/router.js'
	import FeeTip from '@/components/common/blank/feetip'	

	export default {
		data: function(){
			return {
				loading: true,
				cpnInfo: [],
				dialogVisible: false,
				speechLoading: false,
				speechList: [],
				ruleForm: {
					speechSkillId: ''
				},
			 	rules: {
          speechSkillId: [
            { required: true, message: '请选择接待话术', trigger: 'change' }
          ]
       	},
       	resId: ''
			}
		},
		methods: {
			getSpeechList(keywords){
				this.speechLoading = true;
        querySpeechSkill({name: keywords,pageIndex:1, pageSize:50,sortName:"createTime",sortOrder:"desc",sysType:"2",status: 4}).then(resp => {
        	this.speechList = this.$lodash.get(resp,'result.rows',[]).map(item => {
        		return {
        			label: item.name,
        			value: item.id + ''
        		}
        	})
        	this.speechLoading = false;
        })
			},
			save(){
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            return
          }
          let cpn = this.cpnInfo.find(item => item.id == this.resId)
          if(!cpn || !cpn.rule){
          	this.$message.error('未找到对应CPN信息')
          	return;
          }
          let busId = this.$global.getBusinessId();
          let speech = this.speechList.find(item => item.value == this.ruleForm.speechSkillId)
          cpn.rule.ani = cpn.rule.ani || '*';
          cpn.rule.dni = cpn.cpnCode;
					cpn.rule.headers['business-id'] = busId;
					cpn.rule.headers['robot-id'] = this.ruleForm.speechSkillId;
					cpn.rule.relation['robot-id'] = this.ruleForm.speechSkillId;
					cpn.rule.relation['robot-name'] = speech ? speech.label : '';
					cpn.rule.relation['business-id'] = busId;
					cpn.rule.relation['business-name'] = this.$global.getUserInfo('business.name');
					saveRule(cpn.rule).then(resp => {
						if(resp.code == 0){
							this.$message({type: 'success',message: '保存成功'})
							this.close();
							this.initCpnInfo();
						}else{
							this.$message.error('保存失败')
						}
					})
        })
			},
			close(){
				this.dialogVisible = false;
			},
			showDialog(id){
				this.getSpeechList();
				this.resId = id;
				let cpn = this.cpnInfo.find(item => item.id == id);
				this.ruleForm.speechSkillId = cpn && cpn.rule && cpn.rule.headers ? cpn.rule.headers['robot-id'] : ''
				this.dialogVisible = true;
			},
			showConfrim(id){
				let cpn = this.cpnInfo.find(item => item.id == id)
        if(!cpn || !cpn.rule){
        	this.$message.error('未找到对应CPN信息')
        	return;
        }
				this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
    			confirmButtonText: '确定',
    			cancelButtonText: '取消',
    			type: 'warning'
  			}).then(() => {
    			deleteRule({dni: cpn.rule.dni,ani: cpn.rule.ani || '*'}).then(resp => {
    				if(resp.code == '0'){
    					this.$message({type : 'success',message : '删除成功'})
    					this.initCpnInfo();
    				}else{
    					this.$message.error('删除失败')
    				}
    			});
  			}).catch(() => {});
			},
			initCpnInfo(){
				let list = [];
				this.loading = true;
				Promise.all([queryCPNInfoWithBus({
					businessId: this.$global.getBusinessId(),
					cpnTypeArr: [1,3],
					status: 1
				}),getRuleTemplate()]).then(values => {
					let rows = this.$lodash.get(values,'[0].result.rows',[]),
						ruleTpl = this.$lodash.get(values,'[1]');
					rows.forEach(item => {
						if(item.expirationStatus == 0){
							let rule = item.itemJson ? JSON.parse(item.itemJson) : ruleTpl
							list.push({
								id: item.resId,
								cpnCode: item.cpnCode,
								rule: rule,
								speechSkillId: rule.headers ? rule.headers['robot-id'] : '',
								speechSkillName: rule.relation ? rule.relation['robot-name'] : ''
							})
						}
					})
					list.sort((a,b) => {
						return a.cpnCode - b.cpnCode;
					})
					this.cpnInfo = list;
					this.loading = false;
				})
			}
		},
		mounted(){
			this.initCpnInfo();
		},
		components: {
			'fee-tip': FeeTip
		}
	}
</script>