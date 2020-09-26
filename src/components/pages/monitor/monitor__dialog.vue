<template>
	<el-dialog :title="'通话详情-'+tel_number"  
		width="800px"
	  :visible.sync="show"
    :append-to-body="true"
    :before-close="beforeClose">
		<div class="see__table">
		  <div class="chat-box" id="chat_box">
		    <ul>
		      <template v-for="(item,index) in detailData">
  		        <li v-if="item.role === 'robot'" class="robot" :key="index">
  		          	<div class="icon-box"></div>
  		          	<div class="text-box">
  		          		<div class="node-name">{{item.nodeName}}</div>
  		            	<span class="content">{{item.output}}</span>
  		          	</div>
  		        </li>
  		        <li v-else class="user" :key="index">
  		          <div class="icon-box"></div>
  		          <div class="text-box">
  		            <span class="content">{{item.input}}</span>
  		            <div v-if="item.hits.length > 0" class="hit-node">命中节点：{{item.hits[0].hit}}</div>
  		          </div>
  		        </li>
		      </template>
		    </ul>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
		    <el-button @click.stop="takeover" :disabled="isSubmit" type="primary">接管</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {mapState} from 'vuex'
  import {queryRealTimeCallDetail} from '@/api/kylin.js'
	export default {
		name : 'monitor__config',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','calluuId','telNumber'],
		data : function () {
			return {
				detailData:[],
        getNewDataTimer : null,
        tel_number:this.telNumber
			}
		},
		computed : {
			...mapState('user',[
				'business'
            ])
		},
    mounted(){
      this.searchRealTimeDetailData()
    },
		methods : {
      searchRealTimeDetailData(){
        clearTimeout(this.getNewDataTimer);
        queryRealTimeCallDetail({
          business_id:this.business.id,
          sys_type:this.$config.system.id,
          calluuid:this.calluuId
        }).then((res)=>{
          if(res.code==0){
            this.detailData=this.$lodash.get(res,'result.rows',{}); 
            this.$nextTick(function(){
              var scrollDom = document.getElementById('chat_box');
              scrollDom.scrollTop = scrollDom.scrollHeight
            })
            this.getNewDataTimer = setTimeout(()=>{ this.searchRealTimeDetailData(); },3000);  
          }else{
            if (res.code=='500000') {
              this.$message.error(res.messageExt);
            }else{
              this.$message.error('监控失败');  
            }
          }
        })
      },
			//events
			beforeClose : function(){
        this.$phone.handup()
        clearTimeout(this.getNewDataTimer);
        this.$emit('change',false);

			},
			cancel : function(){
        this.$phone.handup()
        clearTimeout(this.getNewDataTimer);
				this.$emit('change',false);
			},
      takeover : function(){
        clearTimeout(this.getNewDataTimer);
        queryRealTimeCallDetail({
          business_id:this.business.id,
          sys_type:this.$config.system.id,
          calluuid:this.calluuId
        }).then((res)=>{
          if(res.code==0){//判断是不是已经被他人接管
            this.$emit('takeover',false);
            setTimeout(()=>{
              this.$emit('change',false);
            },1000)
          }else{
            if (res.code=='500000') {
              this.$message.error(res.messageExt);
            }else{
              this.$message.error('监控失败');  
            }
          }
        })
        
      }
		},
    beforeDestroy : function(){
      console.log('beforeDestroy1')
      this.$phone.handup()
      clearTimeout(this.getNewDataTimer);
    }
	}
</script>

<style scoped>
	.chat-box{
    height:550px;
    overflow: auto;
  }
	.chat-box li{
    list-style: none;
    display: flex;
    margin-bottom: 30px;
    padding: 0 15px;
  }
  .chat-box ul{
    padding-left: 0;
  }
  .chat-box .user{
    flex-direction: row-reverse;
    position:relative;
    margin-bottom: 40px;
  }
  .chat-box .icon-box {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-size: contain;
  }
  .chat-box .robot .icon-box {
    background: url(./images/robot2.png)  -5px -5px no-repeat;
  }
  .chat-box .user .icon-box {
    background: url(./images/customer.png)  -5px -5px no-repeat;
  }
  .chat-box .user .icon-tips{
    position:absolute;
    right: 80px;
    bottom:-20px;
    color: #00b792;
  }
  .chat-box .text-box {
    border-radius: 4px;
    padding: 10px;
    max-width: 50%;
    position: relative;
  }
  .chat-box .role-name{
    position: absolute;
    top: -25px;
    white-space:nowrap;
    color: #d1d1d1;
  }
  .chat-box .text-speed{
    position: absolute;
    bottom: -24px;
    color: #44b3ff;
    font-size: 12px;
     white-space:nowrap;
  }
  .chat-box .robot .role-name{
      left: 0px;
  }
  .chat-box .user .role-name{
      right: 0px;
  }
  .chat-box .robot .text-speed{
     left: 0;
  }
  .chat-box .user .text-speed{
      right: 0px;
  }

  .chat-box .node-box{
    display: flex;
  }
  .chat-box .chat-player-box{
    height: 20px;
    width: 100px;
    margin-left: 10px;
  }
  .chat-box .text-box span{
    display: block;
  }
  .chat-box .text-box .node-name{
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .chat-box .text-box .hit{
    font-size: 12px;
    color: #999;
    margin-top:5px;
  }

  .chat-box .user .text-box{
    margin-right: 20px;
    background: #d0eeff;
    border: 1px solid #acd9f3;

  }

  .chat-box .robot .text-box{
    margin-left: 20px;
    border: 1px solid #eae9e9;
  }

  .chat-box .text-box:after,.chat-box .text-box::before{
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    top: 10px;
  }

  .chat-box .robot .text-box:after{
    left: -12px;
    border-right-color: #fff;
  }
  .chat-box .robot .text-box:before{
    left: -13px;
    border-right-color: #eae9e9;
  }

  .chat-box .user .text-box:after{
    right: -12px;
    border-left-color: #d0eeff;
  }
  .chat-box .user .text-box:before{
    right: -13px;
    border-left-color: #acd9f3;
  }

</style>