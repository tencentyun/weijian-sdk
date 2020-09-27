Page({
    data: {
        active: 'none'
    },
    onLoad: function () {
        global.edit = {};

        // 页面初始化，先获取播放器实例，方面后面调用
        this._player = this.selectComponent("#my-player2");


        const eventChannel = this.getOpenerEventChannel();
        global.edit.player = this._player;

        // 接收裁切页传递过来的轨道信息
        eventChannel.on("acceptDataFromOpenerPage", data => {
            this._tracks = data.tracks;
            global.edit.tracks = this._tracks;
        });
    },
    onHide() {
        global.edit.player.pause()
      },
      onShow() {
        global.edit.player.play()
      },
    onEditReady() {

        // 初次更新播放轨道
        this._player.updateData(this._tracks, () => {
            this._player.play();
        });
    },
    onTapSelectEffect(e) {
        const type = e.detail.type;  // 点击类型

        this.setData({
            active: type
        });
    },
    playerTap() {

        this.setData({
            active: 'none'
        });
    },
    onConfirmText(e) {
        // text-editor组件提供的回调，可以获取文字的内容，颜色等信息

        let text = e.detail

        // 创建文字clip，并且设置 内容，样式等信息
        let textClip = new global['wj-types'].Clip({
            type: 'text',
            startAt: 0,
            section: new global['wj-types'].ClipSection({
                start: 0,
                end: 100,
            }),
            content: {
                content: text.value, // 文字内容
                style: {
                    type: text.bgColor === 'transparent' ? 'normal' : 'background', // 文字样式
                    color: text.color, // 文字颜色
                    backgroundColor: text.bgColor
                }
            },
        })

        // 创建文字轨道
        let textTrack = new global['wj-types'].Track({
            type: 'text',
            clips: [textClip],
            zindex: 99
        })
        global.edit.tracks.push(textTrack)

        // 播放器更新
        global.edit.player.updateData(global.edit.tracks)

        this.setData({
            active: 'none'
        })
    },
    onTextEditorClose() {
        this.setData({
            active: 'none'
        })
    },
    setActive(e) {
        const type = e.detail;

        this.setData({
            active: type
        })
    }
});