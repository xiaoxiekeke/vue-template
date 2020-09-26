<template>
	<div class="recharge__order">
         <div class="product-info">
            <p class="product-info__head">
                <span class="title">产品清单</span>
                <span @click.stop="destroy" class="back"><返回</span>
            </p>
			<div class="product-info__list">
			    <table width="100%" cellspacing="0" cellpadding="0" class="xm-table">
			        <tbody>
			            <tr><th>产品名称</th><th>充值</th><th>合计</th></tr>
			            <tr>
			                <td>yeta电话机器人充值</td>
			                <td>{{data.charge}}元</td>
			                <td>{{data.charge}}元</td>
			            </tr>
			        </tbody>
			    </table>
			</div>
			<p class="product-info__total">合计：<span class="money">{{data.charge}}元</span></p>
        </div>

        <div class="pay-way">
            <p class="pay-way__head"><span class="title">选择支付方式</span></p>
            <div class="pay-way__list">
                <div @click.stop="switchPay(2)" :class="{selected:payChannel == 2}" class="pay-way-item pay-way--alipay"></div>
                <div @click.stop="switchPay(1)" :class="{selected:payChannel == 1}" class="pay-way-item pay-way--business"></div>
            </div>
            <div class="pay-way__businfo">
                <div v-show="payChannel == 1" class="pay-way__account">
                    <div class="act-img">对公转账</div>
                    <div class="act-info">
                        
                    </div>
                </div>
                <div v-show="payChannel == 1"  class="pay-way__form">
                    <div class="pay-way__form-item">
                        <label class="pay-way__lbl">付款账户名<em class="text-red">*</em></label>
                        <el-input class="pay-way__input" @keyup.native="payAccountDescInput" v-model="payAccountDesc" maxlength="30"  type="text" placeholder="公司名或银行账户名"></el-input>
                        <em class="text-red" v-if="isValidate && accountDescError">{{accountDescError}}</em>
                    </div>
                    <div class="pay-way__form-item">
                        <label class="pay-way__lbl">付款卡号<em class="text-red">*</em></label>
                        <el-input class="pay-way__input" v-model="payAccount" maxlength="20" @keyup.native="payAccountInput" type="text" placeholder="银行卡号"></el-input>
                        <em class="text-red" v-if="isValidate && accountError">{{accountError}}</em>
                    </div>
                    <div >
                        <label class="pay-way__lbl"></label>
                        <span class="account-format">{{accountFormat}}</span>
                    </div>
                    <div>
                        <label class="pay-way__lbl">&nbsp;</label>
                        <span class="pay-way__txt text-red" v-if="uploadError">{{uploadError}}</span>
                        <span :title="orgFileName" v-else class="pay-way__txt" >{{orgFileName || '付款截图'}}</span>

                        <el-upload name="object" class="pay-way__upload" :show-file-list="false" 
                            :data="uploadData" 
                            :action="uploadUrl"
                            :before-upload="beforeUpload" 
                            :on-error="onError"
                            :on-success="onSuccess">
                            <el-button type="text" :loading="uploading">{{uploadTxt}}</el-button>
                        </el-upload>
                    </div>
                </div>
            </div>
            <div class="pay-way__opt">
                <el-button type="primary" v-if="payChannel == 1 && this.accountError == '' 
                    && this.accountDescError==''" 
                    @click.stop="offlineSubmit" class="pay-way-btn">提交
                </el-button>

                <el-button type="info" disabled v-else-if="payChannel == 1" class="pay-way-btn">提交</el-button>

                <form id="alipay__form" v-if="payChannel == 2" :action="data.alipayUrl" method="post" target="_blank" name="alipay">
                    <input type="hidden" name="payType" :value="payType" />
                    <input type="hidden" name="businessId" :value="data.businessId" />
                    <input type="hidden" name="channelCode" :value="data.channelCode" />
                    <input type="hidden" name="callBackUrl" :value="data.callBackUrl" />
                    <input type="hidden" name="payUser" :value="data.payUser" />
                    <input v-if="data.type == 'robot'" type="hidden" name="productId" :value="data.productId" />
                    <input v-if="data.type == 'recharge' " type="hidden" name="payMoney" :value="data.charge" />
                    <input v-if="data.type == 'robot' " type="hidden" name="orderCount" :value="data.orderCount" >
                    <input v-if="data.type == 'robot'" type="hidden" name="orderTime" :value="data.orderTime" />
                    <el-button type="primary" @click.stop="alisubmit" class="pay-way-btn">提交</el-button>
                </form>
            </div>
        </div>

        <el-dialog title="正在支付中"  width="30%" :append-to-body="true"
              :visible.sync="alipayVisible" >
            <span>您好！请在支付宝中完成付款！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.stop="alipayOk">已完成付款</el-button>
            </span>
        </el-dialog>

         <el-dialog title="对公转账提交"  width="30%" :append-to-body="true"
              :visible.sync="offlineVisible" >
            <span>您提交的对公转账申请已提交，我们将尽快核实，核实成功后将为您的账号充值</span>
            <span slot="footer" class="dialog-footer">
                 <el-button @click.stop="offlineOk">好的</el-button>
                <el-button type="primary" @click.stop="consumption">查看记录</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import {mapState} from 'vuex'
