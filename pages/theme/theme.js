// pages/theme/theme.js
Page({
  data: {
    nickname: "小小只",
    avatar:
      "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    info_dot: false,
    currentTab: 1,
  },
  onLoad(options) {
    this.getInfo();
  },
  getInfo: function () {
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/getInfo",
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
            nickname: result.data.nickname,
            info_dot: result.data.info_dot,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  infoChange: function () {
    this.setData({
      currentTab: 2,
    });
  },
  changeIndex: function () {
    this.setData({
      currentTab: 1,
    });
  },
  changeInformation: function () {
    this.setData({
      currentTab: 3,
    });
  },
  changeNickname: function (e) {
    this.setData({
      nickname: e.detail.nickname_new,
    });
  },
  updateInfoDot: function () {
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/getInfoDot",
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
            info_dot: result.data.info_dot,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      success: function (res) {
        console.log(res);
      },
      fail: function (err) {
        console.log(err);
      },
    });
  },
});
