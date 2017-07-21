import { APP_ID, API_HOST } from 'config.js';
const Auth = require('Auth.js');

function noop() {}
var defaultOptions = {
    method: 'GET',
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    success: noop,
    fail: noop,
    complete: noop
};
/**公用调用接口模块
 * @param  {object} options
 * @param  {Promise} 
 */
var call = function(options = {}) {
    let that = this;
    return new Promise((resolve, reject) => {
        wx.canIUse('showLoading') ? wx.showLoading({ title: '拼命加载中' }) : wx.showToast({ title: '拼命加载中', icon: 'loading' });
        var params = Object.assign({}, defaultOptions, options);
        params.url = options.url || (API_HOST + params.api);

        params.success = function(res) {
            wx.canIUse('showLoading') ? wx.hideLoading() : null;
            if (res.statusCode == 200) {
                if (res.data.errcode == 0) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            } else {
                reject(res.data);
            }
        }

        params.fail = function(res) {
            reject(res);
        }

        wx.request(params);
    });

}

/**
 * 需要授权的接口调用
 * @param  {Function} fn
 * @return {Promise}
 */
const guard = function(fn) {
    // console.info(1111)
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



/**
 * 收藏话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const favTopic = function favTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.article.fav.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                post_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '感谢收藏',
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败了T^T',
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
            url: API_HOST + 'api/mag.book.unfav.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                post_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '取消收藏了T^T',
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败了T^T',
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
            url: API_HOST + 'api/mag.fav.list.json?access_token=' + Auth.token(),
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



/*接口名称*/
const requirePath = {
    index: 'api/mag.home.json',
    lists: 'api/mag.article.list.json',
    detail: 'api/mag.article.get.json',
}

module.exports = {
    call: call,
    favTopic: guard(favTopic),
    unfavTopic: guard(unfavTopic),
    queryFavList: guard(queryFavList),
    requirePath: requirePath,
}