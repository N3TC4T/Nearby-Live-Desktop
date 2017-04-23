import fs from 'fs-extra';

import gulp from 'gulp';
import electronDownloader from 'gulp-electron-downloader';

import manifest from '../../build/package.json';

var downloaded = {
  darwin64: false,
  linux32: false,
  linux64: false,
  win32: false
};

[['darwin', 'x64', 'darwin64', './build/darwin64'], ['linux', 'ia32', 'linux32', './build/linux32/opt/' + manifest.name], ['linux', 'x64', 'linux64', './build/linux64/opt/' + manifest.name], ['win32', 'ia32', 'win32', './build/win32']].forEach(function(release) {
  var arch, dist, outputDir, platform;
  platform = release[0], arch = release[1], dist = release[2], outputDir = release[3];
  return gulp.task('download:' + dist, ['kill:' + dist], function(done) {
    if (downloaded[dist]) {
      return done();
    }
    return electronDownloader({
      version: 'v1.2.2',
      cacheDir: './cache',
      outputDir: outputDir,
      platform: platform,
      arch: arch
    }, function() {
      downloaded[dist] = true;
      if (dist === 'darwin64') {
        return fs.rename('./build/darwin64/Electron.app', './build/darwin64/' + manifest.productName + '.app', done);
      } else {
        return done();
      }
    });
  });
});

gulp.task('download', ['download:darwin64', 'download:linux32', 'download:linux64', 'download:win32']);
