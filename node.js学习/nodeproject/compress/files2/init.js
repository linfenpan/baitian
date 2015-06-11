var GVars = {
	PRIZEMAP:{
		"1":{name:"晶钻碎片×188"},
		"2":{name:"晶钻碎片×564"},
		"3":{name:"晶钻碎片×940"},
		"4":{name:"魅情酒吧背景"},
		"5":{name:"樱桃魔力胸针"},
		"6":{name:"魔力珍稀材料暖光×10"},
		"7":{name:"魔力珍稀材料蜜露×10"},
		"8":{name:"魔力珍稀材料马卡龙×10"}
	},
	actTopic: "http://qq.100bt.com/topic-11915087-1.html",
	shareWord: "分享语：过新年啦，#奥比岛#魔力天裁师安琪儿有超多新年愿望想樱桃帮忙实现哦！来帮助樱桃完成安琪儿的愿望，就有机会获得晶钻、魔力时装单件或魔力时装材料等超多奖励！马上去看看>",
	shareTitle: "奥比岛2015魔力天裁师_ 安琪儿的新年愿望",
	gameRoot: "http://aobi.100bt.com/",
	shareLink: "http://aobi.100bt.com/gwActivity/20150206/",
	shareImg: "http://aobi.100bt.com/gwActivity/20150206/dist/style/img_s/share.jpg",
	shareItems: ["qqweibo", "sinaweibo", "qq", "qzone"],
	favlink: "http://aobi.100bt.com/",
	favName: "百田奥比岛"
};

var Service = {
	canLocalClipboard:function(){
		var a=false;
		try{
			window.clipboardData.setData('text', "");
			a=true;
		}catch(e){

		}finally{
			return a;
		}
	},
	doTask: function(taskIndex, taskArgStr) {
		var d = $.Deferred();
		$.getJSON("http://service.100bt.com/gwchoujiang/addChouJianCount.jsonp?businessId=aobi_20150213&callback=?", {
			taskIndex: taskIndex,
			str: taskArgStr
		}, function(data) {
			d.resolve({
				detail: data.res.resultCode.detail,
				code: data.res.resultCode.code,
				result: data.res.value
			});
		});
		return d;
	},
	choujiang: function(index) {
		var d = $.Deferred()
		$.getJSON("http://service.100bt.com/gwchoujiang/chouJian.jsonp?businessId=aobi_20150213&callback=?", {
			taskIndex: index
		}, function(data) {
			d.resolve({
				detail: data.res.resultCode.detail,
				code: data.res.resultCode.code,
				result: data.res.value
			});
		});
		return d;
	},
	queryActUserNumb: function() {
		var d = $.Deferred();
		$.getJSON("http://service.100bt.com/gwchoujiang/queryNewRewardUsers.jsonp?businessId=aobi_20150213&callback=?", function(data) {
			d.resolve({
				code: data.res.resultCode.code,
				detail: data.res.resultCode.detail,
				userNumb: data.totalUserNum
			});
		})
		return d;
	},
	queryActData: function() {
		/*{
			value: {
				finishTask: 0,
				leaveCjCount: 1,
				jpCodes: [],
				gameArea: -1,
				finishTag: [
					false,
					false,
					false
				],
				userId: 1604,
				score: 0,
				userName: "505101",
				cjButtonClickKey: [
					false,
					false,
					false,
					false,
					false
				],
				gameRoleName: "",
				businessId: 57,
				duoduoId: 505101
			}
		}*/
		var d = $.Deferred();
		$.getJSON("http://service.100bt.com/gwchoujiang/queryUser.jsonp?businessId=aobi_20150213&callback=?", function(data) {
			var value = data.res.value;
			d.resolve({
				packages: data.res.value.cjButtonClickKey,
				code: data.res.resultCode.code,
				detail: data.res.resultCode.detail,
				leaveCjCount: data.res.value.leaveCjCount,
				prize: data.res.value.jpCodes
			})
		})
		return d;
	},
	showLogin: function() {
		In("ui_popuplogin", function() {
			ui_popuplogin.init();
			showLogin({
				dontneedCheck: true
			});
		});
	},
	getShareHTML: function(dataObj) {
		var d = $.Deferred();
		modulizer.use(["shareRenderer"], function(shareRenderer) {
			var _vars = dataObj || GVars;
			var shareTxt = _vars.shareWord,
				shareLink = _vars.shareLink,
				shareImg = _vars.shareImg,
				shareItems = _vars.shareItems,
				shareTitle = _vars.shareTitle;
			var option = {
				config: shareItems,
				data: {
					title: shareTitle,
					description: shareTxt,
					url: shareLink,
					imageSrc: shareImg,
					summary: shareTxt
				}
			};
			if (_vars.template) {
				option.template = _vars.template;
			}
			d.resolve(shareBtnRenderer.getHtmlByOption(option));
		});
		return d;
	},
	initPlayer: function(a, opt) {
		var src = $(a).data("src");
		modulizer.use(["flowplayer"], function() {
			a.flowplayer("http://aola.100bt.com/js/util/flowplayer-3.2.7.swf", $.extend(true, {
				clip: {
					url: src,
					autoPlay: true,
					autoBuffering: true,
					onFinish: function() {
						this.play();
					}
				}
			}, opt));
		});
	},
	initSwfPlayer: function(a) {
		var src = $(a).data("src");
		$(a).html('<object id="mymovie" type="application/x-shockwave-flash" data="' + src + '" class="sigeFlashClass"><param name="wmode" value="transparent"><param name="movie" value="' + src + '"><param name="quality" value="high"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="flashvars" value=""></object>');
	},
	updateUserData: function(data, type) {
		var g = {
			init: function(d) {
				GVars.actUserInfo = d;
			}
		};
		var fn = g[type];
		if (fn) {
			fn(data);
		}
	},
	updateUserDataUI:function(){
		$chanceNumb = $(".actDesc .chance", $("#act1"));
		Service.queryActData().done(function(data){
			$chanceNumb.text(data.leaveCjCount);
			modulizer.use(["packageView"],function(packageView){
				packageView.render(data);
			})
		});
	}
};

