<style scoped>
	.notice{
		position: fixed;
		top:67px;
		right:40px;
		background: #fff;
		border:1px solid #e5e5e5;
		width:270px;
		border-radius: 4px;
		z-index: 300;
	}
	.notice-title{
		padding:10px;
		font-size:14px;
		color:#424242;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>

<template>
	<div class="notice">
		<div class="notice-title">{{title}}<el-button @click.stop="close" size="mini">关闭</el-button></div>
		<div class="notice-body">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props : ['title'],
		data : function(){
			return {

			}
		},
		methods : {
			close (){
				this.$emit('close')
			}
		}
	}
</script>