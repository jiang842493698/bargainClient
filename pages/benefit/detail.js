const benefitUtil = require('../../utils/api/benefit');

Page({
  data: {
    loadingComplete: false,
    benefit: null
  },
  onLoad:function(options){
    this.loadData(options);
  },
  loadData(options) {
    var self = this;
    const benefitId = options.benefit;
    benefitUtil.getBenefit(benefitId, function(err, data) {
      if (err) {
        console.error('error: ', err);
      } else {
        self.setData({
          loadingComplete: true,
          benefit: data
        });
      }
    });
  }
});