var packageCfg = {
	"clipboard":{
		path: "http://www.100bt.com/resource/js/plugins/zclip/jquery.zclip.min.js"
	},
	"replyInterFace": {
		path: "http://qq.100bt.com/gwActivity/20130905/script/replyInterFace.js"
	},
	"crossRequest": {
		path: "http://my.100bt.com/chat/js/crossRequest.js"
	},
	"npop-dev": {
		path: "http://www.100bt.com/resource/js/plugins/npopnew/npop/npop-dev.js?20140919"
	},
	shareRenderer: {
		rely: ["npop-dev"],
		registerNS: "window.shareBtnRenderer",
		path: "http://resource.a0bi.com/resource/js/plugins/sharerenderer.js"
	},
	flowplayer: {
		path: "http://www.100bt.com/media/flowplayer/flowplayer-3.2.12.min.js"
	}
};

modulizer.configModuleMap(packageCfg);



modulizer.define(["npop-dev"], "sidebar", function() {
	var threshold = 1399;
	var that = $(".sb");
	function init() {
		$(window).bind("resize.sidebar", zUtil.fntools.debounce(handler, 500)).resize();
		$(window).bind("scroll.sidebar", zUtil.fntools.debounce(handler2, 500)).scroll();
		$(".a6").closest(".sbItem").on("mouseenter", function() {
			$(this).find(".sb-drop").show();
		}).on("mouseleave", function() {
			$(this).find(".sb-drop").hide();
		});
		$(".sbItem").hover(function(){
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		})
		Service.getShareHTML().done(function(data) {
			$(".sb-wshare").html(data);
		});

		function handler2() {
			if ($(window).scrollTop() < 50) {
				that.addClass("sb-fistScreen");

			} else {
				that.removeClass("sb-fistScreen");
			}
		}

		function handler() {
			var sb = $(".sb");
			sb.removeClass("sb-heightRes sb-lowRes");
			if ($(window).width() > threshold) {
				sb.addClass("sb-heightRes");
			} else {
				sb.addClass("sb-lowRes");
			}
		}
	}
	return {
		init: init
	}
});

