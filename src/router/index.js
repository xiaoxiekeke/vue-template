import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/pages/main'
import Report from '@/components/pages/report/report'
import Login from '@/components/pages/login/login'
import Login_iner from '@/components/pages/login/login__inner'
import Register from '@/components/pages/register/register'
import Reset from '@/components/pages/reset/reset'
//我的话术
const MySpeech = () => import(/* webpackChunkName: "myspeech" */'@/components/pages/speech/myspeech')
//话术模板
const SpeechTpl = () => import(/* webpackChunkName: "speechtpl" */'@/components/pages/speech/speechtpl')
//当前任务
const TaskNow = () => import(/* webpackChunkName: "tasknow" */'@/components/pages/task/tasknow')
//历史任务
const Taskhistory = () => import(/* webpackChunkName: "taskhistory" */'@/components/pages/task/taskhistory')
//任务详情
const TaskInfo = () => import(/* webpackChunkName: "taskinfo" */'@/components/pages/task/taskinfo')
//计费
const Recharge = () => import(/* webpackChunkName: "recharge" */'@/components/pages/recharge/recharge')
const Pay = () => import(/* webpackChunkName: "pay" */'@/components/pages/recharge/pay')

//词库
const Dict = () => import(/* webpackChunkName: "dict" */'@/components/pages/dict/dict')
//词库详情
const DictInfo = () => import(/* webpackChunkName: "dictinfo" */'@/components/pages/dict/dictinfo')
//知识库
const Knowledge = () => import(/* webpackChunkName: "knowledge" */'@/components/pages/knowledge/knowledge')
//知识库详情
const KnowInfo = () => import(/* webpackChunkName: "knowledge__info" */'@/components/pages/knowledge/knowledge__info')
//消费记录
const Consumption = () => import(/* webpackChunkName: "consumption" */'@/components/pages/consumption/consumption')
//消费明细
const ConsumptionDetail = () => import(/* webpackChunkName: "consumption__detail" */'@/components/pages/consumption/consump__detail')

//基本信息
const Info = () => import(/* webpackChunkName: "info" */'@/components/pages/info/info')
//客户管理
const Customer = () => import(/* webpackChunkName: "customer" */'@/components/pages/customer/customer')
//客户详情
const CustomerInfo = () => import(/* webpackChunkName: "customer__info" */'@/components/pages/customer/customer__info')
//通话详情
const CustomerCall = () => import(/* webpackChunkName: "customer__call" */'@/components/pages/customer/customer__call')
//用户管理
const Users = () => import(/* webpackChunkName: "users" */'@/components/pages/users/users')
//开放平台
const Push = () => import(/* webpackChunkName: "push" */'@/components/pages/openapi/push/push.vue')
const Line = () => import(/* webpackChunkName: "line" */'@/components/pages/openapi/line/line')
const App = () => import(/* webpackChunkName: "application" */'@/components/pages/openapi/app/app.vue')
const Experience = () => import(/* webpackChunkName: "experience" */'@/components/pages/openapi/experience/experience');
//短信管理
const Sms = () => import(/* webpackChunkName: "sms" */'@/components/pages/sms/sms')
//更新日志
const Updatelogs = () => import(/* webpackChunkName: "updatelogs" */'@/components/pages/updatelogs/updatelogs')

//实时监控
const Monitor = () => import(/* webpackChunkName: "monitor" */'@/components/pages/monitor/monitor')
//监控详情
const MonitorDetail = () => import(/* webpackChunkName: "monitorDetail" */'@/components/pages/monitor/monitor__detail')

//模型规则
const Model = () => import(/* webpackChunkName: "rule" */'@/components/pages/model/model')
//规则类别
const Rule = () => import(/* webpackChunkName: "rule" */'@/components/pages/model/rule')

//团队管理
const Team = () => import(/* webpackChunkName: "team" */'@/components/pages/team/team')

//ai接待
const AiConf = () => import(/* webpackChunkName: "aiconf" */'@/components/pages/ai/conf')
const AiData = () => import(/* webpackChunkName: "aidata" */'@/components/pages/ai/data')

Vue.use(Router)

