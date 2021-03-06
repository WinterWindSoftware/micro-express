var gulp = require('gulp');
var _ = require('lodash');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var config = require('./gulp.conf.json');

gulp.task('default', ['build'], function() {});

gulp.task('clean', function(cb) {
    del.sync([config.server.dest, config.client.dest]);
    cb();
});

gulp.task('server-scripts', function() {
    return gulp.src(config.server.scripts)
        .pipe(plugins.babel())
        .pipe(gulp.dest(config.server.dest))
        .on('error', handleError);
});

gulp.task('html', function() {
    var cfg = config.client;
    return gulp.src(cfg.html)
        .pipe(gulp.dest(cfg.dest))
        .on('error', handleError);
});

gulp.task('styles', function() {
    var cfg = config.client.less;
    return gulp.src(cfg.main)
        .pipe(plugins.less({
            paths: cfg.paths
        }))
        .pipe(gulp.dest(cfg.dest))
        .on('error', handleError);
});

gulp.task('lint', function() {
    return lintFiles(config.server.scripts);
});

gulp.task('build', ['clean', 'lint', 'server-scripts', 'html', 'styles'], function() {});

gulp.task('serve', ['build', 'env:dev'], function() {
    //watch dev src files for changes
    gulp.watch(config.server.scripts, ['server-scripts']);
    //Run nodemon in dest folder
    plugins.nodemon({
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

gulp.task('test:server', ['lint', 'server-scripts', 'env:test'], function() {
    return gulp.src('./build/server/**/*.spec.js', {read: false})
        .pipe(plugins.mocha({reporter: 'spec'}))
        .pipe(plugins.exit())
        .on('error', handleError);
});

gulp.task('test', ['test:server'], function() {});

function lintFiles(files) {
    return gulp.src(files)
        .pipe(plugins.eslint('./eslint.conf.json'))
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError())
        .on('error', handleError);
}

function handleError(err) {
    console.error(err);
    this.emit('end');
}
