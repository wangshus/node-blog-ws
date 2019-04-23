# nodejs学习

``` js
//音乐
//https://api.atoz.ink/query/%E5%A4%8F%E5%A9%89%E5%AE%89
//https://api.atoz.ink/song_url/003F4DFH2OVUaw
CommonJS就是为JS的表现来制定规范，因为js没有模块的功能所以CommonJS应运而生，它希望js可以在任何地方运行，不只是浏览器中。
 
CommonJS定义的模块分为:{模块引用(require)} {模块定义(exports)} {模块标识(module)}
require()用来引入外部模块；exports对象用于导出当前模块的方法或变量，唯一的导出口；module对象就代表模块本身。
```

```js 
npm -v 版本查询
npm init 初始化  快速: npm init -y  创建node时的第一步
npm install(i) 安装依赖
npm install -g 全局安装(任意文件夹都可以使用)
npm install --save(-S) 安装到生产环境--开发和上线后都要使用, 在package.json的 dependencies里面可以看到相应信息
npm install --save-dev(-D) 安装到开发环境,上线不需要 , 在devDependencies

//上传demo到npm官网
npm login 然后按提示输入用户名和密码
npm public 上传当前文件夹的内容,上传后30分钟可以删除,以后就不能删除
npm unpublic xxx -f 删除上传的

//npm淘宝镜像,可以解决国内下载缓慢
npm install -g cnpm --registry=https://registry.npm.taobao.org
//需要用到的模块
npm i -S event       //事件监听
npm i -g nodemon     //安装自动重启服务器工具 
npm i -g fanyi       //安装翻译软件
npm i -S koa@latest  //http依赖
npm i -S koa-router  //处理路径
npm i -S koa-multer  //上传文件
npm i -S koa-body    //处理post请求参数,上传文件
npm i -S superagent  //request请求依赖
npm i -S superagent-charset  //设置编码格式
npm i -S cheerio     //字符串转成html操作
```



### 模块导入和输出

```js
1. nodejs里面的全局变量是 global,定义全局变量 global.a = 1;
2. 文件夹 ./当前文件夹 ../上一个文件夹  /服务器根目录
3. 模块引用 let obj = require("./index.js"),".js"可以省略 require("./index"),"./"一定要加,因为require("index.js")只允许引用核心模块或者第三方库,自己写的不行

4. 模块输出 let a = 2; 级module.exports = { a:a }; 每个页面都有一个module对象,module.exports就是导出的数据,可以是对象,字符串,函数等
注意: 1. module.exports是对象,可以使用 module.exports.a=1 来扩展 module.exports.b=fn;
	 2. global.exports引用了  module.exports,即 global.exports = module.exports;所以可以直接使用 exports.a = 1,但是不能直接 exports=1;这样就覆盖了 global.exports引用module.exports.
```

### 事件循环

``` js
//js都是都是同步的,但里面的函数是异步的 ,都是在同步函数之后执行
setImmediate( function(){concsole.log(1)} )
promise.resolve("3").then(res => concsole.log(res))
process.nextTick( function(){concsole.log(4)} )
setTimeout(console.log(5),0)
console.log(2)
//输出 2 4 3 1
//同一个级别
script > process.nextTick > promise.resolve > setTimeout,setInterval > setImmediate >I/O

```

https://www.wangw.club/images/node/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF.PNG

### npm events模块

```js
//events模块是核心模块,直接引用不需要加路径
const EventEmitter = require("events").EventEmitter;
//实例化
const myEvent = new EventEmitter();
//回调函数
const fn = function () { console.log("这是异步回调函数") };
//异步代码
setTimeout(function () {
    //发送event
    myEvent.emit("mm");
},2000);
//监听event,两种功能一样,on是简写
myEvent.on("mm",fn);
myEvent.addListener("mm",fn);
//内置事件,每次 myEvent 绑定时触发
myEvent.on("newListener",function () {
    console.log("绑定新事件")
});
//一次性事件
myEvent.once("gg",fn);
```

```js
//自定义
const EventEmitter = require("events").EventEmitter;
const Fn = function (name) {
    this.name = name;
};
//继承方法1
Fn.prototype.__proto__ = EventEmitter.prototype;
const  obj = new Fn("你好");
//继承方法2
//obj.__proto__ = EventEmitter.prototype;
obj.on("mm",function () {
    //this指向obj
    console.log(this.name)
});
setTimeout(function () {
    obj.emit("mm");
},1000);
```

