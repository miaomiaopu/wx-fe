// components/index/index.js
Component({
  properties: {},
  data: {
    my_themes: [
      {
        theme_id: 1,
        theme_name: "test432424222222222222222222222222222222222222",
        theme_picture: "http://localhost:8000/images/default-image.jpg",
        tags: ["1", "2"],
        total_subscription: 0,
      },
    ],
    sub_themes: [
      {
        theme_id: 1,
        theme_name: "test2",
        theme_picture: "http://localhost:8000/images/default-image.jpg",
        tags: ["1", "2", "12312312"],
        total_subscription: 0,
      },
    ],
  },
  lifetimes: {
    attached() {
      this.checkin();
      this.getTheme();
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
              icon: "none",
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
        url: "../../pages/ctheme/ctheme",
      });
    },
    onMyThemeClick: function (event) {
      const position = event.detail;
      const index = event.currentTarget.dataset.index;
      const third_session = wx.getStorageSync("third_session");

      if (position === "left") {
        console.log("update");
      } else if (position === "cell") {
        console.log("detail");
      } else if (position === "right") {
        wx.request({
          url: "http://localhost:8000/api/deleteMyTheme",
          data: {
            third_session: third_session,
            theme_id: this.data.my_themes[index].theme_id,
          },
          method: "POST",
          timeout: 0,
          success: (result) => {
            console.log(result);
            if (result.statusCode == 404) {
              wx.reLaunch({
                url: "/pages/login/login",
              });
            } else if (result.statusCode == 200) {
              this.data.my_themes.splice(index, 1);
              this.setData({
                my_themes: this.data.my_themes,
              });
            } else {
              wx.showToast({
                title: "删除失败",
                icon: "error",
              });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      }
    },
    onSubThemeClick: function (event) {
      const position = event.detail;
      const index = event.currentTarget.dataset.index;
      if (position === "cell") {
        console.log("detail");
      } else if (position === "right") {
        const third_session = wx.getStorageSync("third_session");

        // 取消订阅
        wx.request({
          url: "http://localhost:8000/api/cancelSubTheme",
          data: {
            third_session: third_session,
            theme_id: this.data.sub_themes[index].theme_id,
          },
          method: "POST",
          timeout: 0,
          success: (result) => {
            console.log(result);
            if (result.statusCode == 404) {
              wx.reLaunch({
                url: "/pages/login/login",
              });
            } else if (result.statusCode == 200) {
              this.data.sub_themes.splice(index, 1);
              this.setData({
                sub_themes: this.data.sub_themes,
              });
            } else {
              wx.showToast({
                title: "取消失败",
                icon: "error",
              });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      }
    },
    getTheme: function () {
      const third_session = wx.getStorageSync("third_session");
      wx.request({
        url: "http://localhost:8000/api/getMyThemeAndSubTheme",
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
              my_themes: result.data.my_themes,
              sub_themes: result.data.sub_themes,
            });
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
});
