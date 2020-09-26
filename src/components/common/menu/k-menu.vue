<template>
  <div class="k-menu">
    <el-menu 
      :router="true" 
      :collapse-transition="false"
      :collapse="isCollapse" 
      :default-active="routeActive"
      :default-openeds="routerOpened"
      :unique-opened="false"
      background-color="#111634" text-color="#9199CA">
        <!-- <el-menu-item index="/">
          <i class="icon-menu icon-home"></i>
          <span slot="title">主页</span>
        </el-menu-item> -->
        <el-submenu index="1"> 
          <template slot="title">
            <span slot="title">数据统计</span>
          </template>
          <el-menu-item index="/report"><i class="icon-menu icon-home"></i>数据统计</el-menu-item>
        </el-submenu>
        <el-submenu index="2"> 
          <template slot="title">
            <span slot="title">话术库</span>
          </template>
          <el-menu-item index="/speechtpl"><i class="icon-menu icon-speech1"></i>话术模板</el-menu-item>
          <el-menu-item index="/myspeech"><i class="icon-menu icon-speech2"></i>我的话术</el-menu-item>
        </el-submenu>
        <el-submenu index="3"> 
          <template slot="title">
            <span slot="title">知识库</span>
          </template>
          <el-menu-item index="/knowledge"><i class="icon-menu icon-know1"></i>知识点</el-menu-item>
          <el-menu-item index="/dict"><i class="icon-menu icon-know2"></i>相近词库</el-menu-item>
        </el-submenu>
        <el-submenu index="4"> 
          <template slot="title">
            <span slot="title">任务</span>
          </template>
          <el-menu-item index="/tasknow"><i class="icon-menu icon-task1"></i>当前任务</el-menu-item>
          <el-menu-item index="/taskhistory"><i class="icon-menu icon-task2"></i>历史任务</el-menu-item>
        </el-submenu>
        <el-submenu index="5" v-if="permission['__menu'] && permission['__menu'].ai"> 
          <template slot="title">
            <span slot="title">AI接待</span>
          </template>
          <el-menu-item index="/ai/conf"><i class="icon-menu icon-ai1"></i>接待配置</el-menu-item>
          <el-menu-item index="/ai/data"><i class="icon-menu icon-ai2"></i>接待数据</el-menu-item>
        </el-submenu>
       <!--  <el-submenu index="6"> 
          <template slot="title">
            <i class="icon-menu icon-customer"></i>
            <span slot="title">客户管理</span>
          </template>
          <el-menu-item index="/customer">客户管理</el-menu-item>
        </el-submenu> -->
        <el-submenu index="7"> 
          <template slot="title">
            <span slot="title">团队管理</span>
          </template>
          <el-menu-item v-if="permission['__fun'] && permission['__fun'].agent" index="/team"><i class="icon-menu icon-user"></i>成员管理</el-menu-item>
          <el-menu-item v-else index="/users"><i class="icon-menu icon-user"></i>成员管理</el-menu-item>
        </el-submenu>
        <el-submenu index="8" v-if="permission['__menu'] && permission['__menu'].openapi">
          <template slot="title">
            <span slot="title">能力平台</span>
          </template>
          <el-menu-item index="/openapi/experience"><i class="icon-menu icon-openapi1"></i>能力体验</el-menu-item>
          <el-menu-item index="/openapi/app"><i class="icon-menu icon-openapi2"></i>应用管理</el-menu-item>
          <el-menu-item index="/line/ownlines"><i class="icon-menu icon-openapi3"></i>线路管理</el-menu-item>
          <a class="link" target="_blank" href="https://github.com/kxjl-ai-yeta/openapi_doc">
              <el-menu-item index=""><i class="icon-menu icon-openapi4"></i>接口文档</el-menu-item>
          </a>
          <el-menu-item index="/openapi/push"><i class="icon-menu icon-openapi5"></i>接入管理</el-menu-item>
        </el-submenu>

        <el-submenu index="9">
          <template slot="title">
            <span slot="title">设置</span>
          </template>
          <el-menu-item index="/info"><i class="icon-menu icon-setting1"></i>基本信息</el-menu-item>
          <el-menu-item index="/sms"><i class="icon-menu icon-setting2"></i>短信管理</el-menu-item>
          <el-menu-item index="/updatelogs"><i class="icon-menu icon-setting3"></i>更新日志</el-menu-item>
          <el-menu-item index="/recharge"><i class="icon-menu icon-setting4"></i>企业付费</el-menu-item>
          <el-menu-item index="/consumption/1"><i class="icon-menu icon-setting5"></i>交易记录</el-menu-item>
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
      console.log(path)
      return path;
    }
  },
  data : function(){
    return {
      routerOpened:['1','2','3','4','5','6','7','8','9']
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
      span[slot="title"]{
        color: #DCE1FF;
      }
      .icon-home{
        background-position:1px 0px;
      }
      .icon-speech1{
         background-position:1px -24px;
      }
      .icon-speech2{
         background-position:1px -50px;
      }
      .icon-know1{
        background-position:1px -77px;
      }
      .icon-know2{
        background-position:1px -103px;
      }
      .icon-task1{
        background-position:1px -130px;
      }
      .icon-task2{
        background-position:1px -157px;
      }
      
      // .icon-customer{
      //    background-position:1px -171px;
      // }
      .icon-user{
         background-position:1px -185px;
      }
      // .icon-know{
      //   background-position:1px -93px;
      // }
      .icon-openapi1{
        background-position:1px -211px;
      }
      .icon-openapi2{
        background-position:1px -238px;
      }
      .icon-openapi3{
        background-position:1px -266px;
      }
      .icon-openapi4{
        background-position:1px -297px;
      }
      .icon-openapi5{
        background-position:1px -326px;
      }
      .icon-setting1{
          background-position:1px -352px;
      }
      .icon-setting2{
          background-position:1px -378px;
      }
      .icon-setting3{
          background-position:1px -403px;
      }
      .icon-setting4{
          background-position:1px -431px;
      }
      .icon-setting5{
          background-position:1px -458px;
      }
      .icon-ai1{
        background-position:1px -484px;
      }
      .icon-ai2{
        background-position:1px -510px;
      }

      .el-menu-item.is-active{
        .icon-home{
          background-position:-22px 0px;
        }
        .icon-speech1{
           background-position:-22px -24px;
        }
        .icon-speech2{
           background-position:-22px -50px;
        }
        .icon-know1{
          background-position:-22px -77px;
        }
        .icon-know2{
          background-position:-23px -103px;
        }
        .icon-task1{
          background-position:-23px -130px;
        }
        .icon-task2{
          background-position:-23px -157px;
        }
        
        // .icon-customer{
        //    background-position:-23px -171px;
        // }
        .icon-user{
           background-position:-23px -185px;
        }
        // .icon-know{
        //   background-position:-23px -93px;
        // }
        .icon-openapi1{
          background-position:-23px -211px;
        }
        .icon-openapi2{
          background-position:-23px -238px;
        }
        .icon-openapi3{
          background-position:-23px -266px;
        }
        .icon-openapi4{
          background-position:-23px -297px;
        }
        .icon-openapi5{
          background-position:-23px -326px;
        }
        .icon-setting1{
            background-position:-23px -352px;
        }
        .icon-setting2{
            background-position:-23px -378px;
        }
        .icon-setting3{
            background-position:-23px -403px;
        }
        .icon-setting4{
            background-position:-23px -431px;
        }
        .icon-setting5{
            background-position:-23px -458px;
        }
        .icon-ai1{
          background-position:-22px -484px;
        }
        .icon-ai2{
          background-position:-22px -510px;
        }
      }
  }
</style>

