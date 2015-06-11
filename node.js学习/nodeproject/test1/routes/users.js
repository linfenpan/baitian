var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get(/\/([^/]*)\/?$/, function(req, res, next) {
  if(!req.params[0]){
	// 如果没有userId，则跳转到下一个处理
    next(null);
	return;
  }
  req.cookies.sessionId = new Date()/1;
  res.writeHeader(200, {
	"Content-Type":"text/html;charset=UTF-8"
  });
  // 通过get的正则，获取第一个参数
  res.write("写一些内容:" + req.params[0]);
  res.end(null);
});

// 没有用户的时候...
router.get("/", function(req, res, next){
	res.send("写一些内容:没有用户");
});



module.exports = router;
