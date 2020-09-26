<template>
	<div class="page consumption">
		 <el-tabs v-model="activeTab" >
		    <el-tab-pane label="企业线路" name="1">
		    	<linenum v-if="activeTab == 1"></linenum>
		    </el-tab-pane>
		    <el-tab-pane label="企业付费" name="2">
		    	<recharge v-if="activeTab == 2"></recharge>
		    </el-tab-pane>
		 </el-tabs>
	</div>
</template>

<script>
	import Recharge from './recharge'
	import LineNum from './linenum'

	export default {
		data : function(){
			return {
				activeTab : this.$route.params.tab || '2'
			}
		},
		components : {
			'recharge' : Recharge,
			'linenum' : LineNum
		}
	}
</script>

<style lang="less">
	
</style>