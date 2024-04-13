// pages/ctheme/ctheme.js
Page({
  data: {
    themeInput: "",
    filelist: [],
    tags: [],
    tagInput: "",
  },
  onAfterRead(event) {
    const file = event.detail.file;
    const fileListNew = [file];
    this.setData({
      filelist: fileListNew,
    });
  },
  overSize() {
    wx.showToast({
      title: "图片过大",
      icon: "error",
    });
  },
  onDelete(event) {
    this.setData({
      filelist: [],
    });
  },
  createTheme() {
    // 新建主题的逻辑
    // 判断 themeInput 不为空
    if (this.data.themeInput.length == 0) {
      wx.showToast({
        title: "主题名不能为空",
        icon: "none",
      });
      return;
    }
    // session,themeInput,file,tags传给后端
    const third_session = wx.getStorageSync("third_session");
    const themeName = this.data.themeInput;
    let tags = null;
    if (this.data.tags.length != 0) {
      tags = this.data.tags;
    }
    let fileUrl = null;
    if (this.data.filelist.length != 0) {
      fileUrl = this.data.filelist[0].url;
    }
    // 上传图片
    if (fileUrl) {
      wx.uploadFile({
        filePath: fileUrl,
        name: "theme_picture",
        url: "http://localhost:8000/api/createThemeWithPicture",
        formData: {
          third_session: third_session,
          themeName: themeName,
          // 处理 formData 造成的 [object null] 或者 [object Array]
          tags: JSON.stringify(tags),
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
      // 不包含文件，直接发送请求创建主题
      wx.request({
        url: "http://localhost:8000/api/createThemeWithoutPicture",
        method: "POST",
        data: {
          third_session: third_session,
          themeName: themeName,
          tags: tags,
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
    }
  },
  createTag() {
    if (this.data.tags.length >= 3) {
      wx.showToast({
        title: "标签数量不能大于3",
        icon: "none",
      });
    } else {
      const tagName = this.data.tagInput.trim();
      if (tagName.length == 0) {
        wx.showToast({
          title: "输入不能为空",
          icon: "none",
        });
      } else {
        if (this.data.tags.includes(tagName)) {
          wx.showToast({
            title: "标签不能重复",
            icon: "none",
          });
        } else {
          this.setData({
            tags: [...this.data.tags, tagName],
            tagInput: "",
          });
        }
      }
    }
  },
  onTagClose(event) {
    const index = event.currentTarget.dataset.index;
    const tagsNew = this.data.tags;
    tagsNew.splice(index, 1);
    this.setData({
      tags: tagsNew,
    });
  },
});
