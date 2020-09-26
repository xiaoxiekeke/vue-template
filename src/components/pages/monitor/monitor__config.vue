<template>
	<el-dialog
    title="监控配置"
    :visible.sync="show"
    :append-to-body="true"
    :before-close="beforeClose"
    width="530px">
    <el-alert
    title="红色提示"
    type="error" :closable="false">
    </el-alert>
    <div class="err-area">
    	<span>未识别次数&nbsp;&nbsp;≥&nbsp;&nbsp;</span><el-input-number v-model="rednum"  @change="handleChangeRednum" size="small" :min="1" :max="1000"></el-input-number><span>&nbsp;&nbsp;次</span>
    </div>
    <el-alert
	    title="橙色提示"
	    type="warning" :closable="false">
    </el-alert>
	  <div class="warning-area">
    	<span>未识别次数&nbsp;&nbsp;≥&nbsp;&nbsp;</span><el-input-number v-model="yellownum"  @change="handleChangeOrangenum" size="small" :min="1" :max="1000"></el-input-number><span>&nbsp;&nbsp;次</span>
    </div>  
	  <span slot="footer" class="dialog-footer">
		    <el-button @click.stop="cancel">取 消</el-button>
		    <el-button @click.stop="submit" :disabled="isSubmit" type="primary" >确定</el-button>
		</span>
  </el-dialog>
</template>

<script>
	import {mapState} from 'vuex'
	import {queryConfig,saveConfig} from '@/api/kylin.js'
	export default {
		name : 'monitor__config',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','taskId','speechSkillId'],
		data : function () {
			return {
				rednum:4,
				yellownum:2,
				isSubmit : false,
				color:[{
					key:"红色",
					value:2,
					description:""
				},{
					key:"橙色",
					value:1,
					description:""
				},{
					key:"绿色",
					value:0,
					description:""
				}]
			}
		},
		computed : {
			...mapState('user',[
				'business'
      ])
		},
		mounted(){
			queryConfig({
				business_id:this.business.id,
        sys_type:this.$config.system.id,
        task_id:this.taskId
			}).then(res=>{
				var color=this.$lodash.get(res,'result.rows[0].color',{});
				if (color&&color.length>0) {
					this.color=color;
				}
				for (var i = 0; i < this.color.length; i++) {
					if (this.color[i].key=="红色") {
						this.rednum=this.color[i].value
					}
					if (this.color[i].key=="橙色") {
						this.yellownum=this.color[i].value
					}
				}
			})
		},
		methods : {
			//events
			beforeClose : function(){
				this.$emit('change',false);
			},
			cancel : function(){
				this.$emit('change',false);
			},
			submit : function(){
				if (!this.rednum||!this.yellownum) {
	     		this.$message.error('请输入正确的未识别数');
	     		return;
	     	}
	     	if (this.rednum<this.yellownum) {
	     		this.$message.error('红色未识别次数不得小于橙色未识别次数');
	     		return;
	     	}
	     	
	     	var color=[]
	     	this.color.forEach(function(item){
	     		for (var i = 0; i < color.length; i++) {
	     			if(item.key==color[i].key){return false}
	     		}
	     		color.push(item)
	     	})
	     	saveConfig({
	     		business_id:this.business.id,
	        sys_type:this.$config.system.id,
	        task_id:this.taskId,
	     		speechSkillID:this.speechSkillId,
	     		config:[{
	     			color:color
	     		}]
	     	}).then((res)=>{
	     		if (res.code==0) {
	     			this.$message.success("保存成功");
	     			this.$emit('success');	
	     			this.$emit('change',false);	
	     		}else{
	     			this.$message.success("保存失败");
	     		}
	     	})
			},
			handleChangeRednum:function(e){
				for (var i = 0; i < this.color.length; i++) {
					if (this.color[i].key=="红色") {
						this.color[i].value=Number(this.rednum)
					}
				}
				if (!e) {
					this.$message.error('请填入红色未识别次数');
				}
			},
			handleChangeOrangenum:function(e){
				for (var i = 0; i < this.color.length; i++) {
					if (this.color[i].key=="橙色") {
						this.color[i].value=Number(this.yellownum)
					}
				}
				if (!e) {
					this.$message.error('请填入橙色未识别次数');
				}
			}
		}
	}
</script>

<style lang="less">
	.customer-form{
		.form-content{
			width:310px;
		}
	}
	.err-area,.warning-area{
		padding-left: 80px;
		margin-top: 10px;
		margin-bottom: 20px;
	}

</style>