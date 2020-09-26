<style scoped>
	.el-timeline{
		padding-left: 30px;
	}
	.el-timeline-item{
		/*padding-left: 100px;*/
		position: relative;
    padding-bottom: 30px;
	}
	.el-timeline-item__tail {
	    position: absolute;
	    left: 4px;
	    height: 100%;
	    border-left: 2px solid #e4e7ed;
	}
	.el-timeline-item__wrapper{
		position: relative;
    padding-left: 28px;
    top: -3px;
	}
	.el-timeline-item__wrapper h4{
		margin: 0px;
	}
	.el-timeline-item__node {
	    position: absolute;
	    background-color: #e4e7ed;
	    border-radius: 50%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
	.el-timeline-item__node--normal {
	    left: -1px;
	    width: 12px;
	    height: 12px;
	}
	.el-timeline-item__timestamp{
		margin-bottom: 10px;
    padding-top: 10px;
    color: #909399;
    line-height: 1;
    font-size: 13px;
	}
</style>
<template>
	<div class="page">
		<h3>更新日志</h3>
	  <div class="el-timeline">
	    <div class="el-timeline-item" v-for="(item,index) in logItems" :key="index">
	    	<div class="el-timeline-item__tail"></div>
	    	<div class="el-timeline-item__node el-timeline-item__node--normal"></div>
	    	<div class="el-timeline-item__wrapper">
    		  <h4>{{item.title}}</h4>
	    		<div class="el-timeline-item__timestamp">
	    			{{item.time}}
	    		</div>
	    		<el-card v-if="item.updateContent.length>0">
	    		  <p v-for="(item2,index2) in item.updateContent" :key="index2">{{item2.content}}</p>
	    		</el-card>
	    	</div>
	    </div>
	  </div>
	</div>
</template>
<script>
	import {getUpdateLog} from '@/api/jsondata.js'

	export default {
		name : '',
		data : function(){
			return {
				logItems:[]
			}
		},
		mounted:function(){
			getUpdateLog().then((res)=>{
				if (res&&res.logItems) {
					this.logItems=res.logItems
				}
			})
		},
		components : {
			
		}
	}
</script>