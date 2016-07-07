/**
 * Generate CSS from SCSS
 * Build sourcemaps
 */
var config = require('./gulp/config');
var rubySass = require('gulp-ruby-sass');
gulp.task('sass', function () {
    var sassConfig = config.sass.options;

    sassConfig.onError = browserSync.notify;

    // Don’t write sourcemaps of sourcemaps
    var filter = plugins.filter(['*.css', '!*.map'], { restore: true });

    browserSync.notify('Compiling Sass');

    return rubySass(config.sass.src, sassConfig)
        // .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.autoprefixer(config.autoprefixer))
        // .pipe(filter) // Don’t write sourcemaps of sourcemaps
        .pipe(plugins.sourcemaps.write('../maps'))
        // .pipe(filter.restore) // Restore original files
        .pipe(gulp.dest(config.sass.dest));
});