'use strict';

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var mqpacker = require('css-mqpacker');
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var scss = require('postcss-scss');
var sourcemaps = require('gulp-sourcemaps');
var stylelint = require('stylelint');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');

// error notifications
var handleError = function(task) {
  return function(err) {
    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
    this.emit('end');
  };
};

// specify browser compatibility with https://github.com/ai/browserslist
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
];

// pre CSS processors
var preprocessors = [
  stylelint,
  reporter({clearMessages: true, throwError: true}),
];

// post CSS processors
var postprocessors = [
  autoprefixer({browsers: AUTOPREFIXER_BROWSERS}),
  mqpacker,
];

// project paths
var project = {
  dist: './dist',
  assets: {
    partials: './src/app/**/*.html',
    scss: './src/scss/**/*.scss',
    images: './src/images/*.{jpg,jpeg,gif,png}',
    js: {
      frontend: ['./src/app/**/*.js'],
    },
  },
};

// TASKS

// Lint scss
gulp.task('lint:scss', function() {
  return gulp.src(project.assets.scss)
    .pipe(postcss(preprocessors, {
      syntax: scss,
    }))
    .on('error', function() {
      gutil.log(gutil.colors.bgRed('CSS will not build without fixing linting errors!'));
    });
});

// Build CSS from scss
// Unminified for dev, stream injecting browser-sync, with sourcemaps
gulp.task('scss:dev', function() {
  return gulp.src(project.assets.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', handleError('Scss Compiling'))
    .pipe(postcss(postprocessors))
    .on('error', handleError('Post CSS Processing'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(project.dist))
    .pipe(reload({stream: true}));
});

// Build CSS from scss
// Minified for production w/o sourcemaps
gulp.task('scss:dist', function() {
  return gulp.src(project.assets.scss)
    .pipe(sass())
    .pipe(postcss(postprocessors))
    .pipe(cssnano())
    .pipe(gulp.dest(project.dist));
});

// In case someone does 'gulp scss'
gulp.task('scss', ['scss:dev', 'scss:dist']);

// Lint JS
// check the frontend for style and syntax errors
gulp.task('lint:js:frontend', function() {
  return gulp.src(project.assets.js.frontend)
    .pipe(eslint({
      useEslintrc: true,
    }))
    .pipe(eslint.format());
});

// Lint
gulp.task('lint', ['lint:js:frontend']);

// Build templates for faster loading
// Compile HTML into JS so templates are loaded all at once
gulp.task('buildTemplates', function() {
  return gulp.src(project.assets.partials)
    .pipe(templateCache({
      filename: 'app.templates.js',
      module: 'topcharts.templates',
      standalone: true,
      transformUrl: function(url) {
        return 'app/' + url;
      },
    }))
    .pipe(gulp.dest(project.dist));
});

// Build Vendor JS
// combine vendor / dependency js with sourcemaps
gulp.task('buildVendorJs', function() {
  return gulp.src([
      'src/bower_components/angular/angular.min.js',
      'src/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'src/bower_components/localforage/dist/localforage.min.js',
      'src/bower_components/angular-localforage/dist/angular-localForage.min.js',
      'src/bower_components/angular-aria/angular-aria.min.js',
      'src/bower_components/angular-animate/angular-animate.min.js',
      'src/bower_components/angular-cache/dist/angular-cache.min.js',
      'src/bower_components/angular-sanitize/angular-sanitize.min.js',
      'src/bower_components/moment/min/moment.min.js',
      'src/bower_components/angular-moment/angular-moment.min.js',
      'src/bower_components/angucomplete-alt/angucomplete-alt.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(project.dist));
});

// Build App JS
// combine app js with sourcemaps
gulp.task('buildAppJs', function() {
  return gulp.src([
      'src/app/app.js',
      'src/app/app.config.js',
      'src/app/app.init.js',
      'src/app/components/artist/directive.js',
      'src/app/components/artist/service.js',
      'src/app/components/artistList/directive.js',
      'src/app/components/artistList/service.js',
      'src/app/main/controller.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(project.dist));
});

// Build Vendor and App JS
// not minified and includes sourcemaps
gulp.task('scripts:dev', ['buildTemplates', 'buildVendorJs', 'buildAppJs']);

// Build all JS for produciton
// Minified w/o sourcemaps
gulp.task('scripts:dist', ['buildTemplates', 'buildVendorJs', 'buildAppJs'], function() {
  return gulp.src([project.dist + '/app.js', project.dist + '/app.templates.js'])
    .pipe(uglify({
      mangle: false,
    }))
    .pipe(gulp.dest(project.dist));
});

// In case someone does 'gulp scripts'
gulp.task('scripts', ['scripts:dist']);

gulp.task('browser-sync', ['build:dev'], function() {
  browserSync.init({
    ghostMode: false,
    files: ['dist/{images}/*.*', 'dist/*.js', 'index.html'],
    server: {
      baseDir: './'
    }
  });

  gulp.watch(project.assets.partials, ['buildTemplates']);
  gulp.watch(project.assets.js.frontend, ['lint:js:frontend', 'buildAppJs']);
  gulp.watch(project.assets.scss, ['scss:dev']);
});


gulp.task('build:dev', ['scss:dev', 'scripts:dev']);
gulp.task('build:dist', ['scss:dist', 'scripts:dist']);
gulp.task('build', ['build:dist']);

gulp.task('default', ['browser-sync']);
