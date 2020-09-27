//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    image_url_arr: [],
    image_width: 0,
    image_height: 0,
    scroll_height: 0,
    videoList: [],
    loading: false,
  },

  onReady: function () {


    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      url: 'https://demo.vod2.myqcloud.com/WXAMPGetVideoList',
      method: "POST",
 
     
      success: (res) => {
        let videoList = res.data.Data.VideoList;

        videoList.forEach((item) => {
          
          item.realHeight = (item.Height / item.Width) * 360;

        })

        wx.hideLoading({
          complete: (res) => {},
        })
        this.setData({
          videoList,

        })
      }
    })

    this.init_size()
  },
  init: function() {
    this._sysinifo = wx.getSystemInfoSync();
  },

  init_size: function() {
    const sysinfo = app.globalData.sysinfo;

    const width = sysinfo.screenWidth;
    const hight = sysinfo.screenHeight;

    const image_width = (width - 30 - 1) / 2;
    const image_height = image_width * 4 / 3;

    const scroll_height = sysinfo.windowHeight - sysinfo.bottom_bar_height - 50;

    this.setData({
      image_width,
      image_height,
      scroll_height
    });
  },
  onPullDownRefresh: function() {

    this._currentPage = 0;

    wx.request({
      url: 'https://demo.vod2.myqcloud.com/WXAMPGetVideoList',
      method: "POST",

      success: (res) => {


        let videoList = res.data.Data.VideoList;

        videoList.forEach((item) => {
          
          item.realHeight = (item.Height / item.Width) * 360;

        })


        wx.stopPullDownRefresh()

        this.setData({
          videoList
        })
      }
    })
  },
  onReachBottom: function() {

  },
  tap_select_video: function(e) {

    const data = e.currentTarget.dataset.navData;

    wx.navigateTo({
      url: '../feeds/feeds',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage',  data)
      }
    })
  },
  tap_music_btn: function() {
    wx.navigateTo({
      url: '../weijian/index',
    })
  },
  onReachBottom() {


    this.setData({
      loading: true
    })

    wx.request({
      url: 'https://demo.vod2.myqcloud.com/WXAMPGetVideoList',
      method: "POST",
      data: {

        Offset: (++this._currentPage) * 10
      },
      success: (res) => {

        let videoList = res.data.Data.VideoList;

        if(videoList.length === 0) {
            wx.showToast({
              title: '没有数据啦',
              duration: 500
            })
        }

        videoList.forEach((item) => {
          
          item.realHeight = (item.Height / item.Width) * 360;

        })


        const newList = this.data.videoList.concat(videoList);

        this.setData({
          videoList: newList,
          loading: false
        })
      }
    })
  },
  _currentPage: 0
})
