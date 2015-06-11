var basePath = "./pj2/", commonTaskFn = require("../Gruntfile");

module.exports = function(grunt){
  // 统一要使用这个函数...
  commonTaskFn(grunt, basePath);
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	// 压缩插件
	compress: {
		options: {
			// 参数
			archive: "archive.zip",
			mode: "gzip"
		},
		main:{
			files: [
				{
					// 对src目录下的所有文件，进行gzip压缩
					// BUT要知道，如果没有设置gzip解析，浏览器是不认识这压缩后的玩意的
					expand: true,
					cwd: "./script",
					src: ['*.js'],
					dest: './src',
					ext: '.gz.js'
				}
			]
		}
	}
	
  });
  
  // 自定义任务..
  grunt.registerTask('default', ['compress']);
  
  // 请在注册玩任务之后，在调用这个改写目录，因为，
  // 它修改的是process.chdir，把子进程的相对目录全更改了
  // 如果一开始就设置，则会导致依赖的控件，无法找到
  // grunt.file.setBase(basePath);

};