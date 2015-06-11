var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	// ·¢ËÍÎÄ¼ş
	res.status(200).sendfile("./user.jpg");
});

module.exports = router;