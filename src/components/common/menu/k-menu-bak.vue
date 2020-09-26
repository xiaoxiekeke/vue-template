<template>
  <div class="k-menu">
    <el-menu 
      :router="true" 
      :collapse-transition="false"
      :collapse="isCollapse" 
      :default-active="routeActive"
      :unique-opened="true"
      background-color="#111634" text-color="#fff">
        <el-menu-item index="/">
          <i class="icon-menu icon-home"></i>
          <span slot="title">主页</span>
        </el-menu-item>
        <el-submenu index="2"> 
          <template slot="title">
            <i  class="icon-menu icon-speech"></i>
            <span slot="title">话术库</span>
          </template>
          <el-menu-item index="/speechtpl">话术模板</el-menu-item>
          <el-menu-item index="/myspeech">我的话术</el-menu-item>
        </el-submenu>
        <el-submenu index="3"> 
          <template slot="title">
            <i class="icon-menu icon-know"></i>
            <span slot="title">知识库</span>
          </template>
          <el-menu-item index="/knowledge">知识点</el-menu-item>
          <el-menu-item index="/dict">相近词库</el-menu-item>
        </el-submenu>
        <el-submenu index="4"> 
          <template slot="title">
            <i class="icon-menu icon-task"></i>
            <span slot="title">任务</span>
          </template>
          <el-menu-item index="/tasknow">当前任务</el-menu-item>
          <el-menu-item index="/taskhistory">历史任务</el-menu-item>
        </el-submenu>
        <el-submenu index="5" v-if="permission['__menu'] && permission['__menu'].ai"> 
          <template slot="title">
            <i class="icon-menu icon-ai"></i>
            <span slot="title">AI接待</span>
          </template>
          <el-menu-item index="/ai/conf">接待配置</el-menu-item>
          <el-menu-item index="/ai/data">接待数据</el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="/monitor" v-if="permission['__menu'] && permission['__menu'].monitor">
          <i class="icon-menu icon-monitor"></i>
          <span slot="title">实时监控</span>
        </el-menu-item> -->
       <!--  <el-submenu index="6"> 
          <template slot="title">
            <i class="icon-menu icon-customer"></i>
            <span slot="title">客户管理</span>
          </template>
          <el-menu-item index="/customer">客户管理</el-menu-item>
        </el-submenu> -->
        <el-submenu index="7"> 
          <template slot="title">
            <i class="icon-menu icon-user"></i>
            <span slot="title">团队管理</span>
          </template>
          <el-menu-item v-if="permission['__fun'] && permission['__fun'].agent" index="/team">成员管理</el-menu-item>
          <el-menu-item v-else index="/users">成员管理</el-menu-item>
        </el-submenu>
        <el-submenu index="8" v-if="permission['__menu'] && permission['__menu'].openapi">
          <template slot="title">
            <i class="icon-menu icon-openapi"></i>
            <span slot="title">能力平台</span>
          </template>
          <el-menu-item index="/openapi/experience">能力体验</el-menu-item>
          <el-menu-item index="/openapi/app">应用管理</el-menu-item>
          <el-menu-item index="/line/ownlines">线路管理</el-menu-item>
          <a class="link" target="_blank" href="https://github.com/kxjl-ai-yeta/openapi_doc">
              <el-menu-item index="">接口文档</el-menu-item>
          </a>
          <el-menu-item index="/openapi/push">接入管理</el-menu-item>
        </el-submenu>

        <el-submenu index="9">
          <template slot="title">
            <i class="icon-menu icon-setting"></i>
            <span slot="title">设置</span>
          </template>
          <el-menu-item index="/info">基本信息</el-menu-item>
          <el-menu-item index="/sms">短信管理</el-menu-item>
          <el-menu-item index="/updatelogs">更新日志</el-menu-item>
          <el-menu-item index="/recharge">企业付费</el-menu-item>
          <el-menu-item index="/consumption/1">交易记录</el-menu-item>
        </el-submenu>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'k-menu',
  props : {
    isCollapse : { type:Boolean,default:false },
    permission : {type : Object,default : {}}
  },
  computed : {
    routeActive : function(){
      let path = this.$route.path;
      if(path.indexOf('consumption') >= 0){
        path = '/consumption/1'
      }
      return path;
    }
  },
  data : function(){
    return {
    }
  }
}
</script>

<style lang="less">
  .k-menu{
      .el-menu{
        border-right:none;
      }
      .icon-menu{
          background:url(./images/menu.png) 0 0 no-repeat;
          vertical-align: middle;
          margin-right: 5px;
          width: 24px;
          display: inline-block;
          height: 24px;
      }
      .icon-home{
        background-position:1px -2px;
      }
      .icon-speech{
         background-position:1px -32px;
      }
      .icon-task{
        background-position:1px -61px;
      }
      .icon-setting{
          background-position:1px -119px;
      }
      .icon-customer{
         background-position:1px -168px;
      }
      .icon-user{
         background-position:1px -143px;
      }
      .icon-know{
        background-position:1px -90px;
      }
      .icon-openapi{
        background-position:1px -192px;
      }
      .icon-monitor{
        background-position:1px -220px;
      }
      .icon-ai{
        background-position:1px -252px;
      }
  }
</style>

