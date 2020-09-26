<template>
  <div @click.stop="downDialog = false">
       <el-container :class="{'min' :isCollapse}">
        <el-aside class="aside">
          <div class="aside__logo">
            <img v-show="isCollapse" src="static/images/logo-mini.png" width="45" />
            <img v-show="!isCollapse" src="static/images/logo.png" width="80%" />
          </div>
          <div class="aside__menu">
            <k-menu 
              v-if="permission"
              :permission="permission"
              :isCollapse="isCollapse"></k-menu>
          </div>
        </el-aside>
        <el-main class="main">
          <div class="main__top">
              <span title="展开收缩菜单" class="collapse" @click.stop="collapse"></span>
              <div v-if="business.status != 2 && business.status != 1" class="main__tip">
                <span>您尚未进行企业认证，认证后才可进行外呼
                  <a href="#/info" class="bus-auth">去认证</a></span>
              </div>
              <div v-else-if="business.lack" class="main__tip">
                <span>您的通信费用不足,请尽快
                <a href="#/recharge" class="bus-auth">充值通讯费</a></span>
              </div>
              <div class="main__top__right">
                <el-button @click.stop="jumpToCsp" class="cspbtn" size="mini" >座席工作台</el-button>
                <div class="main__downcenter" @click.stop="" >
                  <el-button 
                    @click.stop="downDialog = !downDialog" icon="el-icon-download" type="text">下载中心</el-button>
                  <div class="down__center fadeInRight animated" v-if="downDialog">
                    <donwn-center></donwn-center>
                  </div>
                </div>
                <div class="toobar__user">
                    <img class="headimg" width="40" height="40" :src="photoUrl" />
                    <div class="user-info fadeInRight animated">
                        <div class="user-item"> 
                          <router-link class="link" to="/info">个人资料</router-link>
                        </div>
                        <div @click.stop="logout" class="user-item user-exit">退出</div>
                    </div>
                </div>
              </div>
          </div>
          <div class="main__body">
              <keep-alive exclude="report,speechtpl,tasknow,recharge,info,openapi_push,openapi_app,openapi_line,sms,consumption">
                  <router-view class="fadeInRight animated" 
                      v-if="$route.meta.keepAlive === true || $route.meta.keepAlive == undefined" ></router-view>
              </keep-alive>
              <router-view class="fadeInRight animated" v-if="$route.meta.keepAlive === false"></router-view>
          </div>
        </el-main>
    </el-container>

    <xm-im v-if="imInit"></xm-im>
    <log-notice></log-notice>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {logout} from '@/api/uc.js'
import {queryEntAuthByBusId} from '@/api/bm.js'
import {checkFeeLeft} from '@/api/fee.js'
import {queryAgentsAcdsByPage} from '@/api/kxjl-ac.js'

import KMenu from '@/components/common/menu/k-menu'
import XMIM from '@/components/common/im/xmim'
import DownCenter from '@/components/pages/downcenter/downcenter'
import LogNotice from '@/components/pages/updatelogs/lognotice'

export default {
  name: 'App',
  data : function(){
    return {
      loading : true,
      isLogin : true,
      downDialog : false,
      timer : null,
      imInit : false,
      permission : null
    }
  },
  watch : {
    downQueue : function(){
      let donwElem = document.querySelector('.main__downcenter .el-icon-download');
      donwElem.classList.remove('twinkle-down','animated-down')
      clearTimeout(this.timer);
      this.timer = setTimeout(function(){
          donwElem.classList.add('twinkle-down','animated-down');
      },1000);
    }
  },
  computed: {
    ...mapState('user',[
      'isCollapse',
      'photo',
      'business',
      'downQueue'
    ]),
    photoUrl : function(){
      return this.photo ? this.$global.getStaticFileUrl(this.photo) : 'static/images/user.png';
    }
  },
  methods : {
    ...mapActions('user',[
      'collapse',
      'setUserInfo',
      'modifyBusiness',
      'setReceive'
    ]),
    jumpToCsp (){
      this.$global.checkPermission('__fun.agent').then(result => {
        if(!result){
           this.$alert('AI驱动呼叫中心，机器人外呼遇到意向客户可直接转人工坐席即时响应，大幅度提升呼叫中心效率，不漏掉一个客户<div style="margin-top:15px;">开通热线：0551-69101456</div>', '提示',{
             dangerouslyUseHTMLString: true
           })
          return;
        }
        //如果不是座席账号，提示 "权限不足，请联系管理员"
        if(!this.$global.getUserInfo('dn')){
          this.$alert('权限不足，请联系管理员');
          return;
        }
        //判断是否有座席组
        queryAgentsAcdsByPage({
          userId : this.$global.getUserInfo('id')
        }).then(resp => {
          let acds = this.$lodash.get(resp,'result.rows',[]);
          if(!acds || acds.length == 0 || !acds[0].acdId){
            this.$alert('权限不足，请联系管理员');
            return;
          }
          let url = this.$global.getConfig('csp')
            .replace('{token}',this.$global.getUserInfo('token'))
            .replace('{bid}',this.$global.getUserInfo('business.id'));
          this.$global.destroyData();
          location.href = url;
        })
      });
    },
    logout : function(){
      logout().then((data) => {
        this.toLogin();
      });
    },
    toLogin (){
      this.imInit = false;
      this.$global.destroyData();
      this.setReceive({type : 'callout',data : null});
      this.setReceive({type : 'callin',data : null});
      this.$phone.destory();
      let bid = localStorage.getItem('__bid') || 'yeta';
      this.$router.replace({path : '/'+bid+'/login'});
    }
  },
  created : function(){
    this.setUserInfo();
  },
  mounted : function(){
    const _this = this;
    Promise.all([queryEntAuthByBusId(),checkFeeLeft()]).then(function(values){
      let status = _this.$lodash.get(values,'[0].result.rows[0].status','-1'),
          lack = _this.$lodash.get(values,'[1].result.rows[0].lack',false);
      _this.modifyBusiness({status : status,lack : lack});
    });
    setTimeout(() => {this.imInit = true; },4000);
    
    this.$global.getPermission().then(data => {
      this.permission = data;
    })
  },
  components : {
    'k-menu' : KMenu,
    'donwn-center' : DownCenter,
    'xm-im' : XMIM,
    'log-notice' : LogNotice
  }
}
</script>