export default new Router({
    routes: [{
  	    path: '/',
        redirect: '/report',
        meta: {
            requireAuth: true 
        },
        name: 'main',
        component: Main,
        children : [
          {
              path: '/openapi/experience',
              name: 'openapi_experience',
              meta: {
                requireAuth: true 
              },
              component: Experience
          },
          {
              path: '/openapi/push',
              name: 'openapi_push',
              meta: {
                requireAuth: true 
              },
              component: Push
          },{
              path: '/openapi/app',
              name: 'openapi_app',
              meta: {
                requireAuth: true 
              },
              component: App
          },
          {
              path: '/report',
              name: 'report',
              meta: {
                requireAuth: true 
              },
              component: Report
          },
          {
              path: '/myspeech',
              name: 'myspeech',
              meta: {
                requireAuth: true
              },
              component: MySpeech
          },{
              path: '/speechtpl',
              name: 'speechtpl',
              meta: {
                requireAuth: true 
              },
              component: SpeechTpl
          },{
            path : '/tasknow',
            name : 'tasknow',
            meta: {
              requireAuth: true 
            },
            component : TaskNow

          },{
            path: '/taskinfo/:bid/:id/:speechId',
            name: 'taskinfo',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component: TaskInfo
          },{
            path: '/taskhistory',
            name: 'taskhistory',
            meta: {
              requireAuth: true
            },
            component: Taskhistory
          },{
            path : '/dict',
            name : 'dict',
            meta: {
              requireAuth: true
            },
            component : Dict
          },{
            path: '/dictinfo/:id',
            name: 'dictinfo',
            meta: {
              requireAuth: true
            },
            component: DictInfo
          },{
            path : '/knowledge',
            name : 'knowledge',
            meta: {
              requireAuth: true 
            },
            component : Knowledge
          },{
            path : '/knowinfo/:id/:state',
            name : 'knowinfo',
            meta: {
              requireAuth: true
            },
            component : KnowInfo
          },{
            path : '/recharge',
            name : 'recharge',
            meta: {
              requireAuth: true 
            },
            component : Pay
          },{
            path : '/consumption/:tab',
            name : 'consumption',
            meta: {
              requireAuth: true
            },
            component : Consumption
          },
          {
            path : '/consumpdetail/:tab/:parentItem',
            name : 'consumpdetail',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : ConsumptionDetail
          },
          {
            path : '/info',
            name : 'info',
            meta: {
              requireAuth: true 
            },
            component : Info
          },{
            path : '/customer',
            name : 'customer',
            meta: {
              requireAuth: true
            },
            component : Customer
          },{
            path : '/custinfo/:telnum/:id/:taskId',
            name : 'custinfo',
            meta: {
              requireAuth: true
            },
            component : CustomerInfo
          },{
            path : '/custcall/:userId/:taskId/:traceId/',
            name : 'custcall',
            meta: {
              requireAuth: true
            },
            component : CustomerCall
          },{
            path : '/users',
            name : 'users',
            meta: {
              requireAuth: true
            },
            component : Users
          },{
            path : '/line/:activeName',
            name : 'openapi_line',
            meta: {
              requireAuth: true 
            },
            component : Line
          },{
            path : '/sms',
            name : 'sms',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : Sms
          },{
            path : '/updatelogs',
            name : 'updatelogs',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : Updatelogs
          },{
            path : '/monitor',
            name : 'monitor',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : Monitor
          },{
            path : '/monitordetail/:taskId/:speechSkillId/:name',
            name : 'monitordetail',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : MonitorDetail
          },{
            path : '/model',
            name : 'model',
            meta: {
              requireAuth: true,
            },
            component : Model
          },{
            path : '/rule/:groupId',
            name : 'rule',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : Rule
          },{
            path : '/team',
            name : 'team',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : Team
          },{
            path: '/ai/conf',
            name: 'aiconf',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : AiConf
          },{
            path : '/ai/data',
            name : 'aidata',
            meta: {
              requireAuth: true,
              keepAlive : false
            },
            component : AiData
          }
        ]
  	},{
        path : '/:bid/login',
        name : 'login',
        component : Login
    },{
        path : '/login_inner',
        name : 'login_inner',
        component : Login_iner
    },{
        path : '/:bid/register',
        name : 'register',
        component : Register
    },{
        path : '/:bid/reset',
        name : 'reset',
        component : Reset
    }]
})
