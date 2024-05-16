// pages/ccard/ccard.js
Page({
  data: {
    theme_id: 0,
    filelist: [],
    card_name: "",
    card_content: "",
  },
  onLoad(options) {
    const theme_id = parseInt(options.theme_id);
    this.setData({
      theme_id: theme_id,
    });
  },
  onAfterRead(event) {
    const file = event.detail.file;
    const imageString = `<i>${event.detail.index}<i>`;
    const fileListNew = [...this.data.filelist, file];
    const content = this.data.card_content + imageString;
    this.setData({
      filelist: fileListNew,
      card_content: content,
    });
  },
  overSize() {
    wx.showToast({
      title: "图片过大",
      icon: "error",
    });
  },
  onDelete(event) {
    const index = event.detail.index;
    let filelistNew = this.data.filelist;
    let contentNew = this.data.card_content;
    const deleteString = `<i>${index}<i>`;
    filelistNew.splice(index, 1); // 从文件列表中删除被删除的文件
    contentNew = contentNew.replace(deleteString, "");

    // 修改索引
    const regex = /<i>\d<i>/g;
    let i = 0;
    contentNew = contentNew.replace(regex, (match) => {
      return `<i>${i++}<i>`;
    });

    this.setData({
      filelist: [...filelistNew], // 更新文件列表，触发页面更新
      card_content: contentNew,
    });
  },
  createCard() {
    if (this.data.card_name.length == 0 || this.data.card_content.length == 0) {
      wx.showToast({
        title: "输入不能为空",
        icon: "none",
      });
      return;
    }

    const third_session = wx.getStorageSync("third_session");
    const { card_name, card_content, theme_id } = this.data;

    // 匹配图片和content

    if (this.data.filelist.length == 0) {
      // 无图创建
      wx.request({
        url: "http://localhost:8000/api/createCardWithoutPicture",
        method: "POST",
        data: {
          third_session: third_session,
          card_name: card_name,
          card_content: card_content,
          theme_id: theme_id,
        },
        timeout: 0,
        success: (result) => {
          console.log(result);
          if (result.statusCode == 404) {
            wx.reLaunch({
              url: "/pages/login/login",
            });
          } else if (result.statusCode == 201) {
            wx.navigateBack();
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    } else {
      const regex = /<i>\d<i>/g;
      const matches = card_content.match(regex);
      if (matches.length != this.data.filelist.length) {
        wx.showToast({
          title: "图片不匹配",
          icon: "error",
        });
      }

      // 有图创建
      // 创建基础属性
      let card_id = 0;
      let index = 0;
      wx.uploadFile({
        filePath: this.data.filelist[index].url,
        name: "image",
        url: "http://localhost:8000/api/createCardWithPicture",
        formData: {
          third_session: third_session,
          card_name: card_name,
          card_content: card_content,
          theme_id: theme_id,
          index: index,
        },
        timeout: 0,
        success: (result) => {
          console.log(result);
          if (result.statusCode == 404) {
            wx.reLaunch({
              url: "/pages/login/login",
            });
          } else if (result.statusCode == 201) {
            if (index == this.data.filelist.length - 1) {
              wx.navigateBack();
            } else {
              card_id = JSON.parse(result.data).card_id;

              // 继续
              for (index = 1; index < this.data.filelist.length; index++) {
                const file = this.data.filelist[index];

                wx.uploadFile({
                  filePath: file.url,
                  name: "image",
                  url: "http://localhost:8000/api/createCardWithPicture",
                  formData: {
                    card_id: card_id,
                    index: index,
                  },
                  timeout: 0,
                  success: (result) => {
                    console.log(result);
                    if (result.statusCode == 404) {
                      wx.reLaunch({
                        url: "/pages/login/login",
                      });
                    } else if (result.statusCode == 201) {
                      if (index == this.data.filelist.length) {
                        wx.navigateBack();
                      }
                    }
                  },
                  fail: (err) => {
                    console.log(err);
                  },
                });
              }
            }
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    }
  },
});
