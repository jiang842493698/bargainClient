const requestUtil = require('../wx-extend/request');
const config = require('../../config/index');

function getBargainData(data, callback) {
  requestUtil.request({
    url: `${config.baseUrl}/api/bargainrecords/getBargainData`,
    auth: true,
    data: data,
    method: 'GET',
    success: function(response) {
      callback(null, response.data);
    },
    fail: function(error) {
      callback(error);
    }
  });
}

function getBargainRecords(data, callback) {
  requestUtil.request({
    url: `${config.baseUrl}/api/bargainrecords/getBargainRecords`,
    auth: true,
    data: data,
    method: 'GET',
    success: function(response) {
      callback(null, response.data);
    },
    fail: function(error) {
      callback(error);
    }
  });
}

function createBargain(data, callback) {
  requestUtil.request({
    url: `${config.baseUrl}/api/bargainrecords/createBargain`,
    auth: true,
    data: data,
    method: 'POST',
    success: function(response) {
      callback(null, response.data);
    },
    fail: function(error) {
      callback(error);
    }
  });
}

function helpBargain(data, callback) {
  requestUtil.request({
    url: `${config.baseUrl}/api/bargainrecords/helpBargain`,
    auth: true,
    data: data,
    method: 'POST',
    success: function(response) {
      callback(null, response.data);
    },
    fail: function(error) {
      callback(error);
    }
  });
}

module.exports = { 
  getBargainData,
  getBargainRecords,
  createBargain,
  helpBargain
};