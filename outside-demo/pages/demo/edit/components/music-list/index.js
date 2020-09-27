// import dao from '../../../../tools/services/new_dao';

Component({
    properties: {
        show: {
            type: Boolean,
            value: false
        }
    },
    data: {
        recommendMusicList: [],   // 推荐音乐列表
        musicTap: 'music',
        videoVolume: 100,
        musicVolume: 100
    },
    attached() {

        this.music_data = [
            {
                "Name": "天空之外",
                "Url": "http://www.170mv.com/kw/antiserver.kuwo.cn/anti.s?rid=MUSIC_93477122&response=res&format=mp3%7Caac&type=convert_url&br=128kmp3&agent=iPhone&callback=getlink&jpcallback=getlink.mp3",
                "AlbumImageUrl": "http://image.tingmall.com/album/435/4357577-JPG-240X240-ALBUM.jpg",
                "ArtistSet": [
                    "解语花"
                ]
            },
            {
                "Name": "god is a girls",
                "Url": "http://www.170mv.com/kw/antiserver.kuwo.cn/anti.s?rid=MUSIC_96145895&response=res&format=mp3%7Caac&type=convert_url&br=128kmp3&agent=iPhone&callback=getlink&jpcallback=getlink.mp3",
                "AlbumImageUrl": "http://image.tingmall.com/album/507/5071618-JPG-240X240-ALBUM.jpg",
                "ArtistSet": [
                    "god is a girls"
                ]
            },
            {
                "Name": "北京少爷",
                "Url": "http://www.170mv.com/kw/antiserver.kuwo.cn/anti.s?rid=MUSIC_140162434&response=res&format=mp3%7Caac&type=convert_url&br=128kmp3&agent=iPhone&callback=getlink&jpcallback=getlink.mp3",
                "AlbumImageUrl": "http://image.tingmall.com/album/506/5067577-JPG-240X240-ALBUM.jpg",
                "ArtistSet": [
                    "北京少爷"
                ]
            }
        ];

        this.music_data.forEach((element, index) => {
            element.selected = false;
            element.status = false;
            element.key = index;
        });

        this.setData({
            recommendMusicList: this.music_data
        });
    },
    ready() {
        this._tracks = global.edit.tracks;
    },
    methods: {
        onTapMusicOperTab(e) {
            const key = e.currentTarget.dataset.key;

            this.setData({
                musicTap: key
            })
        },
        onTapRecommendMisic(e) {
            const key = e.currentTarget.dataset.key;

            const recommendMusicList = this.data.recommendMusicList;

            for (let i = 0; i < recommendMusicList.length; i++) {
                if (recommendMusicList[i].key === key) {
                    if (recommendMusicList[i].selected) {
                        recommendMusicList[i].selected = false;
                        recommendMusicList[i].status = 'paused';
                        // 停掉音乐
                        this._delMusic()
                    } else {
                        recommendMusicList[i].selected = true;
                        recommendMusicList[i].status = 'playing';
                        // 开始播放音乐， 并且播放器seek 0

                        const musicData = recommendMusicList[i];

                        this._setMusic(musicData);  // 设置音乐
                    }
                } else {
                    recommendMusicList[i].selected = false;
                    recommendMusicList[i].status = 'paused';
                }
            }

            this.setData({
                recommendMusicList,
                canChangeMusicVolume: true
            })

        },
        _delMusic() {
            // 删掉音乐
            global.edit.tracks.forEach((item, index) => {

                if (item.type === 'music') {
                    global.edit.tracks.splice(index, 1);
                }
            })

            global.edit.player.updateData(global.edit.tracks);
        },
        _setMusic(musicData) {

            // 创建音乐clip
            const musciClip = new global['wj-types'].Clip({
                type: 'music',
                startAt: 0,
                section: new global['wj-types'].ClipSection({
                    start: 0,
                    end: 100
                }),
                info: {
                    tempFilePath: musicData.Url
                }
            });

            // 创建音乐轨道
            const musicTrack = new global['wj-types'].Track({
                type: 'music',
                clips: [musciClip],   // clip加入轨道
            });


            // 删除旧的音乐轨道，因为音乐轨道目前只能存在一个
            global.edit.tracks.forEach((item, index) => {
                if (item.type === 'music') {
                    global.edit.tracks.splice(index, 1);
                }
            })

            // 把音乐轨道加入播放器轨道
            global.edit.tracks.push(musicTrack);

            // 更新
            global.edit.player.updateData(global.edit.tracks, () => {
                global.edit.player.seek(0);
                global.edit.player.play()
            });
        },
        onVideoVolumeChange(e) {
            const value = e.detail.value;

            this._tracks.forEach((item, index) => {
                if(item.type === 'audio') {
                    
                    item.clips.forEach((item) => {
                        item.volume = value / 100;
                    })
                }
            });

            global.edit.player.updateData(this._tracks);
        },
        onMusicVolumeChange(e) {
            const value = e.detail.value;
            this._music_volume = value;

            this._setMusicVolume(value/100);
        },
        _setMusicVolume(value) {
            // 调整音乐的音量
            this._tracks.forEach((item, index) => {
                if(item.type === 'music') {

                    // this._tracks指播放器轨道，index定位到music track， clips中第一个为当前正在播放的音乐，修改它的volume属性即可
                    this._tracks[index].clips[0].volume = value;
                }
            });

            
            global.edit.player.updateData(this._tracks);
        }
    }
})