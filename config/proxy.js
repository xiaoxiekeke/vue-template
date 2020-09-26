

module.exports = {
  local:{
    '/taichi-data-api':{
      target : 'http://172.20.10.243:8992',
      changeOrigin: true
    }
  },
	dev : {
    '/resmanage' :{
      target : 'http://172.16.1.21:6200',
      changeOrigin: true,
      secure: false
    },
    '/speechskill' :{
      target : 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/brainkb' : {
      target : 'http://172.16.1.21:6210',
      changeOrigin: true,
      secure: false
    },
    '/brain': {
      target: 'http://172.16.1.21:6211',
      changeOrigin: true,
      secure: false
    },
    '/bm' : {
      target: 'http://172.16.1.12:6206',
      changeOrigin: true,
      secure: false
    },
    '/outbound-report': {
      target : 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/outbound-data' : {
      target: 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/outbound-manage-api' : {
      target: 'http://172.16.1.21:6204',
      changeOrigin: true,
      secure: false
    },
    '/fee-api' : {
      target : 'http://172.16.1.21:6218',
      changeOrigin: true,
      secure: false
    },
    '/outbound' : {
      target : 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/yungo-abp' : {
      target : 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/yungo-api' : {
      target : 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/yungo-oss' : {
      target : 'https://172.16.1.12:443',
      changeOrigin: true,
      secure: false
    },
    '/crm':{
      target:'https://172.16.1.12:443',
      changeOrigin:true
    },
    '/weixin':{
      target:'https://172.16.1.12:443',
      changeOrigin:true,
      secure: false
    },
    '/taichi-data-api':{
      target:'http://172.16.1.21:6222',
      changeOrigin:true,
      secure: false
    },
    '/download-center-api':{
      target:'http://172.16.1.21:6220',
      changeOrigin:true,
      secure: false
    },
    '/download-center-record':{
      target:'https://172.16.1.12:443',
      changeOrigin:true,
      secure: false
    },
    '/openapi-admin':{
      target:'https://172.16.1.12:443',
      changeOrigin:true,
      secure: false
    },
    '/openapi':{
      target:'https://172.16.1.12:443',
      changeOrigin:true,
      secure: false
    },
    '/session':{
      target:'https://172.16.1.12:443',
      changeOrigin:true,
      secure: false
    },
    '/uc-api':{
      target:'http://172.16.1.12:6247',
      changeOrigin:true,
      secure: false
    },
    '/kylin':{
      target:'http://172.16.1.21:6253',
      changeOrigin:true,
      secure: false
    },
    '/ac-api':{
      target:'http://172.16.1.21:6254',
      changeOrigin:true,
      secure: false
    },
    '/router':{
      target:'http://172.16.1.12:6237',
      changeOrigin:true,
      secure: false
    }
  },
  test : {
  	 '/resmanage' :{
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/speechskill-api' :{
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/brainkb' : {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/brain': {
        target: 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/bm' : {
        target: 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/outbound-report': {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/outbound-data' : {
        target: 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/outbound-manage-api' : {
        target: 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/fee-api' : {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/outbound' : {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/yungo-abp' : {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/yungo-api' : {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/yungo-oss' : {
        target : 'https://test.xiaomankf.com:8083',
        changeOrigin: true,
        secure: false
      },
      '/crm':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/weixin':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/taichi-data-api':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/download-center-api':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/download-center-record':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/openapi-admin':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/openapi':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/session':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/uc-api':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      '/kylin':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      },
      // '/kxjl-ac':{
      //   target:'https://test.xiaomankf.com:8083',
      //   changeOrigin:true,
      //   secure: false
      // },
      '/ac-api':{
        target:'https://test.xiaomankf.com:8083',
        changeOrigin:true,
        secure: false
      }
  }
}