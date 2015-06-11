var fs = require("fs"), 
	path = require("path"),
	glob = require("glob");
// 缺少外链不存在的检测
// 绝对路径检测没有跳过
/*
console.log(fs.existsSync("ad"));
mkdir("ad/bb/cc/ee/a.txt");

console.log(fs.existsSync("./mm/a"));
console.log(path.join.apply(path, ["./", "a"]));
*/
// 文件操作
//var opera = require("./lib/fileOperation");
//opera.copy("mmm", "kkk");

var compiler = require("./lib/compiler"),
	fileOp = require("./lib/fileOperation"),
	newPath = "./dest", oldPath = "";
// console.log(compiler.compile("./test.html", {path: "./20151031/"}));

// 遍历文件
glob.sync(oldPath + "*.{html,htm}", {matchBase: true}).forEach(function(abs){
	var res = compiler.compile(abs, {path: "./"}),
		basePath = path.dirname(abs);
		
	// 按照basePath，进行文件拷贝~，如果是在res里的，则排除
	var map = {}, pageArr = abs.split(/\\|\//);
	res.list.forEach(function(item){
		map[path.join(basePath, item["old"])] = path.join(newPath, item["new"]);
	});
	// 当前页面不要碰
	map[path.join("./", abs)] = 1;
	
	// 目录遍历，排除在map中的文件
	function readdir(src, dst){
		console.log("复制:" + src + " -> " + dst);
		if(!fs.existsSync(dst)){
			fs.mkdirSync(dst);
		};
		fs.readdirSync(src).forEach(function(ph){
			// 目标路径
			var _src = path.join(src, ph), _dst = path.join(dst, ph);
			var stat = fs.statSync(_src);			
			if(stat.isDirectory()){
				readdir(_src, _dst);
			}else if(stat.isFile()){
				if(!map[_src]){
					var readStream = fs.createReadStream(_src);
					readStream.pipe(fs.createWriteStream(_dst));
				}else if(typeof map[_src] === "number"){
					// 首页要做特殊处理
					console.log("创建页面....");
					fileOp.write(_dst, res.text);
					console.log("创建:" + _dst);
				}
			}
		});
	};
	readdir(basePath, newPath);
	
	// 根据map的内容，重新建立
	for(var i in map){
		var newFile = map[i], oldFile = i;
		// 首页不操作
		if(typeof newFile === "number")continue;
		
		var readStream = fs.createReadStream(oldFile),
			base = path.dirname(newFile);
		
		// 先尝试判定文件是否存在
		if(!fs.existsSync(base)){
			fileOp.mkdir(base);
		};
		readStream.pipe(fs.createWriteStream(newFile));
		console.log("创建:" + newFile);
	};

});

