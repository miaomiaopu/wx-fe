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
    const is_share = parseInt(options.is_share);

    wx.onCopyUrl(() => {
      return { query: `theme=${options.theme}&belong=0&sub=0&is_share=1` };
    });
    let belongString = 0;
    let subString = 0;

    if (is_share == 1) {
      let res = this.getBelongAndSub(theme.theme_id);
      if (res) {
        belongString = res.belongString;
        subString = res.subString;
      }
    } else {
      belongString = parseInt(options.belong);
      subString = parseInt(options.sub);
    }

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
  onUnload() {
    wx.offCopyUrl();
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
  unsub: function () {
    const third_session = wx.getStorageSync("third_session");

    // 取消订阅
    wx.request({
      url: "http://localhost:8000/api/cancelSubTheme",
      data: {
        third_session: third_session,
        theme_id: this.data.theme_id,
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
          this.setData({
            total_sub: this.data.total_sub - 1,
            is_sub: false,
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
  },
  sub: function () {
    const third_session = wx.getStorageSync("third_session");

    // 订阅
    wx.request({
      url: "http://localhost:8000/api/subTheme",
      data: {
        third_session: third_session,
        theme_id: this.data.theme_id,
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
          this.setData({
            total_sub: this.data.total_sub + 1,
            is_sub: true,
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
  },
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
      wx.navigateTo({
        url: `../dcard/dcard?card_id=${card.card_id}&card_title=${card.card_title}`,
      });
    } else if (position === "right") {
      // 删除
      wx.request({
        url: "http://localhost:8000/api/deleteCard",
        data: {
          third_session: third_session,
          card_id: card.card_id,
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
            this.data.cards.splice(index, 1);
            this.setData({
              cards: this.data.cards,
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

    const card = this.data.cards[index];
    if (position === "cell") {
      wx.navigateTo({
        url: `../dcard/dcard?card_id=${card.card_id}&card_title=${card.card_title}`,
      });
    }
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
  getBelongAndSub: function (theme_id) {
    const third_session = wx.getStorageSync("third_session");

    wx.request({
      url: "http://localhost:8000/api/getBelongAndSub",
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
          const res = {
            belongString: result.data.belongString,
            subString: result.data.substring,
          };
          return res;
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
});
