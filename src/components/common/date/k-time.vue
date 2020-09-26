<template>
	<div>
		<el-date-picker class="k-time__container"
		    v-model="curDate"
		    :clearable="false"
		     type="datetime"
		    :editable="false"
		    :placeholder="placeholder"
		    :disabled = "disabled"
		    @change="dateChange"
		    :picker-options="pickerOptions2"
		    align="right">
	    </el-date-picker>

	</div>
</template>

<script>

export default {
	model : {
		prop : 'value',
		event : 'change'
	},
	props : {
		value : {type : String},
		quick : {type : Boolean,default : true},
		placeholder : {type : String,default : '请选择时间'},
		disabled : {type : Boolean,default : false}
	},
	data : function(){
		return {
			curDate : null
		}
	},
	watch : {
		value : function(val,oldVal){
			this.curDate = val ? new Date(val) : null;
		}
	},
	computed : {
		pickerOptions2 : function(){
			var _this = this;
			if(this.quick){
				return {
			         shortcuts: [{
			            text: '10分钟后',
			            onClick(picker) {
			            	const start = new Date();
			            	start.setTime(start.getTime() + 10 * 60 * 1000);
		            	   picker.$emit('pick', start);
			            }
			          }, {
			            text: '30分钟后',
			            onClick(picker) {
			              const start = new Date();
			            	start.setTime(start.getTime() + 30 * 60 * 1000);
		            	   picker.$emit('pick', start);
			            }
			          }, {
			            text: '1小时后',
			            onClick(picker) {
			               	 const start = new Date();
			            	start.setTime(start.getTime() + 60 * 60 * 1000);
		            	   picker.$emit('pick', start);
			            }
		          	}, {
			            text: '2小时后',
			            onClick(picker) {
		               		 const start = new Date();
			            	start.setTime(start.getTime() + 2* 60 * 60 * 1000);
		            	   picker.$emit('pick', start);
			            }
		          	}]
		        } 
			}
			
			return null;
		}
	},
	methods : {
		dateChange : function(val){
			this.$emit('change',this.$moment(val).format("YYYY-MM-DD HH:mm:ss"));
		}
	}
}

</script>

<style scope>
	.k-time__container{
		width:100% !important;
	}
</style>