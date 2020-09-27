//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const that = this;

    wx.login({
      success: (res) => {
        wx.request({
          url: 'https://demo.vod2.myqcloud.com/WXAMPLogin',
          method:"POST",
          data: {
            Code: res.code
          },
          success: (res) => {

            const token = res.data.Data.Token;
            const user_id = res.data.Data.UserId;
            that.globalData.token = token;
            that.globalData.user_id = user_id;

            // wx.startPullDownRefresh();
          }
        })
      },
    })

    this._init_global_data()

    const sys = wx.getSystemInfoSync();
    
  },
  _init_global_data: function() {
    const sysinfo = wx.getSystemInfoSync();

    const bottom_bar_height = sysinfo.screenHeight - sysinfo.safeArea.bottom;

    const data = {
      ...sysinfo,
      bottom_bar_height
    };

    this.globalData.sysinfo = data
  },
  globalData: {
    userInfo: null,
  },

})