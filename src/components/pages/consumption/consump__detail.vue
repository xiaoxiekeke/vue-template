<template>
	<div class="page consump__detail">
		<div class="top-bar">
			<el-button @click.stop="$router.go(-1)" class="btn-back" type="text" icon="el-icon-arrow-left">返回</el-button>
		</div>
		<el-tabs v-model="activeTab" >
		    <el-tab-pane label="通话费用" name="1">
		    	<consump-detail-call :parentItem="parentItem" ref="consump__detail__call"></consump-detail-call>
		    </el-tab-pane>
		    <el-tab-pane label="短信费用" name="2">
		    	<consump-detail-sms  :parentItem="parentItem" ref="consump__detail__sms"></consump-detail-sms>
		    </el-tab-pane>
		    <el-tab-pane label="转人工费用" name="3">
		    	<consump-detail-transfer :parentItem="parentItem" ref="consump__detail__transfer"></consump-detail-transfer>
		    </el-tab-pane>
	 	</el-tabs>
	</div>
</template>

<script>
	import ConsumpDetailCall from './consump__detail__call'
	import ConsumpDetailSms from './consump__detail__sms'
	import ConsumpDetailTransfer from './consump__detail__transfer'


	export default {
		data : function(){
			return {
				activeTab : this.$route.params.tab || '1',
				parentItem : this.$route.params.parentItem
			}
		},
		components : {
			'consump-detail-call' : ConsumpDetailCall,
			'consump-detail-sms' : ConsumpDetailSms,
			'consump-detail-transfer' : ConsumpDetailTransfer
		}
	}
</script>