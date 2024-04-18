// pages/dtheme/dtheme.js
Page({
  data: {
    theme_id: 0,
    theme_name: "theme_name",
    nickname: "nickname",
    image: "",
    tags: [],
    total_sub: 1,
    is_belong: false,
    is_sub: false,
    cards: [
      { card_id: 1, card_title: "1123123" },
      { card_id: 2, card_title: "112ssssssssssssss3123" },
    ],
  },
  onLoad(options) {
    // 处理参数
    const themeString = decodeURIComponent(options.theme);
    const theme = JSON.parse(themeString);

    const belongString = parseInt(options.belong);
    const subString = parseInt(options.sub);

    this.setData({
      theme_id: theme.theme_id,
      theme_name: theme.theme_name,
      image: theme.theme_picture,
      tags: theme.tags,
      total_sub: theme.total_subscription,
      is_belong: belongString == 1,
      is_sub: subString == 1,
    });
  },
  onShow() {
    this.getAuthorAndCards();
  },
  getAuthorAndCards: function () {
    const third_session = wx.getStorageSync("third_session");
    const theme_id = this.data.theme_id;

    wx.request({
      url: "http://localhost:8000/api/getAuthorAndCards",
      data: {
        third_session: third_session,
        theme_id: theme_id,
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
            cards: result.data.cards,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  unsub: function () {},
  sub: function () {},
  createCard: function () {
    wx.navigateTo({
      url: `../ccard/ccard?theme_id=${this.data.theme_id}`,
    });
  },
  onMyThemeClick: function (event) {
    const position = event.detail;
    const index = event.currentTarget.dataset.index;
    const third_session = wx.getStorageSync("third_session");

    const card = this.data.cards[index];

    if (position === "left") {
      // 修改
      console.log("left");
    } else if (position === "cell") {
      console.log("cell");
    } else if (position === "right") {
      // 删除
      console.log("right");
    }
  },
  onSubThemeClick: function (event) {
    const position = event.detail;
    const index = event.currentTarget.dataset.index;

    const card = this.data.cards[index];
    if (position === "cell") {
      console.log("cell");
    }
  },
});
