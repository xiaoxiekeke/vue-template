<template>
	<div class="tag__inner" :class="{disabled : disabled}">
		<template v-for="item in tag_intention">
			<div v-if="!disabled"  @click.stop="tagClick(item.value)"
				class="tag__item" 
				:class="{selected : value == item.value}">
				{{item.label}}
			</div>
			<div v-else class="tag__item" 
				:class="{selected : value == item.value}">
				{{item.label}}
			</div>
		</template>
		
	</div>
</template>

<script>
	import {queryLabelOptionList} from '@/api/bm.js'

	export default {
	 	model: {
		    prop: 'value',
		    event: 'change'
	  	},
		props : ['value','disabled'],
		name : 'tag',
		data : function () {
			return {
				tag_intention : []
			}
		},
		methods : {
			tagClick : function(val){
				this.$emit('change',val)
			}
		},
		mounted : function(){
			queryLabelOptionList().then(resp => {
				let rows = this.$lodash.get(resp,'result.rows',[]),
					tag_intention = [];
				for(let row of rows){
					tag_intention.push({label : row.name,value : row.name})
				}
				this.tag_intention = tag_intention;
			});
		}
	}
</script>

<style lang="less">
@import (reference) "../../../assets/less/var.less";

	.tag__inner{
		width:100%;
		border:1px solid #ccc;
		border-bottom:none;
	    box-sizing: border-box;
		.tag__item{
			height:26px;
			line-height:26px;
			text-align:center;
			border-bottom:1px solid #ccc;
			cursor:pointer;
		}
		.tag__item:hover,.tag__item.selected{
			background-color:@base-color;
			border-color:@base-color;
			color:#fff;
		}
	}

	.tag__inner.disabled{
		.tag__item{
		    cursor: not-allowed;
		}
		.tag__item:hover{
			background-color:inherit;
			border-color:#ccc;
			color:inherit;
		}
		.tag__item.selected:hover{
			background-color:@base-color;
			border-color:@base-color;
			color:#fff;
		}
	}
</style>