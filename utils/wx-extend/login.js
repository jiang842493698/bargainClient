var constants = require('./constants');
var Session = require('./session');
var config = require('../../config/index');

const noop = function noop() {}
const defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  loginUrl: config.baseUrl + '/api/wechatAuth',
}

/**
 * @method
 * 
 * @param {Object}   opts           登录配置
 * @param {Function} [opts.success] 可选。登录成功后的回调函数，参数 token 微信用户凭证
 * @param {Function} [opts.fail]    可选。登录失败后的回调函数，参数 error 错误信息
 */
function login(opts) {
    opts = Object.assign({}, defaultOptions, opts)

    wx.login({
      success (loginResult) {
        // 构造请求头，包含 code
        const header = {
          [constants.WX_HEADER_CODE]: loginResult.code
        }
        var userInfo = Session.getUserInfo();
        var data = {};
        if (userInfo) {
          data.nickName = userInfo.nickName;
          data.avatarUrl = userInfo.avatarUrl;
        }
        // 请求服务器登录地址，获得会话信息
        wx.request({
          url: opts.loginUrl,
          header: header,
          data: data,
          method: opts.method,
          success (result) {
            const data = result.data;

            if (!data || !data.token) {
              return opts.fail(new Error(`登录失败(${data.error})：${data.message}`));
            }

            // 成功地响应会话信息
            Session.setToken(data.token);
            opts.success(data.token);
          },
          fail (err) {
            opts.fail('登录失败，可能是网络错误或者服务器发生异常');
          }
        });
      }
    })
}

module.exports = { login }
