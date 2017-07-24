// pages/home/articalList.js
const App = getApp();
let that;
const Require = require('../../utils/Require');
let isPull = false;
let isLoading = false;
let firstCursor = 0; //存放下拉前最后一个的cursor
let firstFir = 0; //存放上滚前最后一个的first

Page({

    data: {
        listData: {},
        booksList: [],
        next_first: 0,
        next_cursor: 0,
        isDone: false
    },
    getList(options = {}) {
        let params = Object.assign({}, {
            cat: that.data.id,
        }, options)
        Require.call({
            api: Require.requirePath.lists,
            data: params
        }).then(res => {
            // wx.setNavigationBarTitle({ title: res.page_title })
            let booksList = isPull ? [].concat(res.articles, that.data.booksList) : [].concat(that.data.booksList, res.articles);

            //防止第一次next_cursor,next_first被污染
            if (isPull) {
                res.next_cursor = firstCursor;
                firstCursor = 0;
            }
            if (isLoading) {
                res.next_first = firstFir;
                firstFir = 0;
            }

            that.setData({
                listData: res,
                booksList: res.books,
                share_title: res.share_title,
                next_first: res.next_first,
                next_cursor: res.next_cursor,
                isDone: res.next_cursor === 0 ? true : false
            })
            isPull = false;
            isLoading = false;
            wx.stopPullDownRefresh();
            // console.log("listData", that.data.listData);
        })
    },
    onLoad: function(options) {
        that = this;
        that.setData({ id: options.id })
        that.getList();
    },


    onPullDownRefresh: function() {
        if (!that.data.next_first) return;
        isPull = true;
        // 每次下拉把上个加载出的next_cursor存储
        firstCursor = this.data.next_cursor;
        that.getList();
    },

    onReachBottom: function() {
        if (!that.data.next_cursor) return;
        isLoading = true;
        firstFir = that.data.next_first;
        that.getList({ cursor: that.data.next_cursor });
    },

    onShareAppMessage: function() {
        return {
            title: that.data.share_title,
            path: "/pages/home/articalList?id=" + that.data.id
        }
    }
})