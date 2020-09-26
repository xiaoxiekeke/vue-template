<template>
  <div class="login">
      <div class="login__form">
          <div class="login__log"></div>
          <div class="login__title">登录</div>
          <div class="login__error" :style="{visibility: !!errorTxt ? 'visible' : 'hidden'}" >{{errorTxt}}</div>
          <el-input id="account" @keyup.enter.native="login" :autofocus="true" class="login__input" v-model.trim="account" placeholder="请输入手机号码"></el-input>
          <el-input id="password" @keyup.enter.native="login"  class="login__input" type="password" v-model.trim="password" placeholder="请输入密码"></el-input>
          <el-input id="businessId" @keyup.enter.native="login"  class="login__input" type="text" v-model.trim="businessId" placeholder="请输入企业ID或客户账号"></el-input>
         
          <el-button v-if="!loging" @click.stop="login" class="login__btn" type="primary" >登录</el-button>
          <el-button v-else class="login__btn" type="primary" :loading="true">登录中</span></el-button>
          <div class="login__remember">
              <el-checkbox v-model="remember">记住登录状态</el-checkbox>
          </div>
      </div>
      <div class="login__footer"> &copy;耶塔电话机器人</div>
      <div class="login__bg"></div>
  </div>
</template>

<script>

import {speechSkillAdminLogin} from '@/api/uc.js'

export default {
  name: 'login_inner',
  data : function(){
      return {
          account : this.$cookies.get('__account') || '',
          password : '',
          businessId : '',
          remember : true,
          loging : false, 
          isForceLogin : false,
          errorTxt:''
      }
  },
  methods : {
    login : function(){
        const _this = this;
        if(_this.account == ''){
            _this.errorTxt = '手机号不能为空';
            document.getElementById('account').focus();
            return;
        }
        if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(_this.account)){
            _this.errorTxt = '手机号格式错误';
            document.getElementById('account').focus();
            return;
        }
        if(_this.password == ''){
            _this.errorTxt = '密码不能为空';
            document.getElementById('password').focus();
            return;
        }
        if(this.businessId == ''){
           _this.errorTxt = '企业ID不能为空';
            document.getElementById('businessId').focus();
            return;
        }

       // let param = {phone : _this.account,password:_this.password,businessId : _this.businessId};
        let param = {account : _this.account,password:_this.password,businessId : _this.businessId};

        _this.errorTxt = '';
        _this.loging = true;
       
        speechSkillAdminLogin(param).then(function(resp){
            const code = _this.$lodash.get(resp,'code','-1'),
                  data = _this.$lodash.get(resp,'result.rows[0]',null);
            if(code == 0 && data != null){
                let userObj = {
                    account : param.account,
                    id : _this.$lodash.get(data,'account.id',''),
                    photo : _this.$lodash.get(data,'account.headPhoto',''),
                    token : _this.$lodash.get(data,'token.access_token',''),
                    dnCode : _this.$lodash.get(data,'agent.dnCode',''),
                    business : {
                        id : _this.$lodash.get(data,'business.id',''),
                        name : _this.$lodash.get(data,'business.name','')
                    },
                    master : '2'
                };
                sessionStorage.setItem('__user',JSON.stringify(userObj));
                if(_this.remember){
                    _this.$cookies.set('__account', _this.account);
                }
                _this.$global.getVersionInfo(_this.account,userObj.business.id).then(url => {
                    let p = '/report';
                    if(!!_this.$route.query.redirect){
                        p = _this.$route.query.redirect;
                    }
                    if(url){
                      location.href = url + '#' + p;
                    }else{
                       _this.$router.replace({ path: p || '/report' });
                    }
                });

               // _this.$router.replace({ path: _this.$route.query.redirect || '/report' });
                return;
            }
            _this.errorNum++;
            _this.loging = false;
            if(code == "200001"){
                _this.errorTxt = "请输入正确的密码";
                document.getElementById('password').focus();
            }else if(code == "200006"){
                _this.errorTxt = "该手机号码未注册";
                document.getElementById('account').focus();
            }else if(code == "200005"){
                _this.errorTxt = "图片验证码错误";
                 document.getElementById('verify').focus();
            }else if(code == "200008"){
                _this.errorTxt = "权限不足";
            }
        });
    }
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
    background: url(./images/logoBig.png) no-repeat center center;
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
  .login__remember{
    margin-top:20px;
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
    background: url(./images/login-bg.jpg) 0 0 no-repeat;
    background-size: cover;
    z-index:0;
  }

</style>
