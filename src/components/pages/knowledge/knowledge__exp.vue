<template>
	<el-dialog
          :title="title"
          :visible.sync="show"
          :append-to-body="true"
          :before-close="beforeClose"
          width="530px">
   		<div class="knowledge__exp">
   			<div class="body">
   				<div class="body__item robot">
   					<span class="body-txt answer-txt">您好，很高兴为您服务，请问有什么需要帮您的</span>
   				</div>
   				<template v-for="item in interList">
   					<div v-if="item.type == 'analyzed' " class="body__item robot" >
   						<span class="body-txt analyzed-txt">{{item.content}}</span>
					</div>
					<div v-else-if="item.type == 'answer' " class="body__item robot" >
   						<span class="body-txt answer-txt">{{item.content}}</span>
					</div>
                    <div v-else-if="item.type == 'audio' "class="body__item robot">
                        <span class="body-txt answer-txt player-box">
                            <Player class="player-btn" v-if="item.content !== ''" :src="formatUrl(item.content)" :pause-key="pauseKey"></Player>
                        </span>
                    </div>
					<div v-else class="body__item customer" >
   						<span class="body-txt question-txt">{{item.content}}</span>
					</div>
   				</template>
   				<div id="bottom"></div>
   			</div>
   			<div class="input">
   				<el-input :autofocus="true" @keyup.enter.native="send" v-model.trim="question">
   				</el-input>
   			</div>
   			<div class="opt">
   				<el-button @click.stop="send" type="primary" size="small">发送</el-button>
   			</div>
   		</div>
    </el-dialog>
</template>

<script>
	
	import {analyze,queryByOr} from '@/api/brainkb.js'
    import Player from '@/components/common/player/player'
	export default {
		name : 'know-exp',
		model : {
			prop : 'show',
			event : 'change'
		},
		props : ['show','cname'],
		data : function(){
			return {
				question : '',
				interList : [],
                playingRef :'',
                pauseKey: Symbol('pauseKey'),
			}
		},
		computed : {
			title : function(){
				return '欢迎体验'+this.cname;
			}
		},
		methods : {
			beforeClose : function(){
				this.$emit('change',false);
			},
            formatUrl : function(url){
                return this.$global.getStaticFileUrl(url);
            },
			send : function(){
				if(!this.question){
					return;
				}
				var _this = this;
				let param = {
					content: this.question,
                    kbName: this.cname,
                    threshold: 0,
                    analyzed : 1,
                    source :1
				}
				_this.interList.push({type : 'question',content : this.question});
				document.getElementById('bottom').scrollIntoView();
				Promise.all([analyze(param),queryByOr(param)]).then(function(values){
					let aResp = values[0],
						orResp = values[1];
					let analyzed = _this.$lodash.get(aResp,'result.rows[0].analyzed',''),
						analyzedObj = { type : 'analyzed' ,content : analyzed};
					let answer = _this.$lodash.get(orResp,'result.rows[0].answer',null),
						answerObj = null;
					if(!answer){
						answerObj = {type:'answer',content : '您的问题已超出范围'}
					}else{
                        if(answer.contentType == 'text'){
                            answerObj = {type:'answer',content : answer.answer}
                        }else if(answer.contentType == 'audio'){
                            answerObj = {type:'audio',content : answer.answer,id :answer.id}
                        }
					}
					_this.interList.push(analyzedObj,answerObj);
					setTimeout(()=>{document.getElementById('bottom').scrollIntoView();},500)
					_this.question = '';
				});
			}
		},
        components: {
            Player
        }
	}
</script>

<style lang="less">
	@import (reference) "../../../assets/less/var.less";
	.knowledge__exp{
		.body{
			height:300px;
			overflow-y:auto;
			.body__item{
				margin:15px 0 30px 0;
				.body-txt{
					display:inline-block;
					padding:10px;
					border-radius: 4px;
				}
				.answer-txt{
					background-color:#d0e8f4;
				}
				.question-txt{
					background-color:@base-color;
					color:#fff;
				}
				.analyzed-txt{
					background-color:#f3f4f4;
					color:#666;
				}
			}
			.body__item.robot{
				text-align:left;
			}
			.body__item.customer{
				text-align:right;
			}
		}
		.input{
			border-top:1px solid #eee;
			.el-input__inner{
				border:none;
				overflow:hidden;
			}
		}
		.opt{
			text-align:right;
		}
        .player-box{
            width:30px;
            height:30px;
            display:flex;
            align-items:center;
            justify-content:center;
        }
        .player-btn{
            width:30px;
            height:30px;
        }
	}
</style>