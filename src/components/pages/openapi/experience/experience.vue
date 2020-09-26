<template>
	<div class="page">
		<el-button class="moreApi" type="text" @click="moreApi">更多接口>></el-button>
		<el-tabs v-model="curTab">
		    <el-tab-pane label="外呼体验" name="calloutLine">
		    	<exp-callout :phone="expPhone"></exp-callout>
			</el-tab-pane>
		    <el-tab-pane label="呼入体验" name="privateLine">
		    	<exp-privateline :phone="expPhone"></exp-privateline>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import ExpCallOut from './exp__callout'
	import expPrivateline from './exp__privateline'
	import {mapState, mapActions} from 'vuex'

	export default {
		name : 'openapi_experience',
		data : function () {
			return {
				curTab : 'calloutLine',
				phoneNum : '',
				expPhone : ''
			}
		},
		computed : {
			 ...mapState('user',[
                'account'
            ])
		},
		methods:{
		    moreApi(){
	    		window.open("https://github.com/kxjl-ai-yeta/openapi_doc")
	        	return;
		    },
		    setPhoneNum : function(){
		    	if(!this.phoneNum){
                    this.$message.error('请填写体验号码');
                    return;
                }
                if(!/^1[3|4|5|7|8]\d{9}$/.test(this.phoneNum)){
                    this.$message.error('号码格式不正确');
                    return;
                }
		    	localStorage.setItem('__expphone',this.phoneNum);
		    	this.expPhone = this.phoneNum;
		    	this.curTab = 'calloutLine';
		    }
		},
		mounted : function(){
			this.phoneNum = localStorage.getItem('__expphone') || this.account;
			this.expPhone = this.phoneNum;
		},
		components : {
			'exp-callout' : ExpCallOut,
			'exp-privateline':expPrivateline
		}
	}

</script>

<style type="text/css">
	.page{
		position: relative;
	}
	.moreApi{
		/*margin-left: 100px;
		margin-top: 50px;*/
		position: absolute;
		right: 20px;
		top:20px;
		z-index: 1000;
	}
	.exp__setting{
		padding: 30px;
		background-color:#fff;
	}
</style>