```js
emitter.getMaxListeners()//当前的监听器最大限制数的值
emitter.setMaxListeners(n)//默认10个,可以设置无限个Infinity,实际数目大于设置数目,以实际为准
emitter.listeners(eventName)//返回事件的回调函数,多个会放在数据里面
emitter.listenerCount(eventName)//监听名为 eventName 的事件的监听器的数量。
```

### path模块

```js
__dirname//当前模块的文件夹名称
__filename//当前模块的文件名称---解析后的绝对路径。

path.join("a","b","..")//拼接地址,自动兼容不同方式的路径 ,加不加 / 都没有影响 ,会自己识别
//输出 a 因为..代表上一层
path.resolve("a","b")//返回绝对路径 
//输出 C:\xampp\htdocs\node\node01\a\b
path.resolve("a","/b") //注意a,b前面不加 / ,/表示根目录,加了就从加了这里开始
//输出 C:\b
console.log(path.parse(__dirname));//输出一个对象,五个属性
{ root: 'C:\\',
  dir: 'C:\\xampp\\htdocs\\node\\node01',
  base: 'path.js',
  ext: '.js',
  name: 'path' }


const { join } = require("path");//利用结构赋值取一个方法

```

### URL模块

``` js
URL模块有node自己写的和WHATWG URL API的,WHATWG URL API是通用化的,所以这里使用WHATWG URL API
//引入
const { URL } = require("url");//结构赋值
//或者
const URL = require("url").URL;//普通
//这里的 URL 是一个构造函数,如下就格式化了url,一般手动去掉 ?
let myurl = new URL("https://www.baidu.com/s?wd=webstorm")
querystring.parse(myurl.search.slice(1));//.slice(1)去掉第一位
querystring.stringify(obj)//将对象转为url
//resolve 也是解析路径
const {resolve} = require("url");
resolve("usr/local","node") // usr/node
resolve("usr/local/","node") // usr/local/node
resolve("usr/local","/node") // /node
resolve("usr/local","./node") // usr/node
resolve("usr/local","../node") // node
//
```

### 断言

```js
//asset
asset(false,"如果第一个参数不为true,这就是报错信息");
asset.ok(true,"如果第一个参数不为true,这就是报错信息");
asset.equal(true,3,"如果第一个参数不等于第二个,这就是报错信息");
//注:1.有数字一般转为数字 2.asset.equal里面使用的是 == 
asset.strictEqual(3,3,"如果第一个参数不等于第二个,这就是报错信息");
//asset.equal里面使用的是 ===
asset.deepEqual({a:1},{a:"1"},"两个对象键和值不一一对应,不严格模式,报错");
asset.deepStrictEqual({a:1},{a:"1"},"两个对象键和值不一一对应,这就是报错信息");
//用处
try{
    asset.deepStrictEqual({a:1},{a:"1"},"信息");
    console.log("相等执行这里")
} catch (e) {
    console.log("不相等执行这里")
}
```

### 加密

```js
//加密
const crypto = require("crypto");
let str = "wangshu is handsome";
const key = "god";
//加密方式 key
let obj = crypto.createHmac("sha256",key);
//加密内容
obj.update(str);
//输出格式
const pass = obj.digest("hex");
console.log(pass);
```

### fs文件操作模块

```js
const fs = require("fs");
//规则1:I/O操作都是异步的,在api后面添加Sync就是同步的
//规则2:错误回调一般是第一个参数
//读文件
//1.异步
fs.readFile("./1.txt",'utf8',function (err,data) {
    if (err) return;
    console.log(data+"")
});
//2.同步
let da = fs.readFileSync("./1.txt",'utf8');
console.log(da);

//写文件
//异步
fs.writeFile("./2.txt","欢迎来到新世e界eee","utf8",function (err) {
    if (err)throw new Error("写入失败");
    console.log("写入成功")
});
//同步
fs.writeFileSync("./3.txt","欢迎来到新世e界eee","utf8");

//判断文件(文件夹)存在性,用同步的
console.log(fs.existsSync("./node"));

//创建文件夹
fs.mkdir("./test",function (err) {
    if (err) throw err
});

//读取文件夹
fs.readdir("./node",function (err,data) {
    console.log(data);//所有文件在数组里面
});

//判断是不是文件(文件夹)
const stau = fs.statSync("./4.txt");
console.log(stau.isFile());
console.log(stau.isDirectory());

//监听文件改变
fs.watchFile("./4.txt",(c,p) => {
    console.log(c);//当前文件信息
    console.log(p);//修改前文件信息
});
fs.writeFileSync("./4.txt","你好","utf8");//改变文件
```

