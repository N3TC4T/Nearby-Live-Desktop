function OnConfig($stateProvider, $urlRouterProvider ,$httpProvider) {
    'ngInject';

    // this can't be used in file , maybe in web usage ?
    //$locationProvider.html5Mode(false);

    $stateProvider
        .state('Loader', {
            url: '/',
            controller: 'AccountController as _AccountCtrl',
            templateUrl: 'index/loader.tmpl.html',
            title: 'Connecting ...'
        })
        .state('Login', {
            url: '/login',
            controller: 'AccountController as _AccountCtrl',
            templateUrl: 'index/login.tmpl.html',
            title: 'Login'
        })
        .state('Register', {
            url: '/register',
            controller: 'AccountController as _AccountCtrl',
            templateUrl: 'index/register.tmpl.html',
            title: 'Register'
        })
        .state('Main', {
            url: '/user',
            controller: 'MainController as _MainCtrl',
            templateUrl: 'user/main.tmpl.html',
            title: 'Welcome'
        })
        .state('Profile', {
            url: '/profile?pid',
            parent:'Main',
            controller: 'ProfileController as _ProfileCtrl',
            templateUrl: 'user/profile/profile.tmpl.html',
            title: 'Profile'
        })
        .state('Edit_Profile', {
            url: '/profile/edit',
            parent:'Main',
            controller: 'ProfileController as _ProfileCtrl',
            templateUrl: 'user/profile/edit.profile.tmpl.html',
            title: 'Edit Profile'
        })
        .state('People', {
            url: '/people',
            parent:'Main',
            controller: 'PeopleController as _PeopleCtrl',
            templateUrl: 'user/people/people.tmpl.html',
            title: 'People'
        })
        .state('Stream', {
            url: '/stream',
            parent:'Main',
            controller: 'StreamController as _StreamCtrl',
            templateUrl: 'user/stream/stream.tmpl.html',
            title: 'Stream'
        })
        .state('Message', {
            url: '/message?pid&img&name',
            parent:'Main',
            controller: 'ConversationController as _ConversationCtrl',
            templateUrl: 'user/conversation/conversation.tmpl.html',
            title: 'Message'
        })
        .state('Notifications', {
            url: '/notifications',
            parent:'Main',
            controller: 'NotificationController as _NotifyCtrl',
            templateUrl: 'user/notification/notifications.tmpl.html',
            title: 'Notifications'
        })
        .state('Account_Settings', {
            url: '/account',
            parent:'Main',
            controller: 'AccountController as _AccountCtrl',
            templateUrl: 'user/setting/account.tmpl.html',
            title: 'Account Setting'
        })
        .state('Privacy_Settings', {
            url: '/privacy',
            parent:'Main',
            controller: 'AccountController as _AccountCtrl',
            templateUrl: 'user/setting/privacy.tmpl.html',
            title: 'Privacy Setting'
        });



    $urlRouterProvider.otherwise('/');

    //$http configuration
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded' ;
    $httpProvider.defaults.headers.common['X-SOFTWARE-VERSION'] = '1.0' ;
    $httpProvider.defaults.headers.common['X-DEVICE-TYPE'] = 'Linux' ;
    $httpProvider.defaults.headers.common['X-UNIT-MEASUREMENT'] = 'true';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    //$http configuration
}

export default OnConfig;
