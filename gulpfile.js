var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	watch = require('gulp-watch');

gulp.task('css', function() {
	gulp.src('public/css/*.css')
		.pipe(livereload())
});
gulp.task('js', function() {
	gulp.src('public/js/**/*.js')
		.pipe(livereload())
});


gulp.task('ejs', function() {
	gulp.src('views/**/*.ejs')
		.pipe(livereload())
});



gulp.task('develop', function() {

	var nodemon = require('nodemon');
	nodemon({
		script: 'app.js',
		ext: 'js json css ejs'
	});

	nodemon.on('start', function() {
		console.log('App has started');
	}).on('quit', function() {
		console.log('App has quit');
	}).on('restart', function(files) {
		console.log('App restarted due to: ', files);
	});

})

gulp.task('default', ['develop', 'css', 'js', 'ejs']);