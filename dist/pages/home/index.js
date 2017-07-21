// pages/home/index.js
const App = getApp();
let that;
const Require = require('../../utils/Require');
const Api = require('../../utils/Api');

let MusicCtr = require('../../utils/musicControll');
let Util = require("../../utils/util");

let isLoading = false;
let isPull = false
Page({
    data: {
        initHeader: {
            // 头部swiper自定义
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500,
            height: 380,
            imgUrls: [],

        },
        navbar: ['发现', '收藏'],
        currentTab: 0, // 导航栏切换索引

        mode: 0,
        topics: [], //快讯列表
        homeList: [], //书籍列表
        colList: [], //收藏列表

        next_first: 0,
        next_cursor: 0,
        isDone: false,
        isEmpty: false,
    },
    onNavbarTap(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({ currentTab: index });
        index === 1 ? that.getCollectList() : that.getList();
    },
    getList() {
        Require.call({
            api: Require.requirePath.index,
        }).then(res => {
            // let category = res.category.filter(item => {
            //     item.article.length > 3 ? item.article.splice(0, 4) : null;
            // });
            res.mode = parseInt(res.mode);
            that.setData({
                "initHeader.imgUrls": res.sliders,
                homeList: res.category,
                mode: res.mode,
            })
            if (res.mode) {
                console.log(1111);
                that.loadTopics();
            }
        })
    },
    getCollectList(options = {}) {
        Require.queryFavList({
            data: options
        }).then(res => {
            let targData = res.articles;
            that.setData({
                    colList: targData,
                    isEmpty: targData.length == 0 ? true : false,
                    next_cursor: res.next_cursor
                })
                // console.log("colList", that.data.colList);
        })
        console.log("isEmpty", that.data.isEmpty);
    },
    loadTopics: function(args) {
        const self = this
        isLoading = true
        Api.queryTopics(args)
            .then(res => {
                // 列表数据合并
                const topics = isPull ? [].concat(res.topics, this.data.topics) : [].concat(this.data.topics, res.topics)
                this.setData({
                        topics: topics,
                        next_cursor: res.next_cursor,
                        next_first: res.next_first,
                        isDone: res.next_cursor === 0 ? true : false
                    })
                    // 如果是下拉刷新, 则重置
                    // isPull = false
                isLoading = false
                wx.stopPullDownRefresh()
            })
            .catch(err => {
                // isPull = false
                isLoading = false
                wx.stopPullDownRefresh()
            })
    },


    //设置播放条数据
    setMusicData() {
        let musicData = MusicCtr.getMusicData();
        that.setData({
            musicData: musicData,
            // "musicData.songState": wx.getStorageSync("songState"),
            // playIndex: wx.getStorageSync("playIndex"),
            // playing: wx.getStorageSync("playing"),
            playIndex: App.globalData.playIndex,
            playing: App.globalData.playing,
        })
        that.songPlay();
    },
    //下一首
    playPre() {
        MusicCtr.playPrevious();
        that.setMusicData()
    },
    //上一首
    playNext() {
        MusicCtr.playNext();
        that.setMusicData()
    },

    //暂停
    stopAudio() {
        MusicCtr.stopMusic();
        that.setData({ playing: false, "musicData.playing": false })
            // wx.setStorageSync("playing", false)
        App.globalData.playing = false;
    },
    //播放
    playAudio(e) {
        let index = e.currentTarget.dataset.index;
        // let lists = wx.getStorageSync("playList")
        let lists = App.globalData.playList
        MusicCtr.playMusic({ lists: lists, index: index })

        that.setMusicData();
    },
    /* 播放进度状态控制 */
    songPlay() {
        clearInterval(timer);
        let timer = setInterval(function() {
            wx.getBackgroundAudioPlayerState({ // 调用小程序播放控制api
                success(res) {
                    let status = res.status;
                    if (status === 0) { clearInterval(timer); }
                    that.setData({
                        "musicData.songState": {
                            progress: res.currentPosition / res.duration * 100,
                            currentPosition: Util.timeToString(res.currentPosition), // 调用转换时间格式
                            duration: Util.timeToString(res.duration) // 调用转换时间格式 
                        }
                    });
                }
            })
        }, 1000);
        //监听音乐停止
        wx.onBackgroundAudioStop(() => {
            console.info("停止")
            that.playNext();
        })


    },
    // START 列表mixins-快讯
    preview: function(e) {
        const current = e.currentTarget.dataset.url
        const images = this.data.topics[e.currentTarget.dataset.topic].images
        wx.previewImage({
            current: current,
            urls: images.map(item => item.original)
        })
    },
    navigatorToDetail(e) {
        wx.navigateTo({ url: '/pages/home/detail?id=' + e.currentTarget.id })
    },

    onLoad: function(options) {
        that = this;
        that.getList();
        that.setData({ playing: false, "musicData.playing": false })
            // wx.setStorageSync("playing", false)
        App.globalData.playing = false;

    },

    onReady: function() {

    },

    onShow: function() {
        that.setMusicData();
    },
    // onHide(){},
    onPullDownRefresh: function() {
        // isPull = true
        // this.loadTopics({
        //     first: this.data.next_first
        // })
    },

    onReachBottom: function() {
        if (!that.data.next_cursor) return;
        if (that.data.mode) {
            that.loadTopics({ cursor: that.data.next_cursor })
        }
        if (that.data.currentTab === 1) {
            that.getCollectList({ cursor: that.data.next_cursor })
        }

    },

    onShareAppMessage: function() {
        return {
            title: that.data.share_title,
            path: "/pages/home/index"
        }
    }
})