const { Schema } = require("./config");

// ObjectId 是mongodb特殊唯一的类型,只能通过 Schema.Types.ObjectId 获取
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
    //头像,用户名,文章,时间,内容
    content:String,
    from:{
        type:ObjectId,
        ref:"users" //关联users表,此值是 const User = db.model("users",UserSchema)里面的那个值
    },
    article:{
        type:ObjectId,
        ref:"articles"
    }
},{ versionKey: false , timestamps:{
        createdAt:"created"
    }
});

//设置comment里面的钩子, 钩子函数只能监听 原型上面的方法
//pre钩子可以设置多个,用 next() 传递控制权
// CommentSchema.pre("remove",function(next){
//     //this 指向文档, 要操作的数据, 有this 指向,就不能用箭头函数
// });
//post钩子在所有前置钩子最后运行,只有一个
CommentSchema.post("remove",(document) => {
    //document就是文档, 相当于pre里面的this
    //在文档删除之前触发
    const Article = require('../Models/article');//避免相互引用出问题,所以在这里引用
    const User = require('../Models/user');

    const { from, article } = document;

    // 对应文章的评论数 -1
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec();
    // 当前被删除评论的作者的 commentNum -1
    User.updateOne({_id: from}, {$inc: {commentNum: -1}}).exec()
});


module.exports = CommentSchema;