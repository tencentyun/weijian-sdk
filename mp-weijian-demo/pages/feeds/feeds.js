//logs.js
const util = require('../../utils/util.js')
var plugin = requirePlugin('myVideo');

Page({
  data: {
    logs: [],
    controls: false,
    isPlaying: true,
    loading: true,
    fileid: "",
    isControls: false,
  },
  onLoad: function (option) {

    const eventChannel = this.getOpenerEventChannel()

    const that = this;

    const sys_info = wx.getSystemInfoSync();

    this.bottom_height = sys_info.screenHeight - sys_info.safeArea.bottom;

    eventChannel.on('acceptDataFromOpenerPage', function(data) {

      const realHeight = 750 * (data.Height / data.Width);

      that.setData({
        fileid: data.Id,
        realHeight,
        MediaUrl: data.Url
      })
    })
  },
  onReady: function() {
    

  },
  isCommentShow: false,
  bottom_height: 0,
  scroll_handle: function(e) {
    let scroll_top = e.detail.scrollTop;


    if(scroll_top > 100 && !this.isCommentShow) {

      // 显示评论
      this.isCommentShow = true;
      this.animate('.input_wrap', [{
        bottom: `${-60 - this.bottom_height}px`
      }, {
        bottom: 0
      }], 100, () => {

      });

      this.videoContext.pause();
    }

    if(scroll_top < 100 && this.isCommentShow) {
      this.isCommentShow = false;

      this.animate('.input_wrap', [{
        bottom: 0
      }, {
        bottom: `${-60 - this.bottom_height}px`
      }], 100, () => {

      });

      this.videoContext.play();

    }
  },
  play_handle: function() {

    this.videoContext = plugin.getContext('video_player');

    this.setData({
      isPlaying: true,
      loading: false
    })
  },
  pause_handle: function() {

    this.setData({
      isPlaying: false
    })
  },
  tap_video: function() {

    this.setData({
      isControls: !this.data.isControls
    })

  },
  tap_play_icon() {
    if(this.data.isPlaying) {
      this.videoContext.pause();
    } else {
      this.videoContext.play();
    }
  }
})
