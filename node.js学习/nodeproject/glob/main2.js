var minimatch = require("minimatch"),
	Minimatch = require("minimatch").Minimatch;
// minimatch测试

console.log("bar.foo match *.foo :" + minimatch("bar.foo", "*.foo"));
console.log("bar.foo match *.+(bar|foo):" + minimatch("bar.foo", "*.+(bar|foo)"));


var filst = [
	"./a/b/c/d.js",
	"./a/x/y.css",
	"./mm/kky/aab.js",
	'./y/dd/abc'
];
console.log("file filter", filst.filter(minimatch.filter("./**/*.js")));

console.log("file filter2", filst.filter(minimatch.filter("*.js", {matchBase: true/*忽略路径*/})));

// 列表匹配
var list1 = minimatch.match(filst, "./y/**/a{b,d,e}c", {/*这里一定要有*/});
console.log(list1);


// 测试一下MiniMathc
var mm = new Minimatch("./a{b,c,d}/*.cc", {});
// 搞不懂glob中，需要自己new出来的含义~？
console.log(mm.pattern, mm.options);
// 列举所有拓展
console.log(mm.braceExpand());
// 转化为正则
console.log(mm.makeRe());



