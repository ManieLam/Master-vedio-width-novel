const Api = require('../../utils/Api')
let isPull = false
const app = getApp()
let isLoading = false

Page({
    data: {
        topics: [],
        next_first: 0,
        next_cursor: 0,
        tag_id: 0,
        isDone: false
    },
    // START 列表mixins
    preview: function(e) {
        const current = e.currentTarget.dataset.url
        const images = this.data.topics[e.currentTarget.dataset.topic].images
        wx.previewImage({
            current: current,
            urls: images.map(item => item.original)
        })
    },
    copyUrl: function(e) {
        const url = e.currentTarget.dataset.url
        app.copyUrl(url);
    },
    copyCode: function(e) {
        const code = e.currentTarget.dataset.code
        app.copyCode(code);
    },
    // END 列表mixins
    loadTopics: function(args) {
        if (isLoading || this.data.isDone) return

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
                        page_title: res.page_title,
                        share_title: res.share_title,
                        isDone: res.next_cursor === 0 ? true : false
                    })
                    // 如果是下拉刷新, 则重置
                isPull = false
                isLoading = false
                wx.stopPullDownRefresh()
                    // 更新标题
                wx.setNavigationBarTitle({
                    title: res.page_title
                })
            })
            .catch(err => {
                isPull = false
                isLoading = false
                wx.stopPullDownRefresh()
            })
    },
    onLoad: function(options) {
        this.setData({
            tag_id: options.tag_id
        })
        this.loadTopics({
            tag_id: options.tag_id
        })
    },
    onPullDownRefresh: function() {
        isPull = true
        this.loadTopics({
            first: this.data.next_first,
            tag_id: this.data.tag_id
        })
    },
    onReachBottom: function() {
        this.loadTopics({
            cursor: this.data.next_cursor,
            tag_id: this.data.tag_id
        })
    },
    onShareAppMessage: function() {
        return {
            title: this.data.share_title,
            path: '/pages/tag/index?tag_id=' + this.data.tag_id
        }
    }
})
