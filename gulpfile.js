var gulp = require('gulp');
var _ = require('lodash');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var nodemon = require('gulp-nodemon');
var config = require('./gulp.conf.json');

gulp.task('default', ['build'], function() {});

gulp.task('clean', function(cb) {
    del.sync([config.server.dest]);
    cb();
});

gulp.task('server-scripts', function() {
    return gulp.src(config.server.scripts)
        .pipe(plugins.babel())
        .pipe(gulp.dest(config.server.dest))
        .on('error', throwErr);
});

gulp.task('lint', function() {
    return lintFiles(config.server.scripts);
});

gulp.task('build', ['clean', 'lint', 'server-scripts'], function() {});

gulp.task('serve', ['build', 'env:dev'], function() {
    //watch dev src files for changes
    gulp.watch(config.server.scripts, ['server-scripts']);
    //Run nodemon in dest folder
    nodemon({
        script: config.server.dest + '/server.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('env:dev', function() {
    process.env.NODE_ENV = 'development';
});

gulp.task('env:test', function() {
    process.env.NODE_ENV = 'test';
});

function lintFiles(files) {
    return gulp.src(files)
        .pipe(plugins.eslint('./eslint.conf.json'))
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError())
        .on('error', throwErr);
}

function throwErr(err) {
    throw err;
}
