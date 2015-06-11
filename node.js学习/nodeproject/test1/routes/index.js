var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/", function(req, res, next){
	// 改写这次res的临时变量.....
	// 因为name是加密的cookie，所以应该从加密的signedCookies中获取
	res.locals.myName = "这是我的名字:"+req.signedCookies.name+"...";
	next();
});
router.get('/', function(req, res, next) {
	// 通过append，可以往header里插入信息
	res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);

	res.append('Warning', '199 Miscellaneous warning');
  
  // 就是刚刚的res.append("Link")的简写
  res.links({
	  next: '/users/5601/',
	  last: '/greet/hi/'
	});
  
  
  // 设置cookie
  res.cookie("name", "da宗熊", {
	path: "/",
	//secure: true, // 设置了安全，则前端不可见
	maxAge: 300000,
	signed: true, // 加密?
	httpOnly: true
  });
  
  // 设置header的location字段
  res.location('/users/4545/');
  
  // 这是链接的重定向
  // res.redirect(301, "/users/5601");，页面的链接也更改了
  
  

  res.render('index', { title: 'Express' }, function(err, html){
	console.log("首页的html内容");
	// 如果不写这个函数，就会调用res.send(html);
	// 如果写了，就必须手动调用
	// 而且连错误都需要自己处理
	if(err){
		// 如果不处理错误，会什么内容都木有哦~
		next(err);
	}else{
		res.send(html);
	}
	
  });
});

module.exports = router;
