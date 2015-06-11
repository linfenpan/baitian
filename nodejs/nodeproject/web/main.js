var http = require("http");
var url = require("url");
var querystring = require("querystring");
var util = require("util");

var fs = require("fs");

var server = new http.Server();
server.listen(3000, function(){
	console.log("listening 3000 port");
});
server.on("connection", function(){
	console.log("Link is connected...");
});
server.on("request", function(req, res){
	//console.log("connnect...");
	var method = req.method;
	switch(method){
		case "POST":
			method = "Post";
			break;
		case "GET":
			method = "Get";
			break;
		case "DELETE":
			method = "Delete";
			break;
		case "PUT":
			method = "Put";
			break;
	};
	
	var pathname = url.parse(req.url).pathname;
	
	res.writeHead(200, {"Content-Type": "text/html;charset=utf-8;"});
	
	res.write("pathname:" + pathname + "<br/>");
	// 如果是首页，则读取文件~
	if(pathname == "/"){
		fs.readFile("./index.txt", function(err, file){
			if(err){
				res.wreteHead(404);
				res.end("找不到文件。- -");
				return;
			}
			res.end(file);
		});
	}else{
		res.write("hello:" + method + "<br/>");
		var cookies = querystring.parse(req.headers.cookie);
		console.log(util.inspect(cookies));
		res.write("cookie:" + req.headers.cookie);
		res.end("\n");
	}
	
	
});


