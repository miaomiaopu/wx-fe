// components/index/index.js
Component({
  properties: {},
  data: {},
  lifetimes: {
    attached() {
      this.checkin();
    },
  },
  methods: {
    checkin: function () {
      const third_session = wx.getStorageSync("third_session");

      wx.request({
        url: "http://localhost:8000/api/checkin",
        data: {
          third_session: third_session,
        },
        method: "POST",
        timeout: 0,
        success: (result) => {
          console.log(result);
          if (result.statusCode == 404) {
            wx.reLaunch({
              url: "/pages/login/login",
            });
          } else if (result.statusCode == 201) {
            wx.showToast({
              title: "^^ 今日签到~",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    toCreateTheme: function () {
      wx.navigateTo({
        url: '../../pages/ctheme/ctheme',
      })
    }
  },
});
