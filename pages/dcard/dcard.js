// pages/dcard/dcard.js
Page({
  data: {
    card_id: 0,
    card_title: "",
    str1: "",
    str2: "",
    str3: "",
    str4: "",
    image1: "",
    image2: "",
    image3: "",
    is_like: true,
  },
  onLoad(options) {
    const card_id_param = parseInt(options.card_id);
    const card_title = options.card_title;
    this.setData({
      card_id: card_id_param,
      card_title: card_title,
    });
    this.getLike(card_id_param);
    this.getCard(card_id_param);
  },
  getLike(card_id) {
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/isLike",
      data: {
        third_session: third_session,
        card_id: card_id,
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
            is_like: result.data.is_like,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  getCard(card_id) {
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/getCard",
      data: {
        third_session: third_session,
        card_id: card_id,
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
            str1: result.data.str1,
            str2: result.data.str2,
            str3: result.data.str3,
            str4: result.data.str4,
            image1: result.data.image1,
            image2: result.data.image2,
            image3: result.data.image3,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  like() {
    const third_session = wx.getStorageSync("third_session");
    const card_id = this.data.card_id;

    wx.request({
      url: "http://localhost:8000/api/likeCard",
      data: {
        third_session: third_session,
        card_id: card_id,
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
            is_like: true,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  unlike() {
    const third_session = wx.getStorageSync("third_session");
    const card_id = this.data.card_id;

    wx.request({
      url: "http://localhost:8000/api/unlikeCard",
      data: {
        third_session: third_session,
        card_id: card_id,
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
            is_like: false,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
});
