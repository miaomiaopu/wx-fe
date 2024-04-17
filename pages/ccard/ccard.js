// pages/ccard/ccard.js
Page({
  data: {
    filelist: [],
    card_name: "",
    card_content: "",
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
    let i = 0
    contentNew = contentNew.replace(regex, (match) => {
      return `<i>${i++}<i>`;
    })

    this.setData({
      filelist: [...filelistNew], // 更新文件列表，触发页面更新
      card_content: contentNew,
    });
  },
  createCard() {},
});
