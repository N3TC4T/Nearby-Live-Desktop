function AccountService($http,AppSettings) {
    'ngInject';

    const service = {};

    service.SaveProfile = SaveProfile ;
    service.PostAdditionalPhoto = PostAdditionalPhoto ;
    service.RemoveAdditionalPhoto = RemoveAdditionalPhoto ;
    service.GetUserPoints = GetUserPoints ;

    return service;


    function SaveProfile(data){
        return $http({
            method: 'POST',
            url: AppSettings.apiUrl + 'account/profile',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }


    function PostAdditionalPhoto(imgId){
        return $http.post(AppSettings.apiUrl + 'account/profile/photos/' + imgId);
    }

    function RemoveAdditionalPhoto(imgId){
        return $http.post(AppSettings.apiUrl + 'account/profile/photos/' + imgId + '/remove');
    }

    function GetUserPoints(){
        return $http.get(AppSettings.apiUrl + 'points')
    }


}

export default {
    name: 'AccountService',
    fn: AccountService
};
