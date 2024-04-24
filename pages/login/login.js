// pages/login/login.js
Page({
  wxLogin() {
    // 判断登录态 session_key 是否过期
    wx.checkSession({
      success: () => {
        const third_session = wx.getStorageSync('third_session')
        if (third_session) {
          // third_session 存在，通过 third_session 登录；否则 通过 wx.login 登录
          this.loginWithThirdSession(third_session);
        } else {
          this.wxLoginWithCode();
        }
      },
      fail: () => {
        this.wxLoginWithCode();
      }
    })
  },
  wxLoginWithCode() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'http://localhost:8000/api/login',
            data: {
              code: res.code
            },
            method: 'POST',
            timeout: 0,
            success: (result) => {
              console.log(result)
              if (result.statusCode == 200 || result.statusCode == 201) {
                wx.setStorageSync('third_session', result.data.third_session)
                wx.switchTab({
                  url: 'pages/theme/theme',
                })
              }
            },
            fail: (err) => {
              console.log(err)
              wx.showToast({
                title: '一键登录失败，请重试',
                icon: 'none',
                duration: 2000
              });
            },
          })
        } else {
          wx.showToast({
            title: '一键登录失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '一键登录失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  loginWithThirdSession(third_session) {
    wx.request({
      url: 'http://localhost:8000/api/login',
      data: {
        third_session: third_session
      },
      method: 'POST',
      timeout: 0,
      success: (result) => {
        console.log(result)
        if (result.statusCode == 404) {
          this.wxLoginWithCode();
        } else if (result.statusCode == 200) {
          wx.switchTab({
            url: '/pages/theme/theme',
          })
        }
      },
      fail: (err) => {
        console.log(err)
      },
    })
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
})