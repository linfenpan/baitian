define(function(require, exports, module){
	var $ = require("jquery");
	var util = {}, __head = document.head || document.getElementsByTagName("head")[0];
	
	// 字符串替换
	util.format = function(str, data, reg){
		return str.replace(reg || /\${([^}]*)}/g, function(a, b){
			return eval("data." + b);
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
		if(window.DDInnerJS && window.isIndex){
			if(href.indexOf("http") != 0){
				href = location.origin + (href.indexOf("/") == 0 ? href : "/" + href);
			}
			DDInnerJS.openNewActivity(href);
		}else{
			window.location.href = href;
		}
	};
	
	// histroy的search更改
	// #param {Object} obj是键值对，用于替换url中的search部分
	util.replaceUrlSearch = function(obj){
		if(!window.history.replaceState){
			return;
		};
		
		var reg = /([^=&?]*)=([^&]*)/g, search = location.search;
		var res, param = {};
		// 将search转为obj
		while(res = reg.exec(search), res){
			param[res[1]] = res[2];
		};
		// 合并search和obj
		for(var i in obj){
			param[i] = obj[i];
		};
		// 重新转为string
		search = [];
		for(var i in param){
			search.push(i + "=" + param[i]);
		};
		search = search.join("&");
		if(search){
			try{
				var link = location.href;
				link = link.slice(0, link.indexOf("?"));
				history.replaceState(null, document.title, link + "?" + search);
			}catch(e){}
		}
		return search;
	};
	
	// 获取search的值
	util.urlsearch = function(key){
		var arr = new RegExp("[\?|&]"+key+"=([^&]*)", "g").exec(location.search);
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
	
	window.util = util;
	module.exports = util;
});