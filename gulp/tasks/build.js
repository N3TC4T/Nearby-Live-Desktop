import gulp from 'gulp';
import async from 'async';
import rcedit from 'rcedit';
import cp from 'child_process';
import fs from 'fs-extra';
import path from'path';
import utils from './utils';

import manifest from '../../build/package.json';

gulp.task('build:darwin64', ['prod', 'resources:darwin', 'build-prepare:darwin64', 'clean:build:darwin64'], function(done) {
  return async.series([
    function(callback) {
      var fromPath, toPath;
      fromPath = './build/resources/darwin/app.icns';
      toPath = './build/darwin64/' + manifest.productName + '.app/Contents/Resources/' + manifest.name + '.icns';
      return fs.copy(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
    }, function(callback) {
      var exeDir, fromPath, toPath;
      exeDir = './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/';
      fromPath = exeDir + 'Electron';
      toPath = exeDir + manifest.productName;
      return fs.rename(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
    }, function(callback) {
      var fromPath, toPath;
      fromPath = './build/resources/darwin/Info.plist';
      toPath = './build/darwin64/' + manifest.productName + '.app/Contents/Info.plist';
      return fs.copy(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
    }, function(callback) {
      var cmd;
      cmd = 'touch ./build/darwin64/' + manifest.productName + '.app';
      return cp.exec(cmd, utils.log(callback, cmd));
    }
  ], done);
});

['linux32', 'linux64'].forEach(function(dist) {
  return gulp.task('build:' + dist, ['prod', 'resources:linux', 'build-prepare:' + dist, 'clean:build:' + dist], function(done) {
    return async.series([
      function(callback) {
        var exeDir, fromPath, toPath;
        exeDir = './build/' + dist + '/opt/' + manifest.name + '/';
        fromPath = exeDir + 'electron';
        toPath = exeDir + manifest.name;
        return fs.rename(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
      }, function(callback) {
        var fromPath, toPath;
        fromPath = './build/resources/linux/app.desktop';
        toPath = './build/' + dist + '/usr/share/applications/' + manifest.name + '.desktop';
        return fs.copy(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
      }, async.apply(async.waterfall, [
        async.apply(fs.readdir, './build/resources/linux/icons'), function(files, callback) {
          return async.map(files, function(file, callback) {
            var fromPath, size, toPath;
            size = path.basename(file, '.png');
            fromPath = path.join('./build/resources/linux/icons', file);
            toPath = './build/' + dist + '/usr/share/icons/hicolor/' + size + 'x' + size + '/apps/' + manifest.name + '.png';
            return fs.copy(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
          }, callback);
        }
      ])
    ], done);
  });
});

gulp.task('build:win32', ['prod', 'resources:win', 'build-prepare:win32', 'clean:build:win32'], function(done) {
  return async.series([
    function(callback) {
      var properties;
      properties = {
        'version-string': {
          ProductName: manifest.productName,
          CompanyName: manifest.win.companyName,
          FileDescription: manifest.description,
          LegalCopyright: manifest.win.copyright,
          OriginalFilename: manifest.productName + '.exe'
        },
        'file-version': manifest.version,
        'product-version': manifest.version,
        'icon': './build/resources/win/app.ico'
      };
      return rcedit('./build/win32/electron.exe', properties, utils.log(callback, 'rcedit ./build/win32/electron.exe properties', properties));
    }, function(callback) {
      var fromPath, toPath;
      fromPath = './build/win32/electron.exe';
      toPath = './build/win32/' + manifest.productName + '.exe';
      return fs.rename(fromPath, toPath, utils.log(callback, fromPath, '=>', toPath));
    }
  ], done);
});

gulp.task('build', ['build:darwin64', 'build:linux32', 'build:linux64', 'build:win32']);
