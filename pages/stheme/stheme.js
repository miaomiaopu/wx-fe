// pages/stheme/stheme.js
Page({
  data: {
    search: "",
    is_search: false,
    res_themes: [
      {
        theme_id: 1,
        theme_name: "test2",
        theme_picture: "http://localhost:8000/images/default-image.jpg",
        tags: ["1", "2", "12312312"],
        total_subscription: 0,
      },
    ],
  },
  onSearch(e) {
    this.setData({
      search: e.detail,
      is_search: true,
    });

    // 搜索
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/searchTheme",
      data: {
        third_session: third_session,
        search: e.detail,
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
            res_themes: result.data.res_themes,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  onThemeClick(event) {
    const position = event.detail;
    const index = event.currentTarget.dataset.index;

    const theme = this.data.res_themes[index];
    if (position === "cell") {
      const themeParams = encodeURIComponent(JSON.stringify(theme));
      wx.navigateTo({
        url: `../dtheme/dtheme?theme=${themeParams}&belong=0&sub=0`,
      });
    } else if (position === "right") {
      const third_session = wx.getStorageSync("third_session");

      // 订阅
      wx.request({
        url: "http://localhost:8000/api/subTheme",
        data: {
          third_session: third_session,
          theme_id: this.data.res_themes[index].theme_id,
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
            this.data.res_themes.splice(index, 1);
            this.setData({
              res_themes: this.data.res_themes,
            });
          } else {
            wx.showToast({
              title: "订阅失败",
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
});
