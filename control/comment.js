const Article = require('../Models/article');
const User = require('../Models/user');
const Comment = require('../Models/comment');

exports.save = async ctx => {
    let message = {
        status: 0,
        msg: "登录才能发表"
    };
    //验证是否登录
    if(ctx.session.isNew)return ctx.body = message;
    //登录了
    const data = ctx.request.body;
    data.from = ctx.session.uid;
    const _comment = new Comment(data);
    await _comment
        .save()
        .then(data => {
            //console.log(data);
            message = {
                status: 1,
                msg: "评论成功"
            }

            //更新文章计数器
            Article
                .update({_id: data.article},{$inc: {commentNum: 1}}, err => {
                    if (err) console.log(err);
                    console.log("更新文章评论计数器成功")
                });
            //更新用户计数器
            User.update({_id: data.from},{$inc: {commentNum: 1}},err => {
                if (err) console.log(err);
                console.log("更新用户评论计数器成功")
            })
        })
        .catch(err=> {
            message = {
                status: 0,
                msg: err
            }
        } );
    ctx.body = message;
};

exports.comlist = async ctx => {
    //console.log(1);
    const uid = ctx.session.uid;
    //const data = await Comment.find({from: uid}).populate("article", "_id ")
    const data = await Comment.find({from: uid})
        .populate({
            path: "article",
            select: "title"
        })
        .then(data => data);
    //console.log(data);
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
};

// exports.del = async ctx => {
//     let commentId = ctx.params.id;
//     let articleId;
//     let uid ;
//
//     let isOk = true;
//
//     //获取评论信息
//     await Comment.findById(commentId, (err, data) => {
//         if (err) {
//             isOk = false;
//         } else {
//             articleId = data.article;
//             uid = data.from;
//         }
//     });
//     //文章评论计数器 -1
//     await Article.update({_id: articleId},{$inc: {commentNum: -1}});
//     //人物评论数 -1
//     await User.update({_id: uid},{$inc: {commentNum: -1}});
//     //删除评论
//     await Comment.deleteOne({_id: commentId});
//
//     if (isOk){
//         ctx.body = {
//             state: 1,
//             message: "删除成功"
//         }
//     }
// };


//删除评论
exports.del = async ctx => {
    let commentId = ctx.params.id;

    let res = {
        state: 1,
        message: "成功"
    };


    // 钩子函数只能监听 原型上面的方法
    //findByIdAndRemove 遇到 and...就不会触发钩子, 直接数据库操作
    //Comment.findByIdAndRemove(commentId).exec();
    await Comment.findById(commentId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: err
            }
        });


    ctx.body = res

};
