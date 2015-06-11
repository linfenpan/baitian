var http = require("http");
var queryString = require("querystring");

// 请求参数
var contents = queryString.stringify({
	articleId:74610, pagerIndex:0, pagerSize:15
});

// 链接的参数
var options = {
	host: "qq.100bt.com",
	path: "/AjaxActComment.action", // 普通的queryString需要叠加在这里~
	method: "POST",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
		"Content-Length": contents.length
	}
};

// 建立请求
var req = http.request(options, function(res){
	res.setEncoding("utf-8");
	res.on("data", function(data){
		console.log(data);
	});
});

req.write(contents);
req.end();