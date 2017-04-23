function PeopleController ($state, $scope, $rootScope, PeopleService) {
    'ngInject';

    var self = this ;
    self.LoadMorePeople = LoadMorePeople ;
    $rootScope.GetPeople = GetPeople ;

    if($state.current.name == 'People'){
        GetPeople()
    }

    function GetPeople(){

        self.IsPeoplesLoading = true ;
        // init values if undefined
        $rootScope.PeopleType = typeof $rootScope.PeopleType !== 'undefined' ? $rootScope.PeopleType : 'Nearby';

        self.getPeopleParams = typeof self.getPeopleParams !== 'undefined' ? self.getPeopleParams : [];

        if (self.getPeopleParams.length == 0){
            self.getPeopleParams.pid= $rootScope.User.id ;
            self.getPeopleParams.gender=0 ;
            self.getPeopleParams.minAge=13 ;
            self.getPeopleParams.maxAge=135 ;
            self.getPeopleParams.photosOnly=false ;
            self.getPeopleParams.nameOnly=false ;
            self.getPeopleParams.minDistance=0 ;
            self.getPeopleParams.maxDistance=10000 ;
            self.getPeopleParams.count=50;
            self.getPeopleParams.lat=0;
            self.getPeopleParams.long=0;
            self.getPeopleParams.start=0;

            if ($rootScope.PeopleType == 'Online'){
                self.getPeopleParams.lastConnected=15 ;
            }else{
                self.getPeopleParams.lastConnected=10080 ;
            }
        }else {
            if ($rootScope.PeopleType == 'Online'){
                self.getPeopleParams.lastConnected=15 ;
            }else{
                self.getPeopleParams.lastConnected=10080 ;
            }
        }
        if($rootScope.PeopleType != 'Following'){
            PeopleService.GetPeople(self.getPeopleParams)
                .then(
                    resolve => {
                        self.IsPeoplesLoading = false ;
                        self.Peoples = resolve.data ;
                    })
        }else {
            PeopleService.GetFavorites()
                .then(
                    resolve => {
                        self.IsPeoplesLoading = false ;
                        self.Peoples = resolve.data ;
                    })
        }

    }

    function LoadMorePeople(){
        self.IsLoadingMore = true;
        self.getPeopleParams.start += 50 ;

        PeopleService.GetPeople(self.getPeopleParams)
            .then(
                resolve => {
                    self.IsLoadingMore = false;
                    self.Peoples = self.Peoples.concat(resolve.data);
                })
    }


}//PeopleController function


export default {
    name: 'PeopleController',
    fn: PeopleController
};
