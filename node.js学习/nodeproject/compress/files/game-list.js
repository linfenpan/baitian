define(function(require, exports, module){
	var $ = require("jquery"), util = require("./util");
	require("http://resource.a0bi.com/qq/script/jquery-EnterScreen");
	require("../style/game-list.css");
	
	var dfCNF = {
		root: "#gameList", item: "li", cnt: ".list", more: ".loading",
		tmp:'<li class="animate2" animate data-link="http://www.doudou.in/game/${id}/">\
				<img class="icon" src="${icon}" />\
				<span class="name">${title}</span>\
				#desc\
			</li>',
		desc:'<span class="desc">${categoryName}</span>', // 用于修正 tmp 的#desc字符串
		needDesc: true,
		// 分页
		pager: ".pager", totalCount: -1
	};
	// 默认分页提交信息
	var dfParam = {
		pn: 0, // 分页索引
		limit: 15, // 每页数量
		isTest: false, // 测试数据
		// type: 0, // 0:热门 1:最新
		categoryId: 0, // 0:默认 1:益智闯关 2:欢乐有限 3:赛车竞速 4:体育竞赛 5:动作战斗 6:棋牌桌游
		gameType: 0 // 0:默认 1:男 2:女
	};
	var url = "http://www.doudou.in/games.jsonp?callback=?"
	
	// 逻辑控制
	function control(){
		this.init.apply(this, arguments);
	};
	control.prototype = {
		init: function(cnf, param){
			this.cnf = $.extend({}, dfCNF, cnf || {});
			this.dfParam = $.extend({}, dfParam, param || {});
			
			cnf = this.cnf;
			// 修正模版
			cnf.tmp = cnf.tmp.replace("#desc", cnf.needDesc ? cnf.desc : "");
			
			this.$root = $(cnf.root);
			this.$list = this.$root.find(cnf.cnt);
			this.$more = this.$root.find(cnf.more);
			this.$pager = this.$root.find(cnf.pager);
			
			this.loadedList = []; // 加载列表
			this.ajax = {}; // 记录ajax请求，方便取消之~
			
			return this.bindUI();
		},
		bindUI: function(){
			var that = this, cnf = this.cnf;
			
			// 加载更多
			this.$root.on("click", cnf.more, function(){
				that.initDataFromLoadedList();
				return false;
			});
			
			// 点击item，打开新页面
			this.$root.on("click", cnf.item, util.delay(function(){
				var link = $(this).data("link");
				if(!link) return false;
				util.openWindow(link);
			}));
			
			this.reset();
			
			return this;
		},
		// 两个提示语
		setLoading: function(){
			this.$more.text("游戏加载中..");
		},
		setLoaded: function(){
			// this.$more.text("点击加载更多");
		},
		// 重新配置，以及加载数据
		reset: function(param){
			$.extend(this.dfParam, param || {});
			
			this.dfParam.pn = 0;
			this.cnf.totalCount = -1;
			
			this.$list.empty();
			this.initPager();

			return this;
		},
		// 分页初始化
		initPager: function(){
			var cnf = this.cnf, param = this.dfParam, that = this;
			var currentCount = 0;
			this.pageLoader = window.EnterScreen({
				selector: this.$more
				,fixTop: 20
				,callback: function(){
					// that.$more.removeClass("hide");
					that.data().done(function(data){
						that.initDataFromLoadedList();
						// 锁屏后，没秒重启一次
						if(data && data.games.length <= 0){
							that.$more.addClass("hide");
						}else{
							currentCount += data.games.length;
							console.log("总数:" + currentCount);
							if(currentCount < cnf.totalCount){
								setTimeout(function(){
									that.pageLoader.restart();
								}, 1000);
							}else{
								that.$more.addClass("hide");
							}
						}
						
					});
					// 每次翻页的回调
					param.pn++;
				}
			});
		},
		// 数据获取
		data: function(param){
			var cnf = this.cnf, that = this;
			
			this.ajax.abort && this.ajax.abort(); // 停止之前的请求
			this.loadedList = []; // 取消之前的数据
			that.setLoading(); // loading状态

			var con = $.extend({}, this.dfParam, param);
			this.ajax = $.getJSON(url, con, function(data){
				console.log(data);
				that.loadedList = util.value(data, "games") || [];
				// 配置总数 & 分页
				if(cnf.totalCount <= 0){
					cnf.totalCount = data.totalCount;
					// that.initPager();
				};
			}).always(function(data){
				that.setLoaded(); // loaded状态
				if(!data || data.totalCount <= 0){
					that.$more.text("暂时没有数据哦~");
				}
			});
			
			return this.ajax;
		},
		// 从加载 list 中，初始数据
		initDataFromLoadedList: function(){
			if(this.cnf.totalCount <= 0){
				return;
			};
			
			// 加载一半数据
			//var half = this.dfParam.limit / 2;
			//var list = this.loadedList.splice(0, half);
			var list = this.loadedList;
			if(list.length > 0){
				this.appendList(list);
			}
			if(this.loadedList.length <= 0){
				// this.$more.addClass("hide");
				// this.$pager.removeClass("hide");
			}else{
				// 隐藏写在 initPager 里
			}
		},
		// 往 $list 中插入数据
		appendList: function(list){
			var tmp = this.cnf.tmp, $item;
			for(var i = 0, max = list.length; i < max; i++){
				var item  = list[i];
				item = util.format(tmp, item);
				$item = $(item);
				this.$list.append($item);
				(function(i, $item){
					setTimeout(function(){
						$item.removeAttr("animate").attr("keyframe", 1);
					}, i * 80);
				})(i, $item);
			};
		}
	};
	
	module.exports = control;
});