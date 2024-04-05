// components/userform/userform.js
Component({
  properties: {
    nickname: String,
  },
  data: {
    inputvalue: null,
  },
  methods: {
    _handleInput: function (e) {
      this.data.inputvalue = e.detail.value;
    },
    _submit: function () {
      const third_session = wx.getStorageSync("third_session");
      let nickname_new = this.data.inputvalue;
      if (nickname_new) {
        wx.request({
          url: "http://localhost:8000/api/updateNickname",
          data: {
            third_session: third_session,
            nickname: nickname_new,
          },
          method: "POST",
          timeout: 0,
          success: (result) => {
            console.log(result);
            if (result.statusCode == 404) {
              wx.reLaunch({
                url: "/pages/login/login",
              });
            } else if (result.statusCode == 429) {
              wx.showToast({
                title: "请勿频繁修改昵称",
                icon: "none",
              });
            } else if (result.statusCode == 200) {
              this.triggerEvent("changeNickname", { nickname_new });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      } else {
        wx.showToast({
          title: "请输入昵称",
          icon: "none",
        });
      }
    },
  },
});
