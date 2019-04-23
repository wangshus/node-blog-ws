const { db } = require("../Schema/config");

const ArticleSchema = require("../Schema/article");
const Article = db.model("articles",ArticleSchema);

//导入用户UserSchema,为了操作用户表,取出用户头像
const UserSchema = require("../Schema/user");
const User = db.model("users",UserSchema);

const CommentSchema = require("../Schema/comment");
const Comment = db.model("comments",CommentSchema);

const fs = require("fs");
const { join } = require("path");

exports.index = async ctx =>{
    //没有登录
    if (ctx.session.isNew){
        ctx.status = 404;
        return await ctx,render("404",{title: "404"})
    }
    //登陆了
    const _id = ctx.params.id;

    const arr = await fs.readdirSync(join(__dirname,"../views/admin"));
    let flag = false;//是否匹配到路由
    arr.forEach( v => {
        let name = v.replace(/(^admin-)|(\.pug$)/g,"");
        //console.log(name);
        if (name === _id){
            //循环里面不能写 await 函数
            flag = true;//用开关
        }
    });
    if (flag) {
        await ctx.render("./admin/admin-"+_id,{
            role: ctx.session.role
        })
    } else {
        ctx.status = 404;
        await ctx.render("404",{title: "404"})
    }

    //console.log(arr);
};