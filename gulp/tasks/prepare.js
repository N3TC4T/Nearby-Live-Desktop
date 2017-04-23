import gulp from 'gulp';
import replace from 'gulp-replace';
import config from '../config';
import manifest from '../../build/package.json';

[['darwin64', './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'], ['linux32', './build/linux32/opt/' + manifest.name + '/resources/app'], ['linux64', './build/linux64/opt/' + manifest.name + '/resources/app'], ['win32', './build/win32/resources/app']].forEach(function(item) {
  var dir, dist;
  dist = item[0];
  dir = item[1];

  gulp.task('build-prepare:' + dist + ':web', ['clean:build:' + dist], function() {
    return gulp.src(config.buildDir + '/**').pipe(gulp.dest(dir + '/web'));
  });

  gulp.task('build-prepare:' + dist + ':browser', ['clean:build:' + dist], function() {
    return gulp.src('./index.js')
      .pipe(replace('Isprod = false', 'Isprod = true'))
      .pipe(gulp.dest(dir));
  });

  gulp.task('build-prepare:' + dist + ':package', ['clean:build:' + dist], function() {
    return gulp.src('./build/package.json').pipe(gulp.dest(dir));
  });
  return gulp.task('build-prepare:' + dist, ['build-prepare:' + dist + ':web', 'build-prepare:' + dist + ':browser', 'build-prepare:' + dist + ':package']);
});

gulp.task('build-prepare', ['build-prepare:darwin64', 'build-prepare:linux32', 'build-prepare:linux64', 'build-prepare:win32']);
