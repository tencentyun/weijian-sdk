Page({
  data: {
    items: [],
    currentItem: 0
  },
  onLoad: function () {
    global.index = {};
  },
  onMediaChanged(e) {

    // 选择视频之后插件提供的回调

    const videoTrack = e.detail.track;

    // 用于数据传递
    global.index.videoTrack = videoTrack;
  },
});