Page({
  data: {
    currentTime: 0,
    selectedTime: 0,
    currentVideoTrack: {},
    playerStyleConfig: null,
    clipperSettings: {
      clipMaxDuration: 20
    }
  },
  onLoad() {
  },
  onReady() {


    // 初始化裁切器需要的数据
    this.setData({
      currentVideoTrack: global.index.videoTrack,
      selectedTime: this._formatSelectedTime(Math.min(this.data.clipperSettings.clipMaxDuration, global.index.videoTrack.duration))
    })
    this._innerTrackInfo = global.index.videoTrack

    // 获取播放器实例
    let player = this.selectComponent("#player");
    this.player = player;

    // 获取裁切器实例
    let clipper = this.selectComponent("#clipper");
    this.clipper = clipper

    // 调整播放器样式
    this.setPlayerStyle()
  },
  onHide() {
    // console.error('hhhhhhh')
    this.player.pause();
    
  },
  onPlayerReady() {

    const videoTrack = global.index.videoTrack;


    // onPlayerReady为播放器就绪的回调，初次渲染必须在此回调里更新，因为播放器内部有一些准备工作

    this.player.updateData([videoTrack], () => {
      // 任何时候都建议在updateData的回调里进行play 或者 pause操作
      this.player.play();

      this._nextTracks = this.player.getTracks();
      // console.error('预览页播放数据, ', this.player.getTracks())
    });
  },

  onTimeUpdate(e) {
    this.setData({
      currentTime: e.detail
    });
  },

  setPlayerStyle() {
    let systemInfo = wx.getSystemInfoSync()
    const { screenWidth, screenHeight, statusBarHeight } = systemInfo
    let panelHeight = 360, screenRatio = screenWidth / 750
    let playerHeight = screenHeight - panelHeight * screenRatio - statusBarHeight
    let playerWidth = screenWidth
    let playerStyleConfig = {
      width: playerWidth / screenRatio,
      height: playerHeight / screenRatio,
      top: statusBarHeight
    }
    this.setData({
      playerStyleConfig
    })
  },
  onThumbTouchStart() {
    this._pause(false)
  },
  onThumbScroll(e) {
    let { time } = e.detail;
    this.seekPreviewerThrottle(time)
  },
  onTimeRollerTouchStart() {
    this._pause(false)
  },
  onTimeRollerTouchEnd() {
    // 增加延时避免快速滑动时间轴横跳问题
    setTimeout(_ => {
      this._play()
    }, 200)
  },
  onTimeRollerMove(e) {
    let { time } = e.detail;

    // 移动游标的时候对播放器进行seek， 这里建议使用节流函数，因为在小程序video的seek性能不佳
    this.seekPreviewerThrottle(time)
  },
  onHandlerTouchStart() {
    this._pause(false)
  },
  onHandlerMove(e) {
    let { startTime, endTime } = e.detail
    this.setData({
      selectedTime: this._formatSelectedTime(endTime - startTime)
    })
  },
  onMediaClipped(e) {
    // 视频裁切完成之后的回调

    clearTimeout(this.data._timeRollerMoveTimer) // 清除掉未完成的throttle，避免横跳
    let { innerTrackInfo, time } = e.detail;
    this._innerTrackInfo = innerTrackInfo
    this.seekPreviewerAt(time)
    this._play()
  },
  // loop播放，注意start时间应为裁切后的start
  onMediaEnded() {
    this.seekPreviewerAt(this._innerTrackInfo.innerStartTime)
  },
  _pause(showPauseIcon = true) {
    this.player.pause()
  },
  _play() {
    this.player.play()
  },

  // 节流函数
  seekPreviewerThrottle(time) {
    if (!this.data._timeRollerMovePrevious) {
      this.data._timeRollerMovePrevious = Date.now();
    }
    var currentTime = Date.now();
    var remaining = 100 - (currentTime - this.data._timeRollerMovePrevious);
    if (remaining <= 0) {
      this.seekPreviewerAt(time)
      this.data._timeRollerMovePrevious = Date.now();
    } else {
      this.data._timeRollerMoveTimer && clearTimeout(this.data._timeRollerMoveTimer);
      this.data._timeRollerMoveTimer = setTimeout(_ => {
        this.seekPreviewerAt(time)
      }, remaining);
    }
  },
  seekPreviewerAt(time = 0) {
    this.player.seek(time)
  },
  _formatSelectedTime(time) {
    time = +time
    return Number.isInteger(time) ? time : parseFloat(time.toFixed(1))
  },
  onClickNext() {
    wx.navigateTo({
      url: '../edit/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', {

          // clipper实例提供的方法可以获取tracks信息
          tracks: this._nextTracks
        })
      }
    })
  }
});