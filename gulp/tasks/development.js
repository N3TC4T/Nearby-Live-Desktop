import gulp        from 'gulp';
import runSequence from 'run-sequence';
import childProcess from 'child_process';
import electron from 'electron-prebuilt';

gulp.task('dev-prepare', ['clean'], function(cb) {

  global.isProd = false;

  runSequence(['styles', 'images', 'fonts', 'views'], 'browserify', 'watch', cb);

});

gulp.task('dev', ['dev-prepare'], function() {
  childProcess.spawn(electron, ['./'], { stdio: 'inherit'});
});

gulp.task('default', ['dev']);
