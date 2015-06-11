define(function(require, exports, module){
	var $ = require("jquery");
	var util = {}, __head = document.head || document.getElementsByTagName("head")[0];
	
	// 字符串替换
	util.format = function(str, data, def, reg){
		return str.replace(reg || /\${([^}]*)}/g, function(a, b){
			var res = eval("data." + b);
			return typeof res == "undefined" ? def || "" : res;
		});
	};
	
	// 读值
	util.value = function(data, str){
		try{
			return eval("data." + str);
		}catch(e){
			return "";
		}
	}
	
	// 延迟处理
	util.delay = function(cb){
		return function(e){
			var that = this;
			that.setAttribute("active", 1);
			setTimeout(function(){
				that.removeAttribute("active");
				cb && cb.call(that, e);
			}, 200);
			return false;
		}
	};
	
	// 动画
	util.animate = function($e, isHide){
		if(isHide){
			$e.attr("animate", 1);
		}else{
			$e.removeAttr("animate");
		}
	};
	// tab 动画切换
	util.tabSwitch = function($e1, $e2, time){
		// 隐藏
		util.animate($e2, true);
		setTimeout(function(){
			$e2.addClass("hide");
			// 出现
			$e1.removeClass("hide");
			setTimeout(function(){
				util.animate($e1, false);	
			}, 10);	
		}, time || 300);
	};
	
	// 打开页面
	util.openWindow = function(href){
		window.location.href = href;
		/*
		if(window.DDInnerJS && window.isIndex){
			if(href.indexOf("http") != 0){
				href = location.origin + (href.indexOf("/") == 0 ? href : "/" + href);
			}
			DDInnerJS.openNewActivity(href);
		}else{
			window.location.href = href;
		}
		*/
	};
	
	
	// 获取search的值
	util.urlsearch = function(key){
		var arr = new RegExp("[\?|&]"+key+"=([^&]*)", "g").exec(location.search);
		return arr ? arr[1] : null;
	};
	
	// 获取hash的值
	util.urlhash = function(key){
		var arr = new RegExp("#"+key+"=([^&]*)", "g").exec(location.hash);
		return arr ? arr[1] : null;
	};
	
	// 修正样式
	util.css = function(csstext){
		var style = document.getElementById("dd-inline-css-style");
		if(!style){
			style = document.createElement("style");
			style.type = "text/css";
			style.id = "dd-inline-css-style";
			__head.appendChild(style);
		};
        if(style.styleSheet) {
            style.styleSheet.cssText = style.styleSheet.cssText + csstext;
        } else {
            style.appendChild(document.createTextNode(csstext));
        }
	};
	
	// 获取cookie的值
	util.getCookie = function(key, value){
		var arr = new RegExp("(?:^|\n|;)" + key + "=([^;]*)", "g").exec(document.cookie);
		return arr ? arr[1] : value || null;
	};

	window.util = util;
	module.exports = util;
});