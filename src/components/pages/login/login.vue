<template>
  <div class="login">
      <div class="login__form">

          <div class="login__log" :style="logoStyle" ></div>
          <div class="login__title">登录</div>
          <div class="login__error" :style="{visibility: !!errorTxt ? 'visible' : 'hidden'}" >{{errorTxt}}</div>
          <div style="position:absolute;top:-2000px">
            <input type="text"/>
            <input type="password"/>
          </div>
          <el-input id="account" @keyup.enter.native="submitLogin" :autofocus="true" class="login__input" v-model.trim="account" placeholder="请输入手机号码"></el-input>
          <el-input id="password" @keyup.enter.native="submitLogin"  class="login__input" type="password" v-model.trim="password" placeholder="请输入密码"></el-input>
         <div v-if="errorNum >= 3" class="login__verify__container">
            <el-input id="verify" @keyup.enter.native="submitLogin"   class="login__verify" v-model.trim="verifyCode" placeholder="图形验证码"></el-input>
            <span @click.stop="changeVerifyCode" class="login__verify__img" title="点击换一张">
                <img :src="verifyCodeUrl" alt="点击换一张" width="100" height="35">
            </span>
         </div>
          <el-button v-if="!loging" @click.stop="submitLogin" class="login__btn" type="primary" >登录</el-button>
          <el-button v-else class="login__btn" type="primary" :loading="true">登录中</span></el-button>
          <div class="login__opt">
              <el-checkbox v-model="remember">记住登录状态</el-checkbox>
              <div class="login__register">
                 <router-link class="link" :to="{path:'/'+bid+'/register'}">免费注册</router-link>
                 &nbsp;&nbsp;
                 <router-link class="link" :to="{path:'/'+bid+'/reset'}">忘记密码？</router-link>
              </div>
          </div>
          
      </div>
      <div class="login__footer"> &copy;{{copyright}}</div>
      <div class="login__bg" :style="bgStyle" ></div>
  </div>
</template>

<script>

import {getCreateVerifyImageUrl } from '@/api/yungo-api.js'//无用
import {login,createImgCode} from '@/api/uc.js'
import CryptoJS from 'crypto-js'

