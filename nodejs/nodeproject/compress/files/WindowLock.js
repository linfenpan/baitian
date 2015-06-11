define(function(require, exports, module){
	var $ = require("jquery"), G = require("common");
	
	// 遮罩
	var WindowLock = (function (window, $) {
		var init = function (options) {
			options = $.extend({
					canClickHide : true
				}, options || {});
			var content = '<div id="lockWindow" class="lockWindow"></div>'
				$("body").append(content);
			if (options.content) {
				$("#lockWindow").html(options.content);
			}
			
			var self = this,
			$lockWindow = $("#lockWindow");
			if (options.slidable) {
				$lockWindow.css({
					"top" : "0",
					"left" : "0",
					"position" : "absolute",
					"width" : "100%",
					"height" : "100%",
					"background" : "rgba(0,0,0,0.5)",
					"z-index" : "1000"
				});
			} else {
				$lockWindow.css({
					"top" : "0",
					"left" : "0",
					"position" : "fixed",
					"width" : "100%",
					"height" : $(window).height() + "px",
					"background" : "rgba(0,0,0,0.5)",
					"z-index" : "1000",
					"display" : "-webkit-box",
					"-webkit-box-align" : "center"
				});
			}
			if (options.wrapCss) {
				$lockWindow.css(options.wrapCss);
			}
			
			if ((/#lock$g/).test(window.location.href)) {
				window.location = "#lock1";
			} else {
				window.location = "#lock";
			}
			
			// 事件判断
			var startEvent = G.isTouchEnv ? "touchstart" : "mousedown";
			$lockWindow.on("click", function (e) {
				if (e.srcElement == $lockWindow[0]) {
					if (options.canClickHide) {
						self.remove();
					}
					try {
						if ($.type(options.ontouched) == "function") {
							options.ontouched.call(window);
						};
					} catch (e) {}
				}
			});
		}
		
		return function (options) {
			init.call(this, options);
			this.$wrap = $("#lockWindow");
		}
	})(window, $);
	WindowLock.prototype = {
		hide : function () {
			this.$wrap.hide();
		},
		show : function () {
			this.$wrap.show();
		},
		remove : function () {
			window.history.go(-1);
			this.$wrap.remove();
			delete this;
		}
	}
	module.exports = WindowLock;
});