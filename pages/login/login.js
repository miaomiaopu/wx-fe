// pages/login/login.js
Page({
  wxLogin() {
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
            },
            fail: (err) => {
              console.log(err)
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
        wx.showToast({
          title: '一键登录失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
})