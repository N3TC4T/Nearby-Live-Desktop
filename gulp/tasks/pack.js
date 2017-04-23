import gulp from 'gulp';
import path from'path';
import asar from 'asar';
import async from 'async';
import del from 'del';
import zip from 'gulp-zip';
import {applyPromise, applySpawn, platform} from './utils'
import winInstaller from 'electron-windows-installer';

import manifest from '../../build/package.json';

gulp.task('pack:darwin64:dmg', ['build:darwin64', 'mclean:dist:darwin64'], function(done) {
  var envName, i, len, ref;
  if (process.platform !== 'darwin') {
    console.warn('Skipping darwin64 packing; This only works on darwin due to `appdmg` and the `codesign` command.');
    return done();
  }
  try {
    var appdmg = require('appdmg');
  } catch (_error) {
    ex = _error;
    console.warn('Skipping darwin64 packing; `appdmg` not installed.');
    return done();
  }
  ref = ['SIGN_DARWIN_KEYCHAIN_PASSWORD', 'SIGN_DARWIN_KEYCHAIN_NAME', 'SIGN_DARWIN_IDENTITY'];
  for (i = 0, len = ref.length; i < len; i++) {
    envName = ref[i];
    if (!process.env[envName]) {
      console.warn(envName + ' env var not set.');
      return done();
    }
  }
  return async.series([
    async.apply(asar.createPackage, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app', './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app.asar'),
    applyPromise(del, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'),
    applySpawn('security', ['unlock-keychain', '-p', process.env.SIGN_DARWIN_KEYCHAIN_PASSWORD, process.env.SIGN_DARWIN_KEYCHAIN_NAME]),
    applySpawn('codesign', ['--deep', '--force', '--verbose', '--keychain', process.env.SIGN_DARWIN_KEYCHAIN_NAME, '--sign', process.env.SIGN_DARWIN_IDENTITY, './build/darwin64/' + manifest.productName + '.app']),
    function(callback) {
      return appdmg({
        source: './build/resources/darwin/dmg.json',
        target: './dist/' + manifest.name + '-' + manifest.version + '-osx.dmg'
      }).on('finish', callback).on('error', callback);
    }
  ], done);
});

gulp.task('pack:darwin64:zip', ['build:darwin64'], function(done) {
  var envName, i, len, ref;
  if (process.platform !== 'darwin') {
    console.warn('Skipping darwin64 packing; This only works on darwin due to the `codesign` command.');
    return done();
  }
  ref = ['SIGN_DARWIN_KEYCHAIN_PASSWORD', 'SIGN_DARWIN_KEYCHAIN_NAME', 'SIGN_DARWIN_IDENTITY'];
  for (i = 0, len = ref.length; i < len; i++) {
    envName = ref[i];
    if (!process.env[envName]) {
      console.warn(envName + ' env var not set.');
      return done();
    }
  }
  return async.series([
    async.apply(asar.createPackage, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app', './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app.asar'),
    applyPromise(del, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'),
    applySpawn('security', ['unlock-keychain', '-p', process.env.SIGN_DARWIN_KEYCHAIN_PASSWORD, process.env.SIGN_DARWIN_KEYCHAIN_NAME]),
    applySpawn('codesign', ['--deep', '--force', '--verbose', '--keychain', process.env.SIGN_DARWIN_KEYCHAIN_NAME, '--sign', process.env.SIGN_DARWIN_IDENTITY, './build/darwin64/' + manifest.productName + '.app']),
    applySpawn('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', './build/darwin64/' + manifest.productName + '.app', './dist/' + manifest.name + '-' + manifest.version + '-osx.zip'])
  ], done);
});


[32, 64].forEach(function(arch) {
  return ['deb', 'rpm'].forEach(function(target) {
    return gulp.task('pack:linux' + arch + ':' + target, ['build:linux' + arch, 'clean:dist:linux' + arch], function(done) {
      var archName, debRecommendsList, debSuggestsList, depsList, expandArgs, fpmArgs;
      if (arch === 32) {
        archName = 'i386';
      } else if (target === 'deb') {
        archName = 'amd64';
      } else {
        archName = 'x86_64';
      }
      depsList = [];
      if (target === 'deb') {
        depsList = ['libnotify4','libappindicator1'];
      } else {
        depsList = [];
      }
      debRecommendsList = [];
      debSuggestsList = [];
      expandArgs = function(name, values) {
        var expandedArgs, i, len, value;
        expandedArgs = [];
        for (i = 0, len = values.length; i < len; i++) {
          value = values[i];
          expandedArgs.push(name);
          expandedArgs.push(value);
        }
        return expandedArgs;
      };
      fpmArgs = [].concat(['-s', 'dir', '-t', target, '--architecture', archName, '--rpm-os', 'linux', '--name', manifest.name, '--force', '--after-install', './build/resources/linux/after-install.sh', '--after-remove', './build/resources/linux/after-remove.sh', '--deb-changelog', './CHANGELOG.md', '--rpm-changelog', './CHANGELOG.md']).concat(expandArgs('--depends', depsList)).concat(expandArgs('--deb-recommends', debRecommendsList)).concat(expandArgs('--deb-suggests', debSuggestsList)).concat(['--license', manifest.license, '--category', '\'' + manifest.linux.section + '\'' , '--description', '\'' +  manifest.description + '\'', '--url', '\'' + manifest.homepage + '\'', '--maintainer', '\'' + manifest.author + '\'' , '--vendor', '\'' + manifest.authorName + '\'' , '--version',  manifest.version  , '--iteration', process.env.CIRCLE_BUILD_NUM || '1', '--package', './dist/' + manifest.name + '-VERSION-linux-ARCH.' + target, '-C', './build/linux' + arch, '.']).filter(function(a) {
        return a != null;
      });
      return async.series([
       async.apply(asar.createPackage, './build/linux' + arch + '/opt/' + manifest.name + '/resources/app', './build/linux' + arch + '/opt/' + manifest.name + '/resources/app.asar'),
       applyPromise(del, './build/linux' + arch + '/opt/' + manifest.name + '/resources/app'),
       applySpawn('fpm', fpmArgs)
      ], done);
    });
  });
});


gulp.task('pack:win32:installer', ['build:win32', 'clean:dist:win32'], function(done) {
  var envName, i, len, ref;
  if (process.platform !== 'win32') {
    return console.warn('Skipping win32 installer packing; This only works on Windows due to Squirrel.Windows.');
  }
  ref = ['SIGN_WIN_CERTIFICATE_FILE', 'SIGN_WIN_CERTIFICATE_PASSWORD'];
  for (i = 0, len = ref.length; i < len; i++) {
    envName = ref[i];
    if (!process.env[envName]) {
      return console.warn(envName + ' env var not set.');
    }
  }
  return async.series([
    async.apply(asar.createPackage, './build/win32/resources/app', './build/win32/resources/app.asar'), applyPromise(del, './build/win32/resources/app'), function(callback) {
      var releasesUrl, remoteReleasesUrl, signParams;
      signParams = ['/t', 'http://timestamp.verisign.com/scripts/timstamp.dll', '/f', process.env.SIGN_WIN_CERTIFICATE_FILE, '/p', process.env.SIGN_WIN_CERTIFICATE_PASSWORD];
      remoteReleasesUrl = manifest.updater.urls.win32.replace(/{{& SQUIRREL_UPDATES_URL }}/g, process.env.SQUIRREL_UPDATES_URL).replace(/%CHANNEL%/g, 'dev');
      releasesUrl = remoteReleasesUrl + '/RELEASES';
      return request({
        url: releasesUrl
      }, function(err, res) {
        if (err || !res || res.statusCode < 200 || res.statusCode >= 400) {
          console.log('Creating installer without remote releases url', releasesUrl, 'because of', 'error', err, 'statusCode', res && res.statusCode, 'body', res && res.body);
          remoteReleasesUrl = void 0;
        }
        return winInstaller({
          appDirectory: './build/win32',
          outputDirectory: './dist',
          loadingGif: './build/resources/win/install-spinner.gif',
          signWithParams: signParams.join(' '),
          setupIcon: './build/resources/win/setup.ico',
          iconUrl: mainManifest.icon.url,
          description: manifest.productName,
          authors: manifest.authorName,
          remoteReleases: remoteReleasesUrl,
          copyright: manifest.copyright,
          setupExe: manifest.name + '-' + manifest.version + '-win32-setup.exe',
          noMsi: true,
          arch: 'ia32'
        }).then(callback, callback);
      });
    }
  ], done);
});

gulp.task('pack:win32:portable', ['build:win32', 'clean:dist:win32'], function(done) {
  var envName, i, len, ref;
  if (process.platform !== 'win32') {
    console.warn('Skipping win32 portable packing; This only works on Windows due to signtool.');
    return done();
  }
  ref = ['SIGN_WIN_CERTIFICATE_FILE', 'SIGN_WIN_CERTIFICATE_PASSWORD'];
  for (i = 0, len = ref.length; i < len; i++) {
    envName = ref[i];
    if (!process.env[envName]) {
      console.warn(envName + ' env var not set.');
      return done();
    }
  }
  return async.series([
    async.apply(asar.createPackage, './build/win32/resources/app', './build/win32/resources/app.asar'), applyPromise(del, './build/win32/resources/app'), function(callback) {
      var args, cmd;
      cmd = process.env.SIGNTOOL_PATH || 'signtool';
      args = ['sign', '/t', 'http://timestamp.verisign.com/scripts/timstamp.dll', '/f', process.env.SIGN_WIN_CERTIFICATE_FILE, '/p', process.env.SIGN_WIN_CERTIFICATE_PASSWORD, path.win32.resolve('./build/win32/' + manifest.productName + '.exe')];
      return applySpawn(cmd, args)(callback);
    }, function(callback) {
      return gulp.src('./build/win32/**/*').pipe(zip(manifest.name + '-' + manifest.version + '-win32-portable.zip')).pipe(gulp.dest('./dist')).on('end', callback);
    }
  ], done);
});

if (process.platform === 'win32') {
  gulp.task('pack', ['pack:' + platform() + ':installer']);
} else {
  gulp.task('pack', ['pack:' + platform()]);
}
