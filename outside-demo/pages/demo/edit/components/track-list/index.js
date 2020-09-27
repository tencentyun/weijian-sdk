Component({
    data: {
        settings: null, // 通过全局设置的皮肤样式
    },

    properties: {
        show: {
            type: Boolean,
            value: false
        },
        bottom: {  // 距离底部的高度
            type: Number,
            value: 0
        }
    },

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () {
            this.setData({
            })
        },
        moved: function () { },
        detached: function () { },
      },

    methods: {
        onTapEditMenu(e) { // 点击列表事件
            
            const type = e.currentTarget.dataset.type;
            this.triggerEvent("trackTap", {
                type: type
            });
        },

        goExportPage() {
          // 导航到导出页
          wx.navigateTo({
            url: '../export/index',
            success: (res) => {
              res.eventChannel.emit('acceptDataFromOpenerPage', {
                tracks: global.edit.tracks
              })
            }
          })
        }

    }
})