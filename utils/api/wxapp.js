const requestUtil = require('../wx-extend/request');
const config = require('../../config/index');

//获取参与者信息 
function getWxApp(callback) {
  requestUtil.request({
    url: config.wxAppUrl + '/api/apps?type=applyToBanner',
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function (response) {

      callback(null, response.data);
    },
    fail: function (error) {
      callback(error);
    }
  });
}
module.exports = { getWxApp }