module.exports = function(grunt, chdir){

  // 因为是给子文件夹共享的，所以，这里将路径暂时设置为父层目录
  grunt.file.setBase("../");
  
  // 加载父层目录的插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-watch");
  
  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);
  
  // 或者使用 grunt.file.setBase(path)设置
 grunt.file.setBase(chdir);
}