### stream--流

```js
const fs = require("fs");
//利用流分步读取文件
//创建流(静止的流)
const st = fs.createReadStream("./4.txt");
//st.resume();//让流释放(没什么用)
st.setEncoding("utf8");//设置编码格式
//让流流动,并读取
st.on("data",function (data) {
    console.log(data)
});
//监听结束
st.on("end",function () {
    console.log("读取结束")
});
//复制文件-------流stream
const read = fs.createReadStream("./1.txt");//静止的读取流
const write = fs.createWriteStream("./2.txt");//写入流
read.pipe(write);//数据从左到右

//直接用stream
const fs = require("fs");
const Readable = require("stream").Readable;
const write = fs.createWriteStream("5.txt");//创建写入流
let ra = new Readable;//实例化流
ra.setEncoding("utf-8");
ra.push("1");
ra.push("2");
ra.push(null);//push完后一定要push(null)表示关闭流
ra.pipe(write);//写入到文件
ra.pipe(process.stdout);//打印到控制台
```



### 服务器配置

```js 
//使用 npm i -g nodemon 安装自动重启服务器工具 ,启动服务器使用 nodemon app.js 代替 node app.js
//使用 npm i -g fanyi 安装翻译软件,fy love 翻译 love

//引用http
const http = require("http");
//创建服务
const server = http.createServer((req,res) => {
    //设置请求头 1.请求状态 2.内容格式 3.内容编码 
    res.writeHeader(200,{"Content-Type":"text/plain;charset=utf8"});
    //write返回数据,可以调用很多次
    res.write("你好");
    //1.结束响应,后面的代码不执行,不结束客户端会一直转
    //2.最后输出,只能字符串
    res.end("可以");
});
//监听端口
server.listen(3000);

//注意:设置text/plain不会解析标签,text/html解析
```

### 服务器request请求

```js
//
```



### http

```js
//返回页面的
//方法1--同步方法
res.write(fs.readFileSync("./index.html"));
res.end();
//方法2--异步方法
fs.readFile("./index.html",(err,data) => {
    res.write(data);
    res.end();//此时res.end()要放到这里,
});
//res.end();不能写到这里
//方法3--管道流
fs.createReadStream("./index.html").pipe(res);
res.end();
```



## 简单的服务器跨域请求

跨域问题是浏览器拦截的,与服务器无关,理论上数据请求到了,但是被浏览器给过滤掉了

```js
//自己的服务器

const http = require("http"),
    request = http.request;

//配置信息
const options = {
    host:"127.0.0.1",
    port:3000,
    method:"get",
    path:"/"
};

//请求没有设置允许所有请求的服务器的数据
const fn = function (response) {
    let datas = {};
    let requestObj = request(options,res => {
        res.setEncoding("utf8");
        res.on("data",data => {
            datas = data;
        });
        res.on("end",()=>{
            response.write(datas);
            response.end();
            console.log("结束");
        })
    });
    requestObj.on("error",(err)=>{
        console.log(err)
    });
    requestObj.write("111");
    requestObj.end();
};

//客服端连接
const server = http.createServer((req,res) => {
    //允许所有的请求
    res.setHeader("Access-Control-Allow-Origin","*");
    //设置编码格式
    res.writeHeader(200,{"Content-Type":"text/plain;charset=utf8"});
    fn(res);
    //res.write(JSON.stringify(obj));
    //res.end();
});

//监听端口
server.listen(3001,() => {
    console.log("监听3001端口");
});
```

```js
//数据源服务器
const http = require("http");
const server = http.createServer((req,res) => {
    //因为没有允许所有请求,所以前端页面请求不到数据
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.writeHeader(200,{"Content-Type":"text/plain;charset=utf8"});
    const obj = {
        a:1,
        b:2
    };
    res.write(JSON.stringify(obj));
    res.end();
});
server.listen(3000,() => {
    console.log("监听3000端口");
});
```