import {offlinePay} from '@/api/fee.js'
import {getUploadUrl} from '@/api/yungo-oss'

export default {
    props : {
        data : {type : Object}
    },
    data : function(){
        return {
            payChannel : 2,
            orgFileName : '',
            payAccount : '',
            payAccountDesc : '',
            isValidate : false,
            //
            uploadData : {
                targetPath : ''
            },
            alipayVisible : false,
            offlineVisible : false,
            uploading : false,
            uploadUrl : getUploadUrl(),
            uploadError : ''
        }
    },
    computed : {
        ...mapState('user',[
            'business',
            'account'
        ]),
        payType : function(){
            if(this.data.type == 'robot'){
                return 3;
            }else if(this.data.type == 'recharge'){
                return 1;
            }
            return '';
        },
        accountError : function(){
            if(this.payAccount == ''){
                return '请输入银行卡号';
            }
            return '';
        },
        accountDescError : function(){
            if(this.payAccountDesc == ''){
                return '请输入公司名或银行账户名';
            }else if(!/^([a-zA-Z0-9\u4e00-\u9fa5]{2,30})$/.test(this.payAccountDesc)){
                return '请输入合法的名称';
            }
            return '';
        },
        accountFormat : function () {
            if(this.payAccount == '')
                return '';
            return this.payAccount.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
        },
        uploadTxt : function(){
            if(this.uploading){
                return '正在上传'
            }
            if(this.orgFileName){
                return '重新上传';
            }
            return '上传';
        }
    },
    methods : {
        destroy : function(){
            this.$emit('destroy');
        },
        switchPay : function(payChannel){
            this.payChannel = payChannel;
        },
        alisubmit : function(){
            document.getElementById('alipay__form').submit();
            this.alipayVisible = true;
        },
        payAccountInput : function(event){
            let val = event.target.value;
            val = val.replace(/\D/g,'');
            event.target.value = val;
            this.payAccount = val;
        },
        payAccountDescInput : function(){
            let val = event.target.value;
            val = val.replace(/([^a-zA-Z0-9\u4e00-\u9fa5])+/g,'');
            event.target.value = val;
            this.payAccountDesc = val;
        },
        offlineSubmit : function(){
            var _this = this;
            _this.isValidate = true;
            if(_this.accountError != '' || _this.accountDescError!='')
                return;
            let param = {
                payType : this.payType,
                businessId : this.business.id,
                payAccount : this.payAccount,
                payAccountDesc : this.payAccountDesc,
                annex : this.uploadData.targetPath,
                channelCode : this.$config.system.id,
                payUser :  this.account,
                payMoney : this.data.charge,
            };
            offlinePay(param).then(function(data){
                if(data.code == 0){
                    _this.offlineVisible = true;
                }else{
                    _this.$message({message: '提交失败',type: 'error'});
                }
            });
        },
        beforeUpload : function(file){
            let orgFileName = file ? file.name : '',
                suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1).toLowerCase() : '';
            if(["png","jpg"].indexOf(suffix) < 0){
                this.uploadError = '图片格式不正确';
                return false;
            }
            if(file.size / 1024 > 1024 * 5){
                this.uploadError = '图片大小不能超过5MB';
                return false;
            }
            this.uploadError = '';
            this.uploading = true;
            this.orgFileName = orgFileName;
            this.uploadData.targetPath = '/pay/'+this.business.id+'_'+new Date().getTime()+'.'+suffix;
        },
        onError : function(err, file, fileList){
            this.uploadError = '上传失败';
            this.uploading = false;
            this.orgFileName = '';
            this.fileName = '';
        },
        onSuccess : function(resp, file, fileLis){
            this.uploading = false;
            if(resp.code != '0'){
                this.uploadError = this.$lodash.get(resp,'messageExt','上传失败');
                return;
            }
            this.fileName = this.$lodash.get(resp,'result.rows[0].fileName','');
        },
        offlineOk : function(){
            this.offlineVisible = false;
            this.$emit('offlineOk');
        },
        alipayOk : function(){
            this.alipayVisible = false;
            this.$router.push({path:'/consumption/2'});
            this.$emit('alipayOk');
        },
        consumption : function(){
            this.offlineVisible = false;
            this.$router.push({path:'/consumption/2'});
            this.$emit('offlineOk');
        }
    },
    mounted : function(){
        
    }
}

