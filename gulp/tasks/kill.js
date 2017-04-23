import cp from 'child_process';
import gulp from 'gulp';
import manifest from '../../build/package.json';

var killed = false;

gulp.task('kill:darwin64', function(done) {
  if (killed) {
    return done();
  }
  cp.exec('pkill -9 ' + manifest.productName, function() {
    return done();
  });
  return killed = true;
});

gulp.task('kill:linux32', function(done) {
  if (killed) {
    return done();
  }
  cp.exec('pkill -9 ' + manifest.name, function() {
    return done();
  });
  return killed = true;
});

gulp.task('kill:linux64', function(done) {
  if (killed) {
    return done();
  }
  cp.exec('pkill -9 ' + manifest.name, function() {
    return done();
  });
  return killed = true;
});

gulp.task('kill:win32', function(done) {
  if (killed) {
    return done();
  }
  return cp.exec('taskkill /F /IM ' + manifest.productName + '.exe', function() {
    return done();
  });
});

killed = true;
