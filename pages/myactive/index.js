// pages/myactive/index.js
let playerUtil = require('../../utils/api/player')
let utils = require('../../utils/util.js')

Page({
  data: {
    list : [],
    page : 1,
    limit : 10,
    total : 0,
    loadSwitch : true,
    showMore: "点击加载历史活动"
  },
  onLoad: function (options) {
    this.loadData();
  },
  loadData(options) {
    var data = {
      page: this.data.page,
      limit: this.data.limit
    };
    this.getMyBenefits(data);
  },
  getMyBenefits(data) {
    var self = this;
    playerUtil.getMyBenefits(data, function (err, data) {
      if (err) {
        console.error('error: ', err);
      } else {
        
        var page = self.data.page + 1;
        var total = data.total;
        
        for (let l of data.list){
          l.joinAt = utils.formatTime(new Date(l.joinAt))
        }
        var list = self.data.list.concat(data.list);
        self.setData({
          page: page,
          total: total,
          list: list,
          loadingComplete: true,
          loadSwitch: true,
          showMore: "点击加载历史活动"
        });
        wx.hideLoading();
      }
    });
  },
  showMore: function () {
    this.setData({
      loadSwitch: false,
      showMore: "加载中..."
    })
    var data = {
      page: this.data.page,
      limit: this.data.limit
    };
    this.getMyBenefits(data)
  },
  handleNavigateToBenefit(e) {
    let benefitId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../benefit/join?benefit=' + benefitId
    });
  }
});