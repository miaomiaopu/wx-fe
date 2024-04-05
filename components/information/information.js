// components/information/information.js
Component({
  properties: {
    info_dot: Boolean,
  },
  data: {
    informations: [],
    showPopup: false,
    popupMessage: "test",
  },
  lifetimes: {
    attached() {
      this._getInformations();
    },
  },
  methods: {
    _getInformations: function () {
      const third_session = wx.getStorageSync("third_session");
      wx.request({
        url: "http://localhost:8000/api/getInformations",
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
              informations: result.data.informations,
            });
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    _handleAllInfomations: function () {
      const third_session = wx.getStorageSync("third_session");

      wx.request({
        url: "http://localhost:8000/api/handleAllInformations",
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
          } else if (result.statusCode == 200) {
            // 请求成功，则更新informations数组中所有消息的is_handle属性为true
            let updatedInformations = this.data.informations;
            updatedInformations.forEach((info) => {
              info.is_handle = true;
            });

            // 更新infoletrmations数组
            this.setData({
              informations: updatedInformations,
            });
            this.triggerEvent("updateInfoDot");
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    _handleInformation: function (event) {
      const { infoid, message, ishandle } = event.currentTarget.dataset;
      if (ishandle) {
        this.setData({
          popupMessage: message,
          showPopup: true,
        });
      } else {
        const third_session = wx.getStorageSync("third_session");

        wx.request({
          url: "http://localhost:8000/api/handleInformation",
          data: {
            third_session: third_session,
            info_id: infoid,
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
              // 请求成功，则更新informations数组中对应消息的is_handle属性为true
              const updatedInformations = this.data.informations.map((item) => {
                if (item.info_id === infoid) {
                  item.is_handle = true;
                }
                return item;
              });
              // 更新informations数组
              this.setData({
                informations: updatedInformations,
                popupMessage: message,
                showPopup: true,
              });
              this.triggerEvent("updateInfoDot");
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      }
    },
    showPopup: function () {
      this.setData({ showPopup: true });
    },
    closePopup: function () {
      this.setData({ showPopup: false });
    },
  },
});