<style lang="less"> 
  @import (reference) "../../assets/less/var.less";
  html,body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size:14px;
    margin:0;
    padding:0;
    background-color:#f5f5f5;
  }
  #app{
    min-height:100vh;

    .min {
      .aside {
        width:@min-menu-width !important;
      }
      .main__body{
        padding-left:@min-menu-width;
      }
      .main__top{
        left:@min-menu-width;

      }
    }
    .aside{
      width:@menu-width !important;
      border:none;
      background-color:#111634;
      transition: width 0.4s;
      position:fixed;
      top:0;
      bottom:0;
    }
    .aside__logo{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 57px
    }

    .aside__menu{
       
    }
    .main{
      padding:0;
      margin:0;
    }
    .main__top{
       text-align:center;
        position:fixed;
        top:0;
        left:@menu-width;
        right:0;
        height:57px;
        border-bottom:1px solid #ccc;
        background-color:#fff;
        z-index:100;
        box-shadow: 2px 0 4px rgba(175,175,175,.5);
        transition: all 0.4s;
        .collapse{
          float:left;
          width: 21px;
          height: 100%;
          background: url(../../assets/images/small-icon.png) no-repeat 0 -358px;
          display: inline-block;
          cursor: pointer;
          margin-left: 20px;
        }
        .main__tip{
          display: inline-block;
          position: absolute;
          margin-left: -@menu-width;
          padding: 10px 15px;
          background-color: #fdf4e9;
          color: #ffc12b;
          top: 8px;
          .bus-auth{
            color:@base-color;
          }
        }
        .main__top__right{
            display:flex;
            align-items:center;
            float: right;
            position:relative;
            height:100%;
            margin-right:20px;
            cursor:pointer;
            .headimg{
                border-radius: 50%;
            }
            .main__downcenter{
              display:inline-block;
              vertical-align: 14px;
              .el-icon-download{
                  border-radius:50%;
                  border:2px solid rgba(14, 182, 142, 0);
              }
            }
            .toobar__user{
              display:inline-block;
              margin-left:10px;
               padding: 9px 0;
            }
            .toobar__user:hover .user-info{
                display:block;
            }
            .user-info{
                position: absolute;
                background: #fff;
                box-shadow: 0 1px 6px rgba(4,0,0,.3);
                min-width: 150px;
                top: 58px;
                right: 0;
                border-radius: 2px;
                text-align:center;
                padding:20px 0 10px 0;
                display:none;
                z-index:200
            }
            .user-item{
                padding:5px 0;
                margin:4px 0;
                .link{
                  text-decoration:none;
                  color: inherit;
                }
            }
            .user-item:hover{
                background-color: #f5f5f5;
                color:@base-color;
            }
            .user-exit{
                cursor:pointer;
                color:@base-color;
            }
        }
       
    }
    .main__body{
        padding-top:57px;
        padding-left:@menu-width;
        overflow-x:hidden;
        transition: all 0.4s;
        min-height: 100vh;
        box-sizing: border-box;
    }

    .down__center{
        position: absolute;
        background: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        top: 58px;
        width: 370px;
        max-height: 590px;
        min-height: 120px;
        right: 0;
        z-index: 100;
        cursor:default;
        padding-bottom:20px;
    }
    .cspbtn{
      margin-right:20px;
    }
  }
</style>
