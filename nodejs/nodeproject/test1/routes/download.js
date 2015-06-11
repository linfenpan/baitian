var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next){
	/*
	res.attachment("./user.jpg"); // 设置为附件模式
	// 如果有参数，则会根据参数，进行附件类型判定
	res.sendfile("./user.jpg");
	*/
	// 上面两个，可以合成一个：
	res.download("./user.jpg", "图片.jpg", function(err){
		if(err){
			console.log("出错了...");
			next();
		}else{
			
		}
	});
});

module.exports = router;