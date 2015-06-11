var child_process = require("child_process");
var util = require("util");

var exec = child_process.exec;





var ls = child_process.execFile("test.bat", {
	input: "a"
}, function(){
	console.log("end...");
});
ls.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
  ls.pause(false);
});

ls.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

ls.on('close', function (code) {
  console.log('child process exited with code ' + code);
});