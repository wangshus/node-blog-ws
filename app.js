
const Koa = require("koa");
const router = require("./routers/router");
const koa_static = require("koa-static");
const views = require("koa-views");
const { join } = require("path");
const logger = require("koa-logger");
const koa_body = require("koa-body");
const session = require("koa-session");


//实例化Koa
const app = new Koa;

//CONFIG下面的signed需要app.keys
app.keys = ["wangshus"];
//session 配置
const CONFIG = {
    key: 'Sid',
    maxAge: 86400000,//过期时间
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, //是否每次刷新
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

//打印日志,必须第一个注册
//app.use(logger());
//配置session,类似于前端的 cookies
app.use(session(CONFIG,app));
//配置静态资源目录
app.use(koa_static(join(__dirname,"public")));
//配置视图模板
app.use(views(join(__dirname,"views"),{ extension:"pug"}));
//处理post请求数据
app.use(koa_body());



//注册路由模块
app
    .use(router.routes())
    .use(router.allowedMethods);
//监听端口
app.listen(3001,"127.0.0.1",function () {
    console.log("正在监听3001端口...");
});

//创建管理员用户
{
    const { db } = require("./Schema/config");
    const UserSchema = require("./Schema/user");
    const encrypto = require("./util/encrypt");
    //通过 db 创建一个可以操作 user 数据库的模型对象
    const User = db.model("users",UserSchema);

    User.find({username:"admin"})
        .then( data => {
            if (data.length === 0){
                //管理员不存在,就创建
                new User({
                    username: "admin",
                    password: encrypto("ws15123"),
                    role: 666,
                    commentNum: 0,
                    articleNum: 0
                })
                    .save()
                    .then( data => {
                        console.log("管理员名为: admin")
                    })
                    .catch(err => {
                        console.log("检查管理员失败")
                    })
            } else {
                console.log("管理员名为: admin")
            }
        })

}