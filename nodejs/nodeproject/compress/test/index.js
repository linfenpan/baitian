window.isIndex = true;

seajs.config({
	alias: {
		_TouchSlide: "http://resource.a0bi.com/doudou/plugin/TouchSlide.1.1.js",
		"game-list": "http://resource.a0bi.com/doudou/v2/script/game-list.js",
		"util": "http://resource.a0bi.com/doudou/v2/script/util.js"
	}
});
define("TouchSlide", function(require, exports, module){
	require("_TouchSlide");
	module.exports = TouchSlide;
});

seajs.use(["common", "jquery", "TouchSlide"], function(G, $, TouchSlide){
// banner滑动
var $banner = $("#banner");
if ($banner.find(".bd li").length > 0) {
	TouchSlide({ 
		slideCell:"#banner",
		titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
		mainCell:".bd ul", 
		effect:"leftLoop", 
		autoPage:true,//自动分页
		autoPlay:true //自动播放
	});
	$banner.on("click", ".pic", function(){
		if(window.DDInnerJS){
			G.location($(this).attr("href"));
			return false;
		}
		return true;
	});
}
$banner.removeClass("hide").resize();
// END banner滑动
});

// 游戏 TAB
seajs.use(["common", "util", "game-list", "jquery"], function(G, util, control, $){
	// 初始导航对应的内容
	var gameList = function(){
		this.init.apply(this, arguments);
	};
	gameList.prototype = {
		init: function(root, id, count){
			this.$root = $(root);
			this.id = id || "gameList", count = count || 3;
			this.ctrs = {};
			
			var html = "";
			for(var i = 0; i < count; i++){
				var item = {
					id: this.id, index: i, className: "hide"
				};
				html += util.format(this.tmp, item);
			}
			this.$root.html(html);

		},
		tmp: '<div id="${id}${index}" class="animate2 gameList ${className}">\
				<ul class="list"></ul>\
				<div class="clear"></div>\
				<div class="tC"><div class="loading">点击加载更多</div></div>\
				<div class="pager hide"></div>\
			</div>',
		initDataByIndexAndType: function(index, type){
			var $elem = this.$root.find("#" + this.id + index);
			if($elem <= 0)return this;
			
			var ctr = this.ctrs[index];
			if(!ctr){
				// 生成下拉加载的控件
				ctr = this.ctrs[index] = new control({
					root: "#" + this.id + index, 
					needDesc: true
				}, {
					type: 1, // 0:热门 1:最新
					categoryId: 0, // 0:默认 1:益智闯关 2:欢乐有限 3:赛车竞速 4:体育竞赛 5:动作战斗 6:棋牌桌游
					gameType: type // 0:默认 1:男 2:女
				});
			};
		},
		show: function(index, donotNeedAnimate){
			// 显示第几个，是否需要动画切换
			var $elem, type = typeof index;
			if(type == "number"){
				$elem = $("#" + this.id + index);
			}else if(type == "string"){
				$elem = $(type);
			}else{
				$elem = index;
			}
			
			// 是否存在上一个元素？ 是否需要动画？
			if(donotNeedAnimate){
				this.$last && this.$last.addClass("hide");
				$elem.removeClass("hide").css({left:0});
			}else{
				this.tabSwitch($elem, this.$last || $elem);
			};
			
			this.$last = $elem;
		},
		tabSwitch: function($e1, $e2){
			// 两个tab切换
			// 动画控制...
			var i1 = $e1.index(), i2 = $e2.index();
			if(i1 == i2){
				$e1.removeClass("hide").css({left: 0});
				return;
			}
			if(i1 > i2){
				$e2.css({left: "-100%"});
				$e1.css({left: "100%"});
			}else{
				$e2.css({left: "100%"});
				$e1.css({left: "-100%"});
			};
			setTimeout(function(){
				$e2.addClass("hide");
				$e1.removeClass("hide");
				setTimeout(function(){
					$e1.css({left: 0});
				}, 50);
			}, 320);
		}
	};
	
	// 导航控制
	var $nav = $("#nav"), $gameList = $("#gameList"), $classify = $("#classify");
	var myGameList = new gameList("#gameList", "gameList", 3);
	// 修正了结构
	myGameList.$root.append($classify);
	// 绑定事件
	$nav.on("click", ".item", function(){
		var $that = $(this), type = $that.data("type") + "";
		if($that.attr("active")){
			return false;
		};
		switch(type){
			case "0":
			case "1":
			case "2":
				myGameList.initDataByIndexAndType(type, type);
				myGameList.show(+type);
				break;
			case "classify":
				myGameList.show($classify);
				break;
		};
		$that.attr("active", 1).siblings("[active]").removeAttr("active");
		// 替换链接状态
		util.replaceUrlSearch({tab: type == "classify" ? "3" : type});
	});
	
	// 链接中，如果有参数tab，则用于修正页面点击
	var gameTab = util.urlsearch("tab") || "0";
	if(gameTab != "0"){
		$nav.find(".item").eq(gameTab).click();
	}else{
		myGameList.initDataByIndexAndType(0, 0);
		myGameList.show(0);
	}
	
	
	// 分类点击
	$classify.on("click", ".list li", util.delay(function(){
		var link = $(this).data("link");
		if(!link) return false;
		util.openWindow(link);
	}));
	
});