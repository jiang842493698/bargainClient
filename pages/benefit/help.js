const app = getApp();
const playerUtil = require('../../utils/api/player');
const bargainRecordApi = require('../../utils/api/bargainrecord');
const sessionUtil = require('../../utils/wx-extend/session');

Page({
  data:{
    master: null,
    bargainer: null,
    benefit: null,
    ruleRichText: null,
    bargainRecords: [],   // userinfo array
    bargainUsers: {},     // userid => userinfo key-value
    winnerList: [],
    winnerCount: 0,
    loadingComplete: false,

    bargainErrorMsg: '',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad(options){
    // options: benefitId, userId
    this.checkLoginStatus();
    this.loadData(options);
  },
  checkLoginStatus() {   // 检查登录状态
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (!this.data.canIUse){
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          sessionUtil.setUserInfo(e.detail.userInfo);
          playerUtil.updatePlayer(e.detail.userInfo, function(err, player) {
            if (err) {
              console.error('error: ', err);
            }
          });
        }
      })
    }
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo){
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      sessionUtil.setUserInfo(e.detail.userInfo);
      playerUtil.updatePlayer(e.detail.userInfo, function(err, player) {
        if (err) {
          console.error('error: ', err);
        }
      });
    }
  },
  loadData(options) {
    var self = this;
    const data = {
      type: 'help',
      benefit: options.benefit,
      master: options.master
    };
    bargainRecordApi.getBargainData(data, function(err, data) {
      if (err) {
        console.error('error: ', err);
      } else {
        self.setData({
          loadingComplete: true,
          master: data.master,
          bargainer: data.bargainer,
          benefit: data.benefit,
          ruleRichText: app.richTextParse(data.benefit.rule),
          bargainRecords: data.bargainRecords,
          bargainUsers: data.bargainUsers,
          winnerCount: data.winnerCount,
          winnerList: data.winnerList
        });
        if (data.master.id == data.bargainer.id) {   // 自己
          wx.redirectTo({
            url: `join?benefit=${ data.benefit._id }`
          });
        }
      }
    });
  },
  helpBargain() {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var data = {
      benefit: this.data.benefit._id,
      master: this.data.master.id,
      bargainer: this.data.bargainer.id
    };
    bargainRecordApi.helpBargain(data, function(err, result) {
      wx.hideLoading();
      if (err) {
        console.error('error: ', err);
      } else {
        if (result.error) {
          self.setData({
            bargainErrorMsg: result.message,
            benefit: result.data.benefit,
            winnerCount: result.data.winnerCount,
            bargainRecords: result.data.bargainRecords,
            bargainUsers: result.data.bargainUsers
          });
          self.toogleBargainErrorModal();
        } else {
          var bargainRecords = self.data.bargainRecords;
          var bargainUsers = self.data.bargainUsers;
          bargainRecords.push(result.data.bargainerRecord.userInfo);
          bargainUsers[result.data.bargainerRecord.id] = result.data.bargainerRecord.userInfo;
          self.setData({
            bargainRecords: bargainRecords,
            bargainUsers: bargainUsers
          });
          self.toogleBargainModal();
        }    
      }
    });
  },
  handleShowDetail() {
    wx.navigateTo({
      url: './detail?benefit=' + this.data.benefit._id
    });
  },
  toogleRule() {
    this.setData({
      showRule: !this.data.showRule
    });
  },
  toogleBargainModal() {
    this.setData({
      showBargainModal: !this.data.showBargainModal
    });
  },
  toogleBargainErrorModal() {
    this.setData({
      showBargainErrorModal: !this.data.showBargainErrorModal
    });
  },
  handleJoinBenefit() {
    wx.redirectTo({
      url: `./join?benefit=${this.data.benefit._id}`
    });
  },
  handleShowBenefits() {
    console.info('test');
    wx.switchTab({
      url: './list'
    });
  },
  handleShowMore() {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    const data = {
      type: 'help',
      benefit: this.data.benefit._id,
      master: this.data.master.id
    };
    bargainRecordApi.getBargainData(data, function(err, data) {
      wx.hideLoading();
      if (err) {
        console.error('error: ', err);
      } else {
        self.setData({
          master: data.master,
          bargainer: data.bargainer,
          benefit: data.benefit,
          bargainRecords: data.bargainRecords,
          bargainUsers: data.bargainUsers,
          winnerCount: data.winnerCount,
          winnerList: data.winnerList
        });
      }
    });
  },
  onShareAppMessage(options) {    // 分享设置
    return {
      title: this.data.benefit.normalShareTitle,
      path: `/pages/benefit/join?benefitId=${this.data.benefit._id}`,
      imageUrl: this.data.benefit.normalShareUrl
    }
  }
});