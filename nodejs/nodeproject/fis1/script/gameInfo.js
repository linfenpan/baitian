seajs.use("jquery", function($){
	
	// 评分滑动
	var shotsLastX = 0;
	var shotsLastY = 0;
	var _screenshots = $("#screenshots");
	var _screenshotsLength = 0;
	var $lis = $("#screenshots li");
	for (var i = 0; i < $lis.length; i++) {
		$li = $($lis[i]);
		// $li.attr("relSrc", "http://img2.a0bi.com/upload/articleResource/20140819/1408432617328.jpg");
		// $li.empty();
		if ($li.attr("relSrc") != "") {
			// $li.css({"background":"url("+$li.attr("relSrc")+") 50% 50% no-repeat","background-size":"contain"});
			_screenshotsLength += $li.width()+2;
		}
	}
	$("#gameScreenshot").on("touchstart", "#screenshots", function(e) {
		shotsLastX = e.touches[0].clientX;
		shotsLastY = e.touches[0].clientY;
		return false;
	}).on("touchmove", "#screenshots", function(e) {
		var curX = e.touches[0].clientX;
		var distance = curX - shotsLastX;
		var targetL = parseInt(_screenshots.css("left")) + distance;
		shotsLastX = curX;
		if (targetL <= 0 && targetL >= -_screenshotsLength+_screenshots.width()) {
			$("#screenshots").css("left", targetL.toString()+"px");
		}

		var curY = e.touches[0].clientY;
		distance = -(curY - shotsLastY);
		shotsLastY = curY;
		window.scroll(0, window.scrollY+distance);
		return false;
	}).on("touchend", "#screenshots", function(e) {
	});

	// 设置评分
	var setScore = function($target, score) {
		if(score<0) score = 0;
		if(score>5) score = 5;
		var w = (score/5*100)+"%";
		$target.find("div").css("width", w);
	}
	var pingfen = 0;
	if (typeof $("#gameCard .star").attr("pingfen") != "number") pingfen = 3;
	setScore($("#gameCard .star"), parseInt(pingfen));


	$("#gameCard").on("click", ".gameStart a", function(e) {
		window.location.href = _this.attr("href");
		// if (checkNavigator() == "mobile") {
		// 	window.location.href = "http://www.doudou.in/play/weixin.html";
		// } else {
		// 	window.location.href = _this.attr("href");
		// }
		e.stopPropagation();
		e.stopImmediatePropagation();
		e.preventDefault();
	});
});
