const app = getApp();
const benefitApi = require('../../utils/api/benefit');
const playerUtil = require('../../utils/api/player');
const sessionUtil = require('../../utils/wx-extend/session');

Page({
  data:{
    list: [],
    loadingComplete: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad:function(){
    this.checkLoginStatus();
    this.loadData();
  },
  mine_activity:function(e){
    wx.navigateTo({
      url: '/pages/myactive/index',
    })
  },
  funMore :function(e){
    wx.navigateTo({
      url: '/pages/funMore/index',
    })
  },
  checkLoginStatus() {   // 检查登录状态
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (!this.data.canIUse) {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          sessionUtil.setUserInfo(e.detail.userInfo);
          playerUtil.updatePlayer(e.detail.userInfo, function (err, player) {
            if (err) {
              console.error('error: ', err);
            }
          });
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      
      sessionUtil.setUserInfo(e.detail.userInfo);
      playerUtil.updatePlayer(e.detail.userInfo, function (err, player) {
        if (err) {
          console.error('error: ', err);
        }
      });
    }
  },
  loadData() {
    var self = this;
    benefitApi.fetchList(function (err, list) {
      if (err) {
        console.error('error: ', err);
      } else {
        self.setData({
          loadingComplete: true,
          list: list
        });
      }
    });
  }
});