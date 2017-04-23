var applyIf, applyPromise, applySpawn, deepClone, join, log, platform, platformOnly, updateManifest,
  slice = [].slice,
  hasProp = {}.hasOwnProperty;

import async from 'async';

import spawn from 'cross-spawn';

import fs from 'fs';

import 'colors';

updateManifest = function(jsonPath, updateFn, done) {
  return async.waterfall([
    async.apply(fs.readFile, jsonPath, 'utf8'), function(file, callback) {
      var json, text;
      json = JSON.parse(file);
      updateFn(json);
      text = JSON.stringify(json);
      return fs.writeFile(jsonPath, text, 'utf8', callback);
    }
  ], done);
};

applyPromise = function() {
  var args, fn;
  fn = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  return function(cb) {
    return fn.apply(null, args).then(function() {
      var results;
      results = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return cb.apply(null, [null].concat(slice.call(results)));
    })['catch'](cb);
  };
};

applySpawn = function(cmd, params, opts) {
  if (opts == null) {
    opts = {};
  }
  return function(cb) {
    var child, errored;
    child = spawn(cmd, params, opts);
    if (cb) {
      errored = false;
      child.on('error', function(err) {
        errored = true;
        return cb(err);
      });
      return child.on('close', function(code) {
        var err;
        if (!errored) {
          if (code) {
            err = new Error('`' + cmd + ' ' + (params.join(' ')) + '` exited with code ' + code);
            err.code = code;
            return cb(err);
          } else {
            return cb(null);
          }
        }
      });
    }
  };
};

applyIf = function(cond, fn) {
  if (cond) {
    return fn;
  } else {
    return function(cb) {
      return cb(null);
    };
  }
};

platform = function() {
  var arch;
  if (process.platform === 'win32') {
    return process.platform;
  } else {
    arch = process.arch === 'ia32' ? '32' : '64';
    return process.platform + arch;
  }
};

platformOnly = function() {
  if (process.platform === 'win32') {
    return 'win';
  } else {
    return process.platform;
  }
};

join = function(args) {
  var key, val;
  return ((function() {
    var results1;
    results1 = [];
    for (key in args) {
      if (!hasProp.call(args, key)) continue;
      val = args[key];
      results1.push(val);
    }
    return results1;
  })()).join(' ');
};

log = function() {
  var callback, messages;
  callback = arguments[0], messages = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  return function(err) {
    var status;
    status = err ? 'Failed'.red : 'Successful'.green;
    return callback(err);
  };
};

deepClone = function(obj) {
  var flags, key, newInstance;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    flags = '';
    if (obj.global != null) {
      flags += 'g';
    }
    if (obj.ignoreCase != null) {
      flags += 'i';
    }
    if (obj.multiline != null) {
      flags += 'm';
    }
    if (obj.sticky != null) {
      flags += 'y';
    }
    return new RegExp(obj.source, flags);
  }
  newInstance = new obj.constructor();
  for (key in obj) {
    newInstance[key] = deepClone(obj[key]);
  }
  return newInstance;
};

module.exports = {
  updateManifest: updateManifest,
  applyPromise: applyPromise,
  applySpawn: applySpawn,
  applyIf: applyIf,
  platform: platform,
  platformOnly: platformOnly,
  join: join,
  log: log,
  deepClone: deepClone
};
