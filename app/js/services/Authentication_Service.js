function AuthenticationService($localStorage,$http, AppSettings) {
    'ngInject';

    const service = {};

    service.Login = Login;
    service.ForgetPassword = ForgetPassword ;
    service.ChangePassword = ChangePassword;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;
    service.GetAuthInfo = GetAuthInfo;

    return service;


    function Login(credentials) {
        return $http.get(AppSettings.apiUrl + 'token' , {params:credentials}) ;
    }

    function ForgetPassword(email){
        return $http.post(AppSettings.apiUrl + 'account/forgotpw?email=' + email) ;
    }

    function ChangePassword(data){
        return $http({
            method: 'POST',
            url: AppSettings.apiUrl + 'account/changepw',
            params: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    function SetCredentials(token) {
        $http.defaults.headers.common['X-AUTH-TOKEN'] =  token;
        $localStorage.AuthToken = token;
    }

    function ClearCredentials() {
        $http.defaults.headers.common['X-AUTH-TOKEN'] = '';
        $localStorage.AuthToken = '';
    }

    function GetAuthInfo(){
        return $http.get(AppSettings.apiUrl + 'account/connect');
    }

}

export default {
    name: 'AuthenticationService',
    fn: AuthenticationService
};
