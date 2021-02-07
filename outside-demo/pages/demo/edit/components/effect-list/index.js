// import config from '../../common/config'
// import PageUtil from '../../common/Util'

Component({
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        effectList: {
            type: Array,
            value: []
        }
    },

    data: {
        curEffectList: [],
        curEffectTab: 'fantasy',
        pressingEffectKey: '',
    },
    observers: {
        effectList(data) {
            if (!data || !data.length) return
            // console.log('%c effectList', 'font-size:50px', data)
            // 可自行根据喜好分类
            this._effectList.fantasy = data.slice(0, 12)
            // this._effectList.fantasy.unshift(...data.slice(-3))
            this._effectList.dynamic = data.slice(12,20)
            this._effectList.splitScreen = data.slice(20,27)
            this.setData({
                curEffectTab: "fantasy",
                curEffectList: this._effectList.fantasy
            })
        }
    },
    lifetimes: {
        attached() {
        },
        ready() {
            this.init()
        }
    },

    methods: {
        init(){
            // 特效分类
            this._effectList = {
                fantasy: [],
                dynamic: [],
                splitScreen: []
            }

            // 获取当前的播放器轨道
            this._tracks = global.edit.tracks;

            // 新建特效轨道，并赋值
            this._track_effect = new global['wj-types'].Track({
                type: 'effect',
                clips: []
            });

            // 将特效轨道加入tracks中
            this._tracks.push(this._track_effect)
        },
        onTapEfClose() {
            this.triggerEvent('setActive', 'none')
        },
        onTapTab1() {
            this.setData({
                curEffectTab: 'fantasy',
                curEffectList: JSON.parse(JSON.stringify(this._effectList.fantasy))
            })
        },

        onTapTab2() {
            this.setData({
                curEffectTab: 'dynamic',
                curEffectList: JSON.parse(JSON.stringify(this._effectList.dynamic))
            })
        },

        onTapTab3() {
            this.setData({
                curEffectTab: 'splitScreen',
                curEffectList: JSON.parse(JSON.stringify(this._effectList.splitScreen))
            })
        },

        onTapEfSave() {
            global.edit.player.seek(0);
            global.edit.player.play();
            this.triggerEvent('setActive', 'none')
        },
        effectTap(e) {
            // 点击特效之后，将给播放器添加特效效果

            let key = e.currentTarget.dataset.key;

            let isalpha = e.currentTarget.dataset.isalpha;

            let initData;

            if (isalpha) {
                initData = {
                    type: 'effect',
                    section: {
                        start: 0,
                        end: 100,     // 如果你需要给整个视频添加这种特效，时间填入100即可，播放器内部会自动处理
                        duration: 100
                    },
                    isAlpha: true,
                    startAt: 0,
                    key: key,   // 特效的key
                };
            } else {
                initData = {
                    type: 'effect',
                    section: {
                        start: 0,
                        end: 100,     // 如果你需要给整个视频添加这种特效，时间填入100即可，播放器内部会自动处理
                        duration: 100
                    },
                    startAt: 0,
                    key: key,   // 特效的key
                };
            }



            // 创建effect clip
            const clipData = new global['wj-types'].Clip(initData);

            // 因为前面已经将track加入，所以直接改引用即可
            this._track_effect.clips = [clipData];

            // 更新播放器
            global.edit.player.updateData(this._tracks, () => {
                global.edit.player.seek(0);
            });
        },
    }
})