```js
//前端js请求
$(document).click(()=>{
    $.ajax({
        method:"get",
        url:"http://127.0.0.1:3001",
        success:(data)=>{
            console.log(data);
        }
    })
});
```

## koa模块( 服务器框架 )

基本思想

```js
//安装依赖
//http依赖
npm i -S koa@latest 
//request请求依赖
npm i -S superagent
//字符串转成html操作
npm i -S cheerio
//接收的参数
ctx.query //返回字符串 {aa:5,bb:8}
ctx.querystring  //返回查询字符串 aa=5&bb=8
//返回内容
ctx.body = "欢迎";//只能是字符串,一般会默认自动转换
//中间件之间的数据传递
ctx.state
```

```js
const Koa = require("koa");
//实例化Koa
let app = new Koa;
//使用中间件 , 这里规定使用异步函数 , 多个中间件 会被存到数组里面 [中间件1,中间件2,中间件3] ,第一个会首先得到控制权
//ctx是上下文 , 包含node里面的 req res等,next是函数,指向下一个
//中间件1
app.use(async (ctx,next) => {
    console.log("中间件1接收");
    //async函数要使用await
    await next();//将控制权给到下一个 , 如果没有 ,就不执行后面的中间件 , 后面的执行完了自动返回控制权
    console.log("中间件1响应");
});
//中间件2
app.use(async (ctx,next) => {
    console.log("中间件2接收");
    await next();
    console.log("中间件2响应");
});
//中间件3
app.use(async (ctx,next) => {
    console.log("中间件3接收");
    await next();//如果是最后一个,则next()无效
    console.log("中间件3响应");
});
app.listen(3000);
```

基本用法

```js
//ctx.body用于返回数据 , 不是字符串会被自动转化为字符串
const Koa = require("koa");
let app = new Koa;
app.use(async (ctx,next) => {
    console.log(ctx);
    ctx.body = "第一次";
    ctx.body += {a:1};
});
```

```js
//不要使用原声 node 的属性
ctx.res Node 的 response 对象.
绕过 Koa 的 response 处理是 不被支持的. 应避免使用以下 node 属性：
res.statusCode
res.writeHead()
res.write()
res.end()
//使用如下替换
1. ctx.request  koa 的 Request 对象.

ctx.header
ctx.headers
ctx.method
ctx.method=
ctx.url
ctx.url=
ctx.originalUrl
ctx.origin
ctx.href
ctx.path
ctx.path=
ctx.query
ctx.query=
ctx.querystring
ctx.querystring=
ctx.host
ctx.hostname
ctx.fresh
ctx.stale
ctx.socket
ctx.protocol
ctx.secure
ctx.ip
ctx.ips
ctx.subdomains
ctx.is()
ctx.accepts()
ctx.acceptsEncodings()
ctx.acceptsCharsets()
ctx.acceptsLanguages()
ctx.get()

2. ctx.response koa 的 Response 对象.

ctx.body
ctx.body=
ctx.status
ctx.status="200"
ctx.message
ctx.message=
ctx.length=
ctx.length
ctx.type="text/html"
ctx.type
ctx.headerSent
ctx.redirect()
ctx.attachment()
ctx.set()
ctx.append()
ctx.remove()
ctx.lastModified=
ctx.eta
```

### 下载图片

```js
const Koa = require("koa");
const request = require('request');
const fs = require("fs");
const app = new Koa;

app.use( async (ctx) => {
    ctx.type = 'image/jpg';
    let a= await new Promise ((resolve) => {
        request
            .get('http://www.wangw.club/images/jiaR.jpg')
            .on('error', function(err) {
                console.log(err);
            })
            .pipe(ctx.res)//传给客服端
            // .pipe(fs.createWriteStream("1.jpg"));//写入到本地
    });
});

app.listen(3000,()=>{
    console.log("监听3000成功")
});
```

```js
//简单方式
http.createServer(function (req, resp) {
    const x = request('http://www.wangw.club/images/jiaR.jpg');
    req.pipe(x);
    x.pipe(resp);
}).listen(3001);
```



### 简单爬虫

