// Require plug-ins
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var shell = require('gulp-shell');
var del = require('del');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var nunjucksRender = require('gulp-nunjucks-render');

//Global variables
var dirSrc = 'src\\scss src\\img src\\js src\\pages src\\templates src\\templates\\macros src\\templates\\partials';
var dirDst = 'dst\\css dst\\img dst\\js dst\\fonts';
var htmlSrc = 'src/pages/*.html';
var htmlDst = 'dst/';
var sassSrc = [
	'node_modules/bootstrap/scss',
	'src/scss',
];
var cssDst = 'dst/css';
var jsSrc =[
	'node_modules/bootstrap/js/dist/bootstrap.bundle.js',
	'node_modules/bootstrap/js/dist/bootstrap.js',
	'src/js'
];
var jsDst =[
	'dst/js'
];
var fontsSrc = '*';
var fontsDst = 'dst/fonts';
var imgSrc = 'src/img/**/*.+(png|jpg|gif|svg)';
var imgDst = 'dst/img';

// Create directory
var optionsMkdir = {
	ignoreErrors:true,
	verbose:true
};
gulp.task('mkdir', shell.task([
  'mkdir '+dirSrc,
  'mkdir '+dirDst
], optionsMkdir));

// Compile html
gulp.task('html', function(){
	return gulp.src(htmlSrc)
		.pipe(changed(htmlDst))
		.pipe(nunjucksRender({
			path: ['src/templates']
		}))
		.pipe(gulp.dest(htmlDst))
});

// Compile sass files
gulp.task('css', function(){
	return gulp.src(jsSrc[2]+'**/*.scss')
		.pipe(changed(cssDst))
		.pipe(sass({
			includePaths: sassSrc,
			outputStyle: 'expanded'
		}))
			.on('error', sass.logError)
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 9']
		}))
		.pipe(gulp.dest(cssDst));
});

// Concat js files
gulp.task('js', function(){

});

// Copy fonts to dist
gulp.task('fonts', function(){
	return gulp.src(fontsSrc)
		.pipe(gulp.dest(fontsDst));
})

// Optimize images
gulp.task('img', function(){
	var options = {verbose: true}
	return gulp.src(imgSrc)
		.pipe(cache(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imageminMozjpeg({
				quality: 90
			}),
			imageminPngquant({
				quality: 90
			}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		], options)))
		.pipe(gulp.dest(imgDst));
})

// Clear gulp-cache
gulp.task('clear-cache', function(callback){
	return cache.clearAll(callback);
});

// Delete dst contents
gulp.task('clean', function(){
	return del.sync('dst');
});

// Gulp build
gulp.task('build', function(callback){
	runSequence('clean', 'mkdir', ['img', 'html', 'css'], callback);
});

// Gulp watch
gulp.task('watch', function()
{	
	// Watch css
	gulp.watch('src/scss/**/*.scss', ['css']);
	// Watch html
	gulp.watch('src/*.html', ['html']);
	// Watch js
	gulp.watch('src/js/*.js', ['js']);
});
