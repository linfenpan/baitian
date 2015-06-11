window.onerror = function(e){
	// alert(e);
};

// seajs的配置
seajs.config({
	alias: {
		_jquery: "http://resource.a0bi.com/resource/js/lib/zepto.min.all",
		_in: "http://resource.a0bi.com/resource/js/nav/in-min",
		util: "http://resource.a0bi.com/doudou/v2/script/util.js",
		user: "http://resource.a0bi.com/doudou/v2/script/user.js",
		// 微信环境的接口
		ddWeixin: "http://resource.a0bi.com/doudou/plugin/ddWeixin.min.js",
		user_for_weixin: "http://resource.a0bi.com/doudou/v2/script/user_for_weixin.js"
	}
});
// 一些预定义
define("jquery", ["_jquery"], function(require, exports, module){
	module.exports = window.Zepto;
});


var ddReadyEvent = "baseAuthorToolIsReady";
// 微信判定
seajs.use("ddWeixin", function(ddWeixin){
	ddWeixin.autoOpenId("wxf91bab01569cc168", {appType:1, isDebug: false}).done(function(openId){
		console.log("授权成功");
		// 全功能的真正入口
		// 但是不从这里开始，也木有什么大问题......
		// 主要是用户信息，可能有延迟
		if(openId){
			// 微信环境，则修正登录
			seajs.use("user_for_weixin", function(UC){
				// 加载导航
				seajs.use("nav");
				seajs.emit(window.ddReadyEvent);
			});
		}else{
			// 加载导航
			seajs.use("nav");
			seajs.emit(window.ddReadyEvent);
		}
	}).fail(function(){
		alert("微信公众号信息获取失败..");
	});
});

// 定义些公用的方法
define("common", function(require, exports, module){
	var G = {}, $ = require("jquery");
	
	module.exports = G;
	
	G.isTouchEnv = /mobile/i.test(navigator.userAgent) && (
		"createTouch" in document || "ontouchstart" in window
	);
	G.addClickEvent = G.isTouchEnv ? function () {
		var arg = arguments;
		var $elem = arg[0], child = arg[1], func = arg[2];
		$.type(child) == "function" && (child = null, func = arg[1]);
		$elem.on("touchstart", child, function () {
			$(this).attr("active", true);
			return false;
		}).on("touchend", child, function (e) {
			var that = this, $that = $(this);
			setTimeout(function () {
				if(!$that.attr("active")){return;}
				$that.removeAttr("active");
				func.call(that, e);
			}, 200);
			//return true;
		});
	}
	 : function() {
		var arg = arguments;
		var $elem = arg[0], child = arg[1], func = arg[2];
		if($.type(child) == "function"){
			child = null, func = arg[1];
		}
		$elem.on("click", child, function(e){
			var that = this, $that = $(this);
			if($that.attr("active")){return;}
			$that.attr("active", true);
			setTimeout(function () {
				$that.removeAttr("active");
				func.call(that, e);
			}, 200);
		});
	};
	G.removeClickEvent = function(){
		var arg = arguments;
		var $elem = arg[0], child = arg[1];
		$elem.off("touchstart", child).off("touchend", child).off("click", child);
	};
	// 滚动到..
	G.scrollTo = function(top, time){
		var sy = window.scrollY, y = top, start = new Date, endTime = time || 120;
		var timer = setInterval(function(){
			var end = new Date, dTime = end - start;
			if(dTime >= endTime || !endTime){
				clearInterval(timer);
				window.scrollTo(0, y);
				return;
			}
			var dx = sy + (y - sy) * dTime / endTime;
			window.scrollTo(0, dx);
		}, 4);
		
	}
	// 判断浏览器平台
	G.navigatorType = {
		WX : "weixin",
		APP : "doudou",
		PC : "pc",
		WAP : "mobile"
	}
	G.navigator = (function (window, navigator) {
		var type = G.navigatorType;
		if ((/mobile|Mobile/g).test(navigator.userAgent)) {
			if ((/MicroMessenger/i).test(navigator.userAgent)) {
				return type.WX;
			} else if (window.DDInnerJS) {
				return type.APP;
			} else {
				return type.WAP;
			}
		} else if (window.DDInnerJS) {
			return type.APP;
		} else {
			return type.PC;
		}
	})(window, navigator);

	G.origin = location.protocol + "//" + location.host;
});

