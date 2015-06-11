var util = require("util");
var oop = require("./lib/fileOperation");
var Factory = require("./lib/tmpFactory");
var cnf = require('./config');

/*
process.title = "DouDou Game compiler";

// process.cwd() 当前node运行的目录
console.log('***        process.cwd() = ' + process.cwd() + ' ***');
// module.filename == __filename，是当前运行的文件
console.log('***      module.filename = ' + module.filename + ' ***');
console.log('***           __filename = ' + __filename + ' ***');
// 该行代码运行的目录
console.log('***            __dirname = ' + __dirname + ' ***');
// node.js启动的文件
console.log('*** require.main.filename= ' + require.main.filename + ' ***');

var path = require("path");
// node启动的所有参数，[node, 当前启动的文字, 额外的参数...]
// console.log(process.argv);
console.log(path.join(process.cwd(), "c:\\test\\a"));
*/
var fs = require("fs"), path = require("path");
var myPath = "./", 
	fileName = "index.html", 
	newName = "index2.html";
// 遍历所有目录..，isCompileAllFile = false，则编译最多到达二级目录
var isCompileAllFile = true;
// 编译目录
// @param pathName {String} 需要编译的目录
// @param fileName {String} 需要编译的文件名
// @param newName  {String} 编译后，新的文件名
// @param isComplieSecond {Boolean} 是否要遍历二级目录
function compilePath(pathName, fileName, newName, isComplieSecond){
	var pp = fs.readdirSync(pathName);
	for(var i = 0, max = pp.length; i < max; i++){
		// 全目录名
		var fullPath = path.join(pathName, pp[i]);
		// 如果跟需要处理的文件同名
		if(fileName == pp[i]){
			// 文件存在，则处理啦
			console.log("Hit file:" + fullPath);
			// path.dirname(fullPath), 找到文件的目录名称..
			compileFile(path.dirname(fullPath), fileName, newName);
		}else if(isComplieSecond && fs.lstatSync(fullPath).isDirectory()){
			// 如果是目录，则应该重新遍历..
			compilePath(fullPath, fileName, newName, isCompileAllFile ? true : false);
		}
	}
}

// 编译文件
// @param myPath {String} 文件路径
// @param fileName {String} 被编译的文件的名字
// @param newName {String}  编译后的新文件的名字
function compileFile(myPath, fileName, newName){
	var ft = new Factory(cnf);
	// 初始化模版
	ft.initHtmlWithCnf(oop.readFile(path.join(myPath, fileName)));
	// 删除不必要的icon信息
	ft.pushData('icon-replace', "");
	// 替换掉公用的内容
	ft.pushData('head-append', oop.readFile("./tmp/head.tmp"));
	ft.pushData('body-append', oop.readFile("./tmp/body.tmp"));
	ft.pushData('html-append', oop.readFile("./tmp/bodyAfter.tmp"));

	// 测试一下
	var text = oop.readFile(path.join(myPath, fileName));
	oop.writeFile(path.join(myPath, newName), ft.generateFile());
}

compilePath(myPath, fileName, newName, true);

