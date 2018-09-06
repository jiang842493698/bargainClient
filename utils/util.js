// 显示失败提示
var showError = (message) => {
    wx.showModal({
        title: '错误提示',
        content: JSON.stringify(message),
        showCancel: false
    })
}

const formatTime = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [ month, day].map(formatNumber).join('月') + '日 ' 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = { showError, formatTime };