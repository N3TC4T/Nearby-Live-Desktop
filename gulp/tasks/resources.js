import gulp from 'gulp';
import filter from 'gulp-filter';
import mustache from 'gulp-mustache';

import manifest from '../../build/package.json';


gulp.task('resources:darwin', function() {
  var templateFilter;
  templateFilter = filter(['*.plist', '*.json']);
  return gulp.src('./resources/darwin/**/*').pipe(templateFilter).pipe(mustache(manifest)).pipe(templateFilter.restore()).pipe(gulp.dest('./build/resources/darwin'));
});

gulp.task('resources:linux', function() {
  var templateFilter;
  templateFilter = filter(['*.desktop', '*.sh']);
  manifest.linux.name = manifest.name;
  manifest.linux.productName = manifest.productName;
  manifest.linux.description = manifest.description;
  manifest.linux.version = manifest.version;
  return gulp.src('./resources/linux/**/*').pipe(templateFilter).pipe(mustache(manifest.linux)).pipe(templateFilter.restore()).pipe(gulp.dest('./build/resources/linux'));
});

gulp.task('resources:win', function() {
  return gulp.src('./resources/win/**/*').pipe(gulp.dest('./build/resources/win'));
});

gulp.task('resources', ['resources:darwin', 'resources:linux', 'resources:win']);
