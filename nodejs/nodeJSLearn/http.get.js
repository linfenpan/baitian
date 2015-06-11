var http = require("http");

// 普通的Get请求，参数请参考http.request方法
var req = http.get({
	host: "my.100bt.com",
	path: "/AjaxGetUserInfoMap.action?userIdList=5601"
}, function(res){
	res.setEncoding("utf8");
	res.on("data", function(data){
		console.log(data);
	});
});