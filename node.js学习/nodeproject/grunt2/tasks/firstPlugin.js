/*
 * firstPlugin
 * https://github.com/linfenpan/grunt2
 *
 * Copyright (c) 2015 da宗熊
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var util = require("util");

  grunt.registerMultiTask('firstPlugin', 'My First Grunt Plugin', function() {
    // Merge task-specific and/or target-specific options with these defaults.
	// 合并参数，不过不调用这个方法，那就木有参数吗？
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
	  /**
	   * f就是这么一个对象:
	   * {
			src: [当前需要处理的文件列表],
			dest: '处理后的目标文件',
			org: {
				src: [文件列表],
				dest: '处理后的文件'
			}
		 }
	   */
	  
	  // 文件列表
	  var list = f.src;
	  // 筛选文件
	  var src2 = list.filter(function(filePath){
		// 如果文件不存在，则不要之~
		if(grunt.file.exists(filePath)){
			return true;
		}else{
			grunt.log.wart("文件:" + filePath + "不存在");
			return false;
		}
	  });
	  // map与forEach不一样，它类似与jQuery的map方法
	  // 返回一个新的列表
	  src2 = src2.map(function(filePath){
		return grunt.file.read(filePath);
	  });
	  // 然后就可以操作咯~
	  console.log(src2);
	  /*
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));
	  src += options.punctuation;
	  */
	  
	  // 添加一些操作
		src2 =  src2.join(options.separator);
        src2 = "\/*author:da宗熊*\/" + "\n" + src2;
		
	  // 往目标文件，写入内容
	  // f.dest是目标路径，src是处理之后的内容
      grunt.file.write(f.dest, src2);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
