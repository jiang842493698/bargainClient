var constants = require('./constants');
var sessionUtil = require('./session');
var loginUtil = require('./login');

var noop = function noop() {};

var buildAuthHeader = function buildAuthHeader(isRequired, token) {
  var header = {};

  if (isRequired && token) {
    header[constants.WX_HEADER_TOKEN] = `Bearer ${token}`;
  }

  return header;
};

function request(options) {
  if (typeof options !== 'object') {
    throw new Error(`请求传参应为 object 类型，但实际传了 ${typeof options} 类型`);
  }

  var requireAuth = options.auth;
  var success = options.success || noop;
  var fail = options.fail || noop;
  var complete = options.complete || noop;
  var originHeader = options.header || {};

  // 成功回调
  var callSuccess = function () {
    success.apply(null, arguments);
    complete.apply(null, arguments);
  };

  // 失败回调
  var callFail = function (error) {
    fail.call(null, error);
    complete.call(null, error);
  };

  // 是否已经进行过重试
  var hasRetried = false;
  
  if (requireAuth && !sessionUtil.getToken()) {
    doRequestWithLogin();
  } else {
    doRequest(); 
  }

  // 登录后再请求
  function doRequestWithLogin() {
    loginUtil.login({ success: doRequest, fail: callFail });
  }

  // 实际进行请求的方法
  function doRequest() {
      var authHeader = buildAuthHeader(requireAuth, sessionUtil.getToken());

      wx.request(Object.assign({}, options, {
        header: Object.assign({}, originHeader, authHeader),

        success: function (response) {
          if (response.statusCode === 401) {
            // 清除登录态
            sessionUtil.clearToken();

            if (!hasRetried) {
              hasRetried = true;
              doRequestWithLogin();
              return;
            }

            callFail(new Error('登录态已过期'));
            return;
          }

          callSuccess.apply(null, arguments);
        },

        fail: callFail,
        complete: noop,
      }));
  };
};

module.exports = { request };