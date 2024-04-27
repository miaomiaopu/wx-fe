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
    card_modified_date: "",
    is_like: true,
    comments: [
      {
        comment_id: 1,
        nickname: "x",
        comment_content: "xxx111",
        comment_date: "12",
        is_belong: true,
      },
    ],
    inputValue: "",
    is_study: 2,
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
    this.getComments(card_id_param);
    this.getIsStudy(card_id_param);
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
            card_modified_date: result.data.card_modified_date,
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
  getComments(card_id) {
    const third_session = wx.getStorageSync("third_session");
    wx.request({
      url: "http://localhost:8000/api/getComments",
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
            comments: result.data.comments,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  deleteComment(event) {
    const index = event.currentTarget.dataset.index;

    wx.showModal({
      title: "删除评论",
      content: "确定要删除该评论吗？",
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定，执行删除逻辑
          this.confirmDelete(index);
        }
      },
    });
  },
  confirmDelete(index) {
    const third_session = wx.getStorageSync("third_session");

    wx.request({
      url: "http://localhost:8000/api/deleteComment",
      data: {
        third_session: third_session,
        comment_id: this.data.comments[index].comment_id,
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
          let commentsNew = this.data.comments;
          commentsNew.splice(index, 1);
          this.setData({
            comments: commentsNew,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  comment() {
    // 弹出窗口，需要输入内容，确认后创建新的评论。并且发给主题所有者
    wx.showModal({
      title: "新评论",
      showCancel: true,
      editable: true,
      placeholderText: "请输入评论内容",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定，弹出输入框
          this.createNewComment(res.content);
        }
      },
    });
  },
  createNewComment(commentContent) {
    const third_session = wx.getStorageSync("third_session");

    // 发送请求创建新的评论
    wx.request({
      url: "http://localhost:8000/api/createComment",
      data: {
        third_session: third_session,
        card_id: this.data.card_id,
        comment_content: commentContent,
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
          // 创建成功，更新页面数据
          this.getComments(this.data.card_id);
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  getIsStudy(card_id) {
    const third_session = wx.getStorageSync("third_session");

    wx.request({
      url: "http://localhost:8000/api/getIsStudy",
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
            is_study: result.data.is_study,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  selectCard() {
    const third_session = wx.getStorageSync("third_session");
    const card_id = this.data.card_id

    wx.request({
      url: "http://localhost:8000/api/selectCard",
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
            is_study: 1,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  cancelSelectCard() {
    const third_session = wx.getStorageSync("third_session");
    const card_id = this.data.card_id

    wx.request({
      url: "http://localhost:8000/api/cancelSelectCard",
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
            is_study: 0,
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  }
});