modulizer.define(["npop-dev","actPops"], "act0", function(npop,actPops) {
	actPops.init();
	var that = this;
	Service.getShareHTML().done(function(data) {
		$(".wshareBtns", that.root).html(data);
	});
	this.root.on("click",".videoBtn",function(){
		Service.pagePops.show_mvPop();
	});
	Service.queryActUserNumb().done(function(data) {
		if (data.code >= 0) {
			$(".actStateBar .numb", that.root).text(data.userNumb);
		} else {
			Util.debug("actStateBar init fail:", data.detail);
		}
	});
});

modulizer.define(["npop-dev"],"packageView",function(){
	var t = '<a href="###" class="nyPackage nyPackage${pos} ${disableClass}" data-index="${index}"></a>';
	function render (data) {
		var $packages = $("#act1 .wnyPackages"),
			$chanceNumb = $("#act1 .actDesc .chance");
		$chanceNumb.text(data.leaveCjCount);
		var _packages = [false, false, false, false, false];
		if (data.packages) {
			_packages = data.packages;
		}
		var str = $.map(_packages, function(v, k) {
			return Util.template(t, {
				index: k,
				pos: k + 1,
				disableClass: v ? "nyPackage_disabled nyPackage_disabled"+(k+1) : ""
			});
		}).join("");
		$packages.html(str);
	}
	return {
		render:render
	};
});

modulizer.define(["npop-dev","allActPops","packageView"], "act1", function(npop,allActPops,packageView) {
	var $packages = $(".wnyPackages", this.root),
		$chanceNumb = $(".actDesc .chance", this.root);
	$packages.on("click", ".nyPackage:not('.nyPackage_disabled')", function() {
		if (!GVars.userInfo) {
			Service.showLogin();
			return false;
		}
		var index = $(this).data("index");
		Service.choujiang(index).done(function(data) {
			if (data.code >= 0) {
				allActPops.prize(data.result.CodeType,data.result.Code);
				Service.updateUserDataUI();
			} else if(data.code==-101||data.code==-103){
				allActPops.noprize();
				Service.updateUserDataUI();
			}else if(data.code==-7){
				Service.showLogin();
			}else if(data.code==-102){
				allActPops.pkgopenZero();
			}else{
				allActPops.com({content:data.detail});
			}
		});
	}).on("click", ".nyPackage_disabled", function() {

	});

	this.root.on("click",".wbtn1 .btn1",function(){
		allActPops.prizeiswhat();
	});
	this.root.on("click",".wbtn1 .btn2",function(){
		allActPops.myPrize();
	});

	Service.queryActData().done(function(data) {
		packageView.render(data);
	});
	Util.debug("act1");
});

modulizer.define(["npop-dev","allActPops"], "act2", function(npop,allActPops) {
	$("#wechatForm").on("submit", function() {
		var str = $(this).find(".strTXT").val();
		if (!$.trim(str)) {
			allActPops.com({
				content:"请输入答案"
			});
			return false;
		}
		Service.doTask(1, str).done(function(data) {
			if(data.code>=0){
				allActPops.wishcomplete1();
				Service.updateUserDataUI();
			}else if(data.code==-7){
				Service.showLogin();
			}else{
				/*包括了data.code==-4*/
				allActPops.com({
					content:data.detail
				});
			}
			$("#wechatForm")[0].reset();
		});
		return false;
	});
});

modulizer.define(["npop-dev","allActPops"], "act3", function(npop,allActPops) {
	var that = this;
	Service.getShareHTML($.extend({}, GVars, {
		template: "%{shareLink}",
		shareItems: ["qzone"]
	})).done(function(data) {
		$(".act3ShareBtn", that.root).attr("href", data).click(function() {
			window.open($(this).attr("href"), "newwindow", "height=600, width=800, top=200, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no");
			Service.doTask(2).done(function(data) {
				if(data.code>=0){
					setTimeout(function(){
						allActPops.wishcomplete1();
						Service.updateUserDataUI();
					},5000);
				}else if(data.code==-7){
					Service.showLogin();
				}else if(data.code==-4){
					allActPops.com({
						content:"今天已经完成过啦，看看其他愿望吧！明天记得再来哦！"
					});
				}else{
					//这里默默的失败吧
					allActPops.com({
						content:data.detail
					});
				}
			});
			return false;
		});
	})

});

