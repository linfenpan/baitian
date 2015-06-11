/*
 * firstPlugin
 * https://github.com/linfenpan/grunt2
 *
 * Copyright (c) 2015 da宗熊
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    firstPlugin: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },
	
	log: {
		bar: "hello",
		obj: {
			options: {
				red: true
			},
			x: 11, y: 12
		},
		mm: [1, 2, 3, 4]
	}

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'firstPlugin']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
  
  var util = require("util");
  // 创建一个多任务
  grunt.registerMultiTask("log", "自定义的任务", function(){
	console.log(this.target, this.data);
	console.log(this.options({}), this.files);
	
	console.log(util.inspect(util, false));
  });

};
