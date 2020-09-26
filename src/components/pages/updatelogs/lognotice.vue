<style scoped>
	.log{
		padding:5px 8px;
		max-height:300px;
		overflow-y:auto;
	}
	.log-item{
		color:#8e8e8e;
		font-size:12px;
		line-height: 22px;
		margin:0
	}
	.log-opt{
		border-top:1px solid #e5e5e5;
		text-align:center;
	}
	.bounce-enter-active {
	  animation: bounce-in .5s;
	}
	.bounce-leave-active {
	  animation: bounce-in .5s reverse;
	}
	@keyframes bounce-in {
	  0% {
	    transform: translateY(-258px);
	  }
	  100% {
	    transform: translateY(0);
	  }
	}
</style>

<template>
	<transition name="bounce" >
		<notice v-if="!isRead && log.length > 0" title="新版本更新内容" @close="close" >
    	<div class="log">
    		<p class="log-item" v-for="item in log">{{item.content}}</p>
    	</div>
    	<div class="log-opt">
    		<el-button @click="see" type="text">查看详情</el-button>
    	</div>
    </notice>
  </transition>
</template>

<script>
	import {getUpdateLog} from '@/api/jsondata.js'
	import Notice from '@/components/common/notice/notice'

	export default {
		data : function(){
			return {
				isRead : false,
				log : [],
				time : ''
			}
		},
		methods : {
			see (){
				this.close();
				this.$router.push('/updatelogs');
			},
			close (){
				localStorage.setItem('__update',this.time);
				this.isRead = true;
			}
		},
		mounted : function(){
			getUpdateLog().then(resp => {
				if(resp && resp.logItems){
					this.log = resp.logItems[0].updateContent || [];
					this.time = resp.logItems[0].time;
				}
				this.isRead = localStorage.getItem('__update') == this.time;
			})
		},
		components : {
	    'notice' : Notice
	  }
	}
</script>