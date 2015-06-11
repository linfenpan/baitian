var http = require("http");

// 一个普通的服务器
// 一般服务器有两个事件 1、request 2、connection
var service = new http.Server();
service.on("request", function(req, res){

	req.on("data", function(chunk){
		console.log(chunk);
	});

	res.writeHead(200, {"Content-Type": "text/html", charset: "utf-8"});
	res.write("<meta charset='utf-8'/><h1>Hello Node.js</h1>");
	res.write("<p>这是内容..</p>");
	res.end(null); 
});
service.on("close", function(){
	console.log("GoodBye my page!", arguments);
});
service.listen(3000);
console.log("Http server is listening at port 3000.");