modulizer.define(["npop-dev", "crossRequest", "replyInterFace","allActPops"], "act4", function(npop, cR, rI,allActPops) {
	/*test  http://qq.100bt.com/topic-10138610-1.html */
	/*pdt   http://qq.100bt.com/topic-11915087-1.html */
	var topicId = 11915087;
	ReplyInterFace.prototype.alert = function(msg) {
		allActPops.com({content:msg});
	};
	var replyInstance;
	replyInstance = replyInstance || new ReplyInterFace(topicId, true);
	$("#wishForm").on("submit", function() {
		if(!GVars.userInfo){
			Service.showLogin();
			return false;
		}
		var duoduoId = $(this).find(".wishForm_duoduoId").val();
		var content = $(this).find(".wishForm_word").val();
		if (!$.trim(duoduoId)) {
			allActPops.com({
				content:"hey~别偷懒,把内容都填了吧~"
			})
			return false;
		}
		if ($.trim(content).length<20) {
			allActPops.com({
				content:"祝福应该要20字以上~"
			})
			return false;
		}
		if ($.trim(content).length>200) {
			allActPops.com({
				content:"请输入言简意赅的祝福,200字以内就够了哟~"
			})
			return false;
		}
		var QQContent = "<p>多多号:" + duoduoId + "</p><p>2015奥比岛愿望:" + content + "</p>";
		replyInstance.submit(QQContent, function() {
			Service.doTask(3).done(function(data) {
				if(data.code>=0){
					allActPops.wishcomplete2();
					Service.updateUserDataUI();
				}else{
					allActPops.com({content:"发表成功！"});
					// /*包括了data.code==-4*/
					// 默默地失败吧~
					// allActPops.com({
					// 	content:data.detail
					// });
				}
				$("#wishForm")[0].reset();
			});
		}, {
			dealWithLogin: false
		});
		return false;
	});
});

modulizer.define(["part3", "sidebar", "actPops", "part2"], "main", function(part3, sidebar, actPops, part2) {
	sidebar.init();
	actPops.init();
	part2.init();
	ajaxLogin.listen("userInfoReady", function(data) {
		GVars.userInfo = data.userInfo;
		Service.updateUserDataUI();
	});
	ajaxLogin.runCommonLoginCheck();

});

// part2 的许愿没有按照需求完成
modulizer.define("part2", function(){
	function init(){
		var startDate = "2015-02-13", title = "安琪儿";
		$.getJSON("http://service.100bt.com/PubTimeNow.action?callback=?", function(data){
			var date = data.date;
			if(date <= "2015-02-16"){
				title += "最喜欢";
			}else if(date <= "2015-02-19"){
				title += "最爱吃";
			}else if(date <= "2015-02-24"){
				title += "最可爱";
			}else{
				title += "的愿望";
			};
		}).done(function(data){
			$("#act2 .mainwidth").append("<span class='aqeTxt'>"+title+"</span>");
		});
	};
	
	return {
		init: init
	};
});

