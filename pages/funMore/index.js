// pages/funMore/index.js
const wxappUtil = require('../../utils/api/wxapp.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameArray : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isSelect()
  },
  isSelect(){
    let _this = this
    wxappUtil.getWxApp(function callBack(err,data){
        if(err){
          console.log(err)
        }else{
          _this.setData({
            gameArray: data,
            loadingComplete : true
          })
        }

    })
  },
  

  
})