var gulp   = require('gulp');
var config = require('../../config').watch;
var reload = require('browser-sync').reload;
/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(option.less.src, ['less']);
    gulp.watch([root + '/**/*.css']).on('change', function (event) {
        // console.log('Event type: ' + event.type);
        // console.log('Event path: ' + event.path);
        gulp.src(event.path)
            .pipe(browserSync.reload({ stream: true }));
    });
});