modulizer.define(["npop-dev","clipboard"], "actPops", function(npop,clipboard) {
	function commonInit() {
		this.domElement.on("click", ".gohongbaoBtn", function() {
			$(window).scrollTop($("#act1").offset().top);
		}).on("click", ".pop_addFavBtn", function() {
			Util.AddFavorite(GVars.favlink, GVars.favName);
		});
	}

	function init() {
		if (this.hasInit) {
			return false;
		}
		this.hasInit = true;
		zUtil.generateNS("Page.PopDefinition", {
			commonActPop: {
				content: '<div class="innerbg"><div class="info"></div></div>',
				className: "commonActPop",
				popHandler: {
					init: function() {
						var that=this;
						commonInit.call(this);
						 this.tips= Page.Widget.TipsFactory.getTips({alignTarget: this.domElement,timeout: 1000,alignMyPlace: "center middle",alignTargetPlace: "center middle"});
						 that.domElement.on("click",".close",function(){
						 	if(!Service.canLocalClipboard()){
					 		 	var cps=that.domElement.find(".cpLink");
					 			if(cps.length>0){
					 				cps.each(function(k,v){
					 					$(v).zclip("remove");
					 				})
					 			}
						 	}
						 });

					},
					beforeshow: function() {
						var ctxData = Service.popPool.commonActPop.runtimeData;
						$(".info", this.domElement).html(ctxData.content);
						$(".title", this.domElement).html(ctxData.title);
					},
					aftershow: function() {
						var cps = $(this.domElement).find(".cpLink");
						var that = this;
						if (cps.length > 0) {
							if (Service.canLocalClipboard()) {
								cps.click(function() {
									that.tips.show({
										content: "复制成功，可Ctrl+V粘贴到别处~"
									})
									window.clipboardData.setData("text", $(this).closest(".prizeItem").find(".pCode").val());
								});
							} else {
								cps.each(function(k, v) {
									$(v).zclip({
										path: 'http://www.100bt.com/resource/js/plugins/zclip/ZeroClipboard.swf',
										copy: function() {
											that.tips.show({
												content: "复制成功，可Ctrl+V粘贴到别处~"
											})
											return $(v).closest(".prizeItem").find(".pCode").val();
										},
										afterCopy: function() {

										}
									});
								})
							}

						}
					}
				}
			},
			giftPop: {
				posMethod: "absolute",
				content: '<div class="innerbg"><div class="info"></div></div>',
				className: "giftPop",
				popHandler: {
					init: function() {
						commonInit.call(this);
					},
					beforeshow: function() {
						var ctxData = Service.popPool.giftPop.runtimeData;
						$(".info", this.domElement).html(ctxData.content);
						$(".title", this.domElement).html(ctxData.title);
					}
				}
			},
			commonSPActPop: {
				content: '<div class="innerbg"><div class="info"></div></div>',
				className: "commonSPActPop",
				popHandler: {
					init: function() {
						commonInit.call(this);
					},
					beforeshow: function() {
						var ctxData = Service.popPool.commonSPActPop.runtimeData;
						$(".info", this.domElement).html(ctxData.content);
						$(".title", this.domElement).html(ctxData.title);
					}
				}
			},
			mvPop:{
				content: '<div class="innerbg"><div class="info"></div></div>',
				className: "mvPop",
				popHandler: {
					init: function() {
						var that=this;
						this.domElement.find(".close").click(function(){
							that.domElement.find("object").remove();
						}).text('×');
					},
					beforeshow: function() {
						var ctxData = Service.popPool.mvPop.runtimeData;
						this.domElement.find(".info").append('<a data-src="dist/resource/mv.swf" class="mvLink"></a>')
						Service.initSwfPlayer($(".mvLink",this.domElement));
					}
				}
			}
		});
		var popNS = "Service.pagePops";
		/*可以在popPoolNS里面取得使用此种初始化方式初始化的弹窗*/
		/*弹窗定义的位置*/
		var popInfosName = "Page.PopDefinition";
		/*弹窗实例的存取位置*/
		var popPoolNS = "Service.popPool";
		/*初始化顺便调用内置测试方法弹窗所有弹窗*/
		zUtil.npopWrappInit(popNS, popInfosName, popPoolNS, {
			overlayColor: "#000",
			overlayOpacity: "0.7"
		});
	}
	return {
		init: init,
		hasInit: false
	}

});


