// pages/export/index.js
const app = getApp()
const VodUploader = require('../../miniprogram_npm/vod-wx-sdk-v2/vod-wx-sdk-v2');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: "",
    isSaveLocal: false,
    isUploading: false,
    progress: 0,
    isProgeress: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.setStorageSync('is_tips', true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  handleThumbReady: function(e) {
    const img_url = e.detail.path;
    const height = e.detail.height;
    const width = e.detail.width;

    const real_height_rpx = (height / width) * 500;

    this.setData({
      img_url,
      img_height: real_height_rpx
    });

    this._img_url = img_url;


  },
  getSign: function(callback) {

    wx.request({
      url: 'https://demo.vod2.myqcloud.com/GetUploadSign',
      method: 'POST',
      data: {
        Token: app.globalData.token
      },
      success: (res) => {
        const sign = res.data.Data.UploadSign;

        this._upload_sign = sign;

        callback(sign)
      }
    })

  },
  _img_url: null,
  _upload_sign: null,
  handleExportSuccess: function(e) {    
    let path = e.detail.tempFilePath;

    const that = this;

    const uploader = VodUploader.start({
      // 必填，把 wx.chooseVideo 回调的参数(file)传进来
      mediaFile: e.detail, 
      // 必填，获取签名的函数
      getSignature: that.getSign, 
      coverFile: {
        errMsg: 'xxx',
        tempFilePaths: [that._img_url],
        tempFiles: [{
          path: that._img_url,
          size: 3000
        }]
      },

      // 上传中回调，获取上传进度等信息
      progress: function(result) {

          const progress = result.percent;
          const progress_num = parseInt(progress * 100);

          that.setData({
            progress: progress_num
          })

          that.total_progress_cb(parseInt((progress_num/2) + 50));

      },
      // 上传完成回调，获取上传后的视频 URL 等信息
      finish: function(result) {

          that.setData({
            isUploading: false
          })

          const is_tips = wx.getStorageSync('is_tips');


          if(!is_tips) {
            wx.showModal({

              cancelText:'不再提示',
              title: '上传成功！',
              content: '视频审核中，审核通过后将在首页展示',
              success: (e) => {


                if(e.confirm) {
                  
                } else {

                  wx.setStorageSync('is_tips', true)
                }

                if( that.data.isSaveLocal ) {
            
                  wx.saveVideoToPhotosAlbum({
                    filePath: path,
                    success: function() {
                      wx.reLaunch({
                        url: '../index/index',
                      })
                    }
                  })
                } else {
    
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
                
              }
            })
          } else {
            if( that.data.isSaveLocal ) {
            
              wx.saveVideoToPhotosAlbum({
                filePath: path,
                success: function() {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
              })
            } else {

              wx.reLaunch({
                url: '../index/index',
              })
            }
          }

      },
      // 上传错误回调，处理异常
      error: function(result) {
          wx.showModal({
              title: '上传失败',
              content: JSON.stringify(result),
              showCancel: false
          });
      },
  });
  },
  tap_select: function() {

    if(this.data.isUploading) {
      return
    }

    this.setData({
      isSaveLocal: !this.data.isSaveLocal
    })
  },
  start_export: function() {
    
    this.setData({
      isUploading: true
    })

  },
  export_progress: function(e) {
    const progress = e.detail.progress;


    this.total_progress_cb(parseInt(progress / 2))

  },
  total_progress_cb(progress) {

    this.setData({
      progress: progress
    })
  }
})