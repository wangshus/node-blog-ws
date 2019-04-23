const crypto = require("crypto");

module.exports = function (password,key="wangshus") {
    //第一个参数是加密方式
    const hmac = crypto.createHmac("sha256",key);
    //加密数据
    hmac.update(password);
    //hex 代表16进制
    const passw = hmac.digest("hex");
    return passw
};