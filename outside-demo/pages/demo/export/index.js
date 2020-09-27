Page({
  data: {
    tracks: []
  },
  handleThumbReady() {},
  handleReady() {
    console.warn('ready.....')

    this.setData({
      tracks: this._tracks,
    })
  },
  handleExportFail() {},
  handleExportSuccess(e) {
    let res = e.detail;

    wx.saveVideoToPhotosAlbum({
      filePath: res.tempFilePath,
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: "导出成功！"
        });
        // this.setData({
        //   showNext: true
        // });
        setTimeout(() => {
          wx.navigateBack({
            delta: 4
          })
        }, 1000)
        
      }
    });
  },
  handleProgress() {},

  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", data => {
      const tracks = data.tracks;
      this._tracks = tracks;

      console.warn('导出中接收到的数据', tracks)
    });
  }
})