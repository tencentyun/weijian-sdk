// import config from '../../common/config'

Component({
    properties: {
        show: {
            type: Boolean,
            value: false
        }
    },
    data: {
        filterList: [],
    },

    ready() {

        // 从播放器中获取filter列表
        const filterList = global.edit.player.getFilters();

        this.setData({
            filterList
        })
    },
    methods: {
        onTapFilterBtn(e) {
            const key = e.currentTarget.dataset.key;
            this._setFilter(key);
        },
        _setFilter(key) {
            // 获取播放器轨道
            const tracks = global.edit.player.getTracks();
            global.edit.filter = key;

            // 删除掉旧的滤镜
            let oldFilterTrackIndex = tracks.findIndex(t => t.type === 'filter')
            if (oldFilterTrackIndex > -1) {
                tracks.splice(oldFilterTrackIndex, 1)
            }
            const filterTrack = new global.edit.player.types.TrackData({
                id: "main-filter",
                type: 'filter',
                clips: []
            })
            const filterClip = new global.edit.player.types.ClipData({
                id: 'main-filter',
                type: 'filter',
                key,
                section: {
                    start: 0,
                    end: 1000,
                    duration: 1000
                },
                startAt: 0
            })
            filterTrack.clips = [filterClip]
            tracks.push(filterTrack)
            // 播放器更新
            global.edit.player.updateData(tracks);

            // 修改ui的active状态
            const list = this.data.filterList;
            let index = 0;

            for (let i = 0; i < list.length; i++) {
                let f = list[i];
                if (f.key === key) {
                    f.selected = true;
                    this.data.currFilter = f;
                    index = i;
                } else {
                    f.selected = false;
                }
            }

            this.setData({
                filterList: list
            })
        }
    }
})