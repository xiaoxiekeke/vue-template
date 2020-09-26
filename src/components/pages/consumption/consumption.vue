<template>
	<div class="page consumption">
		 <el-tabs v-model="activeTab" >
		    <el-tab-pane label="消费记录" name="1">
		    	<!-- <consump-list></consump-list> -->
		    		<el-tabs v-model="activeTab2" type="card">
	    		    <el-tab-pane label="通话费用" name="1">
	    		    	<consump-detail-call  ref="consump__detail__call"></consump-detail-call>
	    		    </el-tab-pane>
	    		    <el-tab-pane label="短信费用" name="2">
	    		    	<consump-detail-sms  ref="consump__detail__sms"></consump-detail-sms>
	    		    </el-tab-pane>
	    		    <el-tab-pane label="转人工费用" name="3">
	    		    	<consump-detail-transfer ref="consump__detail__transfer"></consump-detail-transfer>
	    		    </el-tab-pane>
		    	 	</el-tabs>
		    </el-tab-pane>
		    <el-tab-pane label="订单记录" name="2">
		    	<consump-order ref="consump__order"></consump-order>
		    </el-tab-pane>
		 </el-tabs>
	</div>
</template>

<script>
	import ConsumpList from './consump__list'
	import ConsumpOrder from './consump__order'
	import ConsumpDetailCall from './consump__detail__call'
	import ConsumpDetailSms from './consump__detail__sms'
	import ConsumpDetailTransfer from './consump__detail__transfer'

	export default {
		data : function(){
			return {
				activeTab : this.$route.params.tab || '1',
				activeTab2:'1'
			}
		},
		beforeRouteEnter : function(to, from, next){
			next(vm => {
				if(vm.activeTab == '2'){
					vm.$refs.consump__order.search();
				}
			});
		},
		components : {
			'consump-list' : ConsumpList,
			'consump-order' : ConsumpOrder,
			'consump-detail-call' : ConsumpDetailCall,
			'consump-detail-sms' : ConsumpDetailSms,
			'consump-detail-transfer' : ConsumpDetailTransfer
		}
	}
</script>

<style lang="less">
	.consumption{
		.consump__date{
			width:260px;
		}
		.consump__content{
			margin-top:10px;
		}
	}
	.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
	    border-bottom-color: #f5f5f5;
	}
</style>