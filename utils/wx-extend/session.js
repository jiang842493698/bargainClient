var constants = require('./constants');
var SESSION_TOKEN = constants.WX_SESSION_TOKEN;
var SESSION_USERINFO = constants.WX_SESSION_USERINFO;

var Session = {
  getToken: function () {
    return wx.getStorageSync(SESSION_TOKEN) || null;
  },

  setToken: function (session) {
    wx.setStorageSync(SESSION_TOKEN, session);
  },

  clearToken: function () {
    wx.removeStorageSync(SESSION_TOKEN);
  },

  getUserInfo: function() {
    if (wx.getStorageSync(SESSION_USERINFO)) {
      return JSON.parse(wx.getStorageSync(SESSION_USERINFO));
    } else {
      return null;
    }
  },

  setUserInfo: function(session) {
    wx.setStorageSync(SESSION_USERINFO, JSON.stringify(session));
  },

  clearUserInfo: function() {
    wx.removeStorageSync(SESSION_USERINFO);
  }
};

module.exports = Session;