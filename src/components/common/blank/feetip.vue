<style scoped>
	.fee-blank{
    height: calc(100vh - 120px);
	}
	.fee-blank-bg{
		background: url(./images/robot.png) 0 -49px no-repeat;
		width: 150px;
    height: 132px;
	}
	.fee-blank-txt{
    margin: 18px 0;
	}

</style>

<template>
	<div v-if="lack" class="fee-blank flex-center-center">
		<div class="flex-column-center">
			<div class="fee-blank-bg"></div>
			<p class="fee-blank-txt">{{text || '您的账号余额不足，请充值后再来创建任务' }}</p>
			<el-button type="primary" plain>
				<router-link class="link" to="/recharge">立即充值</router-link>
			</el-button>
		</div>
	</div>
	<div v-else>
		<slot></slot>
	</div>
</template>

<script>
	import {checkFeeLeft} from '@/api/fee.js'

	export default {
		props:['text'],
		data: function () {
			return {
				lack: false
			}
		},
		mounted(){
			checkFeeLeft().then(resp => {
				this.lack = this.$lodash.get(resp,'result.rows[0].lack',false)
			})
		}
	}
</script>