```js
//依赖
//npm i -S superagent  http请求
//npm i -S superagent-charset  设置编码格式
//npm i -g nodemon  工具自动刷新服务器
//npm i -S cheerio  操作DOM结构


const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require("cheerio");
const Koa = require("koa");
const join = require("path");
const {resolve} = require("url");

let app = new Koa();
let data_need = {
    name:"",
    price:"",
    img:""
};

app.use( async (ctx ,next) => {
    ctx.set("Access-Control-Allow-Origin","*");
    const data_url = ctx.request.query.dataurl;
	//await 后面必须是Promise
    await new Promise((resolve) => {
        superagent.post(data_url)
            .charset('gbk')
            .end((err,data) => {
                const $ = cheerio.load(data.text);
            	//find() 查询后代
                data_need.name = $("#name").find(".sku-name").text().trim();
                data_need.img = $("#spec-n1 img").attr("src").trim();
                data_need.price = $("#jd-price").text().trim();
                // console.log(data_need);
                resolve(data_need);
            });
    });
    ctx.body = data_need;
});

app.listen(3000);//设置监听端口
```

### koa-router

```js
//请求方式代表(约定俗称,降低交流成本)
get    查找
post   增加
put    修改
delete 删除
```

### koa-static静态资源管理

koa-router里面的网页如果有引用外部.css .js文件,也是要设置路径管理的,一般用框架koa-static

```js
//每个资源都要请求,所以要使用静态资源管理
//绑定静态资源目录,后面取都是以static为根目录
app.use(koa_static(join(__dirname,"static")));
//引用方法,必须从根目录起
<link rel="stylesheet" href="/css/common.css">
```

### koa-body处理post请求数据,文件上传

```js
//post请求数据处理,把数据整理在 ctx.request.body
app.use(koa_body());
```

#### 基础用法

```js
const Koa = require("koa"),
    Router = require("koa-router");

let app = new Koa();
let router = new Router();

//利用router实现 不同请求方式 不同功能
//router.get 第一个参数:路径 后面的是中间件,可以多个
router.get("/",async (ctx,next) => {
    console.log("1请求");
    next();
    console.log("1响应");
    ctx.body="1";
},async (ctx,next) => {
    console.log("2请求");
    next();
    console.log("2响应");
});

router.get("/home",async (ctx,next) => {
    ctx.body="<h1>home</h1>";
});
//把koa-touter绑定到 koa
app
    .use(router.routes())
    .use(router.allowedMethods());
//设置监听端口
app.listen(3000);
```

#### 一般用法

```js
//----------koa-router.js----------

const Koa = require("koa");
//绑定静态资源
const koa_static = require("koa-static");
//处理 post 请求数据,把数据整理在 ctx.request.body 下面
const koa_body = require("koa-body");
//解决跨域方法
const cors = require('@koa/cors');
//url格式化
const {join} = require("path");
//引用当前目录的router.js
const router = require("./router");
//实例化
const app = new Koa();
//绑定静态资源目录,后面取都是以static为根目录
app.use(koa_static(join(__dirname,"static")));
//post请求数据处理,把数据整理在 ctx.request.body
app.use(koa_body());
//引用解决跨域
app.use(cors());
//引用路由:把koa-router绑定到 koa (这一步放到最后)
app
    .use(router.routes())
    .use(router.allowedMethods());
//设置监听端口
app.listen(3000);

//----------router.js---------------

const Router = require("koa-router");
const admin = require("./admin");
const router = new Router();
//利用router实现 不同请求方式 不同功能
//router.get 第一个参数:路径 后面的是中间件,可以多个
router.get("/",admin.root);
router.get("/home",admin.home);
router.get("/user",admin.user);
router.post("/showData",async (ctx) => {
    //跨域解决方法2
    //ctx.set("Access-Control-Allow-Origin","*");
    //post发送过来的数据ctx.request.body
    console.log(ctx.request.body);
    ctx.body = ctx.request.body
});
//导出
module.exports = router;

//------------admin.js------------

//读取文件模块,直接引用
const fs = require("fs");
exports.root = async (ctx) => {
    //要设置编码格式
    ctx.body = fs.readFileSync("./htmlfile/root.html","utf-8")
};
exports.home = async (ctx) => {
    ctx.body = fs.readFileSync("./htmlfile/home.html","utf-8")
};
exports.user = async (ctx) => {
    ctx.body = fs.readFileSync("./htmlfile/user.html","utf-8")
};
```

