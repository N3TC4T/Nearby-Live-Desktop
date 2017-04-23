function PeopleService($http,AppSettings) {
    'ngInject';

    const service = {};

    service.GetPeople = GetPeople;
    service.GetFavorites = GetFavorites ;
    service.GetUserProfile = GetUserProfile;
    service.GetBlockedUsers = GetBlockedUsers ;
    service.Block = Block ;
    service.UnBlock = UnBlock ;
    service.Follow = Follow ;
    service.UnFollow = UnFollow ;
    service.OnlineStatus = OnlineStatus ;

    return service;

    //GET /api/people/JnjpqarBgD0fP0uosfTwRA/posts HTTP/1.1

    function GetPeople(params){
        return $http.get(AppSettings.apiUrl + 'people' ,{params:params});
    }

    function GetFavorites(){
        return $http.get(AppSettings.apiUrl + 'account/favorites');
    }

    function GetUserProfile(id , params){
        return $http.get(AppSettings.apiUrl + 'people/' + id , {params:params});
    }

    function Follow(pid){
        return $http.post(AppSettings.apiUrl + 'account/favorites/' + pid);
    }

    function UnFollow(pid){
        return $http.post(AppSettings.apiUrl + 'account/favorites/' + pid + '/delete');
    }

    function GetBlockedUsers(){
        return $http.get(AppSettings.apiUrl + 'account/blocks');
    }

    function Block(pid){
        return $http.post(AppSettings.apiUrl + 'account/blocks/' + pid );
    }

    function UnBlock(pid){
        return $http.post(AppSettings.apiUrl + 'account/blocks/' + pid + '/delete');
    }



    function OnlineStatus(pid){
        return $http({
            method: 'POST',
            url: AppSettings.apiUrl + 'people/status',
            data: pid,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
}

export default {
    name: 'PeopleService',
    fn: PeopleService
};
