export default {

  browserPort: 3000,
  UIPort: 3001,
  testPort: 3002,
  openBrowser:false,

  sourceDir: './app/',
  buildDir: './build/web/',


  styles: {
    src: 'app/styles/**/*.scss',
    dest: 'build/web/css',
    prodSourcemap: false,
    sassIncludePaths: []
  },

  scripts: {
    src: 'app/js/**/*.js',
    dest: 'build/web/js',
    test: 'test/**/*.js',
    gulp: 'gulp/**/*.js',
    browser:'app/browser/main.js'
  },

  images: {
    src: 'app/images/**/*',
    dest: 'build/web/images'
  },

  fonts: {
    src: ['app/fonts/**/*'],
    dest: 'build/web/fonts'
  },

  assetExtensions: [
    'js',
    'css',
    'png',
    'jpe?g',
    'gif',
    'svg',
    'eot',
    'otf',
    'ttc',
    'ttf',
    'woff2?'
  ],

  views: {
    index: 'app/index.html',
    src: 'app/views/**/*.html',
    dest: 'app/js'
  },

  gzip: {
    src: 'build/web/**/*.{html,xml,json,css,js,js.map,css.map}',
    dest: 'build/web/',
    options: {}
  },

  browserify: {
    bundleName: 'main.js',
    browserName:'browser.js',
    prodSourcemap: false
  },

  test: {
    karma: 'test/karma.conf.js',
    protractor: 'test/protractor.conf.js'
  },

  init: function() {
    this.views.watch = [
      this.views.index,
      this.views.src
    ];

    return this;
  }

}.init();