#### 图片上传1( koa-multer )

```js
//-----------------app.js---------------
//依赖 npm i -S koa koa-router koa-multer
const Koa = require('koa');
const Router = require('koa-router');
//文件上传的依赖
const multer = require('koa-multer');
const { join } = require('path');

const app = new Koa;
const router = new Router;

const storage = multer.diskStorage({
    // 存储的位置
    destination: join(__dirname, "upload"),
    // 文件名
    filename(req, file, cb){
        const filename = file.originalname.split(".");
        cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
    }
});

const upload = multer({storage});

router.post('/profile', upload.single('file'), async ctx => {
    ctx.body = {
        filename: ctx.req.file.filename
    }
});

//把koa-touter绑定到 koa
app
    .use(router.routes())
    .use(router.allowedMethods());
//设置监听端口
app.listen(3000);
```

```html
<!-----------text.html--------------->
<!--文件提交一定要设置  enctype="multipart/form-data"-->
<form action="http://127.0.0.1:3000/profile" method="post" enctype="multipart/form-data">
    <input type="file" name="file">
    <button>提交</button>
</form>
```

#### 图片上传2( koa-body )

```js
//文件存储的目录为/upload
const Koa = require('koa')
const koaBody = require('koa-body')
const { join } = require('path')

const app = new Koa

 //koaBody处理post数据时直接app.use(koaBody()),上传文件时要设置下面参数
app.use(koaBody({
  //上传文件必须为 true  
  multipart: true,
  formidable: {
    // 上传存放的路径
    uploadDir: join(__dirname, "upload"),
    // 保持后缀不变
    keepExtensions: true,
    // 文件大小(字节)1M=1024KB=1024*1024B
    maxFileSize: 1024000,
    onFileBegin: (name, file) => {
      // 取后缀  如：.js  .txt
      const reg = /\.[A-Za-z]+$/g
      const ext = file.name.match(reg)[0] 

      // 修改上传文件名
      file.path = join(__dirname, "upload/") + Date.now() + ext
    },
    onError(err){
      console.log(err)
    }
  }
}))
app.use(async (ctx) => {
  // 表单数据在body
  console.log(ctx.request.body)
  // 文件在files
  console.log(ctx.request.files)
  ctx.body = "上传成功"
})
app.listen(3002);
console.log("启动成功")
```

### git使用git网站上的包

```js
1.在git官网找到对应的包
2.点击clone or download
3.复制地址
4.在git命令里输入: git clone +地址
5.cd到下载的文件目录
6.输入: npm i 安装依赖
7.node xxx.js运行
```

### pug模板使用

```js
//npm i -S koa koa-router koa-views pug
//引用时只需要引用koa-views不用引用pug,配置views就可以
app.use(views(join(__dirname,"views"),{ extension:"pug"}));
//返回模板使用
await ctx.render("index");//返回模板,一定要加await,读取文件耗时操作
```

#### pug文件

```pug
//注意代码缩进严格要求
doctype html
html
    head
        title 雨觞舒成
        meta(charset="utf8")
    body
        //div可以省略
        .aaa#box 你好
        //- 后面写js代码
        -let bool = true
        div(class=bool?"bbb":"ccc") 欢迎
```

##### pug代码复用

```pug
//- index.pug
doctype html
html
  include includes/head.pug
  body
    h1 我的网站
    p 欢迎来到我这简陋得不能再简陋的网站。
    include includes/foot.pug
```

```pug
//- includes/head.pug
head
  title 我的网站
  script(src='/javascripts/jquery.js')
  script(src='/javascripts/app.js')
```

```Pug
//- includes/foot.pug
footer#footer
  p Copyright (c) foobar
```

##### pug继承

父级

```
//- layout.pug
html
  head
    title 我的站点 - #{title}
    block scripts
      script(src='/jquery.js')
  body
    block content
    block foot
      #footer
        p 一些页脚的内容
```

子集

```
//- page-a.pug
extends layout.pug
//需要提供给父级的两个 block
block scripts
  script(src='/jquery.js')
  script(src='/pets.js')

block content
  h1= title
  - var pets = ['猫', '狗']
  each petName in pets
    include pet.pug
```

