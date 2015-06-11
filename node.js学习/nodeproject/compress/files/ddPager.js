define(function(require, exports, module){
	var $ = require("jquery");
	
	// #param {jquery Object | string} 分页根元素
	// #param {array} 参数列表[总页数，配置]
	var ddPager = function(root, arg){
		return this.init.apply(this, ([].unshift.call(arg, root), arg));
	}
	ddPager.prototype = {
		init: function(root, total, con){			
			this.root = root, this.total = total, this.con = $.extend({
				perPage: 10, // 每页个数, 
				callback: function(index, root){}, // 每次翻页的回调, 
				autoLoad: false, //是否自动读取第一页
				current: 0,
				prev: "上一页",
				next: "下一页",
				go: "跳转",
				error: function(e){
					alert(e);
				}
			}, con || {});
			if(typeof root == "string"){
				this.root = $(root);
			}
			
			this.bindUI();
			return this;
		}
		,destroy: function(){
			this.prev.off("click");
			this.next.off("click");
			this.go.off("click");
			this.root.empty();
			
			this.con = null;
			this.root = this.prev = this.next = this.cur = this.tol = this.page = this.go = null;
		}
		,bindUI: function(){
			var con = this.con;
			this.root.html('<div class="ddPager">\
				<a class="prev" href="###"></a>\
				<span class="msg"><i class="e"></i>/<i class="t"></i></span>\
				<a class="next" href="###"></a>\
				<input class="page" type="number" min="1" max="1">\
				<a class="go" class="submit" href="###">跳转</a>\
			</div>');
			this.prev = this.root.find(".prev");
			this.next = this.root.find(".next");
			this.cur = this.root.find(".e");
			this.tol = this.root.find(".t");
			this.page = this.root.find(".page");
			this.go = this.root.find(".go");
			
			this.prev.text(con.prev);
			this.next.text(con.next);
			this.cur.text(con.current + 1);
			
			this.page.val(con.current + 1);
			this.resetTotal(this.total);
			
			this.bindEvent();
		}
		,bindEvent: function(){
			var that = this, con = this.con;
			
			this._wait = 0;
			this.prev.on("click", this._(function(e){
				con.current > 0 && that.gotoPage(--con.current);
			}));
			this.next.on("click", this._(function(e){
				con.current < (con.sum - 1) && that.gotoPage(++con.current);
			}));
			this.go.on("click", this._(function(e){
				var val = that.page.val();
				if(/\D/g.test(val) || $.trim(val) == ""){
					// 页数输入错误
					con.error("pageInputInvalid");
				}else{
					var page = ~~val;
					if(page > con.sum){
						// 大于最大值
						con.error("pageOverMax");
					}else if(page <= 0){
						// 小于最小值
						con.error("pageOverMin");
					}else{
						con.current = page - 1;
						that.gotoPage(con.current);
					}
				}
			}));
			
			// 设置了自动读取第一页
			if(con.autoLoad){
				this.go.trigger("click");
			}
		}
		,resetTotal: function(total){
			this.total = total;
			var con = this.con, sum = Math.ceil(this.total / con.perPage);
			con.sum = sum;

			this.tol.text(sum);
			this.page.attr("max", sum);
			
			this.disposeItemClass(con.current);
		}
		,disposeItemClass: function(index){
			var disable = "disable", con = this.con;
			this.prev[index <= 0 ? "addClass" : "removeClass"](disable);
			this.next[index >= con.sum - 1 ? "addClass" : "removeClass"](disable);
		}
		,gotoPage: function(index){
			var con = this.con;
			con.current = index;
			this.disposeItemClass(index);
			this.cur.text(index + 1);
			this.page.val(index + 1);
			
			con.callback && con.callback.call(this, this, index, this.root);
		}
		,_: function(func){
			var that = this;
			return function(e){
				if(that._wait <= 0){
					func && func.call(this, e);
				}
				return false;
			}
			
		}
		,wait: function(i){
			this._wait = i || 1;
		}
		,notify: function(i){
			this._wait -= i || 1;
		}
	};
	
	$.fn.ddPager = function(){
		this.pager = new ddPager(this, arguments);
		return this;
	};
	$.fn.getDDPager = function(){
		return this.pager;
	}
	
	module.exports = ddPager;
});