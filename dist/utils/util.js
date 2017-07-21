function getToken() {
    return wx.getStorageSync('token')
};
/* 转换时间格式 */
function timeToString(duration) {
    let str = '';
    let minute = parseInt(duration / 60) < 10 ?
        ('0' + parseInt(duration / 60)) :
        (parseInt(duration / 60));
    let second = duration % 60 < 10 ?
        ('0' + duration % 60) :
        (duration % 60);
    str = minute + ':' + second;
    return str;
}

module.exports = {
    getToken: getToken,
    timeToString: timeToString,
}