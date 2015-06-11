var express = require('express');
var util = require('util');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/* for parsing multipart/form-data
var multer = require("multer");
*/
// 本机木有安装的说...
/*
var redis = require('redis'); // 使用redis缓存
var db = redis.createClient(); // 创建redis客户端
*/

var app = express(), blog = express(), blogAdmin = express();

app.use("/blog", blog); // 使用use，重设路径
blog.use("/admin", blogAdmin); // 使用use，重设路径

console.log("路径[app]:" + app.path());
console.log("路径[blog]:" + blog.path());
console.log("路径[blogAdmin]:" + blogAdmin.path());



// view engine setup
app.set('views', path.join(__dirname, 'views'));// 第二个参数，可为列表，引擎按顺序，寻找文件目录
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser("secret")); // 给cookie加个签名

app.use(express.static(path.join(__dirname, 'public')));
// 设置jsonp的回调名字
app.set('jsonp callback name', 'callback');
// 开启路由严格模式
// app.enable("strict routing"); /foo和/foo/不一样
// 开启匹配大小写模式
// app.enable("case sensitive routing"); /foo和/Foo不一样
// 开启view缓存，在生成环境默认true
// app.enable("view cache");


// http://lfp.xx.com/users/5601/
// 设置一些param，方便注入
// 访问 /range/123/ -> from 2 to 3
app.get('/range/:range', function(req, res, next){
  var range = req.params.range;
  res.send('from ' + range[1] + ' to ' + range[2]);
});

// 所有请求，都要经过
// app.all类似app.get，也支持param和正则
// app.all用来填写用户数据，也是不错的选择
app.all("*", function(req, res, next){
	console.log("all request will pass here~");
	next();
});

// 后面有":userId"的路由器，都会经过这里
app.param('userId', function (req, res, next, id) {
  console.log('userId is[from param]:' + req.params.userId);
  next();
});
// 加一个工具方法，让param支持正则定义，只有epxress 4.11之后才支持哦~
// 如果在纯粹定义的时候，还是蛮不错的
app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val) {
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});
app.param('id', /^\d+$/);

// 可以通过 :userId，先获取用户信息..
app.all("/users/:userId([0-9]+)/*", function(req, res, next){
	console.log("userId:" + req.params.userId);
	next(); // 如果没有next，不会进入到后面的规则
});
// 删除 和 更新方法..
app.put("/users/:userId/*", function(req, res, next){
	console.log("进来了put方法");
	res.send({code:0, userId: req.params.userId});
});
app.delete("/users/:userId/*", function(req, res, next){
	console.log("进来了DELETE方法");
	res.send({code:0, userId: req.params.userId});
});

app.post("/users/:userId/*", function(req, res, next){
	console.log("进来了post方法");
	res.send({code:0, userId: req.params.userId});
});

// 甚至我可以写成链式结构
/* 中间键也可以制定路径
app.use("/data", function(req, res, next){
	// 在中间件里send了，就不会进入到后面的逻辑
	res.send("Hello world!");
	next();
});
*/
app.route("/data").all(function(req, res, next){
	console.log("link 进入了这里...");
	next();
}).get(function(req, res, next){
	// 最终会到达这里
	res.jsonp({data: "小红帽会哭..."});
});


// 静态视图助手，好像不能用
/*
app.helpers({
	myName: "这是我的名字...: da宗熊"
});
*/


// locals变量，在所有模版中可见的
// 但是locals并不像文档说的，是个变量
app.locals.author = 'da宗熊';

// 一些外部的路由
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/json', require('./routes/json'));
app.use('/download', require("./routes/download"));
app.use('/ico', require("./routes/ico"));


// req.baseURL测试，就是use指定的链接
var greet = express.Router();
greet.get("/hi", function(req, res){
	console.log(req.baseUrl); // 打印基础链接
	res.send("这次的baseUrl:" + req.baseUrl);
});
app.use(['/gre+t', '/hel{2}o'], greet);

// req.body测试
// $.post("/body", {a:123, b:234}, function(data){console.log(data)});
app.post("/body", function(req, res){
	res.json(req.body);
});
// 只有post才有body哦~
app.get("/body", function(req, res){
	res.json(req.body);
});




// error handlers
// catch 404 and forward to error handler
// 如果前面有处理了，就不会跳转到这里的404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
