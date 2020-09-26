<template>
	<div>
		<el-date-picker class="k-date__container"
				:size="size"
		    v-model="curDate"
		    type="daterange"
		    :editable="false"
		    range-separator="至"
		    start-placeholder="开始日期"
		    end-placeholder="结束日期"
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
		value : {type : Array,default : []},
		size : {type : String},
		limitLastOneYear:{type:Boolean,default:false}
	},
	data : function(){
		 let self = this
		return {
			curDate :  this.value.length > 0 ? [new Date(this.value[0]),new Date(this.value[1])] :[] ,
			pickerOptions2: {
						disabledDate(time) {
							if (!!self.limitLastOneYear) {
								return time.getTime() > Date.now()||(time.getTime() +31536000000< Date.now());
							}else{
								return false
							}
	          },
		        shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		            	const now = new Date();
			            picker.$emit('pick', [now, now]);
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
		              picker.$emit('pick', [start, start]);
		            }
		          }, {
		            text: '过去7天',
		            onClick(picker) {
		               	const end = new Date();
		              	end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
			            const start = new Date();
			            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			            picker.$emit('pick', [start, end]);
		            }
	          	}, {
		            text: '过去30天',
		            onClick(picker) {
	               		const end = new Date();
		              	end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
			            const start = new Date();
			            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
			            picker.$emit('pick', [start, end]);
		            }
	          	}]
	        }
		}
	},
	methods : {
		dateChange : function(val){
			if(val == null){
				this.$emit('change',[]);
			}else{
				this.$emit('change',[this.$moment(val[0]).format('YYYY-MM-DD'),this.$moment(val[1]).format('YYYY-MM-DD')]);
			}
		}
	}
}

</script>

<style scope>
	.k-date__container{
		width:100% !important;
	}
</style>