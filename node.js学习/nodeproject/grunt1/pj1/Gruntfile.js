var basePath = "./pj1/", commonTaskFn = require("../Gruntfile");

module.exports = function(grunt){
  // 统一要使用这个函数...
  commonTaskFn(grunt, basePath);
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	// 脚本合并插件
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
	  // src 和 files 是不能同时存在...
      build1: {
        src: './src/common.js',
        dest: './script/maxin.min.js'
      },
	  build2: {
		files: {
			"./script/index.js": "./src/index.js",
			"./script/list.js": ["./src/common.js", "./src/game-list.js"]
		}
	  },
	  build3: {
		files: [
			{
				src: "./src/game-list.js",
				dest: "./script/glist.js"
			}
		]
	  }
    },
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
					expand: true,
					cwd: "src/",
					src: ['**/*.js'],
					dest: 'script/',
					ext: '.gz.js'
				}
			]
		},
		main2: {
			// 对src/index.js进行gzip压缩
			src: "src/index.js",
			dest: "script/index.gz.js"
		}
	}
	// css压缩
	,cssmin: {
		options: {
			// 这两个参数，都不知道有什么作用的说..
			shorthandCompacting: true,
			roundingPrecision: 111
		},
		target: {
			files: {
				"style/output.css": ["css/common.css", "css/index.css"]
			}
		},
		target2: {
			files: [
				{
					// 除去.min.css后缀的文件，进行逐个文件压缩
					expand: true,
					cwd: "css/",
					src: ["**/*.css", "!*.min.css"],
					dest: "style/",
					ext: ".min.css"
				}
			]
		}
	}
	// 文件合并
	,concat: {
		options: {
			// 文件与文件的间隔
			separator: "\n;\n",
			banner: "/* 就是个开头... */\n",
			process: function(src, filepath) {
			  // 给合并文件添加头部，把'use strict'放置在最顶部..
			  return '// Source: ' + filepath + '\n' +
				src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
			}
		},
		main1: {
			files: [{
				src: ["src/index.js", "src/common.js"],
				dest: "script/concat.index.js"
			}]
		}
	}
	// 文件拷贝
	,copy: {
		main: {
			// 把所有文件拷贝到copy_style目录下
			files: [
				{
					expand: true,
					src: "**/*",
					cwd: "css/",
					dest: "copy_style/",
					filter: "isFile"
				},
				{
					// 就算这样子写，都只是拷贝一个文件了.
					src: "src/*.js",
					dest: "copy_script/"
				}
			]
		}
	}
	// 压缩html文件
	,htmlmin: {
		options:{
			removeComments: true, // 删除注释
			collapseWhitespace: true	// 合并空格和换行
		}
		,main: {
			files: {
				"html_html/index.html": "index.html"
			}
		}
		,main2: {
			files: [
				{
					// 测试了下，列表是木有用的..
					src: ["index.html", "detail.html"],
					dest: "html_html/index2.html"
				}
			]
		}
	}
	// less测试
	,less: {
		main: {
			options: {
				path: "assets/" // @import的跟目录
				,rootpath: "assets/" // 每个url资源自动添加前缀
				,compress: false // 压缩否？
				,ieCompat: true // 是否兼容ie8？
				,optimization: 1000 // 优化等级？
				,banner: "/* 放在最前面的注释.. */"
				,modifyVars: {
					// 改写less文件里的变量值
					imagePath: '"http://www.100bt.com/bear.png"'
				}
			},
			files: {
				"assets/css/res.css": "assets/less/res.less"
			}
		}
	}
	// clean测试
	,clean: {
		main: {
			// 需要删除的目录
			src: ["clean_script"]
		},
		main2: {
			// 删除目录下的脚本文件，除了.min.js结尾的
			src: ["script/*.js", "!script/*.min.js"]
		}
	}
	// jade测试
	,jade: {
		main: {
			options: {
				// 需要注入到jade模版里的数据
				data: {
					debug: false
				}
			},
			files: [
				{
					src: "jade/test.jade",
					dest: "jade/test.html"
				}
			]
		},
		main2: {
			options: {
				data: function(dest, src){
					return {
						author: "da宗熊",
						from: src,
						to: dest
					}
				}
			},
			files: {
				"jade/test1.html": "jade/test1.jade"
			}
		}
	}
	// watch测试
	,watch: {
		options:{
			debounceDelay: 250, // 延迟多少毫秒
			spawn: false, // 设置为false，让watch任务跑在子线程上
			reload: false, // 是否监听Gruntfile.js的更变，true，则自动重启watch任务
		},
		less: {
			files: ['assets/less/*.less'],
			tasks: ['less']
		},
		scripts: {
			files: ["src/*.js"],
			tasks: ["compress"]
		}
	}
  });
  
  // 设置一个配置
  grunt.config.set("uglify.options.mangle.except", ["require", "module", "exports"]);

  // 自定义任务..
  grunt.registerTask('job', ['uglify', 'concat']);
  
  // 请在注册玩任务之后，在调用这个改写目录，因为，
  // 它修改的是process.chdir，把子进程的相对目录全更改了
  // 如果一开始就设置，则会导致依赖的控件，无法找到
  // grunt.file.setBase(basePath);

};