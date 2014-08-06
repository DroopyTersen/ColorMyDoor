var gulp = require("gulp");
var argv = require("optimist").argv;
var open = require("gulp-open");

var EXPRESS_PORT = argv.port || 5000;
var LIVERELOAD_PORT = 35729;
var DEFAULT_PAGE = "index.html";
var liveReload = null;

var paths = {
	html: [ "*.html", "views/**/*.html"],
	scripts: ["*.js", "scripts/**/*.js"],
	styles: ["styles/**/*.css"]
};

var startLiveReload = function() {
	liveReload = require("tiny-lr")();
	liveReload.listen(LIVERELOAD_PORT);
	console.log("Live Reload listening on port " + LIVERELOAD_PORT);
};

var notifyLiveReload = function(event) {
	var filename = require('path').relative(__dirname, event.path);
	console.log(filename);
	liveReload.changed({
		body: {
			files: [ filename ]
		}
	});
};

var setupWatch = function() {
	for (var pathName in paths) {
		if (paths.hasOwnProperty(pathName)){
			gulp.watch(paths[pathName], notifyLiveReload);
		}
	}
};

var openBrowser = function() {
	var options = {
		url: "http://localhost:" + EXPRESS_PORT
	};
	gulp.src("./" + DEFAULT_PAGE).pipe(open("", options));
};

var startExpress = function() {
	var express = require("express");
	var app = express();
	//this puts a snippet of js on our page that will respond to file changes
	app.use(require("connect-livereload")({ port: LIVERELOAD_PORT}));
	//this makes our static files servable
	app.use(express.static(__dirname));
	//this starts the server
	app.listen(EXPRESS_PORT);
	console.log("Server started on port " + EXPRESS_PORT);
};

gulp.task("default", function() {
	startExpress();
	startLiveReload();
	setupWatch();
	openBrowser();
	console.log("Gulp is running");
});
