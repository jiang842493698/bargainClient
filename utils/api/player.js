const requestUtil = require('../wx-extend/request');
const config = require('../../config/index');

function updatePlayer(userInfo, callback) {
  requestUtil.request({
    url: config.baseUrl + '/api/players/updateMyInfo',
    auth: true,
    data: {
      userInfo: JSON.stringify(userInfo)
    },
    method: 'PUT',
    header: {
      'content-type': 'application/json'
    },
    success: function(response) {
      callback(null, response.data);
    },
    fail: function(error) {
      callback(error);
    }
  });
}
//查询活动信息
function getMyBenefits(data, callback){
  requestUtil.request({
    url: config.baseUrl + '/api/players/getMyBenefits',
    auth: true,
    method: 'GET',
    data: data,
    success: function (response) {
      callback(null, response.data);
    },
    fail: function (error) {
      callback(error);
    }
  });
}

module.exports = { updatePlayer, getMyBenefits };