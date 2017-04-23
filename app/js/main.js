import jquery from 'jquery-browserify';
import angular from 'angular';

// angular modules
import constants from './constants';
import onConfig  from './on_config';
import onRun     from './on_run';
import 'angular-ui-router';
import 'angular-animate';
import 'semantic-ui';
import 'ngstorage';
import 'angular-timeago';
import 'angular-perfect-scrollbar-2';
import 'lightbox2';
import 'angular-electron';
import './templates';
import './filters';
import './controllers';
import './services';
import './directives';

// create and bootstrap application
const requires = [
    'ui.router',
    'ngStorage',
    'ngAnimate',
    'yaru22.angular-timeago',
    'angular-perfect-scrollbar-2',
    'angular-electron',
    'templates',
    'app.filters',
    'app.controllers',
    'app.services',
    'app.directives'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);

angular.module('app').config(onConfig);

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
  strictDi: true
});