// 导航
define("nav", function(require, exports, module){
	var $ = require("jquery"), G = require("common"), util = require("util");
	var USER = require("user");
	console.log(USER, "Yonghu");
	
	// 默认配置
	var defaultCF = $.extend({
			root : "#header",
			active : "active#200" // 在移动环境下，点击后添加active属性，会延迟响应200ms
		,
			rootLeft : "#headerLeft",
			rootRight : "#headerRight",
			rootCenter : "#headerCenter",
			left : ["home", "return"],
			center: [],
			right : ["make", "user", "refresh"]
		}, window.NavCF || {});
	// 是否触屏
	var isTouchEnv = /mobile/i.test(navigator.userAgent) && (
		"createTouch" in document || "ontouchstart" in window
	);
	// 保存数据的地方
	var data = {
		_css : {}
		// 加载样式
	};
	
	// 添加配置
	// @param name 配置名
	// @param c 配置{html:"结构", click:"点击事件", css:"依赖样式"}
	function add(name, c) {
		data[name] = $.extend({}, data[name], c);
		if (c && c.css) {
			var css = c.css;
			switch ($.type(css)) {
			case "string":
				data._css[css] = 1;
				break;
			case "array":
				for (var i = 0, max = css.length; i < max; i++) {
					data._css[css[i]] = 1;
				}
				break;
			}
			delete data[name].css;
		}
	}
	
	// 初始化导航
	function init() {
		// 加载样式
		var css = data._css,
		header = document.head || document.getElementsByTagName("head")[0];
		data._css = {};
		var link = document.createElement("link");
		link.rel = "stylesheet";
		for (var i in css) {
			var newLink = link.cloneNode();
			newLink.href = i;
			header.appendChild(newLink);
		}
		
		// 根据配置，初始化导航
		var c = defaultCF,
		$p = $(c.root);
		$p.html('<div id="headerLeft"></div><div id="headerCenter">标题</div><div id="headerRight"></div>');
		var $l = $p.find(c.rootLeft),
		$r = $p.find(c.rootRight),
		$c = $p.find(c.rootCenter);
		initItem($l, c.left);
		initItem($r, c.right);
		initItem($c, c.center);
	}
	
	// 初始配置列表
	function initItem($pt, list) {
		$pt.empty();
		for (var i = 0, max = list.length; i < max; i++) {
			var arr = list[i].split("#");
			var item;
			
			// 拓展，可传入字符串： "item#param"
			if(arr.length > 1){
				item = data[arr[0]];
			}else{
				item = data[list[i]];
			}
			if (!item)
				continue;
			
			// 构建html
			// 传入字符串形式："item#param1#param2"
			var html;
			if(item.param && arr.length > 1){
				var lts = arr.slice(1);
				for(var i = 0, max = item.param.length; i < max; i++){
					var it = item.param[i], val = lts[i];
					html = item.html.replace(/\${[^}]*}/g, function(a, b){
						return val || "";
					});
				};
			}else{
				html = item.html;
			};
			
			// 插入父元素
			var $e = $(html).appendTo($pt);
			if (item.click) {
				// 是否支持触屏事件
				if (isTouchEnv) {
					(function ($e, item) {
						$e.on("touchstart", function () {
							var $T = $(this);
							$T.attr(defaultCF.active.split("#")[0], true);
							return true;
						}).on("touchend", function (e) {
							var arr = defaultCF.active.split("#"),
							$T = $(this);
							if (!$T.attr(arr[0]))
								return;
							setTimeout(function () {
								$T.removeAttr(arr[0]);
								item.click.call(this, e);
							}, +arr[1]);
							return false;
						});
					})($e, item);
				} else {
					(function ($e, item) {
						$e.on("click", function(e){
							item.click.call(this, e);
							return false;
						});
					})($e, item);
				}
			};
		}
	}
	
	// 重设配置
	function reset(c) {
		defaultCF = $.extend(defaultCF, c || {});
	}
	
	// 组装数据
	add("home", {
		html : '<a href="http://www.doudou.in/" class="navHome">豆豆游戏</a>',
		click : function () {
			if (window.isIndex) {
				return false;
			}
			window.top.location = "/";
		}
	});
	add("return", {
		html : '<a href="javascript:;" class="navBtn navReturn">返回</a>',
		click : function (e) {
			if (window.DDInnerJS) {
				DDInnerJS.goback();
			} else {
				history.go(-1);
			}
			return false;
		}
	});
	add("refresh", {
		html : '<a href="javascript:;" class="navBtn navRefresh">刷新</a>',
		click : function (e) {
			location.reload();
		}
	});
	add("title", {
		html : '<a href="javascript:;" class="navBtn navTitle">${name}</a>',
		param: ["name"],
		click : function (e) {
			location.reload();
		}
	});
	add("make", {
		html : '<a href="javascript:;" class="navBtn navMake">制作游戏</a>',
		click : function (e) {
			// 在APP内 & 是首页
			util.openWindow("/tougao/templateList.html");
			return false;
		}
	});
	add("user", {
		html : '<a href="javascript:;" class="navBtn navUser">个人中心</a>',
		click : function (e) {
			// cookie是判断登录的最好方法
			USER.afterCheckLogin(function(){
				// 在APP内 & 是首页
				util.openWindow("/uc/usercenter.html");
			}, function(){
				if (G.navigator == G.navigatorType.WX) {
					alert("未能正确获取用户信息");
				} else {
					USER.showLogin();
				}
			});
			return false;
		}
	});
	
	init();
	
	// 外部接口
	module.exports = {
		add : add,
		init : init,
		reset : reset
	};
	
});

