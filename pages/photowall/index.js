const benefitUtil = require('../../utils/api/benefit');

Page({
  data: {
    page: 1,
    limit: 100,
    total: 0,
    list: [],
    loadsWitch:true,
    benefitId: null,
    showMore : "加载更多"
  },
  onLoad: function (options) {
    this.loadData(options);
  },
  loadData(options) {
    this.setData({
      benefitId: options.benefit
    });
    var data = {
      id: options.benefit,
      page: this.data.page,
      limit: this.data.limit
    };
    this.getWinners(data);
  },
  getWinners(data) {
    var self = this;
    benefitUtil.getWinners(data, function(err, data) {
      if (err) {
        console.error('error: ', err);
      } else {
        var page = self.data.page + 1;
        var total = data.total;
        var list = self.data.list.concat(data.list);
        self.setData({
          page: page,
          total: total,
          list: list,
          loadingComplete: true,
          showMore: "加载更多",
          loadsWitch: true,
        });
        wx.hideLoading();
      }
    });
  },
  handleShowMore() {
    this.setData({
      showMore : "加载中...",
      loadsWitch : false,
    })
    var data = {
      id: this.data.benefitId,
      page: this.data.page,
      limit: this.data.limit
    };
    this.getWinners(data);
  }
});