export default {
  name: 'login',
  data : function(){
      return {
          loading : false,
          account : this.$cookies.get('__account') || '',
          password : '',
          verifyCode : '',
          remember : true,
          loging : false, 
          isForceLogin : false,
          errorNum : 0,
          errorTxt:'',
          verifyCodeUrl :createImgCode(),
          logoUrl : '',
          bgUrl : '',
          bid : '',
          copyright : '电话机器人'
      }
  },
  computed : {
      bgStyle : function(){
        if(!this.bgUrl){
            return {};
        } 
        return {
          'background-image':  'url('+this.bgUrl+')'
        }
      },
      logoStyle : function(){
          if(!this.logoUrl) {
              return {};
          }
          return {
            'background-image': 'url('+this.logoUrl+')'
          }
      }
  },
  methods : {
    validateForm () {
      if(this.account == ''){
        this.errorTxt = '手机号不能为空';
        document.getElementById('account').focus();
        return false;
      }
      if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.account)){
        this.errorTxt = '手机号格式错误';
        document.getElementById('account').focus();
        return false;
      }

      if(this.password == ''){
        this.errorTxt = '密码不能为空';
        document.getElementById('password').focus();
        return false;
      }

      if(this.errorNum >= 3 && this.verifyCode == ''){
        this.errorTxt = '验证码不能为空';
        document.getElementById('verify').focus();
        return false;
      }
      return true;
    },
    submitLogin : function(){
      if(!this.validateForm()){
        return;
      }
      this.ajaxLogin(0);
    },
    ajaxLogin (kickOff){
      this.errorTxt = '';
      this.loging = true;

      let param = {
        phone : this.account,
        password : this.password,
        clientId : this.$global.getClientId(),
        kickOff : kickOff || 0
      }
      if(this.errorNum >= 3){
        param.verifyCode = this.verifyCode;
      }
      if(!!this.$global.getConfig('encrypt')){
         let  timestamp = new Date().getTime(),
              secKey =  'kxjl'+this.account+timestamp;
         let realKey = (function getKey(key) {
              var realKey = CryptoJS.SHA1(key);
              realKey = CryptoJS.SHA1(realKey).toString().substring(0, 32); 
              return realKey;
            })(secKey);
        var encrypt = CryptoJS.AES.encrypt(this.password, CryptoJS.enc.Hex.parse(realKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        param.timestamp = timestamp;
        param.password = encrypt.ciphertext.toString(CryptoJS.enc.Base64);
      }
      login(param).then( (resp) => {
        const code = this.$lodash.get(resp,'code','-1'),
          data = this.$lodash.get(resp,'result.rows[0]',null);
        if(code == 0 && data != null){
          let userObj = {
            account : param.phone,
            id : this.$lodash.get(data,'member.id',''),
            surname : this.$lodash.get(data,'member.surname',''),
            photo : this.$lodash.get(data,'member.headPhoto',''),
            bindStatus : this.$lodash.get(data,'member.bindStatus',''),
            token : this.$lodash.get(data,'token.access_token',''),
            master : this.$lodash.get(data,'member.master'),
            business : {
              id : this.$lodash.get(data,'business.id',''),
              name : this.$lodash.get(data,'business.name','')
            },
            dn : this.$lodash.get(data,'agent.dn','')
          };
          sessionStorage.setItem('__user',JSON.stringify(userObj));
          if(this.remember){
            this.$cookies.set('__account', this.account);
          }
          this.$global.getVersionInfo(this.account,userObj.business.id).then(url => {
            let p = '/report';
            if(!!this.$route.query.redirect){
                p = this.$route.query.redirect;
            }
            if(url){
              location.href = url + '#' + p;
            }else{
               this.$router.replace({ path: p || '/report' });
            }
          });
          return;
        }
        if(code != '200002'){
          this.errorNum++;
        }
        this.loging = false;
        if(code == "200001"){
          this.errorTxt = "请输入正确的密码";
          document.getElementById('password').focus();
        }else if(code == "200006"){
          this.errorTxt = "该手机号码未注册";
          document.getElementById('account').focus();
        }else if(code == "200005"){
          this.errorTxt = "图片验证码错误";
          document.getElementById('verify').focus();
        }else if(code == "200008"){
          this.errorTxt = "权限不足";
        }else if(code == "200009"){
          this.errorNum = 3
          this.errorTxt = "连续登录失败次数超过限制";
        }else if(code == '200002'){ //已经登录
          this.$confirm('您的账号已在另一台电脑登录，如非本人操作，则密码很可能已泄露。建议您修改密码', '登录提示', {
            confirmButtonText: '继续登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.ajaxLogin(1);
          }).catch( () => {})
        }else{
          this.errorTxt = "登录失败";
        }
        if(code != '200002' && this.errorNum >= 3){
          this.changeVerifyCode()
        }
      });
    },
    changeVerifyCode : function(){
      const url = createImgCode();
      this.verifyCodeUrl = url + '?t'+new Date().getTime();
    }
  },
  beforeRouteEnter : function(to, from, next){
    next(vm => {
      vm.bid = vm.$route.params.bid || 'yeta';
      localStorage.setItem('__bid',vm.bid);
      vm.logoUrl = 'static/kcdn/logo/'+vm.bid+'/logo.png';
      vm.bgUrl = 'static/kcdn/logo/'+vm.bid+'/bg.jpg';
    });
  },
  mounted : function(){
    this.$global.destroyData();
    let theme = sessionStorage.getItem('__theme'),
      themeObj = theme ? JSON.parse(theme) : {};
    this.copyright = themeObj.name + '电话机器人';
  }
}
</script>
<style src="@/assets/less/common.less" lang="less"></style>
<style lang="less">
  .login{
      background:#5D6C6E;
      min-height:100vh;
      overflow:hidden;
  }
  .login__log{
    position: absolute;
    height: 60px;
    background-position:center center;
    background-repeat:no-repeat;
    z-index: 10;
    margin-top: -120px;
    width: 100%;
    left: 0;
  }
  .login__form{
    position:absolute;
    top:50%;left:50%;
    transform: translate(-50%,-50%);
    width:400px;
    min-height:400px;
    background:#fff;
    box-sizing: border-box;
    z-index:10;
    padding: 40px 45px;
    border-radius: 5px;
  }
  .login__title{
    text-align: center;
    color: #333;
    font-size: 22px;
    font-weight: 600;
  }
  .login__error{
      text-align: left;
      border-radius: 3px;
      height:30px;
      line-height: 30px;
      margin-bottom: 8px;
      background: #f89fb6;
      font-size: 12px;
      text-indent: 15px;
      color: #a92f4f;
  }
  .login__input{
    margin-bottom:22px;
  }
  .login__verify__container{
    margin-bottom:15px;
  }
  .login__verify{
    display:inline-block;
    width:60%;
    vertical-align:top;
  }
  .login__verify__img{
    float:right;
    cursor:pointer;
  }
  .login__btn{
    width:100%;
    height:43px;
    margin-top:10px;
  }
  .login__opt{
    margin-top:20px;
    display: flex;
    justify-content: space-between;
  }
  .login__register{

  }
  .login__footer{
    position: fixed;
    bottom: 20px;
    text-align: center;
    width: 100%;
    z-index: 10;
    color: #fff;
    font-size: 16px;
  }
  .login__bg{
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    background-repeat : no-repeat;
    background-size: cover;
    z-index:0;
  }

</style>
