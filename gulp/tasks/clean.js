import config from '../config';
import gulp   from 'gulp';
import del    from 'del';
import fs  from 'fs-extra';

import manifest from '../../build/package.json';


['linux32', 'linux64'].forEach(function(dist) {
  return gulp.task('clean:build:' + dist, ['download:' + dist], function(done) {
    return del('./build/' + dist + '/opt/' + manifest.name + '/resources/default_app', done);
  });
});


['linux32', 'linux64', 'win32'].forEach(function(dist) {
  return gulp.task('clean:dist:' + dist, function(done) {
    return fs.ensureDir('./dist', done);
  });
});


gulp.task('clean:build:win32', ['download:win32'], function(done) {
  return del('./build/win32/resources/default_app', done);
});

gulp.task('clean:build:darwin64', ['download:darwin64'], function(done) {
  return del(['./build/darwin64/' + manifest.productName + '.app/Contents/Resources/default_app', './build/darwin64/' + manifest.productName + '.app/Contents/Resources/atom.icns'], done);
});

gulp.task('clean:dist:darwin64', function(done) {
  return del('./dist/' + manifest.productName + '.dmg', function() {
    return fs.ensureDir('./dist', done);
  });
});

gulp.task('clean:dist', ['clean:dist:darwin64', 'clean:dist:linux32', 'clean:dist:linux64', 'clean:dist:win32']);
gulp.task('clean:build', ['clean:build:darwin64', 'clean:build:linux32', 'clean:build:linux64', 'clean:build:win32']);

gulp.task('clean', function() {

  return del([config.buildDir]);

});
