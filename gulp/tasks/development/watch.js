var gulp   = require('gulp');
var config = require('../../config').watch;
var browserSync = require('browser-sync');
// var reload = require('browser-sync').reload;
/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch', ['browserSync'], function() {
    gulp.watch([config.styles, config.scripts, config.htmls, config.images]).on('change', function (event) {
        gulp.src(event.path)
            // .pipe(browserSync.reload({ stream: true }));
            .pipe(browserSync.stream());
    });
});
