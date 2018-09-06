const aldstat = require("./utils/ald/ald-stat");
const sessionUtil = require('./utils/wx-extend/session');
const richTextParse = require('./utils/richTextParse/richText.js');


App({
  onLaunch() {
    this.getSession();
    this.manageUpdate();
  },
  getSession() {
    var userInfo = sessionUtil.getUserInfo();
    console.info(userInfo)
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },
  manageUpdate() {
    if(wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '新版本已就绪',
          content: '点击确定重启更新',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        console.log('update failed');
      })
    }
  },
  richTextParse: richTextParse.go,
  globalData: {
    userInfo: null
  }
})