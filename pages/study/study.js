// pages/study/study.js
Page({
  data: {
    timer: null,
    elapsedTime: 0,
    needStudyCards: [],
    studyTimes: [{ card_id: 1, phase: 2, s_phase: 0 }],
    index: 0,
    card_id: 0,
    card_title: "",
    str1: "",
    str2: "",
    str3: "",
    str4: "",
    image1: "",
    image2: "",
    image3: "",
    showInfo: false,
  },
  onLoad(options) {
    // 处理参数
    const studyTimesString = decodeURIComponent(options.studyTimes);
    const studyTimes = JSON.parse(studyTimesString);

    // 将 s_phase != 3 的数据存入到 needStudyCards 中
    const needStudyCards = studyTimes
      .map((item, index) => {
        return { index: index, ...item };
      })
      .filter((item) => item.s_phase < 2);

    this.setData({
      studyTimes: studyTimes,
      needStudyCards: needStudyCards,
      card_id: needStudyCards[0].card_id,
    });
    this.getCard();
  },
  onShow() {
    this.startTimer();
  },
  onHide() {
    this.pauseTimer();
  },
  onUnload() {
    // 清除计时器并结束计时
    this.stopTimer();
    if (this.data.needStudyCards.length == 0) {
      wx.setStorageSync("studyTimes", []);
    } else {
      wx.setStorageSync("studyTimes", this.data.studyTimes);
    }
  },
  getCard() {
    const third_session = wx.getStorageSync("third_session");
    const card_id = this.data.card_id;
    wx.request({
      url: "http://localhost:8000/api/getStudyCard",
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
            card_title: result.data.card_title,
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
  // 开始计时
  startTimer() {
    this.setData({
      timer: setInterval(() => {
        this.setData({
          elapsedTime: this.data.elapsedTime + 1,
        });
      }, 60000),
    }); // 按分钟计算
  },
  // 暂停计时
  pauseTimer() {
    clearInterval(this.data.timer);
  },
  // 结束计时
  stopTimer() {
    clearInterval(this.data.timer);
    this.setData({
      timer: null,
    });
    const elapsedTime = this.data.elapsedTime

    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/studyTime",
      data: {
        third_session: third_session,
        duration: elapsedTime,
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
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  remember() {
    let needStudyCardsNew = this.data.needStudyCards;
    let studyTimesNew = this.data.studyTimes;
    let index = this.data.index;
    let card_id = this.data.card_id;
    if (needStudyCardsNew[index].s_phase == 0) {
      studyTimesNew[needStudyCardsNew[index].index].s_phase = 1;
      needStudyCardsNew[index].s_phase = 1;
      index = index + 1 >= needStudyCardsNew.length ? 0 : index + 1;
      card_id = needStudyCardsNew[index].card_id;
    } else if (needStudyCardsNew[index].s_phase == 1) {
      // 删除needStudyCardsNew对应位置的数据, 并且让index指向下一个数据的位置(index为末尾时，则删除数据后+1)
      studyTimesNew[needStudyCardsNew[index].index].s_phase = 2;
      needStudyCardsNew.splice(index, 1);
      if (index == needStudyCardsNew.length) {
        index = 0;
      }
      // 提交学会卡片，提升卡片学习等级
      const third_session = wx.getStorageSync("third_session");
      wx.request({
        url: "http://localhost:8000/api/completeStudyCard",
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
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
      // 如果删除后为空, 则结束学习
      if (needStudyCardsNew.length == 0) {
        // 弹窗显示学习完成，一秒后返回前一页面
        wx.showToast({
          title: "学习完成",
          icon: "success",
          duration: 1500,
          complete: function () {
            setTimeout(() => {
              wx.navigateBack();
            }, 1000);
          },
        });
      } else {
        card_id = needStudyCardsNew[index].card_id;
      }
    }
    this.setData({
      needStudyCards: needStudyCardsNew,
      studyTimes: studyTimesNew,
      index: index,
      card_id: card_id,
    });
    this.getCard();
  },
  uncertain() {
    // 记不清楚就简单的展示
    this.setData({
      showInfo: true,
    });
  },
  forget() {
    // 错误了也简单的展示，然后将 s_phase 回退到 0
    const index = this.data.index;
    let needStudyCardsNew = this.data.needStudyCards;
    needStudyCardsNew[index].s_phase = 0;
    let studyTimesNew = this.data.studyTimes;
    studyTimesNew[needStudyCardsNew[index].index].s_phase = 0;
    this.setData({
      needStudyCards: needStudyCardsNew,
      studyTimes: studyTimesNew,
      showInfo: true,
    });
  },
  nextCard() {
    // index 增加，如果超出 needStudyCards，则 为 0
    let index = this.data.index;
    index = index + 1 >= this.data.needStudyCards.length ? 0 : index + 1;
    this.setData({
      index: index,
      showInfo: false,
      card_id: this.data.needStudyCards[index].card_id,
    });
    this.getCard();
  },
});
