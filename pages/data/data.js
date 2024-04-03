// pages/data/data.js
Page({
  data: {
    dataList: []
  },
  onLoad: function (options) {
    this.getDataListWithThirdSession();
  },
  getDataListWithThirdSession: function () {
    const third_session = wx.getStorageSync('third_session')

    wx.request({
      url: 'http://localhost:8000/api/getData',
      data: {
        third_session: third_session
      },
      method: "GET",
      timeout: 0,
      success: (result) => {
        console.log(result)
        if (result.statusCode == 404) {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        } else {
          this.setData({
            dataList: result.data.dataList
          })
        }
      },
      fail: (err) => {
        console.log(err)
      },
    })
  }
})