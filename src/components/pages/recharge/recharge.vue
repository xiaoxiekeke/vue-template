<template>
	<div class="page recharge" v-loading="loading" >
    	<p class="recharge__title">企业付费</p>
    	<div v-show="!show.detail" class="recharge__detail" >
            <div class="recharge__info">
            	<p class="recharge-head">当前状态</p>
            	<div>
                    话费余额：<span class="hightlight">{{baseInfo.totalMoney}}</span>&nbsp;元
                    <span class="margin-left-20">可用通话时长：<span class="hightlight">{{baseInfo.canUseAmount}}</span></span>
                </div>
                <p class="recharge-head" style="margin-top:30px">充值</p>
                <div class="recharge__money">充值金额：
                    <el-input class="recharge-input" maxlength="5" v-model="charge" @keyup.native="chargeInput"></el-input>&nbsp;&nbsp;元
                </div>
                <div>
                    <div v-for="chargeItem in chargeList" 
                        @click.stop="chargeChange(chargeItem)" 
                        class="money-choice" :class="{selected : charge == chargeItem}">{{chargeItem}}</div>
                </div>
            </div>
            <div class="recharge__pay-opt">
			     <el-button type="info" disabled v-if="business.status != 2 || charge <= 0" 
                    class="recharge__pay-btn">
			     下一步 选择支付方式</el-button>
			    <el-button v-else type="primary" @click.stop="next('recharge')" class="recharge__pay-btn" >下一步 选择支付方式</el-button>
			    <span v-if="business.status == 3" >
			    	企业认证失败，请<a class="link" href="#/info">重新认证</a>后进行购买
			    </span>
			    <span v-else-if="business.status == 1">企业认证中，请通过认证后购买</span>
			    <span v-else-if="business.status != 2">
			    	本产品目前只对已企业认证的用户开放，请<a href="#/info" class="link">认证</a>>后进行购买</span
			    </span>
			</div>
        </div>
        <div v-if="show.detail">
            <recharge-order :data="orderInfo" @alipayOk="alipayOk" @offlineOk="offlineOk" @destroy="goBack"></recharge-order>
        </div>
    </div>
</template>

<script>
 	import {mapState, mapActions} from 'vuex'
	import {queryEntAuthByBusId} from '@/api/bm.js'
	import {queryFeeAccountById,getAliPayUrl} from '@/api/fee.js'
    import RechargeOrder from './recharge__order'

	export default {
        name : 'recharge',
		data : function(){
			return {
				loading : true,
				show : {
                    success : false,
                    detail : false
                },
                baseInfo : {
                    totalMoney : null,
                    canUseAmount : ''
                },
                info : {
                    totalPrice : 0, //总价格
                    savePrice : 0 //节省价格
                },
                orderInfo : {}, //订单信息
                charge : 3000,
                chargeList : [3000,5000,8000,10000,15000]
			}
		},
		computed : {
			 ...mapState('user',[
                'business',
                'account'
            ])
		},
	  	methods : {
	  		...mapActions('user',[
                'modifyBusiness'
            ]),
            goBack : function(type){
                if(type == 'renew'){
                    this.show.renew = false;
                }else{
                    this.show.detail = false;
               }
            },
            //话费
            chargeChange : function(val){
                this.charge = val;
            },
            chargeInput: function (event) {
                let val = event.target.value;
                val = val.replace(/\D/g,'');
                event.target.value = val;
                if(val != '' && !isNaN(val)){
                    this.charge = parseInt(val);
                }else{
                    this.charge = '';
                }
            },
            //选择支付方式
            next : function(type){
                const _this = this,
                      bid = _this.business.id;
                switch(type){
                    case 'recharge' :
                        _this.orderInfo = {
                            type : 'recharge',
                            businessId : bid,
                            channelCode : _this.$config.system.id,
                            callBackUrl : window.location.href.split("#")[0] + "#/recharge",
                            payUser : _this.account,
                            charge : _this.charge,
                            alipayUrl : getAliPayUrl()
                        };
                        break;
                }
                this.show.detail = true;
            },
            offlineOk : function(){
                this.show.detail = false;
            },
            alipayOk : function(){
                this.show.detail = false;
            }
        },
        mounted : function(){
        	const _this = this;
            Promise.all([queryEntAuthByBusId(),queryFeeAccountById()]).then(function(values){
                let status = _this.$lodash.get(values,'[0].result.rows[0].status',''),
                	feeInfo = _this.$lodash.get(values,'[1].result.rows[0]',null),
                	totalMoney = feeInfo&&feeInfo.totalMoney ? Number(feeInfo.totalMoney).toFixed(2) : '0.00',
                    canUseAmount = feeInfo&&feeInfo.canUseAmount ? feeInfo.canUseAmount : '0';
                _this.modifyBusiness({status : status});
                _this.baseInfo.totalMoney = totalMoney;
                _this.baseInfo.canUseAmount = canUseAmount == -1 ? '不限量' : canUseAmount + '分钟';
                _this.loading = false;
            });
        },
        components : {
            'recharge-order' : RechargeOrder
        }
	}
</script>

<style lang="less" src="./recharge.less" scoped></style>