```
//- pet.pug
p= petName
```

##### 混入

```pug
//- 定义
mixin list
  ul
    li foo
    li bar
    li baz
//- 使用
+list
+list
//可以传参list(arr)
```

##### js代码写在script下面,script后面要加 一个 "."

```
script.
  if (usingPug)
    console.log('这是明智的选择。')
  else
    console.log('请用 Pug。')
  document.onclick = function(){
      alert(1)
  }  
```



#### pug后台使用

```js
const Koa = require("koa");
const Router = require("koa-router");
//koa-views可以关联 pug ,不用直接引用 pug
const views = require("koa-views");
const { join } = require("path");

const app = new Koa;
const router = new Router;

router.get("/",async (ctx) => {
    //返回模板,一定要加await,读取文件耗时操作
    await ctx.render("index");
});

//配置koa-views,第一个参数为地址,第二个为指定文件类型
app.use(views(join(__dirname,"views"),{ extension:"pug"}));
//配置router
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000,function () {
    console.log("监听3000端口")
});
```

### mongoDB使用(需要配置环境变量)

```js
//启动服务端,并设置路径,默认路径在安装路径的data
mongod --dbpath webstorem/DB //服务端启动后不能关
//启动客服端,默认端口27017
mongo
//查看当前数据库
show dbs
//创建数据库/切换数据库
use yu//存在就切换,不存在就新建(不会显示空数据库)
//查看当前使用的数据库
db
//插入数据
db.yu.insert({"name":"wang"})
//删除数据库,删除停留在的那个
db.dropDatabase()
//创建集合
db.createCollection("css")
//显示集合
show collections
//删除集合
db.css.drop()
//插入数据
db.css.insert({"name":"yu"})
//查看数据
db.css.find()//不传参,,查所有
db.css.find({"name":"yu"})
db.css.find().pretty()//格式化json数据
//更新数据
db.css.update({"name":"yu"},{$set:{age:"18"}})//修改第一条满足条件的
db.css.update({"name":"yu"},{$set:{age:"18"}},{multi:true})//修改所有满足条件的
//---第一true是插入,false更新 ,第二个true表示全部,false第一条
db.css.update({"name":"yu"},{$set:{age:"18"}},true,true );
//删除数据(文档)
db.css.deleteOne({"name":"afei"})//删除第一个满足条件
db.css.deleteMany({"name":"afei"})//删除所有满足条件
db.css.deleteMany({})//删除所有
//删除文档后并不会真正释放空间
db.repairDatabase()//释放空间
//条件查询
> - $gt;
< - $lt;
>= - $gte;
<= - $lte
db.css.find({age : {$gt : 30}}) //Select * from css where age > 100;
```

### node使用mongo

```js
//依赖 npm i -S mongoose //操作mongo
//使用
const mongoose = require("mongoose");
//连接mongo数据库wang
const db = mongoose.createConnection("mongo://localhost:27017/wang",{useNewUrlParser:true});
```

## node实战

#### 动态路由

```js
router.get("user/:id",async (ctx) => {
    //"/user/:ws" 是动态路由,值会存在ctx.params里
    /*ctx.params = {
        //请求"user/login"
        id:login
    }*/
    ctx.body = ctx.params.ws
});
```

##### js的正则表达式的正则前瞻(?=)和非捕获性分组(?:)有什么区别?

```js
(?=)会作为匹配校验，但不会出现在匹配结果字符串里面
(?:)会作为匹配校验，并出现在匹配结果字符里面，它跟(...)不同的地方在于，不作为子匹配返回。
let data = 'windows 98 is ok';
data.match(/windows (?=\d+)/);  // ["windows "]
data.match(/windows (?:\d+)/);  // ["windows 98"]
data.match(/windows (\d+)/);    // ["windows 98", "98"]
```

##### layui使用

``` js
表单元素属性添加 required 就代表必须填写

//前提是你要加载element模块
layui.use('element', function(){
  var element = layui.element;
  
  //一些事件监听
  element.on('tab(demo)', function(data){
    console.log(data);
  });
});
```

##### 重定向

```js
页面重定向:
ctx.redirect("/");
前端:location.herf("/")
```

