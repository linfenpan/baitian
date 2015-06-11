var minimatch = require("minimatch"),
	Minimatch = require("minimatch").Minimatch;
// minimatch����

console.log("bar.foo match *.foo :" + minimatch("bar.foo", "*.foo"));
console.log("bar.foo match *.+(bar|foo):" + minimatch("bar.foo", "*.+(bar|foo)"));


var filst = [
	"./a/b/c/d.js",
	"./a/x/y.css",
	"./mm/kky/aab.js",
	'./y/dd/abc'
];
console.log("file filter", filst.filter(minimatch.filter("./**/*.js")));

console.log("file filter2", filst.filter(minimatch.filter("*.js", {matchBase: true/*����·��*/})));

// �б�ƥ��
var list1 = minimatch.match(filst, "./y/**/a{b,d,e}c", {/*����һ��Ҫ��*/});
console.log(list1);


// ����һ��MiniMathc
var mm = new Minimatch("./a{b,c,d}/*.cc", {});
// �㲻��glob�У���Ҫ�Լ�new�����ĺ���~��
console.log(mm.pattern, mm.options);
// �о�������չ
console.log(mm.braceExpand());
// ת��Ϊ����
console.log(mm.makeRe());



