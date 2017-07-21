const Api = require('../../utils/Api')
const Auth = require('../../utils/Auth')
const app = getApp()
let isSubmiting = false

Page({
    data: {
        id: 0,
        topic: null,
        is_faved: false,
        is_liked: false,
        like_count: 0,
        likes: [],
        user: null,
        reply_count: 0,
        replies: [],
        text: '',
        reply_to: 0,
        reply_focus: false,
        placeholder: '发布评论'
    },
    // START 列表mixins
    copyUrl: function(e) {
        const url = e.currentTarget.dataset.url
        app.copyUrl(url);
    },
    copyCode: function(e) {
        const code = e.currentTarget.dataset.code
        app.copyCode(code);
    },
    // END 列表mixins
    preview: function(e) {
        const current = e.currentTarget.dataset.url
        const images = this.data.topic.images
        wx.previewImage({
            current: current,
            urls: images.map(item => item.original)
        })
    },
    onLoad: function(options) {
        this.setData({
            id: options.id,
            user: Auth.user()
        })
        this.setTopic()
    },
    setTopic: function() {
        Api.getTopic(this.data.id)
            .then(res => {
                this.setData({
                    topic: res.topic,
                    is_faved: Boolean(res.topic.is_faved),
                    is_liked: Boolean(res.topic.is_liked),
                    like_count: res.topic.like_count,
                    likes: res.topic.likes,
                    reply_count: res.topic.reply_count,
                    replies: res.topic.replies,
                    share_title: res.share_title
                })
                wx.setNavigationBarTitle({
                    title: res.page_title
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    },
    like: function() {
        this.setData({ is_liked: true })
        Api.likeTopic(this.data.id)
            .then(res => {
                this.setData({
                    like_count: this.data.like_count + 1,
                    likes: [].concat(res.user, this.data.likes)
                })
            })
            .catch(err => {

            })
    },
    unlike: function() {
        this.setData({ is_liked: false })
        Api.unlikeTopic(this.data.id)
            .then(res => {
                this.setData({
                    like_count: this.data.like_count - 1,
                    likes: this.data.likes.filter(user => user.openid !== res.user.openid)
                })
            })
            .catch(err => {

            })
    },
    share: function() {
        wx.showShareMenu({
            success: function() {
                console.log('open share success')
            },
            fail: function() {
                console.log('open share fail')
            }
        })
    },
    toggleFavTopic: function() {
        if (this.data.is_faved) {
            this.unfavTopic()
        } else {
            this.favTopic()
        }
    },
    favTopic: function() {
        this.setData({
            is_faved: true
        })
        Api.favTopic(this.data.id)
            .then(res => {
                this.setData({
                    is_faved: true
                })
            })
            .catch(err => {

            })
    },
    unfavTopic: function() {
        this.setData({
            is_faved: false
        })
        Api.unfavTopic(this.data.id)
            .then(res => {
                this.setData({
                    is_faved: false
                })
            })
            .catch(err => {

            })
    },
    needAuth: function() {
        const self = this
        wx.showModal({
            title: '授权',
            content: '只有授权用户才能进行此操作，确认授权吗？',
            success: function(res) {
                if (res.confirm) {
                    Auth.checkOrLogin()
                        .then(user => {
                            self.setData({
                                user: user
                            })
                        })
                }
            }
        })
    },
    reply: function(e) {
        const self = this
        const comment_id = e.currentTarget.dataset.id
        const username = e.currentTarget.dataset.user
        const openid = e.currentTarget.dataset.openid

        // 1.检测有没有本地用户
        if (!this.data.user) {
            return false
        }
        // 2.如果是自己的评论则显示删除菜单
        if (openid === this.data.user.openid) {
            wx.showActionSheet({
                itemList: ['删除评论'],
                itemColor: '#e74c3c',
                success: function(res) {
                    if (res.tapIndex === 0) {
                        self.deleteReply(comment_id)
                    }
                }
            })
        } else {
            // 3.如果是其他人评论则回复
            this.setData({
                reply_to: comment_id,
                placeholder: '回复' + username + ':',
                reply_focus: true
            })
        }
    },
    deleteReply: function(comment_id) {
        Api.deleteReply(comment_id)
            .then(res => {
                if (res.errcode === 0) {
                    this.setData({
                        replies: this.data.replies.filter(item => item.id !== comment_id)
                    })
                }
            })
            .catch(err => {
                console.log('err', err)
            })
    },
    onRepleyFocus: function(e) {
        this.setData({
            reply_focus: true
        })
    },
    onReplyBlur: function(e) {
        const text = e.detail.value.trim()
            // 只有输入内容为空的时候, 输入框失焦才会重置回复对象
        if (text === '') {
            // 保证先提交评论再重置
            setTimeout(() => {
                this.setData({
                    reply_to: 0,
                    placeholder: '发布评论',
                    reply_focus: false
                })
            }, 0)
        }
    },
    commentSubmit: function(e) {
        const text = e.detail.value.text.trim()
        if (text === '' || isSubmiting) return

        isSubmiting = true
        Api.createReply({
                topic_id: this.data.id,
                text: text,
                reply_to: this.data.reply_to,
                form_id: e.detail.formId
            })
            .then(res => {
                this.setData({
                    text: '',
                    reply_to: 0,
                    placeholder: '发布评论',
                    reply_focus: false,
                    reply_count: this.data.reply_count + 1,
                    replies: [].concat(this.data.replies, res.reply)
                })
                isSubmiting = false
            })
            .catch(err => {
                isSubmiting = false
                console.log(err)
            })
    },
    onShareAppMessage: function() {
        return {
            title: this.data.share_title,
            path: '/pages/single/index?id=' + this.data.id
        }
    }
})