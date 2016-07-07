var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

gulp.task('web', ['less'], function () {

    browserSync.init({
        // server: {
        //     baseDir: './'
        // }
        proxy: '127.0.0.1',
        notify: true,
        ghostMode: {
            clicks: true,
            location: true,
            forms: false,
            scroll: true
        }
    });
    var root = 'web';
    gulp.watch(option.less.src, ['less']);
    gulp.watch([root + '/**/*.css']).on('change', function (event) {
        // console.log('Event type: ' + event.type);
        // console.log('Event path: ' + event.path);
        gulp.src(event.path)
            .pipe(browserSync.reload({ stream: true }));
    });
    gulp.watch([root + '/**/*.html']).on('change', function (event) {
        gulp.src(event.path)
            .pipe(browserSync.reload({ stream: true }));
    });
    gulp.watch([root + '/**/*.js', '!node_modules/**/*']).on('change', function (event) {
        gulp.src(event.path)
            .pipe(browserSync.reload({ stream: true }));
    });
});

// gulp.task('default', ['web']);

gulp.task('less', function () {
    gulp.src(option.less.src, { base: option.less.base })
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(plugins.sourcemaps.write('../maps'))
        .pipe(gulp.dest(option.less.dest));
});

gulp.task('img', function () {
    return gulp.src(option.img.src) //引入所有需处理的JS
        .pipe(plugins.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })) //压缩图片
        // 如果想对变动过的文件进行压缩，则使用下面一句代码
        .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(option.img.dest))
        .pipe(plugins.notify({
            message: '图片处理完成'
        }));
});
//file
var rel = './web-release';
var option = {
    less: {
        src: ['web/_lib/nuke/less/*.less'],
        dest: 'web/_lib/nuke/css',
        base: 'web/_lib/nuke/less'
    },
    img: {
        src: ['web/img/**/*'],
        dest: 'web/images',
        base: 'web/img'
    },
    release: rel,
    minjs: {
        src: [
            'web/bower_components/jquery/dist/jquery.min.js',
            'web/_lib/jquery_plugins/nuke.js',
            'web/_lib/angular_plugins/dirPaginate/dirPaginate.js',
            // 'web/_lib/angular_plugins/angular-extend.js',
            // 'web/_lib/base/common.js',
            // 'web/_lib/nuke/js/management_v1.0.0.js'
        ],
        dest: rel + '/pkg/js',
        base: ''
    },
    mincss: {
        src: [
            'web/_lib/jquery_plugins/jquery-ui-1.11.4/jquery-ui.css',
            'web/_lib/jquery_plugins/webui-popover/jquery.webui-popover.css',
            'web/bower_components/bootstrap/dist/css/bootstrap.css',
        ],
        dest: rel + '/pkg/css',
        base: ''
    },
    images: {
        src: [
            'web/images/**/*',
        ],
        dest: rel + '/images',
        base: 'web/images'
    },
    copyimages: {
        src: [
            'web/images/icon/occupancy_[1234].png',
            'web/images/icon/person.png',
            'web/**/*.pdf',
        ],
        dest: rel,
        base: 'web'
    },
    copyjs: {
        src: [
            rel + '/rev/*.json',
            'web/_lib/nuke/js/**/*',
            'web/booking/*.js',
        ],
        dest: rel,
        base: 'web'
    },
    copybase: {
        src: [
            rel + '/rev/*.json',
            'web/_lib/base/core.js',
        ],
        dest: rel,
        base: 'web'
    },
    copycss: {
        src: [
            rel + '/rev/*.json',
            'web/_lib/nuke/css/**/*',
            '/_lib/nuke/css/common.css'
        ],
        dest: rel,
        base: 'web'
    },
    rev: {
        src: [
            rel + '/rev/*.json',
            'web/**/*.html',
        ],
        dest: rel,
        base: './dist'
    }

};

//执行压缩混淆前，先执行jshint
gulp.task('dist', function (cb) {
    runSequence('clean', 'jshint', 'images',
        'copy:images', 'minjs', 'mincss',
        'fonts', 'fonts1', 'copy:css',
        'copy:js', 'copy:js1', 'copy:base', 'rev', cb);
});

//压缩，合并 js
gulp.task('minjs', function () {
    return gulp.src(option.minjs.src)      //需要操作的文件
        .pipe(plugins.concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest(option.minjs.dest))       //输出到文件夹
        .pipe(plugins.rename({ suffix: '.min' }))   //rename压缩后的文件名
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.ngmin({ dynamic: false }))//Pre-minify AngularJS apps with ngmin
        .pipe(plugins.stripDebug())//除去js代码中的console和debugger输出
        .pipe(gulp.dest(option.minjs.dest))                               //- 输出文件本地
        .pipe(plugins.uglify({ outSourceMap: false }))    //压缩
        .pipe(plugins.rev())
        .pipe(gulp.dest(option.minjs.dest))                               //- 输出文件本地
        .pipe(plugins.rev.manifest('minjs.json'))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(option.release + '/rev'));  //输出
});

gulp.task('jshint', function () {
    return gulp.src(option.minjs.src)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});

gulp.task('mincss', function (cb) {                                //- 创建一个名为 concat 的 task
    return gulp.src(option.mincss.src)    //- 需要处理的css文件，放到一个字符串数组里
        .pipe(plugins.concat('main.min.css'))                            //- 合并后的文件名
        .pipe(plugins.minifyCss())                                      //- 压缩处理成一行
        .pipe(gulp.dest(option.mincss.dest))                               //- 输出文件本地
        .pipe(plugins.rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest(option.mincss.dest))                               //- 输出文件本地
        .pipe(plugins.rev.manifest('mincss.json'))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(option.release + '/rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内

});
gulp.task('copy:js', function (cb) {
    return gulp.src(option.copyjs.src, { base: option.copyjs.base })
        .pipe(revCollector())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.ngmin({ dynamic: false }))//Pre-minify AngularJS apps with ngmin
        .pipe(plugins.stripDebug())//除去js代码中的console和debugger输出
        // .pipe(gulp.dest(option.minjs.dest))                               //- 输出文件本地
        .pipe(plugins.uglify({ outSourceMap: false }))    //压缩
        .pipe(plugins.rev())                                            //- 文件名加MD5后缀
        // .pipe(plugins.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(gulp.dest(option.copyjs.dest))                               //- 输出文件本地
        .pipe(plugins.rev.manifest('copyjs.json'))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(option.release + '/rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内

});
gulp.task('copy:css', function (cb) {
    return gulp.src(option.copycss.src, { base: option.copycss.base })   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())
        .pipe(plugins.rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest(option.copycss.dest))                               //- 输出文件本地
        .pipe(plugins.rev.manifest('copycss.json'))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(option.release + '/rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内

});
gulp.task('copy:base', function (cb) {
    return gulp.src(option.copybase.src, { base: option.copybase.base })
        .pipe(revCollector())
        .pipe(plugins.rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest(option.copybase.dest))                               //- 输出文件本地
        .pipe(plugins.rev.manifest('copybase.json'))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(option.release + '/rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内

});
gulp.task('images', function (cb) {
    return gulp.src(option.images.src, { base: option.images.base })
        .pipe(plugins.rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest(option.images.dest))                               //- 输出文件本地
        .pipe(plugins.rev.manifest('img.json'))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(option.release + '/rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内

});
gulp.task('rev', function (cb) {
    return gulp.src(option.rev.src)   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                       //- 执行文件内js,img,css名的替换
        .pipe(gulp.dest(option.release));           //- 替换后的文件输出的目录

});

gulp.task('clean', function (cb) {
    return del(rel + '/**/*');
});