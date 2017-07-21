import { APP_ID, API_HOST } from "config.js"

const Data = {
    user: wx.getStorageSync('user'),
    token: wx.getStorageSync('token'),
    expired_in: parseInt(wx.getStorageSync('expired_in'), 10)
}

/*
|-------------------------------------------------------------------------------
| 基于token验证机制的微信小程序授权模块
|-------------------------------------------------------------------------------
| login()           - 登陆
| logout()          - 注销
| guest()           - 判断当前用户是否为游客
| user()            - 获取当前用户信息
| openid()          - 获取当前用户的openid
| token()           - 获取本地token
| check()           - 验证当前用户授权是否有效/过期
| checkOrLogin()    - 验证当前授权是否有效, 无效则重新登录
*/
const Auth = {}

/**
 * 获取当前登陆用户的openid
 * @return {string}
 */
Auth.openid = function openid() {
    const user = Auth.user()
    if (user && user.openid) {
        return user.openid
    } else {
        return ''
    }
}

/**
 * 判断当前用户是否为游客
 * @return {boolean}
 */
Auth.guest = function guest() {
    if (!Data.user) {
        return true
    } else {
        return false
    }
}

/**
 * 获取当前登陆用户信息
 * @return {object}
 */
Auth.user = function user() {
    if (Data.user) {
        return Data.user
    } else {
        return null
    }
}

/**
 * 登陆
 * @return {Promise} 用户
 */
Auth.login = function login() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                const code = res.code
                wx.getUserInfo({
                    success: function(res) {
                        const iv = res.iv
                        const encryptedData = res.encryptedData
                        wx.request({
                            url: API_HOST + 'api2/auth.signon.json',
                            method: 'POST',
                            data: {
                                // appid: APP_ID,
                                code: code,
                                iv: iv,
                                encrypted_data: encryptedData
                            },
                            success: function(res) {
                                Data.user = {
                                    openid: res.data.user.openid,
                                    nickname: res.data.user.nickname,
                                    gender: res.data.user.gender,
                                    avatar: res.data.user.avatarurl
                                }
                                Data.token = res.data.access_token
                                Data.expired_in = Date.now() + parseInt(res.data.expired_in, 10) * 1000 - 60 * 1000
                                wx.setStorageSync('user', Data.user)
                                wx.setStorageSync('token', Data.token)
                                wx.setStorageSync('expired_in', Data.expired_in)
                                getApp().globalData.userInfo = Data.user
                                console.log('登录成功')
                                resolve(Data)
                            },
                            fail: function(res) {
                                console.log('登录失败', res)
                                reject(res)
                            }
                        })
                    },
                    fail: function(err) {
                        console.log('用户信息获取失败', err)
                        reject(err)
                    }
                })
            }
        })
    })
}

/**
 * 注销
 * @return {boolean}
 */
Auth.logout = function logout() {
    wx.removeStorageSync('user')
    wx.removeStorageSync('token')
    wx.removeStorageSync('expired_in')
    Data.user = null
    Data.token = ''
    Data.expired_in = 0

    return true
}

/**
 * 获取token
 * @return {string}
 */
Auth.token = function token() {
    if (Data.token) {
        return Data.token
    } else {
        return ''
    }
}

/**
 * 判断token还是否在有效期内
 * @return {boolean}
 */
Auth.check = function check() {
    if (Auth.user() && Date.now() < Data.expired_in && Data.token) {
        return true
    } else {
        return false
    }
}

/**
 * 验证当前授权是否有效, 无效则重新登录
 * @return {Promise} 用户
 */
Auth.checkOrLogin = function checkOrLogin() {
    if (Auth.check()) {
        return Promise.resolve(Auth.user())
    } else {
        return Auth.login()
            .then(data => {
                return data.user
            })
    }
}

module.exports = Auth