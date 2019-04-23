const multer = require("koa-multer");
const { join } = require("path");

let storage = multer.diskStorage({
    //位置
    destination: join(__dirname,"../public/avatar"),
    filename(req,file,cb){
        //console.log(file);
        const filename = file.originalname.split(".");
        cb(null,`${Date.now()}.${filename[filename.length-1]}`)
    }
});

module.exports = multer({ storage });