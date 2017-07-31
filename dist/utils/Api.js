import { APP_ID, API_HOST, INVALID_TOKEN } from "config.js"

const Auth = require('./Auth')
    /**
     * 获取话题列表
     * @param  {object} args 参数
     * @return {promise}
     */
const queryTopics = function queryTopics(args) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/topic.list.json',
            method: 'GET',
            data: args,
            success: function(res) {
                if (res.data.errcode === 0) {
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 获取话题详情
 * @param  {int} id 话题id
 * @return {promise}
 */
const getTopic = function getTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/topic.get.json',
            method: 'GET',
            data: {
                id: id,
                access_token: Auth.token()
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 点赞话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const likeTopic = function likeTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/topic.like.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                topic_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 取消点赞话题
 * @param  {int} id 话题id
 * @return {Promise}
 */
const unlikeTopic = function unlikeTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/topic.unlike.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                topic_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 收藏话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const favTopic = function favTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/topic.fav.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                topic_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 取消收藏话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const unfavTopic = function unfavTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/topic.unfav.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                topic_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 创建评论
 * @param  {object} args 参数
 * @return {promise}
 */
const createReply = function createReply(args) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/reply.create.json?access_token=' + Auth.token(),
            method: 'POST',
            data: args,
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 删除评论
 * @param  {int} id 评论id
 * @return {promise}
 */
const deleteReply = function deleteReply(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/reply.delete.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 获取收藏列表
 * @param  {object} args<{cursor}>
 * @return {promise}
 */
const queryFavList = function queryFavList(args) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/fav.list.json?access_token=' + Auth.token(),
            method: 'GET',
            data: args,
            success: function(res) {
                if (res.data.errcode === 0) {
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res.data)
            }
        })
    })
}

/**
 * 我的消息列表
 * @param  {object} args<{cursor}>
 * @return {promise}
 */
const queryNotificationList = function queryNotificationList(args) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api2/notification.list.json?access_token=' + Auth.token(),
            method: 'GET',
            data: args,
            success: function(res) {
                if (res.data.errcode === 0) {
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 需要授权的接口调用
 * @param  {Function} fn
 * @return {Promise}
 */
const guard = function(fn) {
    const self = this
    return function() {
        if (Auth.check()) {
            return fn.apply(self, arguments)
        } else {
            return Auth.login()
                .then(data => {
                    return fn.apply(self, arguments)
                })
        }
    }
}

module.exports = {
    queryTopics: queryTopics,
    getTopic: getTopic,
    likeTopic: guard(likeTopic),
    unlikeTopic: guard(unlikeTopic),
    favTopic: guard(favTopic),
    unfavTopic: guard(unfavTopic),
    createReply: guard(createReply),
    deleteReply: guard(deleteReply),
    queryFavList: guard(queryFavList),
    queryNotificationList: guard(queryNotificationList)
}