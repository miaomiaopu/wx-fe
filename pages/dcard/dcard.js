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
  },
  onLoad(options) {
    const card_id_param = parseInt(options.card_id);
    const card_title = options.card_title
    this.setData({
      card_id: card_id_param,
      card_title: card_title
    })
    this.getCard(card_id_param);
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
});
