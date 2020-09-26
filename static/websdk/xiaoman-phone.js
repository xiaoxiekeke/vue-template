/* xiaoman-phone.js version 1.0.0 */
var xiaoman = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /*
  * 系统返回码
  */
  var ReturnCode = {
    Success: {
      code: '000000',
      desc: "操作成功"
    },
    Error: {
      code: '999999',
      desc: "系统内部错误"
    },
    ParamIsNull: {
      code: '100000',
      desc: "必选项为空"
    },
    ParamError: {
      code: '100001',
      desc: "参数格式不正确"
    },
    LineNumError: {
      code: '100002',
      desc: "外显号码不正确"
    },
    EnvError: {
      code: '100003',
      desc: "当前环境不支持WebRTC"
    },
    EventNotListen: {
      code: "200000",
      desc: "未监听回调事件"
    },
    AccountNotLogin: {
      code: "200001",
      desc: "账号未登录"
    },
    PhoneIsNotOpen: {
      code: "200002",
      desc: "电话功能未启动"
    },
    PhoneIsOpened: {
      code: "200003",
      desc: "电话功能已启动"
    },
    AgentDnNotFound: {
      code: "200004",
      desc: "未找到座席对应分机号"
    },
    AuthFail: {
      code: "300000",
      desc: "鉴权失败"
    },
    CallOutError: {
      code: "400000",
      desc: "外呼失败"
    },
    CallBusy: {
      code: "400001",
      desc: "通话正忙"
    },
    CallNotFound: {
      code: "400002",
      desc: "未找到有效通话"
    },
    CallEstablished: {
      code: "400003",
      desc: "通话已接听"
    }
  };
  var Api = {
    sdkServer: {
      makeCall: '/api/v1/makeCall',
      optLog: '/api/v1/flow'
    },
    uc: {
      login: '/api/v1/account/login',
      logout: '/api/v1/account/logout',
      queryAccountInfo: '/api/v1/account/{businessId}/queryAccountInfo'
    }
  };
  var IM = {
    State: ["ERROR", "CONNECTING", "CONNFAIL", "AUTHENTICATING", "AUTHFAIL", "CONNECTED", "DISCONNECTED", "DISCONNECTING", "ATTACHED", "REDIRECT", "CONNTIMEOUT"] //内部事件名称

  };
  var EventInner = {
    Message: '__onmessage',
    ImConected: '__imconected',
    ImConflict: '__imconflict',
    SIP_Opened: '__opensip',
    SIP_AutoAnswer: '__sipautoanswer',
    SIP_Ended: '__sipended',
    SIP_Ringing: '__ringing',
    SIP_Established: '__established',
    SIP_Transcript: '__transcript'
    /*
    * 消息类型
    */

  };
  var MsgType = {
    EventOpened: 'EventOpened',
    EventDialing: 'EventDialing',
    EventRinging: 'EventRinging',
    EventEstablished: 'EventEstablished',
    EventReleased: 'EventReleased',
    EventTranscript: 'EventTranscript',
    //转写文本
    EventConflict: 'EventConflict'
  };
  var CallOrigin = {
    WebClick: 'webclick',
    //页面点击
    InBound: 'inbound',
    //呼入
    Listening: 'listening',
    //监听
    Silence: 'silence',
    //静默座席
    BrainTransfer: 'brain-transfer' //从brain接管

  };

  var Config = {
    isEncryptPassword: true,
    isDebug: true,
    service : {
      //uc : 'https://www.xfyeta.com/uc-api',
      //sdkServer : 'https://www.xfyeta.com/sdk-server'
      uc : 'http://172.16.1.22:8088/uc-api-dev',
      sdkServer : 'http://172.16.1.22:8199/sdk-server'
    },
    sip : {
      register: true,
      register_expires: 30,
      //socketURL : 'wss://webcall.kxjlcc.com:7443',
      socketURL : 'wss://172.16.1.61:7443',
      sipURI : '@webrtc',
      iceURL : ["stun:101.201.226.199:13478"]
    },
    im: {
      serverName: '@xiaomankf.com',
      resource: '/tserver-client',
      server: 'wss://dev.xiaomankf.com:5391'
    }
  };

  var XStore =
  /*#__PURE__*/
  function () {
    function XStore() {
      _classCallCheck(this, XStore);

      this.userInfo = null;
      this.userData = null;
      this.dni = '';
      this.agentUUID = '';
      this.customerUUID = '';
    } //用户信息


    _createClass(XStore, [{
      key: "setUserInfo",
      value: function setUserInfo(userInfo) {
        this.userInfo = userInfo;
      }
    }, {
      key: "getUserInfo",
      value: function getUserInfo(key) {
        var _this = this;

        var obj = '';

        if (!this.userInfo) {
          return obj;
        }

        if (!key) {
          return this.userInfo;
        }

        key.split('.').every(function (item, index) {
          obj = index == 0 ? _this.userInfo[item] : obj[item];
          return obj != null;
        });
        return obj;
      }
    }, {
      key: "getToken",
      value: function getToken() {
        return this.getUserInfo('token');
      }
      /*
      * 获取分机号
      */

    }, {
      key: "getAgentDn",
      value: function getAgentDn() {
        return this.getUserInfo('dn');
      }
      /*
      * 获取登录账号
      */

    }, {
      key: "getAccount",
      value: function getAccount() {
        return this.getUserInfo('account');
      }
      /*
      * 获取外显号码
      */

    }, {
      key: "getTelNum",
      value: function getTelNum() {
        return this.getUserInfo('outshowtel');
      } //用户随路数据

    }, {
      key: "setUserData",
      value: function setUserData(userData) {
        if (!userData || !this.userData) {
          this.userData = userData;
        } else {
          for (var key in userData) {
            this.userData[key] = userData[key];
          }
        }
      }
    }, {
      key: "getUserData",
      value: function getUserData() {
        return this.userData || '';
      }
    }, {
      key: "setDni",
      value: function setDni(dni) {
        this.dni = dni || '';
      }
    }, {
      key: "getDni",
      value: function getDni() {
        return this.dni || '';
      }
    }, {
      key: "setAgentUUID",
      value: function setAgentUUID(agentUUID) {
        this.agentUUID = agentUUID || '';
      }
    }, {
      key: "getAgentUUID",
      value: function getAgentUUID() {
        return this.agentUUID || '';
      }
    }, {
      key: "setCustomerUUID",
      value: function setCustomerUUID(customerUUID) {
        this.customerUUID = customerUUID;
      }
    }, {
      key: "getCustomerUUID",
      value: function getCustomerUUID() {
        return this.customerUUID;
      }
    }]);

    return XStore;
  }();

  XStore._instance = null;

  XStore.getInstance = function () {
    if (!this._instance) {
      this._instance = new XStore();
    }

    return this._instance;
  };

  /*
  * 查询微服务接口地址
  */

  function getRequestUrl() {
    var service = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var api = arguments.length > 1 ? arguments[1] : undefined;
    var store = XStore.getInstance();
    var url = service + api;
    var token = store.userInfo ? store.userInfo.token : "";

    if (url.indexOf("token=") >= 0) {
      return url;
    }

    if (url.indexOf("?") > 0) {
      url += "&token=" + token;
    } else {
      url += "?token=" + token;
    }

    return url;
  }
  /*
  * ajax异步请求
  */

  function ajaxPost(url) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (resolve, reject) {
      fetch(url, {
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(param)
      }).then(function (resp) {
        if (resp.status !== 200) {
          reject && reject();
        } else {
          resp.json().then(function (data) {
            resolve && resolve(data);
          });
        }
      }).catch(function (err) {
        reject && reject();
      });
    });
  }
  function ajaxFormPost(url) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (resolve, reject) {
      var pstr = [];

      for (var key in param) {
        pstr.push("".concat(key, "=").concat(param[key]));
      }

      fetch(url, {
        method: "post",
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        body: pstr.join('&')
      }).then(function (resp) {
        if (resp.status !== 200) {
          reject && reject();
        } else {
          resp.json().then(function (data) {
            resolve && resolve(data);
          });
        }
      }).catch(function (err) {
        reject && reject();
      });
    });
  }
  function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
  function checkEnv() {
    return new Promise(function (resolve, reject) {
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(function (stream) {
        resolve && resolve(true);
      }).catch(function (err) {
        resolve && resolve(false, error.code || error.name);
      });
    });
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var scriptElem = document.createElement('script');

      scriptElem.onload = function () {
        resolve && resolve();
      };

      scriptElem.src = src;
      document.head.appendChild(scriptElem);
    });
  }

  var SERVICE_NAME = Config.service.uc;
  /*
  * 账号登录
  */

  function login(_ref) {
    var phone = _ref.phone,
        password = _ref.password,
        timestamp = _ref.timestamp;
    var url = getRequestUrl(SERVICE_NAME, Api.uc.login);
    return ajaxPost(url, {
      phone: phone,
      password: password,
      timestamp: timestamp
    });
  }
  /*
  * 账号退出
  */

  function logout() {
    var url = getRequestUrl(SERVICE_NAME, Api.uc.logout);
    return ajaxFormPost(url);
  }

  var SERVICE_NAME$1 = Config.service.sdkServer;
  /*
  * 发起外呼
  */

  function makeCall(_ref) {
    var callRelationId = _ref.callRelationId,
        phoneNum = _ref.phoneNum,
        lineNum = _ref.lineNum,
        robotId = _ref.robotId,
        appId = _ref.appId,
        prefix = _ref.prefix;
    var url = getRequestUrl(SERVICE_NAME$1, Api.sdkServer.makeCall);
    return ajaxPost(url, {
      phoneNum: phoneNum,
      callRelationId: callRelationId,
      lineNum: lineNum,
      robotId: robotId,
      appId: appId,
      prefix: prefix
    });
  }
  /*
  * 操作日志保存
  */

  function saveOptLog() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var url = getRequestUrl(SERVICE_NAME$1, Api.sdkServer.optLog);
    return ajaxPost(url, {
      content: content
    });
  }

  /*
  * 日志管理
  */
  var XLog =
  /*#__PURE__*/
  function () {
    function XLog(module) {
      var _this = this;

      var isDebug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _classCallCheck(this, XLog);

      this.dbName = '__xlog';
      this.version = 1;
      this.db = null;
      this.module = module;
      this.logData = [];
      this.isDebug = isDebug;
      var req = window.indexedDB.open(this.dbName, this.version);

      req.onsuccess = function (event) {
        _this.db = req.result;
      };

      req.onupgradeneeded = function (event) {
        _this.db = event.target.result;

        if (!_this.db.objectStoreNames.contains('log')) {
          var objectStore = _this.db.createObjectStore('log', {
            keyPath: 'id',
            autoIncrement: true
          });

          objectStore.createIndex('time', 'time', {
            unique: false
          });
          objectStore.createIndex('module', 'module', {
            unique: false
          });
        }
      };
    }

    _createClass(XLog, [{
      key: "log",
      value: function log() {
        var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'INFO';
        var msg = arguments.length > 1 ? arguments[1] : undefined;
        var data = arguments.length > 2 ? arguments[2] : undefined;

        try {
          var nowTime = new Date().getTime(),
              dataJson = data ? JSON.stringify(data) : '';

          if (!this.db) {
            this.logData.push({
              time: nowTime,
              level: level,
              module: this.module,
              msg: msg,
              data: dataJson
            });
            return;
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.logData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var l = _step.value;
              this.db.transaction(['log'], 'readwrite').objectStore('log').add({
                time: l.time,
                level: l.level,
                module: l.module,
                msg: l.msg,
                data: l.data
              });
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          this.logData = [];
          this.db.transaction(['log'], 'readwrite').objectStore('log').add({
            time: nowTime,
            level: level,
            module: this.module,
            msg: msg,
            data: dataJson
          });
        } catch (e) {}
      }
    }, {
      key: "info",
      value: function info(msg, data) {
        if (this.isDebug) {
          console.log(msg + '' + (data ? JSON.stringify(data) : ''));
        }

        this.log('INFO', msg, data);
      }
    }, {
      key: "error",
      value: function error(msg, data) {
        if (this.isDebug) {
          console.error(msg + '' + (data ? JSON.stringify(data) : ''));
        }

        this.log('ERROR', msg, data);
      }
    }, {
      key: "warn",
      value: function warn(msg, data) {
        if (this.isDebug) {
          console.warn(msg + '' + (data ? JSON.stringify(data) : ''));
        }

        this.log('WARN', msg, data);
      }
    }, {
      key: "clean",
      value: function clean() {
        if (!this.db) {
          return;
        }

        var nowTime = new Date().getTime(),
            time = nowTime - 0.5 * 24 * 60 * 60 * 1000,
            range = IDBKeyRange.upperBound(time);
        var req = this.db.transaction(['log'], 'readwrite').objectStore('log').index('time').openCursor(range, 'next');

        req.onsuccess = function () {
          var cursor = this.result;

          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
      }
    }, {
      key: "getAll",
      value: function getAll(num) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          if (!_this2.db) {
            resolve && resolve([]);
            return;
          }

          try {
            var req = _this2.db.transaction(['log'], 'readwrite').objectStore('log').openCursor();

            var data = [];

            req.onsuccess = function (ev) {
              var cursor = ev.target.result;

              if (cursor) {
                if (num != null && num <= 0) {
                  resolve && resolve(data);
                  return;
                }

                data.push(cursor.value);
                cursor.delete();
                cursor.continue();

                if (num != null && num > 0) {
                  num--;
                }
              } else {
                resolve && resolve(data);
              }
            };
          } catch (e) {
            resolve && resolve([]);
          }
        });
      }
    }]);

    return XLog;
  }();

  XLog._instance = null;

  XLog.getInstance = function (module) {
    if (!this._instance) {
      this._instance = new XLog(module);
    }

    return this._instance;
  };

  var Base =
  /*#__PURE__*/
  function () {
    function Base() {
      _classCallCheck(this, Base);

      this.log = XLog.getInstance('base');
      this.store = XStore.getInstance();
      this._saveLogTimer = null;
    }
    /*
    * 根据企业ID和token登录
    */


    _createClass(Base, [{
      key: "loginWithToken",
      value: function loginWithToken(_ref) {
        var _this = this;

        var business = _ref.business,
            token = _ref.token,
            success = _ref.success,
            fail = _ref.fail;
        this.log.info('账号登录', {
          business: business,
          token: token
        });

        if (!business || !token) {
          this.log.error("\u767B\u5F55\u5931\u8D25\uFF0C".concat(ReturnCode.ParamIsNull.desc));
          fail && fail({
            code: ReturnCode.ParamIsNull.code,
            desc: ReturnCode.ParamIsNull.desc
          });
          return;
        }

        queryAccountInfo(business, token).then(function (resp) {
          if (resp.code != '0') {
            var result = {
              code: ReturnCode.AuthFail.code,
              desc: resp.message || ReturnCode.AuthFail.desc
            };

            _this.log.error('登录失败', result);

            fail && fail(result);
            return;
          }

          var data = resp.result && resp.result.rows ? resp.result.rows[0] : {},
              dn = data && data.agent ? data.agent.dn : '';

          if (!dn) {
            _this.log.warn('未找到对应分机号');
          } //保存用户信息


          var userInfo = {
            account: data && data.user ? data.user.phone : '',
            dn: dn,
            token: token,
            outshowtel: data ? data.lines || [] : []
          }; //设置userInfo

          _this.store.setUserInfo(userInfo);

          _this.log.info('登录成功', userInfo);

          setTimeout(function () {
            _this.saveLog();
          }, 10000);
          success && success({
            code: ReturnCode.Success.code,
            desc: ReturnCode.Success.desc,
            token: token,
            outshowtel: userInfo.outshowtel
          });
        }).catch(function () {
          var result = {
            code: ReturnCode.AuthFail.code,
            desc: '接口调用异常'
          };

          _this.log.error('登录失败', result);

          fail && fail(result);
        });
      }
      /*
      * 设置用户信息直接登录
      */

    }, {
      key: "loginWithUser",
      value: function loginWithUser(_ref2) {
        var _this2 = this;

        var user = _ref2.user,
            success = _ref2.success,
            fail = _ref2.fail;

        if (!user || !user.account || !user.token || !user.dn) {
          this.log.error("\u767B\u5F55\u5931\u8D25\uFF0C".concat(ReturnCode.ParamIsNull.desc));
          fail && fail({
            code: ReturnCode.ParamIsNull.code,
            desc: ReturnCode.ParamIsNull.desc
          });
          return;
        } //保存用户信息


        var userInfo = {
          account: user.account,
          dn: user.dn,
          token: user.token,
          outshowtel: user.outshowtel || []
        }; //设置userInfo

        this.store.setUserInfo(userInfo);
        this.log.info('登录成功', userInfo);
        setTimeout(function () {
          _this2.saveLog();
        }, 10000);
        success && success({
          code: ReturnCode.Success.code,
          desc: ReturnCode.Success.desc,
          token: userInfo.token,
          outshowtel: userInfo.outshowtel
        });
      }
      /*
      * 账号登录
      */

    }, {
      key: "login",
      value: function login$1(_ref3) {
        var _this3 = this;

        var account = _ref3.account,
            password = _ref3.password,
            success = _ref3.success,
            fail = _ref3.fail;
        this.log.info('账号登录', {
          account: account,
          password: password
        });

        if (!account || !password) {
          this.log.error("\u767B\u5F55\u5931\u8D25\uFF0C".concat(ReturnCode.ParamIsNull.desc));
          fail && fail({
            code: ReturnCode.ParamIsNull.code,
            desc: ReturnCode.ParamIsNull.desc
          });
          return;
        }

        var timestamp = new Date().getTime();
        var param = {};

        {
          var secKey = 'kxjl' + account + timestamp;

          var realKey = function getkey(key) {
            var realKey = CryptoJS.SHA1(key);
            realKey = CryptoJS.SHA1(realKey).toString().substring(0, 32);
            return realKey;
          }(secKey);

          var encrypt = CryptoJS.AES.encrypt(password, CryptoJS.enc.Hex.parse(realKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
          param = {
            phone: account,
            password: encrypt.ciphertext.toString(CryptoJS.enc.Base64),
            timestamp: timestamp
          };
        }

        login(param).then(function (resp) {
          if (resp.code != '0') {
            var result = {
              code: ReturnCode.AuthFail.code,
              desc: resp.message || ReturnCode.AuthFail.desc
            };

            _this3.log.error('登录失败', result);

            fail && fail(result);
            return;
          }

          var data = resp.result && resp.result.rows ? resp.result.rows[0] : {},
              token = data && data.token ? data.token.access_token : '',
              dn = data && data.agent ? data.agent.dn : '';

          if (!dn) {
            _this3.log.warn('未找到对应分机号');
          } //保存用户信息


          var userInfo = {
            account: account,
            dn: dn,
            token: token,
            outshowtel: data ? data.lines || [] : []
          }; //设置userInfo

          _this3.store.setUserInfo(userInfo);

          _this3.log.info('登录成功', userInfo);

          setTimeout(function () {
            _this3.saveLog();
          }, 10000);
          success && success({
            code: ReturnCode.Success.code,
            desc: ReturnCode.Success.desc,
            token: token,
            outshowtel: userInfo.outshowtel
          });
        }).catch(function () {
          var result = {
            code: ReturnCode.AuthFail.code,
            desc: '接口调用异常'
          };

          _this3.log.error('登录失败', result);

          fail && fail(result);
        });
      }
      /*
      * 账号退出
      */

    }, {
      key: "logout",
      value: function logout$1(_ref4) {
        var _this4 = this;

        var success = _ref4.success,
            fail = _ref4.fail;
        this.log.info('账号主动退出');

        if (!this.store.getToken()) {
          fail && fail({
            code: ReturnCode.AuthFail.code,
            desc: ReturnCode.AuthFail.desc
          });
          return;
        }

        try {
          this.log.info('退出将自动关闭电话服务');
          xiaoman.phone.close();
        } catch (e) {
          this.log.warn('退出将自动关闭电话服务失败');
        }

        logout({}).then(function (resp) {
          if (resp.code != '0') {
            fail && fail({
              code: ReturnCode.AuthFail.code,
              desc: resp.message || ReturnCode.AuthFail.desc
            });
            return;
          }

          _this4.store.setUserInfo(null);

          _this4._cancelSaveLog();

          success && success({
            code: ReturnCode.Success.code,
            desc: ReturnCode.Success.desc
          });
        }).catch(function () {
          var result = {
            code: ReturnCode.AuthFail.code,
            desc: '接口调用异常'
          };

          _this4.log.error('退出异常', result);

          fail && fail(result);
        });
      }
    }, {
      key: "_cancelSaveLog",
      value: function _cancelSaveLog() {
        clearTimeout(this._saveLogTimer);
      }
    }, {
      key: "saveLog",
      value: function saveLog() {
        var _this5 = this;

        if (this.store.getToken()) {
          this.log.getAll(20).then(function (data) {
            if (!data || data.length == 0) {
              return;
            }

            data.forEach(function (item) {
              item._accout = _this5.store.getAccount() + '__' + localStorage.getItem('__uuid');
              item._dn = _this5.store.getAgentDn();
              item._token = _this5.store.getToken();
            });
            saveOptLog(data);
          });
          this._saveLogTimer = setTimeout(function () {
            _this5.saveLog();
          }, 60000);
        }
      }
    }]);

    return Base;
  }();

  var XEvent =
  /*#__PURE__*/
  function () {
    function XEvent() {
      _classCallCheck(this, XEvent);

      this._events = Object.create(null);
    }

    _createClass(XEvent, [{
      key: "on",
      value: function on(type, handler) {
        this._events[type] = this._events[type] || [];

        this._events[type].push(handler);
      }
    }, {
      key: "once",
      value: function once(type, handler) {
        this._events[type] = [handler];
      }
    }, {
      key: "emit",
      value: function emit(type) {
        var args = [].slice.call(arguments, 1);
        (this._events[type] || []).forEach(function (fn) {
          fn && fn.apply(void 0, _toConsumableArray(args));
        });
      }
    }, {
      key: "onMessage",
      value: function onMessage(fn) {
        this.once(EventInner.Message, fn);
      }
    }, {
      key: "contain",
      value: function contain(key) {
        return this._events[key] != null;
      }
    }, {
      key: "cleanAll",
      value: function cleanAll() {
        this._events = Object.create(null);
      }
    }]);

    return XEvent;
  }();

  XEvent._instance = null;

  XEvent.getInstance = function () {
    if (!this._instance) {
      this._instance = new XEvent();
    }

    return this._instance;
  };

  /*
  * 铃声
  */
  var XRing =
  /*#__PURE__*/
  function () {
    function XRing() {
      _classCallCheck(this, XRing);

      this.ring = 'https://agent.kxjlcc.com/websdk/ring.wav';
    }

    _createClass(XRing, [{
      key: "playRing",
      value: function playRing() {
        if (document.getElementById("__sdkring")) {
          return;
        }

        var sdkRing = document.createElement("audio");
        sdkRing.setAttribute("id", "__sdkring");
        sdkRing.style.display = "none";
        sdkRing.setAttribute("autoplay", "autoplay");
        sdkRing.setAttribute("loop", "loop");
        sdkRing.setAttribute("src", this.ring);
        document.body.appendChild(sdkRing);
      }
    }, {
      key: "stop",
      value: function stop() {
        var sdkRing = document.getElementById("__sdkring");

        if (sdkRing) {
          sdkRing.pause();
          sdkRing.parentNode.removeChild(sdkRing);
        }
      }
    }]);

    return XRing;
  }();

  XRing._instance = null;

  XRing.getInstance = function () {
    if (!this._instance) {
      this._instance = new XRing();
    }

    return this._instance;
  };

  var XSip =
  /*#__PURE__*/
  function () {
    function XSip() {
      _classCallCheck(this, XSip);

      this.log = XLog.getInstance('sip');
      this.event = XEvent.getInstance();
      this.store = XStore.getInstance();
      this.ring = XRing.getInstance();
      this.socket = null;
      this.ua = null;
      this.session = null;
      this.localStream = null;
      this.callOrigin = '';
      this.audio = document.createElement("AUDIO");
      this.audio.setAttribute("autoplay", "autoplay");
    }

    _createClass(XSip, [{
      key: "_destoryCall",
      value: function _destoryCall() {
        this.session = null;
        this.localStream = null;
        this.store.setUserData(null);
        this.store.setDni('');
        this.store.setAgentUUID('');
        this.store.setCustomerUUID('');
        this.ring.stop();
      }
    }, {
      key: "_getSipHeader",
      value: function _getSipHeader(req, key) {
        var headers = req.headers;

        if (!headers) {
          return '';
        }

        var data = headers[key];

        if (!data || data.length == 0) {
          return '';
        }

        return data[0].raw || '';
      }
    }, {
      key: "_initSession",
      value: function _initSession(ev) {
        var _this = this;

        if (this.session) {
          //如果当前为监听，则把电话挂断，接下一通
          if (this.getCallOrigin() == CallOrigin.Listening) {
            this.release();
          } else {
            this.log.info('座席正忙');
            ev.session.terminate({
              status_code: 486,
              reason_phrase: 'Agent Busy'
            });
            return;
          }
        }

        if (!ev.session) {
          return;
        }

        this.session = ev.session;

        if (ev.originator == 'local') {
          setTimeout(function () {
            var evt = document.createEvent('Event');
            evt.initEvent('icecandidate', false, false);
            ev.session.connection.dispatchEvent(evt);
          }, 1500);
          return;
        }

        var session = this.session,
            connection = session ? session.connection : null;

        if (!session.id) {
          this.log.warn('会话ID不存在，自动挂断');
          session.terminate({
            status_code: 486,
            reason_phrase: 'Session NotFound'
          });

          this._destoryCall();

          return null;
        }
        /*session.on('progress', (s_ev) => {
            console.log('progress')
        });
        session.on('accepted',  (s_ev) => {
            console.log('accepted')
        });*/


        session.on('confirmed', function (s_ev) {
          if (!_this._isAutoAnswer()) {
            _this.log.info('电话已接通');

            _this.event.emit(EventInner.SIP_Established);
          }
        });
        session.on('failed', function (s_ev) {
          _this.log.info('当前会话状态：failed');

          _this.event.emit(EventInner.SIP_Ended);

          _this._destoryCall();
        });
        session.on('ended', function (s_ev) {
          _this.log.info('当前会话状态：ended');

          _this.event.emit(EventInner.SIP_Ended);

          _this._destoryCall();
        });
        session.on('newInfo', function (data) {
          var msg = data.info.body ? JSON.parse(data.info.body) : null,
              msgEvent = msg.event ? msg.event.toUpperCase() : '';

          _this.log.info('收到Info消息', msg);

          if (msgEvent == 'CHANNEL_PROGRESS_MEDIA') {
            _this.event.emit(EventInner.SIP_Ringing);
          } else if (msgEvent == 'CHANNEL_ANSWER') {
            _this.event.emit(EventInner.SIP_Established);
          } else if (msgEvent == 'TRANSCRIPT') {
            //实时转写
            _this.event.emit(EventInner.SIP_Transcript, msg);
          }
        });
        this.callOrigin = this._getSipHeader(ev.request, 'X-Kxjl-Call-Origin'); //自动接通

        if (this._isAutoAnswer()) {
          this.answer();
          return;
        }

        this.store.setDni(ev.request.from.display_name);
        this.store.setCustomerUUID(this._getSipHeader(ev.request, 'X-Kxjl-Customer-Uuid'));
        this.store.setAgentUUID(this._getSipHeader(ev.request, 'X-Kxjl-Agent-Uuid'));
        this.store.setUserData({
          'call-relation-id': this._getSipHeader(ev.request, 'X-Kxjl-Call-Relation-Id'),
          'app-id': this._getSipHeader(ev.request, 'X-Kxjl-App-Id'),
          'line': this._getSipHeader(ev.request, 'X-Kxjl-Line')
        });
        this.log.info('播放来电提示音乐');
        this.ring.playRing();
        this.event.emit(EventInner.SIP_Ringing);

        if (connection) {
          connection.onaddstream = function (ev) {
            var remoteStreams = connection.getRemoteStreams();

            if (remoteStreams.length > 0) {
              _this.audio.srcObject = remoteStreams[0];
            }
          };

          connection.onremovestream = function (ev) {
            _this.audio.srcObject = null;
          };
        }

        session.bufferedInvite = null;
      }
    }, {
      key: "_isAutoAnswer",
      value: function _isAutoAnswer() {
        return [CallOrigin.WebClick, CallOrigin.Listening, CallOrigin.BrainTransfer].indexOf(this.callOrigin) >= 0;
      }
    }, {
      key: "isOpen",
      value: function isOpen() {
        return this.ua && this.ua.isRegistered();
      }
    }, {
      key: "isBusy",
      value: function isBusy() {
        return this.session != null;
      }
    }, {
      key: "isEstablished",
      value: function isEstablished() {
        return this.session && this.session.isEstablished();
      }
    }, {
      key: "getCallOrigin",
      value: function getCallOrigin() {
        return this.callOrigin;
      }
    }, {
      key: "answer",
      value: function answer() {
        var _this2 = this;

        if (this._isAutoAnswer()) {
          this.log.info('自动接听');
        } else {
          this.log.info('呼入接听电话');
          this.ring.stop();
        }

        navigator.mediaDevices.getUserMedia({
          'audio': true,
          'video': false
        }).then(function (mediaStream) {
          _this2.localStream = mediaStream;
          var _config = {
            'mediaConstraints': {
              'audio': true,
              'video': false
            },
            'pcConfig': {
              'iceServers': [{
                urls: [Config.sip.iceURL]
              }]
            },
            sessionTimersExpires: 1800,
            mediaStream: mediaStream
            /* rtcOfferConstraints : {iceRestart : true,offerToReceiveAudio : true}*/

          };

          _this2.session.answer(_config);

          if (_this2._isAutoAnswer()) {
            _this2.log.info('触发自动接听事件');

            _this2.event.emit(EventInner.SIP_AutoAnswer);
          }

          if (_this2.session.connection) {
            _this2.session.connection.onaddstream = function () {
              var remoteStreams = _this2.session.connection.getRemoteStreams();

              if (remoteStreams.length > 0) {
                _this2.audio.srcObject = remoteStreams[0];
              }
            };

            _this2.session.connection.onremovestream = function () {
              _this2.audio.src = '';
            };

            setTimeout(function () {
              var evt = document.createEvent('Event');
              evt.initEvent('icecandidate', false, false);

              if (_this2.session && _this2.session.connection != null) {
                _this2.session.connection.dispatchEvent(evt);
              }
            }, 2000);
          }
        }).catch(function (error) {
          _this2.log.error(error);
        });
      }
    }, {
      key: "release",
      value: function release() {
        if (this.session) {
          if (this.isEstablished()) {
            this.session.terminate({
              status_code: 200,
              reason_phrase: 'Web Release'
            });
          } else {
            this.session.terminate({
              status_code: 486,
              reason_phrase: 'Web Busy'
            });
          }
        }

        this._destoryCall();
      }
    }, {
      key: "open",
      value: function open() {
        var _this3 = this;

        this.socket = new JsSIP.WebSocketInterface(Config.sip.socketURL);
        var phoneNum = this.store.getAgentDn();

        if (!phoneNum) {
          this.log.error('未获取到座席对应分机号');
          return;
        }

        var configuration = {
          sockets: [this.socket],
          uri: "sip:".concat(phoneNum).concat(Config.sip.sipURI),
          authorization_user: phoneNum,
          display_name: phoneNum,
          password: this.store.getToken(),
          //password : 'error: token is invalid',
          register: Config.sip.register,
          contact_uri: "sip:".concat(phoneNum).concat(Config.sip.sipURI, ";transport=wss"),
          register_expires: Config.sip.register_expires
        };
        this.ua = new JsSIP.UA(configuration);
        this.ua.on('connecting', function (ev) {
          _this3.log.info('SIP连接中...');
        });
        this.ua.on('connected', function (ev) {
          _this3.log.info('SIP已连接');

          _this3.ua.unregister();

          setTimeout(function () {
            _this3.ua.register();
          }, 500);
        });
        this.ua.on('disconnected', function (ev) {
          _this3.log.warn('SIP连接断开');
        });
        this.ua.on('registered', function (ev) {
          _this3.log.info('SIP注册成功');

          _this3.event.emit(EventInner.SIP_Opened);
        });
        this.ua.on('unregistered', function (ev) {
          _this3.log.info('SIP已注销');
        });
        this.ua.on('registrationFailed', function (ev) {
          _this3.log.error('SIP注册失败');
        });
        this.ua.on('newRTCSession', function (ev) {
          _this3.log.info('SIP会话接入...');

          _this3._initSession(ev);
        });
        this.ua.on('newMessage', function (ev) {
          _this3.log.error('SIP消息通知');
        });
        this.ua.start();
      }
    }, {
      key: "close",
      value: function close() {
        this._destoryCall();

        if (this.session) {
          this.session.terminate({
            status_code: 200,
            reason_phrase: 'hang up by close phone'
          });
          this.session = null;
        }

        if (this.ua) {
          this.ua.stop();
          this.ua = null;
        }

        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }
      }
    }]);

    return XSip;
  }();

  var XIM =
  /*#__PURE__*/
  function () {
    function XIM(account) {
      _classCallCheck(this, XIM);

      this.connection = null;
      this.log = XLog.getInstance('im');
      this.event = XEvent.getInstance();
      this.store = XStore.getInstance();
    }

    _createClass(XIM, [{
      key: "isOpen",
      value: function isOpen() {
        return this.connection && this.connection.connected;
      }
    }, {
      key: "open",
      value: function open() {
        var _this = this;

        var loadPlugin = function loadPlugin() {
          return new Promise(function (resolve, reject) {
            if (window.Strophe) {
              resolve && resolve();
            } else {
              loadScript('https://agent.kxjlcc.com/websdk/plugins/strophe.js').then(function () {
                resolve && resolve();
              });
            }
          });
        };

        loadPlugin().then(function () {
          var account = _this.store.getAgentDn();

          var tscFrom = "tsc-" + account + Config.im.serverName + (Config.im.resource),
              pwd = '',
              serverUrl = Config.im.server;
          _this.connection = new Strophe.Connection(serverUrl, {
            withCredentials: false
          }, false);

          _this.connection.connect(tscFrom, pwd, function (status, condition) {
            _this.log.info("IM\u5F53\u524D\u72B6\u6001\u4E3A".concat(IM.State[status], "\u3002\u542F\u52A8\u8D26\u53F7\u4E3A\uFF1A").concat(tscFrom, ",\u5730\u5740\u4E3A\uFF1A").concat(serverUrl, "\u3002"));

            try {
              if (status === Strophe.Status.CONNECTED) {
                _this.log.info('IM启动成功');

                _this.event.emit(EventInner.ImConected, true);
              } else if (condition === 'conflict') {
                //被踢下线
                _this.event.emit(EventInner.ImConflict, true);

                console.warn('您的帐号已在其它地方登录，您已被强制退出');

                _this.log.warn('您的帐号已在其它地方登录，您已被强制退出');
              }
            } catch (e) {
              _this.log.error("IM\u542F\u52A8\u5F02\u5E38\uFF0C\u542F\u52A8\u8D26\u53F7\u4E3A\uFF1A".concat(tscFrom, ",\u5730\u5740\u4E3A\uFF1A").concat(serverUrl));

              if (_this.connection != null) {
                _this.connection.disconnect();

                _this.connection = null;
              }
            }
          });
        });
      }
    }, {
      key: "close",
      value: function close() {
        this.log.info('关闭IM');

        if (this.connection) {
          this.connection.disconnect();
          this.connection = null;
        }
      }
    }]);

    return XIM;
  }();

  var Phone =
  /*#__PURE__*/
  function () {
    function Phone() {
      _classCallCheck(this, Phone);

      this.log = XLog.getInstance('phone');
      this.sip = new XSip();
      this.im = new XIM();
      this.store = XStore.getInstance();
      this.event = XEvent.getInstance();
      this.isStart = false;
    }

    _createClass(Phone, [{
      key: "_openSIP",
      value: function _openSIP() {
        this.sip.open();
      }
    }, {
      key: "_openIM",
      value: function _openIM() {
        this.im.open();
      }
    }, {
      key: "_checkLogin",
      value: function _checkLogin() {
        return !!this.store.getUserInfo();
      }
    }, {
      key: "_getCommonData",
      value: function _getCommonData() {
        var callOrigin = this.sip.getCallOrigin(),
            ani = '',
            dni = '';

        if (callOrigin == CallOrigin.WebClick) {
          ani = this.store.getAgentDn();
          dni = this.store.getDni();
        } else {
          ani = this.store.getDni();
          dni = this.store.getAgentDn();
        }

        return {
          'call-origin': callOrigin,
          'userData': this.store.getUserData(),
          'agent-uuid': this.store.getAgentUUID(),
          'customer-uuid': this.store.getCustomerUUID(),
          'ani': ani,
          'dni': dni
        };
      }
    }, {
      key: "_getEventData",
      value: function _getEventData(msgType, data) {
        var result = {
          msgType: msgType
        };

        switch (msgType) {
          case MsgType.EventOpened:
            break;

          case MsgType.EventConflict:
            break;

          case MsgType.EventDialing:
            result = Object.assign(result, this._getCommonData());
            break;

          case MsgType.EventReleased:
            result = Object.assign(result, this._getCommonData());
            break;

          case MsgType.EventRinging:
            result = Object.assign(result, this._getCommonData());
            break;

          case MsgType.EventEstablished:
            result = Object.assign(result, this._getCommonData());
            break;

          case MsgType.EventTranscript:
            data = data || {};
            result = Object.assign(result, this._getCommonData());
            result.userData = data;
            break;
        }

        return result;
      }
    }, {
      key: "isOpen",
      value: function isOpen() {
        return this.isStart || this.sip.isOpen();
      }
      /*
      * 启动电话服务
      */

    }, {
      key: "open",
      value: function open(param) {
        var _this = this;

        var success = param ? param.success : null,
            fail = param ? param.fail : null;
        this.log.info('开始启动电话服务');
        checkEnv().then(function (result, message) {
          if (!result) {
            _this.log.error("电话启动失败：" + ReturnCode.EnvError.desc);

            fail && fail({
              code: ReturnCode.EnvError.code,
              desc: ReturnCode.EnvError.desc
            });
            return;
          } //如果服务已启动则返回错误，不允许重复启动


          if (_this.isOpen()) {
            _this.log.error("电话启动失败：" + ReturnCode.PhoneIsOpened.desc);

            fail && fail({
              code: ReturnCode.PhoneIsOpened.code,
              desc: ReturnCode.PhoneIsOpened.desc
            });
            return;
          } //判断用户是否登录和传入的token是否正确


          if (!_this._checkLogin()) {
            _this.log.error("电话启动失败：" + ReturnCode.AccountNotLogin.desc);

            fail && fail({
              code: ReturnCode.AccountNotLogin.code,
              desc: ReturnCode.AccountNotLogin.desc
            });
            return;
          } //判断分机号是否存在


          if (!_this.store.getAgentDn()) {
            _this.log.error("电话启动失败：" + ReturnCode.AgentDnNotFound.desc);

            fail && fail({
              code: ReturnCode.AgentDnNotFound.code,
              desc: ReturnCode.AgentDnNotFound.desc
            });
            return;
          } //判断是否监听事件


          if (!_this.event.contain(EventInner.Message)) {
            _this.log.error('电话启动失败：' + ReturnCode.EventNotListen.desc);

            fail && fail({
              code: ReturnCode.EventNotListen.code,
              desc: ReturnCode.EventNotListen.desc
            });
            return;
          } //监听SIP电话内部事件
          //sip注册成功


          _this.event.once(EventInner.SIP_Opened, function (result) {
            if (_this.isOpen()) {
              _this.log.info('电话启动成功');

              var eventData = _this._getEventData(MsgType.EventOpened);

              _this.log.info('触发电话事件', eventData);

              _this.event.emit(EventInner.Message, eventData);
            }
          }); //sip自动接听


          _this.event.once(EventInner.SIP_AutoAnswer, function () {
            var eventData = _this._getEventData(MsgType.EventDialing);

            _this.log.info('触发电话事件', eventData);

            _this.event.emit(EventInner.Message, eventData);
          }); //sip会话结束


          _this.event.once(EventInner.SIP_Ended, function () {
            var eventData = _this._getEventData(MsgType.EventReleased);

            _this.log.info('触发电话事件', eventData);

            _this.event.emit(EventInner.Message, _this._getEventData(MsgType.EventReleased));
          }); //sip用户振铃


          _this.event.once(EventInner.SIP_Ringing, function () {
            var eventData = _this._getEventData(MsgType.EventRinging);

            _this.log.info('触发电话事件', eventData);

            _this.event.emit(EventInner.Message, _this._getEventData(MsgType.EventRinging));
          }); //sip用户接听


          _this.event.once(EventInner.SIP_Established, function () {
            var eventData = _this._getEventData(MsgType.EventEstablished);

            _this.log.info('触发电话事件', eventData);

            _this.event.emit(EventInner.Message, _this._getEventData(MsgType.EventEstablished));
          }); //sip转写文本


          _this.event.once(EventInner.SIP_Transcript, function (data) {
            var eventData = _this._getEventData(MsgType.EventTranscript, data);

            _this.log.info('转写文本', eventData);

            _this.event.emit(EventInner.Message, eventData);
          }); //im冲突


          _this.event.once(EventInner.ImConflict, function () {
            _this.log.warn('IM账号冲突，将自动关闭电话功能');

            _this.event.emit(EventInner.Message, _this._getEventData(MsgType.EventConflict));

            _this.close();
          }); //启动sip电话


          _this._openSIP(); //启动IM


          _this._openIM();

          _this.isStart = true;
          success && success({
            code: ReturnCode.Success.code,
            desc: ReturnCode.Success.desc
          });
        });
      }
      /*
      * 关闭电话服务
      */

    }, {
      key: "close",
      value: function close(param) {
        this.log.info('关闭电话服务');
        this.sip.close();
        this.store.setUserData(null);
        this.store.setDni('');
        this.store.setAgentUUID('');
        this.store.setCustomerUUID('');
        this.isStart = false;
        this.im.close();
        param && param.success && param.success({
          code: ReturnCode.Success.code,
          desc: ReturnCode.Success.desc
        });
      }
    }, {
      key: "answer",
      value: function answer() {
        var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.log.info('接听电话');

        if (!this._checkLogin()) {
          this.log.error("接听失败：" + ReturnCode.AccountNotLogin.desc);
          param.fail && param.fail({
            code: ReturnCode.AccountNotLogin.code,
            desc: ReturnCode.AccountNotLogin.desc
          });
          return;
        }

        if (!this.isOpen()) {
          this.log.error('接听失败：电话功能已关闭');
          param.fail && param.fail({
            code: ReturnCode.PhoneIsNotOpen.code,
            desc: ReturnCode.PhoneIsNotOpen.desc
          });
          return;
        }

        if (!this.sip.isBusy() || this.sip.getCallOrigin() == CallOrigin.WebClick) {
          this.log.error('接听失败：未找到有效通话');
          param.fail && param.fail({
            code: ReturnCode.CallNotFound.code,
            desc: ReturnCode.CallNotFound.desc
          });
          return;
        }

        if (this.sip.isEstablished()) {
          this.log.error('接听失败：正在通话中无法接听');
          param.fail && param.fail({
            code: ReturnCode.CallEstablished.code,
            desc: ReturnCode.CallEstablished.desc
          });
          return;
        }

        this.sip.answer();
        param.success && param.success({
          code: ReturnCode.Success.code,
          desc: ReturnCode.Success.desc
        });
      }
    }, {
      key: "callOut",
      value: function callOut(_ref) {
        var _this2 = this;

        var phoneNum = _ref.phoneNum,
            line = _ref.line,
            _ref$userData = _ref.userData,
            userData = _ref$userData === void 0 ? {} : _ref$userData,
            success = _ref.success,
            fail = _ref.fail;

        if (arguments.length == 0) {
          this.log.error('外呼失败：参数不能为空');
          fail && fail({
            code: ReturnCode.ParamIsNull.code,
            desc: ReturnCode.ParamIsNull.desc
          });
          return;
        }

        this.log.info('开始外呼', {
          phoneNum: phoneNum,
          line: line,
          userData: userData
        });

        if (!this._checkLogin()) {
          this.log.error("外呼失败：" + ReturnCode.AccountNotLogin.desc);
          fail && fail({
            code: ReturnCode.AccountNotLogin.code,
            desc: ReturnCode.AccountNotLogin.desc
          });
          return;
        } //电话是否已启动


        if (!this.isOpen()) {
          this.log.error('外呼失败：电话功能已关闭');
          fail && fail({
            code: ReturnCode.PhoneIsNotOpen.code,
            desc: ReturnCode.PhoneIsNotOpen.desc
          });
          return;
        } //参数检查


        if (!phoneNum) {
          this.log.error('外呼失败：呼叫号码不能为空');
          fail && fail({
            code: ReturnCode.ParamIsNull.code,
            desc: ReturnCode.ParamIsNull.desc
          });
          return;
        } //手机号码格式检查


        if (!/^\d+$/.test(phoneNum)) {
          this.log.error('外呼失败：号码格式不正确');
          fail && fail({
            code: ReturnCode.ParamError.code,
            desc: ReturnCode.ParamError.desc
          });
          return;
        }

        if (line && !/^\d+$/.test(line)) {
          this.log.error('外呼失败：外显号码格式不正确');
          fail && fail({
            code: ReturnCode.ParamError.code,
            desc: ReturnCode.ParamError.desc
          });
          return;
        } //如果外显号码不为空则判断外显号码是否正确


        if (line != "") {
          var lineArr = this.store.getTelNum() || [];

          if (lineArr.indexOf(line) < 0) {
            fail && fail({
              code: ReturnCode.LineNumError.code,
              desc: ReturnCode.LineNumError.desc
            });
            return;
          }
        } //是否存在会话


        if (this.sip.isBusy()) {
          fail && fail({
            code: ReturnCode.CallBusy.code,
            desc: ReturnCode.CallBusy.desc
          });
          return;
        }

        makeCall({
          callRelationId: userData['call-relation-id'] || "",
          appId: userData['app-id'] || "",
          robotId: userData['robot-id'] || "",
          prefix: userData['prefix'] || "",
          phoneNum: phoneNum,
          lineNum: line || ""
        }).then(function (resp) {
          if (resp.code != '0') {
            _this2.log.error('外呼失败：' + resp.messageExt || ReturnCode.CallOutError.desc);

            fail && fail({
              code: ReturnCode.CallOutError.code,
              desc: resp.messageExt || ReturnCode.CallOutError.desc
            });
            return;
          }

          var agentUUID = resp.result && resp.result.rows && resp.result.rows.length > 0 ? resp.result.rows[0].uuid_aleg : '',
              cusotmerUUID = resp.result && resp.result.rows && resp.result.rows.length > 0 ? resp.result.rows[0].uuid_bleg : '';

          _this2.store.setUserData(userData);

          _this2.store.setDni(phoneNum);

          _this2.store.setAgentUUID(agentUUID || '');

          _this2.store.setCustomerUUID(cusotmerUUID || '');

          _this2.log.info('外呼成功', {
            agentUUID: agentUUID,
            cusotmerUUID: cusotmerUUID
          });

          success && success({
            code: ReturnCode.Success.code,
            desc: ReturnCode.Success.desc
          });
        }).catch(function () {
          _this2.log.error('外呼失败：接口调用失败');

          fail && fail({
            code: ReturnCode.CallOutError.code,
            desc: '接口调用失败'
          });
        });
      }
    }, {
      key: "release",
      value: function release(param) {
        this.log.info('座席主动挂断');
        this.sip.release();
        param && param.success && param.success({
          code: ReturnCode.Success.code,
          desc: ReturnCode.Success.desc
        });
      }
    }]);

    return Phone;
  }();

  /*
  * webrtc版本
  */

  if (!localStorage.getItem('__uuid')) {
    localStorage.setItem('__uuid', getUUID());
  }

  var xiaoman$1 = {
    base: new Base(),
    phone: new Phone()
  };

  return xiaoman$1;

}());
