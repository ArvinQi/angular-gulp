/**
 * Generate CSS from SCSS
 * Build sourcemaps
 */
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var config = require('../../config').sass;
var rubySass = require('gulp-ruby-sass');
var plugins = require('gulp-load-plugins')();
gulp.task('sass', ['scss'],function () {
    gulp.watch(config.src, ['scss']);
})
gulp.task('scss', function () {
    var sassConfig = config.options;

    sassConfig.onError = browserSync.notify;

    // Don’t write sourcemaps of sourcemaps
    // var filter = plugins.filter(['*.css', '!*.map'], { restore: true });

    browserSync.notify('Compiling Sass');

    return rubySass(config.src, sassConfig)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.autoprefixer(config.autoprefixer))
        // .pipe(filter) // Don’t write sourcemaps of sourcemaps
        .pipe(plugins.sourcemaps.write('../maps'))
        // .pipe(filter.restore) // Restore original files
        .pipe(gulp.dest(config.dest));
});