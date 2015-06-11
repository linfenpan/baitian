// 公共模块管理，到底要做什么功能呢？
// 基本:
// 1、根据模块名，合并脚本				[OK]
// 2、根据模块名，合并样式，拉取资源	[OK]

// 延伸：
// 1、脚本之间的依赖关系，如何定义？
// 2、样式之间，如何定义依赖呢？


// var path = require("path"), fs = require("fs");
var minimatch = require("minimatch");
var findAll = require("./lib/findAll");

var args = ["a", "b"];

var mod = require("./lib/modules");
var mcompiler = require("./lib/mCompiler");



var $ = require("./lib/tool");
var pkg = {
	aaa: ["a():theme()", "b"]
};
var options = {
	dist: ""
};
var res = mcompiler.compile(pkg.aaa);

console.log(res);

// console.log(mod.js(["a", "b"]));

// var access = require("./lib/access");
// var jsList = mod.image(["a:theme(red):", "b"]);
// console.log(jsList);
// access.combine("./test/core.js", jsList);

// var list = fs.readdirSync("./modules");

// console.log(fs.existsSync('./modules/bbb/cc.txt'));

// 存储器
// 
// access.combine("./test/core.js", ["main.js", "package.json"]);