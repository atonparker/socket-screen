const argv       = require('yargs').argv;
const browserify = require('browserify');
const del        = require('del');
const gulp       = require('gulp');
const vbuffer    = require('vinyl-buffer');
const vsource    = require('vinyl-source-stream');

function clean() {

  return del('client.js');

}

function scripts() {

  const bundler = browserify({
    debug: false,
    entries: 'src/client/index.js',
    transform: [ 'babelify' ]
  });

  return bundler.bundle()
    .pipe(vsource('client.js'))
    .pipe(vbuffer())
    .pipe(gulp.dest('.'));

}

const series = gulp.series.bind(gulp);
const parallel = gulp.parallel.bind(gulp);

gulp.task(clean);
gulp.task('build', series(clean, scripts));
