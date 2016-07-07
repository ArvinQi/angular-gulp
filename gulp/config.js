var src = 'app';
var build = 'build';
var development = 'build/development';
var production = 'build/production';
var srcAssets = 'app/_assets';
var developmentAssets = 'app/_assets';
var productionAssets = 'build/production/assets';

module.exports = {
  sass: {
    src: srcAssets + '/scss/**/*.{sass,scss}',
    dest: developmentAssets + '/css',
    options: {
      noCache: true,
      compass: true,
      sourcemap: true
    }
  },
  autoprefixer: {
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ],
    cascade: true
  },
  browsersync: {
    development: {
      server: {
        baseDir: './app'
      },
      // proxy: '127.0.0.1',
      notify: true,
      ghostMode: {
        clicks: true,
        location: true,
        forms: false,
        scroll: true
      }
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998
    }
  },
  watch: {
    
  },
};
