<template>
	<div class="jsonview">
		<div>
			<div class="title">请求参数</div>
			<div class="request content">
				<pre><code>{{JSON.stringify(request,null,2)}}</code></pre>
			</div>
		</div>
		<div>
			<div class="title">返回结果<span class="opt" title="全屏查看" @click.stop="showDetail(2)"></span></div>
			<div class="response content">
				<pre><code>{{JSON.stringify(response,null,2)}}</code></pre>
			</div>
		</div>

		<el-dialog
		  :title="title"
		  :visible.sync="dialogVisible"
		  :append-to-body="true"
		  top="3%"
		  width="55%"
		  :before-close="handleClose">
		  	<div>
		  		<pre><code>{{JSON.stringify(detail,null,2)}}</code></pre>
		  	</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		props : ['request','response'],
		data : function(){
			return {
				dialogVisible : false,
				detail : '',
				title : ''
			}
		},
		methods : {
			showDetail : function(type){
				if(type == 1){
					this.title = '请求参数';
					this.detail = this.request;
				}else{
					this.title = '返回结果';
					this.detail = this.response;
				}
				this.dialogVisible = true;
			}
		}
	}
</script>

<style lang="less">
	.jsonview{
		border:1px solid #f6f6f6;
		width:100%;
		.title{
			background-color:#f6f6f6;
			padding-left:5px;
			line-height:30px;
		}
		.opt{
			float:right;
			cursor:pointer;
            background:url("../../../../assets/images/small-icon.png") -74px -326px no-repeat;
            width: 30px;
    		height: 30px
		}
		.content{
			height:200px;
			overflow:auto;
			padding: 5px 10px;
		}
		.request.content{
			height:130px;
		}
		.response.content{
			height:300px
		}
	}
</style>