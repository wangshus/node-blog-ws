const Article = require('../Models/article');
const User = require('../Models/user');
const Comment = require('../Models/comment');
const encrypto = require("../util/encrypt");

//用户注册路由
exports.reg = async (ctx) => {
    const userIn = ctx.request.body;
    const username = userIn.username;
    const password = userIn.password;
    // 先检测数据库是否存在用户
    await new Promise((resolve,reject) => {
        User.find({ username } ,(err,data) => {
            //出错,返回错误
            if (err) return reject(err);
            //用户已存在
            if (data.length !== 0) return resolve("");
            //注册用户
            //加密后保存到数据库,encrypto是自定义加密模块
            const user_ = new User({
                username,
                password:encrypto(password),
                commentNum: 0,
                articleNum: 0
            });
            user_.save((err,data) => {
                if (err){
                    reject("")
                } else {
                    resolve(data)
                }
            })
        });
    }).then(async res => {
        if (res){
            //注册成功
            await ctx.render("isOk",{
                status:"注册成功"
            })
        } else {
            //用户名已存在
            await ctx.render("isOk",{
                status:"用户名已存在"
            })
        }
    }).catch(async err => {
        //注册失败
        console.log(err);
        await ctx.render("isOk",{
            status:"注册失败,请重试"
        })
    });
    console.log("这是处理用户注册的中间件");
};

//用户登录路由
exports.login = async (ctx) => {
    const userIn = ctx.request.body;
    const username = userIn.username;
    const password = userIn.password;
    await new Promise((resolve,reject) => {
        User.find({ username },(err,data) => {
            //不管错误还是用户名不存在 , 都到错误里处理
            if (err) return reject("");
            if (data.length === 0) return reject("用户名不存在");
            if(data[0].password === encrypto(password)){
                return resolve(data)
            }
            resolve("")
        })
    }).then( async res => {
        //res为空就是密码不正确
        if (!res){
            return await ctx.render("isOK",{
                status:"密码不正确"
            });
        }
        //登录成功就设置 cookies,记住登录状态
        //console.log(111);
        ctx.cookies.set("username",username,{
            domain:"127.0.0.1",//主机地址,只有访问次主机地址才会把次cookies带给主机
            path:"/",
            maxAge: 36e5,//过期时间
            httpOnly: false, // true 表示不让用户访问
            // signed: true,//默认 true 可以不写
        });
        //保存用户 _id
        //console.log(res);
        ctx.cookies.set("uid",res[0]._id,{
            domain:"127.0.0.1",//主机地址,只有访问次主机地址才会把次cookies带给主机
            path:"/",
            maxAge: 36e5,//过期时间
            httpOnly: false, // true 表示不让用户访问
            // signed: true,
        });


        //设置 session
        ctx.session = null;//强制清除session
        ctx.session = {
            username,
            uid:res[0]._id,
            avatar:res[0].avatar,
            role: res[0].role
        };


        await ctx.render("isOK",{
            status:"登录成功"
        })
    } ).catch( async err => {
        if (err){
            return await ctx.render("isOk",{
                status:"用户名不存在,请先注册"
            })
        }
        await ctx.render("isOk",{
            status:"登录失败,请重试"
        })
    } );
};

//保持用户登录
exports.keepLog = async (ctx,next) => {
    //ctx.session.isNew;//默认存在
    // console.log(ctx.session.isNew);
    if (ctx.session.isNew){
        if (ctx.cookies.get("username")) {
            let uid = ctx.cookies.get("uid");
            //查询头像
            let avatar = await User.findById(uid)
                .then(data => data.avatar);
            ctx.session = {
                username:ctx.cookies.get("username"),
                uid,
                avatar
            }
        }
    }
    await next();
};

//退出登录
exports.logout = async ctx => {
    //把session和cookies设置为null
    ctx.session = null;
    ctx.cookies.set("username","",{
        maxAge:0
    });
    ctx.cookies.set("uid","",{
        maxAge:0
    });

    //重定向到首页
    ctx.redirect("/");
};


//头像上传
exports.upload = async ctx => {
    const filename = ctx.req.file.filename;

    //更新用户头像
    let data = {};
    await User.update({_id: ctx.session.uid},{$set: { avatar: "/avatar/" + filename}},(err,date) => {
        if(err) {
            data = {
                status: 0,
                message: err
            }
        } else {
            data = {
                message: "上传成功",
                status:1
            }
        }
    });
    ctx.body = data;
};