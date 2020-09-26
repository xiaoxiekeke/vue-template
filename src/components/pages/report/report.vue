<template>
	 <div class="page report" v-loading="loading">
      <el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="AI外呼" name="callout">
		    	<report-callout ref="reportCallOut" v-show="activeName==='callout'"></report-callout>
		    </el-tab-pane>
		    <el-tab-pane label="AI接待" v-if="!!permission&&!!permission.__menu&&!!permission.__menu.ai" name="callin">
		    	<report-callin ref="reportCallIn" v-show="activeName==='callin'"></report-callin>
		    </el-tab-pane>
		  </el-tabs>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import ReportCallout from '@/components/pages/report/report-callout'
import ReportCallin from '@/components/pages/report/report-callin'

export default {
	name: 'report',
	data : function () {
		return {
			activeName: 'callout',
			permission:null
		}
	},
	
	methods : {
		 	handleClick(tab, event) {
        if(tab.name=="callin"){
        	setTimeout(()=>{
        		this.$refs.reportCallIn.initData()
        	},0)
        }else if(tab.name=="callout"){
        	setTimeout(()=>{
        		this.$refs.reportCallOut.initData()
        	},0)
        	
        }
      }
	},
	
	mounted : function(){
		this.$global.getPermission().then((res)=>{
			this.permission=res;
		})
	},
	components : {
		'report-callin':ReportCallin,
		'report-callout':ReportCallout
	}
}
</script>
<style scoped>
	.report{
		background-color: #fff;
	}
	
</style>