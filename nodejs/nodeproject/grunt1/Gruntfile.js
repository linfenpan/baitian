module.exports = function(grunt, chdir){

  // ��Ϊ�Ǹ����ļ��й���ģ����ԣ����ｫ·����ʱ����Ϊ����Ŀ¼
  grunt.file.setBase("../");
  
  // ���ظ���Ŀ¼�Ĳ��
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
  
  // Ĭ�ϱ�ִ�е������б�
  grunt.registerTask('default', ['uglify']);
  
  // ����ʹ�� grunt.file.setBase(path)����
 grunt.file.setBase(chdir);
}