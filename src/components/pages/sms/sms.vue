<template>
	<div class="page">
		<el-tabs v-model="activeTab">
		    <el-tab-pane label="模板管理" name="tab__tpl">
		    	<sms-template v-if="activeTab == 'tab__tpl'"></sms-template>
		    </el-tab-pane>
		  <!--   <el-tab-pane label="发送记录" name="tab__record">
		    	<sms-record v-if="activeTab == 'tab__record'"></sms-record>
		    </el-tab-pane> -->
		</el-tabs>
	</div>
</template>
<script>
	import SmsTemplate from './sms-template'
	import SmsRecord from './sms-record'

	export default {
		name : '',
		data : function(){
			return {
				activeTab : 'tab__tpl'
			}
		},
		components : {
			'sms-template' : SmsTemplate,
			'sms-record' : SmsRecord
		}
	}
</script>