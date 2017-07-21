// pages/home/articalList.js
const App = getApp();
let that;
const Require = require('../../utils/Require');
let isPull = false;

Page({

    data: {
        listData: {},
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
            let booksList = isPull ? res.articles : [].concat(that.data.booksList, res.articles);

            that.setData({
                listData: res,
                booksList: res.articles,
                share_title: res.share_title,
                next_first: res.next_first,
                next_cursor: res.next_cursor,
            })
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
        that.getList();
    },

    onReachBottom: function() {
        if (!that.data.next_cursor) return;
        that.getList({ cursor: that.data.next_cursor });
    },

    onShareAppMessage: function() {
        return {
            title: that.data.share_title,
            path: "/pages/home/articalList?id=" + that.data.id
        }
    }
})