// pages/theme/theme.js
Page({
  data: {
    nickname: "小小只",
    avatar:
      "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    info_dot: false,
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
  infoChange: function () {},
  commentInfo: function () {},
});
