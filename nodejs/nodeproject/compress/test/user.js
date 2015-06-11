define(function(require, exports, module){
	// 依赖
	var $ = require("jquery");
	require("http://www.100bt.com/doudou/plugin/isWeak");
	require("http://www.100bt.com/doudou/plugin/md5");
	require("../style/user.css");
	var WindowLock = require("./WindowLock");
	
	
	window.userInfo = null;
	var AccountBox = (function(window, $){
		// 私有静态方法 begin
		var username = "";

		//将form转为AJAX提交
		var ajaxSubmit = function(frm, fn, exOptions) {
			var dataPara = getFormJson(frm);
			if(exOptions) {
				(!!exOptions.md5 && !!window["hex_md5"]) && (dataPara[exOptions.md5] = hex_md5(dataPara[exOptions.md5]));
			}
			try{
				$.get(frm.action, dataPara, fn);
			}catch(e){}
		}

		//将form中的值转换为键值对。
		var getFormJson = function(frm) {
			var o = {};
			var a = $(frm).serializeArray();
			$.each(a, function () {
				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [$.trim(o[this.name])];
					}
					o[this.name].push($.trim(this.value) || '');
				} else {
					o[this.name] = $.trim(this.value) || '';
				}
			});
			return o;
		}

		var TaskList = function(){
			this.init();
		}
		TaskList.prototype.init = function(){
			this._clear();
		}
		TaskList.prototype._clear = function(){
			this._tasks = [];
			this._pointer = -1;
		}
		TaskList.prototype.add = function(fun){
			var self = this;
			self._tasks.push(fun);
			return self;
		}
		TaskList.prototype.start = function(){
			if(this._tasks != []){
				this._pointer = 0;
				this._tasks[this._pointer]();
			}
			return this;
		}
		TaskList.prototype.resolve = function(){
			if(this._pointer == -1){
				return;
			}else{
				if(this._pointer < this._tasks.length-1){
					this._pointer++;
					this._tasks[this._pointer]();
				}else if(this._pointer == this._tasks.length-1){
					this._doneFun.apply(this, arguments);
				}
			}
		}
		TaskList.prototype.reject = function(){
			// this._clear();
			this._pointer = -1;
			this._failFun.apply(this, arguments);
		}
		TaskList.prototype.done = function(fun){
			this._doneFun = fun;
			return this;
		}
		TaskList.prototype.fail = function(fun){
			this._failFun = fun;
			return this;
		}

		var init = function(options){
			// init私有函数 begin
			var setContent = function(){
				var self = this;
				var accountBoxContent = '<div id="accountBox"> <div class="acTitle"> <div class="acTitleContent">登录</div> </div> <div id="acLoginForm" class="acForm loginForm"> <form action="/uc/login.jsonp?callback=?"method="post"> <div class="acItem icon icon_name"> <input id="login_mail" name="email" type="email" placeholder="登录邮箱" required="required" maxlength="50"> </div><div class="acItem icon icon_password"> <input id="login_password" name="MD5Password" type="password" placeholder="密码" required="required" maxlength="30"> </div> <div class="acFooter"> <a id="turnRegister_btn" class="btn al" href="###">注 册</a> <button id="login_btn" class="btn ar" href="###" autofocus="true">登 录</button> </div> </form> </div> <div id="acRegisterForm" class="acForm registerForm"> <form action="/uc/register.jsonp?callback=?" method="post"> <div class="acItem icon icon_name"> <input id="register_name" name="nickName" type="text"placeholder="设置3到5个字符的昵称" required="required" maxlength="5"> </div> <div class="acItem icon icon_mail section"> <input id="register_mail" name="email" type="email"placeholder="登录邮箱" required="required" maxlength="50"> </div> <div class="acItem icon icon_password"> <input id="register_password" name="MD5Password" type="password"placeholder="请输入6到16位字符的密码" required="required" maxlength="16"> </div> <div class="acItem icon icon_password section"> <input id="register_passwordConfirm" type="password"placeholder="再次输入登录密码" required="required" maxlength="16"> </div> <div class="acItem acVerificationItem"> <input id="register_verification" name="imgCode" type="text"placeholder="请输入验证码" required="required" maxlength="10"> <img id="register_verification_img" src="" alt=""> </div> <div class="acFooter"> <a id="turnLogin_btn" class="btn al" href="###">登 录</a> <button id="register_btn" class="btn ar" href="###" autofocus="true">完成注册</button> </div> </form> </div> </div>';
				// $("html").append(accountBoxContent);
				// 调整样式
				self.outerWrapper = new WindowLock({
					content: accountBoxContent
					,ontouched: function(){
						self.remove();
					}
					,slidable: true
				});
			}

			var updateVerificationImg = (function(){
				return function(){
					$registerVerificationImg.get(0).src = "/uc/RegisterIdentifyImgCode.html?v="+new Date/1;
					$registerVerification.val("");
				}
			})();

			var updateDisplay = function(){
				$accountBox.css({
					"position": "relative"
					,"top": (windowH-$accountBox.height())/2+"px"
				})
			}
			// init私有函数 end


			// 主逻辑 begin
			// 设置html，初始化成员
			setContent.call(this);

			var showAccountError = (function(){
				$("form input").on("input", function(){
					this.setCustomValidity("");
					// 在弹出错误提示后，如果继续快速输入，那么错误提示会保持，且不会触发invalid事件，所以使用checkValidity保证触发invalid事件
					this.checkValidity();
				});
				return function(formTarget, inputTarget, msg){
					inputTarget.setCustomValidity(msg);
					// 为了使用浏览器默认错误提示样式
					$(formTarget).find("button").trigger("click");
					updateVerificationImg();
				}
			})();

			var self = this
				,$accountBox = $("#accountBox")
				,$registerVerificationImg = $("#register_verification_img")
				,$registerVerification = $("#register_verification")
				,windowH = $(window).height()
				,windowW = $(window).width();

			updateDisplay();
			$accountBox.find("#login_mail").val(self._getUsername());

			// 设置验证码
			updateVerificationImg();
			$("#register_verification_img").on("click", function(){
				updateVerificationImg();
			});

			// 设置页面切换
			var state = "login";
			$("#turnRegister_btn").on("click", function(){
				$accountBox.find(".loginForm").hide();
				$accountBox.find(".registerForm").show();
				updateVerificationImg();
				$accountBox.find(".acTitleContent").text("注册");
				updateDisplay();
				state = "register";
				return false;
			});
			$("#turnLogin_btn").on("click", function(){
				$accountBox.find(".registerForm").hide();
				$accountBox.find(".loginForm").show();
				$accountBox.find(".acTitleContent").text("登录");
				updateDisplay();
				state = "login";
				return false;
			});

			// html5 input格式属性检验
			$("#accountBox input").on("invalid", function(e){
				var self = this;
				var tips = {valueMissing:"请填写此字段。", defaultError:"格式有误。", tooLong:"太长了。"}
				for(key in tips){
					if(e.target.validity[key]) {
						self.setCustomValidity(tips[key]);
						return;
					}
				}
				if(!e.target.validity["customError"]){
					self.setCustomValidity(tips["defaultError"]);
				}
			});

			// 设置表单提交
			$("#acLoginForm form").on("submit", function(){
				var $this = $(this);
				ajaxSubmit($this.get(0), function(data){
					// 登录成功或失败
					if(data.res.code < 0){
						showAccountError($this[0], $("#login_password")[0], "用户名或密码输入有误。");
					}else if(data.res.code == 0){
						window.userInfo = data;
						// 跳转至用户中心页
						// showAccountError("登录成功");
						self.remove();
						// console.log("需要后端信息");
						UC.loginCb.fire("success", data.data);
					}
				}, {"md5":"MD5Password"});
				return false;
			});
			$("#acRegisterForm form").on("submit", function(){
				var $this = $(this);
				var taskList = new TaskList();
				try{
					taskList.add(function(){
						var register_name = $.trim($("#register_name").val());
						if(register_name.length < 3 || register_name.length > 5){
							taskList.reject({formTarget:$this[0], inputTarget:$("#register_name")[0], error:"请输入3到5个字符的昵称"});
						}else{
							taskList.resolve();
						}
					}).add(function(){
						var sMail = $.trim($("#register_mail").val());
						if(sMail.length < 1 || sMail.length > 50){
							taskList.reject({formTarget:$this[0], inputTarget:$("#register_mail")[0], error:"邮箱地址格式不正确"});
							return;
						}
						$.ajax({
							url: "/uc/checkEmail.json?email="+encodeURIComponent(sMail)
							,type: "get"
							,async: true
							,success: function(data){
								if(data.res.code < 0){
									taskList.reject({formTarget:$this[0], inputTarget:$("#register_mail")[0], error:data.res.detail});
								}else if(data.res.code == 0){
									taskList.resolve();
								}
							}
						});
					}).add(function(){
						var register_password = $.trim($("#register_password").val());
						if(register_password.length < 6 || register_password.length > 16){
							taskList.reject({formTarget:$this[0], inputTarget:$("#register_password")[0], error:"密码需为6到16位字符"});
						}else{
							taskList.resolve();
						}
					}).add(function(){
						var register_password = $.trim($("#register_password").val());
						var register_passwordConfirm = $.trim($("#register_passwordConfirm").val());
						if(register_password != register_passwordConfirm){
							taskList.reject({formTarget:$this[0], inputTarget:$("#register_passwordConfirm")[0], error:"两次输入的密码不一致"});
						}else{
							taskList.resolve();
						}
					}).add(function(){
						In("isweak", function(){
							var a = new WeakPasswordChecker();
							var f = a.isWeak($.trim($("#register_password").val()));
							if(f){
								taskList.reject({formTarget:$this[0], inputTarget:$("#register_password")[0], error:"这个密码太简单容易被盗号哦，换一个吧~~"});
							}else{
								taskList.resolve();
							}
						});
					}).add(function(){
						ajaxSubmit($this.get(0), function(data){
							// 注册成功或失败
							if(data.res.code < 0){
								taskList.reject({formTarget:$this[0], inputTarget:$("#register_verification")[0], error:data.res.detail});
							}else if(data.res.code == 0){
								window.userInfo = data;
								// 跳转至用户中心页
								self.remove();
								UC.loginCb.fire("success", data.data);
								taskList.resolve();
							}
						}, {"md5":"MD5Password"});
					}).done(function(){
					}).fail(function(e){
						showAccountError(e.formTarget, e.inputTarget, e.error);
					}).start();
				}catch(e){
					
				}
				return false;
			});
			// 主逻辑 end
		}
		// 私有静态方法 end
		return function(options){
			this._setUsername = function(name){
				username = name;
			}
			this._getUsername = function(name){
				return username;
			}
			init.call(this, options);
			this.$wrap = $("#accountBox");
		}
	})(window, $);
	AccountBox.prototype = {
		remove: function(){
			this._setUsername(this.$wrap.find("#login_mail").val());
			this.outerWrapper.remove();
		}
	}

	/**
		* 用户中心，统一控制呗~
	**/
	var UC = {
		showLogin: function(){
			new AccountBox();
		}
		,loginCb: $.Callbacks({memory:true, unique:true}) // 记忆功能，去重功能
		,checkLogin: function(){
			// 重设deferred对象，等待操作完成
			// 跟后端交互, 检测登录..
			var that = this;
			$.get("/util/getMyUserInfo.jsonp", function(data){
				console.log(data);
				if(data && data.res){
					var res = data.res;
					if(res.code == 0){
						that.loginCb.fire("success", data.data);
					}else{
						that.loginCb.fire("fail", data);
					}
				}
			}, "json").fail(function(data){
				// 清除cookie信息
				var date = new Date();
				date.setDate(date.getDate() - 1);
				document.cookie = "dduid=0;path=/;expires=" + date.toGMTString() + "/";
				
				that.loginCb.fire("fail", data);
			});
			return this;
		}
	};
	// 检测登录之后的回调函数
	// #param {function|null} 成功登录后
	// #param {function|null} 木有登录的时候
	UC.afterCheckLogin = function(sfn, ffn){
		if(sfn || ffn){
			var that = this;
			this.loginCb.add(function(res, data){
				if(res == "success" && sfn){
					sfn(data);
				}else if(ffn){
					ffn(data);
				}
				// 执行一次后，删除之~
				that.loginCb.remove(arguments.callee);
			});
		}
	}
	window.UC = UC;
	module.exports = UC;
});