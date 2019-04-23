const Article = require('../Models/article');
const User = require('../Models/user');
const Comment = require('../Models/comment');


//返回文章发表页
exports.addPage = async ctx => {
    await ctx.render("add-article",{
        title:"添加文章",
        session:ctx.session
    });
};


//发表文章,保存到数据库
exports.add = async ctx => {
    //没有登录
    if (ctx.session.isNew){
        return ctx.body = {
            msg:"用户未登录",
            status:0
        }
    }
    //登录了
    const data = ctx.request.body;

    //取出用户名
    data.auther = ctx.session.uid;
    data.commentNum = 0;

    await new Promise((resolve,reject) => {
        //保存到数据库
        new Article(data)
            .save( (err,dat) => {//可以用回调函数形式, 也可以用 .then(),但是只能用一种,不然保存两次
                if (err) return reject(err);
                //更新用户文章计数
                //console.log(dat);
                User.update({_id: dat.auther},{$inc: {articleNum: 1}}, err => {
                    if (err) return console.log(err);
                    console.log("更新文章计数成功")
                });

                resolve(dat)
        })
    })
        .then( res => {
            ctx.body = {
                msg: "发表成功",
                status:1
            }
        })
        .catch( err => {
            ctx.body = {
                msg: "发表失败",
                status:0
            }
        } )

};

//获取文章列表
exports.getLists = async ctx => {
    let page = ctx.params.id || 1;
    page--;
    const num = 5;
    const maxNum = await Article.estimatedDocumentCount( (err,num) => err?console.log(err):num );//获取总数目
    //所有的查询在没有回调之前不会执行,exec() 占门用来执行的,也需要回调
    const artList = await Article
        .find()
        .sort("-created") //以哪个字段排序 默认升序 -代表降序
        .skip(page*num)   //从第几条开始取(跳过多少条)
        .limit(num)       // 取多少条
        .populate({
            path:"auther", //Schema里面已经写了文章表里面的auther与users表的id关联
            select:"username _id avatar" //选择要查询的字段,以空格隔开
        })       // 连表查询
        .then( data => data )
        .catch( err => err );
    //console.log(artList);
    // console.log(artList[0].auther);
    // .exec(data => {});
    await ctx.render("index",{
        title: "博客首页",
        session: ctx.session,
        artList,
        maxNum
    })
};

//文章详情
exports.details = async ctx => {
    //取到id;
    const _id = ctx.params.id;
    const article = await Article.findById(_id) //通过 id 获取的是一个对象, 而其他是 一个数组
        .populate({
            path: "auther",
            select: "username"
        })
        .then(data => data);

    const comment = await Comment
        .find({article: _id})
        .sort("-created")
        .populate("from","username avatar")
        .then( data => data)
        .catch( err => {
            console.log(err);
        });

    await ctx.render("article",{
        article,
        session: ctx.session,
        comment
    });
};

// 返回用户所有文章
exports.artlist = async ctx => {
    const uid = ctx.session.uid;
    const data = await Article.find({auther: uid});
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
};

// 删除对应 id 的文章
exports.del = async ctx => {
    const _id = ctx.params.id;

    let res = {
        state: 1,
        message: "成功"
    };

    await Article.findById(_id)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: err
            }
        });

    ctx.body = res
};