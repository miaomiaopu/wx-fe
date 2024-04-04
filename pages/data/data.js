// pages/data/data.js
Page({
  data: {
    dataList: [],
    threeMonthsAgo: new Date().getTime(),
    today: new Date().getTime(),
    check_ins: [],
  },
  onLoad: function (options) {
    this.getDataListWithThirdSession();
    this.getDate();
  },
  getDataListWithThirdSession: function () {
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/getData",
      data: {
        third_session: third_session,
      },
      method: "GET",
      timeout: 0,
      success: (result) => {
        console.log(result);
        if (result.statusCode == 404) {
          wx.reLaunch({
            url: "/pages/login/login",
          });
        } else if (result.statusCode == 200) {
          this.setData({
            dataList: result.data.dataList,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  getDate: function () {
    let date = new Date();
    this.setData({
      today: date.getTime(),
    });
    date.setMonth(date.getMonth() - 3);
    this.setData({
      threeMonthsAgo: date.getTime(),
    });

    // 获取签到的记录
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/getCheckin",
      data: {
        third_session: third_session,
      },
      method: "GET",
      timeout: 0,
      success: (result) => {
        console.log(result);
        if (result.statusCode == 404) {
          wx.reLaunch({
            url: "/pages/login/login",
          });
        } else if (result.statusCode == 200) {
          this.setData({
            check_ins: result.data.check_ins,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
});
