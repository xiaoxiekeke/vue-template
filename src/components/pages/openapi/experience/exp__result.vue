<template>
	<div class="exp__result">
		<el-card class="call-result">
		  <div slot="header">
		    <span>对话</span>
		  </div>
		  <div class="content" v-loading="!dialog"  element-loading-text="同步推送结果最多需要3分钟左右，请耐心等待！">
		  	<pre><code>{{dialog}}</code></pre>
		  </div>
		</el-card>
		<el-card class="call-result">
		  <div slot="header">
		    <span>录音</span>
		      <el-popover v-if="voiceUrl"
			    placement="top-start"
			    width="200"
			    trigger="hover"
			    :content="voiceUrl">
			    <el-button width="300"  slot="reference" style="float: right; padding: 3px 0" type="text">完整地址</el-button>
			  </el-popover>
		  </div>
		   <div class="content" v-loading="!voice"  element-loading-text="同步推送结果最多需要3分钟左右，请耐心等待！">
		  	<pre><code>{{voice}}</code></pre>
		  </div>
		</el-card>
		<el-card class="call-result">
		  <div slot="header">
		    <span>话单</span>
		  </div>
		  <div class="content" v-loading="!callRecord"  element-loading-text="同步推送结果最多需要3分钟左右，请耐心等待！">
		  	<pre><code>{{callRecord}}</code></pre>
		  </div>
		</el-card>
	</div>
</template>

<script>

	export default {
		props : ['receive'],
		data : function(){
			return {
			}
		},
		computed : {
			
			dialog : function(){
				if(!this.receive.dialog){
					return '';
				}
				return JSON.stringify(JSON.parse(this.receive.dialog),null,2);
			},
			voice : function(){
				if(!this.receive.voice){
					return '';
				}
				return JSON.stringify(JSON.parse(this.receive.voice),null,2);
			},
			callRecord : function(){
				if(!this.receive.callRecord){
					return '';
				}
				return JSON.stringify(JSON.parse(this.receive.callRecord),null,2);
			},
			voiceUrl : function(){
				if(!this.receive.voice){
					return '';
				}
				let url = JSON.parse(this.receive.voice).url;
				return this.$global.getStaticFileUrl(url);
			}
		},
		methods : {
		}
	}

</script>

<style lang="less">
	.exp__result{
		width:100%;
		display:flex;
		justify-content:space-between;
		.call-result{
			width:30%;
			.content{
				height:300px;
				overflow:auto;
			}
		}
	}
</style>