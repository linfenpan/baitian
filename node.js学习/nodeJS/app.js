//app.js

var http = require('http');
//创建服务器
http.createServer(function(req, res){
	//设置请求头部
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write("<h1>Node.js</h1>");
	res.end("<p>Hello node.js</p>");
}).listen(3000);/*listen 创建了监听器，让node.js进程不会退出事件循环*/

//访问:http://127.0.0.1:3000/
console.log("HTTP server is listening at port:3000.");