import gulp from 'gulp';
import del from 'del';

gulp.task('purge:build', function(done) {
  return del('./build', done);
});

gulp.task('purge:cache', function(done) {
  return del('./cache', done);
});

gulp.task('purge:dist', function(done) {
  return del('./dist', done);
});

gulp.task('purge', ['purge:build', 'purge:cache', 'purge:dist']);
