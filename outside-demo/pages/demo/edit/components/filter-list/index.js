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


            const operations = new global.edit.player.types.ClipOperation({
                key,
                type: 'filter'
            });
            
            tracks.forEach((item, index) => {
                if(item.type === 'media') {
                    item.clips.forEach((item) => {
                        item.operations = [operations];
                    })
                }
            })
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