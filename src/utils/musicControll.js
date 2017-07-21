const Util = require("./util");
const App = getApp();

/*全局数据*/
var musicData = {};

const musicPlayer = {
    // constructor(props = {}) {
    // },
    lists: {}, //播放列表
    current: {}, // 当前播放的数据
    index: 0, //播放条目
    state: false, //播放状态
    songState: {}, //进度条状态
    /*配置播放数据*/
    setOption({ current, lists, state, index }) {

        //全局设置参数
        current ? this.current = current : this.current;
        lists ? this.lists = lists : this.lists;
        state ? this.state = state : this.state;
        index ? this.index = index : this.index;

        App.globalData = {
            playIndex: index,
            playData: current,
            playList: lists,
            playing: state
        }


    },
    /*获取当前播放条数据*/
    getMusicData() {

        let globalData = App.globalData;
        this.songState = wx.getStorageSync("songState"); //记录最终的进度条


        let musicData = {
                index: globalData.playIndex,
                current: globalData.playData,
                playList: globalData.playList,
                playing: globalData.playing,
                songState: this.songState,
                // bookCat:
            }
            // console.log("musicData in get:", musicData);

        return musicData
    },

    /**
     * 播放
     * @param  options={lists,index}   {播放列表,播放条目}
     * */
    playMusic(options = {}) {
        let lists = options.lists;
        let index = this.index = options.index;
        console.log("playMusic", lists, index);
        if (!lists.song[index].URL) {
            wx.showToast({ title: '当前无播放内容', image: '../images/error.svg' })
            return;
        }
        wx.playBackgroundAudio({
            dataUrl: lists.song[index].URL,
            title: lists.song[index].name,
            // coverImgUrl: lists.thumbnail,
        })
        this.setOption({ current: lists.song[index], lists: lists, state: true, index: index })

    },

    /*停止*/
    stopMusic() {
        wx.getBackgroundAudioPlayerState({ // 小程序播放控制api
            success(res) {
                let status = res.status;
                if (status === 1) { // 正在播放中
                    // console.info("stopMusic1")
                    wx.pauseBackgroundAudio(); //暂停播放
                    App.globalData.playing = false;

                } else if (status === 0) { // 正在暂停中
                    // console.info("stopMusic2")
                    App.globalData.playing = true;
                }

            }
        })

    },
    /*下一首*/
    playNext() {
        let index = this.index;
        index++;
        if (index == this.lists.song.length) {
            index = this.index = 0;
        }
        this.playMusic({ lists: this.lists, index: index });
        App.globalData.playIndex = index;

    },

    /*上一首*/
    playPrevious() {
        let index = this.index;
        index--;
        if (index < 0) {
            index = this.index = this.lists.song.length - 1;
        }
        this.playMusic({ lists: this.lists, index: index });
        App.globalData.playIndex = index;

    },


};





module.exports = musicPlayer;