</script>

<style lang="less" scope>

     .pay-way{
        background: #fff;
        padding: 20px 25px;
        margin-top:15px;
        .pay-way__list{
            margin-top:25px;
            margin-bottom:45px;
        }
        .pay-way-item{
            display: inline-block;
            width: 138px;
            height: 45px;
            cursor: pointer;
            position: relative;
        }
        .pay-way--alipay{
            background: url(./images/alipay-btn.png) no-repeat;
        }
        .pay-way--business{
            background: url(./images/bank-btn.png) no-repeat;
        }
        .pay-way__list .pay-way--business{
            margin-left: 30px;
        }
        .pay-way-item.selected:after{
            display: inline-block;
            content: '';
            background: url(./images/set-pay-money.png) no-repeat;
            position: absolute;
            width: 27px;
            height: 16px;
            bottom: 0px;
            right: 0;
        }
        .pay-way__opt{
            margin-top:25px;
        }
        .pay-way-btn{
            width: 200px;
        }
        .pay-way__account{
            width: 400px;
            height: 90px;
            border: 1px solid #ccc;
            .act-img{
                background: url(./images/icon-dg.png) center center no-repeat;
                display: inline-block;
                padding-top: 55px;
                text-align: center;
                width: 90px;
                color: #1ab394;
                font-size: 12px;
                vertical-align: top;
            }
            .act-info{
                display: inline-block;
                border-left: 1px solid #ccc;
                padding: 5px 0 5px 24px;
                height: 88px;
            }
            .act-info-item{
                margin:5px;
            }
        }
        .pay-way__form{
            margin-top:15px;
           .pay-way__form-item{
                height: 44px;
                line-height: 44px;
                margin: 10px 0;
            }
            .pay-way__lbl{
                width: 90px;
                text-align: left;
                font-weight: normal;
                display: inline-block;
            }
            label.recharge_upload{
                color: #ffc12b;
                text-decoration: underline;
                margin-left: 10px;
                font-weight: normal;
                cursor: pointer;
            }
            .pay-way__input{
                width:310px;
            }
            .account-format{
                padding-left: 7px;
                font-weight: 700;
                font-size: 16px;
                font-style: italic;
            }
        }
        .pay-way__upload{
            display: inline-block;
            margin-left: 10px;
            vertical-align:4px;
        }
        .pay-way__txt{
            max-width: 240px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .product-info{
        background: #fff;
        padding: 20px 25px;
        .product-info__head{
            background: #fff;
            margin:0;
            padding-top:15px;
        }
        .product-info__list{
            margin-top: 20px;
        }
        .product-info__total{
            text-align: right;
            .money{
                font-size: 26px;
                color: #1ab394;
            }
        }
        .back{
            float: right;
            color: #1ab394;
            cursor: pointer;
            font-weight: normal;
        }
        .title{
            font-weight: bold;
        }
        .xm-table{
            min-width: 300px;
            border-collapse: collapse;
            width: 100%;
            border: 1px solid #dfdfdf;
            table-layout: fixed;
            tr,th{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 8px;
                padding-left: 8px;
                height: 42px;
                background-color: #eee;
                text-align: center;
                font-weight: 700;
                font-size: 12px;
                color: #898989;
            }
            td{
                min-width: 40px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 8px;
                padding-left: 8px;
                height: 42px;
                text-align: center;
                background-color: #fff;
                border: 1px solid #dfdfdf;
                font-size: 12px;
                color: #898989;
                font-weight: normal;
            }
        }
    }
    

</style>