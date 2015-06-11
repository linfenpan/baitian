;~function(window, $){
var $ = $; // 如果不存在，用seajs修正之~
var DDdownload = {
	cookieKey: "dddownloadkey"
	,isDoNotNeedDownloadPath: function(pathname){
		var list = [/^\/template/, /^\/tougao\/show/], res = false;
		for(var i in list){
			var item = list[i];
			if(item.test(pathname)){
				res = true;
				break;
			}
		}
		return res;
	}
	,init: function(){
		var cookie = /dddownloadkey=/g.test(document.cookie);
		if(cookie || this.isDoNotNeedDownloadPath(window.location.pathname)){
			return;
		};
		var $body = $("body");
		$body.append('\
			<div id="DDdownload">\
				<span class="ico"></span>\
				<a target="_blank" href="http://www.doudou.in/play/download.html" class="btn"></a>\
				<a href="" class="close"></a>\
			</div>\
		');
		var link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", "http://resource.a0bi.com/doudou/v2/style/DDdownload.css");
		var head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(link);
		
		this.$root = $("#DDdownload"), this.dialog = dialog.init();
		this.bindUI();
	}
	,bindUI: function(){
		var that = this;
		this.$root.on("click", ".close", this.delayFn(function(){
			that.hide();
		})).on("click", ".btn", this.delayFn(function(){
			if($.os && $.os.android){
				window.top.location = this.getAttribute("href");
			}else{
				that.dialog.show("目前仅支持安卓系统");
			}
		}));
	}
	,delayFn: function(cb){
		return function(e){
			var that = this;
			this.setAttribute("active", 1);
			setTimeout(function(){
				that.removeAttribute("active");
				
				setTimeout(function(){
					cb && cb.call(that, e);
				}, 50);
				
			}, 150);
			return false;
		}
	}
	,destroy: function(){
		this.$root.remove();
		this.dialog.destroy();
		this.$root = this.dialog = null;
	}
	,hide: function(){
		var that = this;
		this.$root.attr("hide", 1);
		setTimeout(function(){
			that.setCookie();
			that.destroy();
		}, 350);
	}
	,setCookie: function(){
		document.cookie = [this.cookieKey, "=true;", "path=/;"].join("");
	}
};
var dialog = {
	init: function(){
		var $body = $("body");
		$body.append('\
			<div id="DDdownload_dialog_lock" hide></div>\
			<div id="DDdownload_dialog" hide>\
				<span class="text">目前仅支持安卓系统</span>\
				<a href="" class="btn">知道了</a>\
			</div>\
		');
		this.$root = $("#DDdownload_dialog"), this.$text = this.$root.find(".text");
		this.$lock = $("#DDdownload_dialog_lock");
		this.bindUI();
		return this;
	}
	,bindUI: function(){
		var INSTANCE = this;
		this.$root.on("click", ".btn", function(){
			var self = this;
			self.setAttribute("active", 1);
			setTimeout(function(){
				self.removeAttribute("active");
				
				setTimeout(function(){
					INSTANCE.hide();
				}, 50);
			}, 150);
			return false;
		});
		this.hide();
	}
	,show: function(html){
		this.$text.html(html);
		this.$lock.removeAttr("hide");
		this.$root.removeAttr("hide");
	}
	,hide: function(text){
		this.$lock.attr("hide", 1);
		this.$root.attr("hide", 1);
	}
	,destroy: function(){
		this.$root.remove();
		this.$root = this.$text = null;
	}
};



if(typeof define == "function"){
	define(function(require, exports, module){
		// 修正jquery引用
		$ = require("jquery");
		DDdownload.init();
		module.exports = DDdownload;
	});
}else{
	// 绑定
	DDdownload.init();
	window.DDdownload = DDdownload;
}


}(window, window.$);