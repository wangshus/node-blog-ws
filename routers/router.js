const Router = require("koa-router");

const router = new Router;

const user = require("../control/user");
const article = require("../control/article");
const comment = require("../control/comment");
const admin = require("../control/admin");
const upload = require("../util/upload");


router.get("/",user.keepLog, article.getLists);

// async (ctx) => {
//     //console.log(ctx.session)
//     await ctx.render("index",{
//         title:"雨觞舒成",
//         session:ctx.session
//     })
// }

//主要用来处理用户登录,注册
// router.get("/user/:ws",async (ctx) => {
//     //"/user/:ws" 是动态路由,值会存在ctx.params里
//     // ctx.params = {
//     //     //请求"user/login"
//     //     ws:login
//     // }
//     // ctx.body = ctx.params.ws
// });

router.get(/^\/user\/(?=reg|login)/,async (ctx) => {
    //show为true就是注册,false就是登录
    let show = /reg$/.test(ctx.path);

    await ctx.render("register",{ show });

});

//处理登录数据
// router.post("/user/login",async (ctx) => {
//     const user = ctx.request.body;
//     //先根据用户名查数据库,再根据用户名取密码
//     console.log("用户需要登录,登录信息:");
//     console.log(ctx.request.body)
//
// });

//处理注册数据
router.post("/user/reg",user.reg);
//处理登录据
router.post("/user/login",user.keepLog,user.login);

//处理登录据
router.get("/user/logout",user.logout);

//发表文章页
router.get("/article",user.keepLog,article.addPage);

//发表文章
router.post("/article",user.keepLog,article.add);

//文章分页
router.get("/page/:id",article.getLists);

//文章详情页
router.get("/article/:id",user.keepLog,article.details);

//添加评论
router.post("/comment",user.keepLog,comment.save);

//个人中心
router.get("/admin/:id",user.keepLog,admin.index);



//头像上传
router.post("/upload",user.keepLog,upload.single("file"),user.upload);
//获取评论
router.get("/user/comments",user.keepLog,comment.comlist);
//删除评论
router.del("/comment/:id",user.keepLog,comment.del);
// 获取用户的所有文章
router.get("/user/articles", user.keepLog, article.artlist);
// 后台：删除用户评论
router.del("/article/:id", user.keepLog, article.del);



//404
router.get("*",async ctx => {
    await ctx.render("404",{title: "404"})
});
module.exports = router;