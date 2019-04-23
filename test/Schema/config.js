//连接数据库
const mongoose = require("mongoose");

const db = mongoose.createConnection("mongodb://localhost:27017/blogproject",{ useNewUrlParser: true });

const Schema = mongoose.Schema;

//用原生的Promise 替代mongo的Promise
mongoose.Promise = global.Promise;

db.on("error",(err) => {
    console.log("连接数据库错误"+err)
});

db.on("open",() => {
    console.log("连接数据库成功")
});


module.exports = {
    db,Schema
};