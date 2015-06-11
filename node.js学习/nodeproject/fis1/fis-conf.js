// 配置uglify-js优化器
fis.config.merge({
	settings: {
		optimizer: {
			"uglify-js": {
				mangle : {
					except : "require"   //如果是多个可以使用 ["require", "jQuery"]
				},
				output: {
					// 将字符串全部转为ascii字符
					ascii_only: true,
					// 保留注释
					comments: true
				},
				compress: {
					// 压缩参数
				}
			}
		}
	}
});

// -pack命令配置
// 使用此命令，只是做了单纯的合并操作，并不会改写文件的引用
fis.config.set("pack", {
	"lib/common.js": [
		"script/common.js",
		"script/ddPager.js"
	]
});
// 利用fis-postpackager-simple插件，可以自动将页面中  的独立资源引用替换为打包的资源
fis.config.set("modules.postpackager", "simple");

// 有了simple插件，我们还可以按页面进行自动合并，将没有通过pack设置打包的零散资源，自动合并起来
// 但是慎用哦~，打包后的资源，一般放在pkg文件夹下
fis.config.set("settings.postpackager.simple.autoCombine", true);

// 开启图片合并插件
// 为所有样式资源开启csssprites
// 注: 会把所有background-size干掉哦~
// BUT: 如果csssprites里，设置了scale，则会自动补上background-size属性，但是是固定px的~
fis.config.set("roadmap.path", [{
	reg: "**.css",
	useSprite: true
}]);
// 设置csssprites的默认属性
fis.config.set("settings.spriter.csssprites", {
	margin: 10, // 间距10
	layout: "matrix" //矩阵排列方式，默认是线性"linear"
	,scale: 1.2
});
// PS: 使用csssprites合并的图片需要在图片路径处添加query标识，即: url(img_s/aa.png?__sprite);


// 更改sprite默认的生成路径
/*
var paths = fis.config.get('roadmap.path') || [];
paths.unshift({
    reg: /.*\/(.*_(?:x|y|z)\.png)$/i,
    release: '/static/comb/$1'
});

fis.config.set('roadmap.path', paths);
*/