// 初始化...
seajs.use(["common", "jquery"], function(G, $){
	// 设置html根元素字体大小
	$(window).resize(function () {
		var $h = $("html");
		var winW = $h.width();
		winW > 720 && (winW = 720);
		var fontSize = winW * 12 / 320;
		$h.css("font-size", fontSize);
	}).resize();
	
	// 设置页脚
	var link = "";
	if (G.navigator == G.navigatorType.WX) {
		link = "http://mp.weixin.qq.com/s?__biz=MzA5Nzk2OTIxNw==&mid=201099443&idx=1&sn=00a1d77cf1458023761bc403ec59b1d5#rd";
	} else {
		link = "/play/weixin.html ";
		
	}
	var footerHtml = '<div class="fWrp"><div class="copyright">© doudou.in</div><div class="linkwp"><a href="/play/cooperate.html" class="link">联系我们</a><a href="' + link + '"  class="link">关注我们</a>' + ((G.navigator == G.navigatorType.APP) ? '' : '<a href="http://www.doudou.in/play/download.html"  class="link">客户端<em class="hot"></em></a>') + '</div></div>'
	$("#footer").append(footerHtml);

});

// 真正初始化后
seajs.on(ddReadyEvent, function(){
	// 检测登录
	seajs.use(["user"], function(UC){
		UC.checkLogin();
	});
	// 修正样式
	seajs.use(["common", "util"], function(G, util){
		var type = G.navigator;
		if(type == G.navigatorType.PC || type == G.navigatorType.WAP){
			util.css(".navUser{display:none;}");
		}else if(type == G.navigatorType.APP){
			util.css(".navUser,.navMake{display:none;}");
		}
		// 流氓地插入下载广告
		// 起码保证其它组件完成再玩~
		if(G.navigator != G.navigatorType.APP){
			seajs.use(["http://resource.a0bi.com/doudou/v2/script/DDdownload.js"], function(){});
		}
	});
	
	
	
	
});

// 豆豆游戏APP，
if(window.DDInnerJS && window.DDInnerJS.initPage){
	window.DDInnerJS.initPage(1); // 0代表游戏页
}