modulizer.define(['npop', 'actPops'], "allActPops", function(nopop, actPops) {
	function buildBtn(arr) {
		var t = '<a href="${link}" target="${target}" class="popBtn ${cssClass}"><span class="popBtnTxt">${word}</span><span class="popBtnr"></span></a>';
		return '<div class="popCtrls">' + $.map(arr, function(v, k) {
			return Util.template(t, {
				cssClass: v.cssClass ? v.cssClass : "",
				word: v.word ? v.word : "什么按钮？",
				link: v.link ? v.link : "###",
				target: v.link ? "_blank" : "_self"
			});
		}).join("") + '</div>';
	}

	function buildHead(title) {
		var t = '<div class="popTitle">${title}</div>'
		return Util.template(t, {
			title: title
		});
	}

	function buildContent(content) {
		var t = '<table class="popContentTable"><tbody><tr><td>${content}</td></tr></tbody></table>'
		return Util.template(t, {
			content: content
		});
	}
	actPops.init();
	// Service.pagePops.show_commonActPop({content:"<div>"+actPops.buildBtn([{
	// 		cssClass:"hello",
	// 		word:"爱上对方爱上对方"
	// 	}])+"</div>"});

	// Service.pagePops.show_commonSPActPop({content:"放大镜撒考虑"});

	function myPrize() {
		Service.queryActData().done(function(data) {
			var prizeItemTpl='<div class="prizeItem clearfix"><span class="pName l" title="${name}">${name}</span><input class="pCode l" type="text" value="${code}"/><span class="pCtrlCp pr tC l"><a href="###" class="cpLink fontStylelargeSp">复制</a></span></div>'
			var ctn, btn;
			if(!GVars.userInfo){
				Service.showLogin();
				return false;
			}
			if (data.code >= 0||data.code==-9) {
				// if (true) {
				if (data.prize && data.prize.length > 0) {
						var _prizes=data.prize;
/*						var _prizes=[{
							Code:"假数据",
							CodeType:1
						},{
							Code:"我怎么抽都不中",
							CodeType:2
						},{
							Code:"so",
							CodeType:1
						},{
							Code:"作假",
							CodeType:2
						},{
							Code:"作假",
							CodeType:1
						},{
							Code:"作假",
							CodeType:2
						}]*/
						ctn='<div class="myPrizeScroll fontStylelarge">'+$.map(_prizes,function(v,k){
							return Util.template(prizeItemTpl,{
								name:GVars.PRIZEMAP[v.CodeType].name,
								code:v.Code
							});
						}).join("")+'</div>'
						ctn =ctn+'<p>奖励兑换码，均可在<a href="http://aobi.100bt.com/" class="sp" target="_blank">奥比岛官网</a>登录游戏，到【浪漫花海】找NPC樱小桃兑换！</p>';
						btn = buildBtn([{
							word: "兑换奖励",
							cssClass: "myPrize_1 closeBtn",
							link: "http://aobi.100bt.com/"
						}, {
							word: "继续开红包",
							cssClass: "myPrize_2 closeBtn gohongbaoBtn"
						}]);
				} else {
					ctn = '<p class="fontStylelarge">还没获得任何奖励呢，马上完成安琪儿的愿望，去开红包吧！</p>'
					btn = buildBtn([{
						word: "去完成愿望",
						cssClass: "myPrize_3 closeBtn"
					}, {
						word: "开红包",
						cssClass: "myPrize_4 closeBtn gohongbaoBtn"
					}]);
				}
				Service.pagePops.show_commonActPop({
					content: buildHead('我的奖励') + buildContent(ctn) + btn
				});
			} else if (data.code == -7) {
				Service.showLogin();
			} else {
				com(data.detail);
			}
		});
	}

	function com(obj) {
		var _obj = obj || {}
		var _title = _obj.title || "温馨提示";
		var _content = _obj.content || "";
		Service.pagePops.show_commonActPop({
			content: buildHead(_title) + buildContent('<p class="fontStylelarge">' + _content + '</p>') + buildBtn([{
				word: "确定",
				cssClass: "com_1 closeBtn"
			}])
		});
	}

	function pkgopenZero() {
		Service.pagePops.show_commonActPop({
			content: buildHead('戳痛我啦！%>_<%') + buildContent('<p class="fontStylelarge tL">开红包次数是0哦，马上去完成安琪儿的愿望就能获得开红包次数！如果今天已经完成所有愿望，明天记得再来吧！</p>') + buildBtn([{
				word: "继续完成愿望",
				cssClass: "myPrize_1 closeBtn"
			}, {
				word: "收藏页面明天再来",
				cssClass: "myPrize_2 closeBtn pop_addFavBtn"
			}])
		});
	}

	function prize(type,code) {
		var prizeItemTpl='<div class="prizeItem clearfix"><span class="pName l" title="${name}">${name}</span><input class="pCode l" type="text" value="${code}"/><span class="pCtrlCp pr tC l"><a href="###" class="cpLink fontStylelargeSp">复制</a></span></div>';
		var cont='<div class="myPrizeScroll fontStylelarge">'+Util.template(prizeItemTpl,{
								name:GVars.PRIZEMAP[type].name,
								code:code
							})+'</div>';
		cont=buildContent(cont);
		Service.pagePops.show_commonActPop({
			content: buildHead('恭喜获得奖励') + cont + buildBtn([{
				word: "兑换奖励",
				cssClass: "myPrize_1 closeBtn",
				link:"http://aobi.100bt.com/"
			}, {
				word: "继续开红包",
				cssClass: "myPrize_2 closeBtn gohongbaoBtn"
			}])
		});
	}

	function noprize() {
		/*4个文案：（替换红字部分随机出现）*/
		var rArray = ["我最喜欢希爸爸和小耶妈妈，只是有时候淘气想跟他们玩玩嘛！", "每天都能吃到甜点和蛋糕，是我感到最美好的事情，所以我爱抢樱桃东西吃！", "每天都开开心心萌萌哒，你有什么想对我说的，可以在奥比岛微信留言哦！", "为大家设计更多更美的魔力时装，是我2015最大的愿望，你也赞同吧？！"];

		var word = rArray[zUtil.randomIntInRange(0, rArray.length - 1)];
		Service.pagePops.show_commonSPActPop({
			content: buildContent('<p class="fontStylelarge">这个红包里放的是我的秘密！一般人不造！<br />悄悄告诉你：' + word + '</p>') + buildBtn([{
				word: "继续开红包",
				cssClass: "noprize_1 closeBtn gohongbaoBtn"
			}])
		});
	}

	function wishcomplete1() {
		Service.pagePops.show_commonActPop({
			content: buildHead('愿望完成') + buildContent('<p class="fontStylelarge">谢谢小奥比，奖励你1次开红包机会！</p>') + buildBtn([{
				word: "继续完成愿望",
				cssClass: "wishcomplete1_1 closeBtn"
			}, {
				word: "开红包",
				cssClass: "wishcomplete1_2 closeBtn gohongbaoBtn"
			}])
		});
	}

	function wishcomplete2() {
		Service.pagePops.show_commonActPop({
			content: buildHead('愿望完成') + buildContent('<p class="fontStylelarge">愿望写得不错嘛，每天首次发表成功，将奖励1次开红包机会！<span class="fontStylelargeSp">（每天都有1次哦）</span></p>') + buildBtn([{
				word: "去看看大家的愿望",
				cssClass: "wishcomplete2_1 closeBtn",
				link: GVars.actTopic
			}, {
				word: "开红包",
				cssClass: "wishcomplete2_2 closeBtn gohongbaoBtn"
			}])
		});
	}

	function prizeiswhat() {
		Service.pagePops.show_giftPop({
			content: buildHead('红包里有什么') + buildBtn([{
				word: "去完成愿望",
				cssClass: "prizeiswhat1 closeBtn"
			}, {
				word: "开红包",
				cssClass: "prizeiswhat2 closeBtn gohongbaoBtn"
			}])
		});
	}
	return {
		myPrize: myPrize,
		/*看看我的奖励弹窗*/
		pkgopenZero: pkgopenZero,
		/*点击红包，开启次数为0时弹窗*/
		prize: prize,
		/*开红包中奖弹窗*/
		noprize: noprize,
		/*安琪儿秘密弹窗（不中奖）*/
		wishcomplete1: wishcomplete1,
		/*愿望2、愿望3每天首次完成弹窗*/
		wishcomplete2: wishcomplete2,
		/*愿望4完成弹窗*/
		prizeiswhat: prizeiswhat,
		/*奖励展示弹窗（红包里有什么）*/
		com: com
	};
});


modulizer.compileDOM($(".staticModule"));
modulizer.use(["main"]);
