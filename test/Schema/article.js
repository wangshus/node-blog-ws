const { Schema } = require("./config");

// ObjectId 是mongodb特殊唯一的类型,只能通过 Schema.Types.ObjectId 获取
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
    title:String,
    content:String,
    auther:{
        type:ObjectId,
        ref:"users" //关联users表,此值是 const User = db.model("users",UserSchema)里面的那个值
    },
    commentNum:Number,
    tips:String
},{ versionKey: false , timestamps:{
        createdAt:"created"
    }
});


ArticleSchema.post('remove', doc => {
    const Comment = require('../Models/comment');
    const User = require('../Models/user');

    const { _id:artId, auther: authorId } = doc;

    // 只需要用户的 articleNum -1
    User.findByIdAndUpdate(authorId, {$inc: {articleNum: -1}}).exec();
    // 把当前需要删除的文章所关联的所有评论  一次调用 评论 remove
    Comment.find({article: artId})
        .then(data => {
            data.forEach(v => v.remove())
        })
});

module.exports = ArticleSchema;