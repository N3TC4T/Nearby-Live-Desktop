function OnRun($rootScope,$localStorage, $http, AppSettings) {
    'ngInject';

    // change page title based on state
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        $rootScope.pageTitle = '';

        if ( toState.title ) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        }

        $rootScope.pageTitle += AppSettings.appTitle;
    });

    // set X-AUTH-TOKEN to default header if it's was set
    if($localStorage.AuthToken){
        $http.defaults.headers.common['X-AUTH-TOKEN'] = $localStorage.AuthToken ;
    }


    //just in dev
    //$rootScope.User = $localStorage.UserData


}

export default OnRun;
