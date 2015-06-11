var express = require("express");
var util = require("util");
var router = express.Router();

/** Get json linster*/
router.get("/", function(req, res){
	
	var data = {
		name: "小红", 
		age: 23,
		sex: "boy"
	};
	// res.jsonp能自动判断是否有callback参数
	// 进而是否封装callback成为函数
	// 可以通过 app.set("jsonp callback name", "cb"); 设置默认回调
	res.jsonp(data);
	/*
	var query = req.query;
	if(query.callback){
		res.jsonp(data);
	}else{
		// 使用jsonp小心了，不能设置res.writeHeader的说...
		res.writeHeader(200, {
			"Content-Type": "text/javascript;charset=UTF-8"
		});
		res.write(JSON.stringify(data));
	};
	*/
	res.end("");
	
});

module.exports = router;
