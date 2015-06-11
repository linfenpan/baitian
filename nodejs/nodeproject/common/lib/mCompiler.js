/**
 * 编译器
 * @description 编译modules的json配置
 * @author da宗熊
 * @email 384858402@qq.com
 */

 
var fs = require("fs"), path = require("path"), $ = require("./tool");
var modules = require("./modules");
var LinkList = require("./LinkList");

var operationConfig = {
	_module: {
		all: false, // 检查孙级文件夹
		include: true // 是否包含表层文件
	},
	theme: {
		all: true,
		include: true
	},
	_other: {
		all: true,
		include: false
	}
};

var proto = {
	_map: {}, // 依赖map moduleName: {name: 板块名字, list: [], pkg: 包信息, isRely: 是否已经修正过rely了[false]}
	_pkg: {}, // 包数据
	_dsc: {}, // 声明
	/**
	 * 出入配置列表，进行编译
	 * @param list {Array|String} ["moduleName(version?):theme(version?)"]
	 */
	compile: function(list){
		// 编译当前列表
		this._compile(list);
		
		// 加载依赖项目
		this._complieRelyAndFixRely();
		
		// 理顺this._map中的依赖
		var res = this._sortMapByRely();
		$.log(res);
		
		var list = [];
		// 整合list里的数据
		res.forEach(function(v, i){
			console.log(v);
			v.list && v.list.length > 0 && this.push({
				list: v.list,
				name: v.name
			});
		}.bind(list));
		
		return list;
	},
	_compile: function(list){
		if($.type(list) !== "array"){
			list = [list]
		};
		
		// 编译配置文件，把生成内容，放置在this._map中
		list.forEach(function(item, index){
			this.compileOne(item);
		}.bind(this));
		
	},
	// 管理依赖
	_complieRelyAndFixRely: function(){
		var map = this._map, item, rely, pkg;
		// console.log(map);
		for(var i in map){
			if(map.hasOwnProperty(i)){
				item = map[i];
				pkg = item.pkg;
				rely = pkg && pkg.rely;
				
				// 把依赖管理起来
				if(rely && rely.length > 0 && !item["isRely"]){
					item["isRely"] = true;
					// console.log("..............................modules: " + i);
					
					// 去除重复板块
					rely = rely.filter(function(v, i){
						return !this._map[this.__compileOne(v).module];
					}.bind(this));
					rely.length > 0 && this._compile(rely);
					
					// 修正rely的字段名字~
					// 将 [b:theme(xxx), c()] => [b, c]
					rely = pkg.rely;
					rely.forEach(function(v, j){
						rely[j] = this.__compileOne(v).module;
					}.bind(this));

				}else{
					item["isRely"] = true;
				}
			}
		}
	},
	// 理顺this._map中的数据
	_sortMapByRely: function(){
		var map = this._map;
		var footer = new LinkList(null), item, node, rlist;
		for(var i in map){
			if(map.hasOwnProperty(i)){
				item = map[i];
				node = footer.findPrev(item);
				if(!node){
					node = new LinkList(item);
					footer.prepend(node);
				}
				// 修正pkg中的关系
				if(item.pkg && item.pkg.rely && item.pkg.rely.length > 0){
					rlist = item.pkg.rely;
					console.log("........................", rlist);
					rlist.forEach(function(v, i){
						// 需要先解析..
						// console.log(map);
						if(!node.find(map[v])){
							node.prepend(map[v]);
						}
					}.bind(this));
				}
			}
		};
		var res = footer.overview();
		// 最后一项，是空的说~
		res.pop();
		return res;
	},
	/**
	 * 编译单项
	 * @param item {String} 配置, moduleName(version?):theme(version?):other(version?)
	 */
	compileOne: function(item){
		if(!item){return [];}
		
		// 解析配置
		var arr = item.split(":"), res = [];
		
		// 第一项是特殊的
		var firstDeclare = arr.shift(), first, moduleName;
		if(firstDeclare){
			// 前任一般都很特别的嘛~，它包含了操作的根目录
			first = this._compileFirst(firstDeclare);
			moduleName = first.module;

			// 防止重复编译
			if(this._map[moduleName]){
				return this._map[moduleName];
			};
			
			first = this._compileOne(firstDeclare, first.module, "_module");
			res.push(first);
			// console.log("这里", first);
		}
		console.log("moduleName: " + moduleName);
		
		// 每一项都修正读取一次配置
		arr.forEach(function(mod, index){
			res.push(this._compileOne(mod, moduleName));
		}.bind(this));
		
		// res就是所有配置了
		// 根据res，来读取数据
		var datas = [];
		res.forEach(function(item, index){
			var dd = this._compileConfig(item);
			// console.log("编译结果:",  dd);
			datas.push.apply(datas, dd);
		}.bind(this));
		
		// 记录在缓存，key代表权重，权重越小，放置在越后面
		this._map[moduleName] = {name: moduleName, list: datas, pkg: this._pkg[moduleName], isRely: false};
		
		return datas;
	},
	/**
	 * 编译第一个元素
	 */
	_compileFirst: function(declare){
		var item = this.__compileOne(declare);
		var module = item.module, version = item.version;
		// 读取module下的package信息
		var pkg = this._pkg[module] || (this._pkg[module] = modules.readPkg(module), this._pkg[module]);
		if(version){
			pkg.path = version;
		}
		return item;
	},
	/**
	 * 具体如何编译
	 * @param declare {String} 语句声明
	 * @param root {String} 根目录
	 * @param mod {String} 编译模式
	 */
	_compileOne: function(declare, root, mod){
	
		var root = root || "";
		// 解析声明
		var obj = this.__compileOne(declare), 
			folder = obj.module,
			version = obj.version;
		
		// 修正配置
		var mod = operationConfig[mod || folder] || operationConfig["_other"];
		
		// 没有声明root的，folder就是当前的root
		// root = root == "" ? folder : root;
		// 读取root下的package信息
		var pkg = this._pkg[root] || {};
		// 真正的root目录
		var realPath = path.join(root, pkg.path || "");
		
		return {
			folder: root != folder ? path.join(realPath, folder) : realPath,	// package中的path字段，可以制定默认的路径【即版本】
			module: folder,
			root: root,
			version: version || pkg[folder] || "", // package中的配置，为默认值
			pkg: pkg,
			mod: mod
		}
	},
	/**
	 * 已经无力在去想名字了，让它随风而死吧
	 */
	__compileOne: function(declare){
		// 解析声明
		if(!this._dsc[declare]){
			var arr = /(^[^(]+)\(?([^)]*)\)?/.exec(declare), 
				folder = arr[1],
				version = arr[2].replace(/'|"/g, "");
			this._dsc[declare] = {module: folder, version: version};
		}
		return this._dsc[declare];
	},
	/**
	 * 编译配置
	 * @param item {Object} 配置{folder:文件夹, version:子文件夹, mod: {all:拷贝孙级文件夹} }
	 */
	_compileConfig: function(item){
		$.log(item);
		var folder = item.folder;
		if(modules.exist(folder)){
			
			var mod = item.mod, version = item.version;
			var res = [];
			
			// 包含表层文件..
			if(mod["include"]){
				res.push.apply(res, modules.find("!("+ item.root +".json)", folder, false));
			}
			
			// 检查version版本..
			var versionPath = path.join(folder, version);
			if(modules.exist(versionPath)){
				if(versionPath != folder){
					res.push.apply(res, modules.find("*", versionPath, mod.all));
				}
			}else{
				console.warn(versionPath + "不存在..");
			}
			
			return res;
		}else{
			console.warn(item.folder + "不存在...");
			return [];
		}
	},
	// 给外部提供代理
	proxy: function(){
		var p = Object.create(this);
		p._map = {};
		p._dsc = {};
		p._pkg = {};
		return p;
	}
};



var mcompiler = module.exports = proto.proxy();


