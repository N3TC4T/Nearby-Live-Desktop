function MainController ($state,$scope, $rootScope ,$interval,$http, AuthenticationService ,PeopleService, NotificationService,AppSettings) {
    'ngInject';
    var self = this ;

    // pass $state to controller
    self.$state = $state;


    self.Logout = Logout ;
    self.SideMenuHandler = SideMenuHandler;
    $rootScope.ProfileCard = ProfileCard;
    $rootScope.ProfileCard.Follow = ProfileCardFollow ;
    $rootScope.ProfileCard.UnFollow = ProfileCardUnFollow ;
    $rootScope.ProfileCard.Block = ProfileCardBlock ;


    $scope.$on('ngRepeatFinished', function () {
        $('.ui.mini.image').popup();
    });


    //Retrieve user profile details for showing in modal
    function ProfileCard(pid){
        $rootScope.IsProfileCardLoading = true;
        $('.ui.basic.small.profile_card.modal')
            .modal({
                dimmerSettings:{
                    opacity:0.5
                }
            })
            .modal('show');
        var param = {
            'mini':true
        };
        PeopleService.GetUserProfile(pid , param)
            .then(
                resolve => {
                    $rootScope.UserCard = resolve.data;
                    $rootScope.IsProfileCardLoading = false;
                }
            );
    }


    // Follow user from profile card
    function ProfileCardFollow(){
        PeopleService.Follow($rootScope.UserCard.id)
            .then(
                resolve => {
                    $rootScope.UserCard.fav = true ;
                    $rootScope.User.favs = resolve.data ;
                }
            );
    }


    //un follow user from profile card
    function ProfileCardUnFollow(){
        PeopleService.UnFollow($rootScope.UserCard.id)
            .then(
                resolve => {
                    $rootScope.UserCard.fav = false ;
                    $rootScope.User.favs = resolve.data ;
                }
            );
    }

    //block user from profile card
    function ProfileCardBlock(){
        PeopleService.Block($rootScope.UserCard.id)
            .then(
                resolve => {
                    $rootScope.UserCard.blocked = true ;
                }
            );
    }





    //Heartbeat Section


    //Initialize notification counter variable if undefined
    $rootScope.notifications = typeof $rootScope.notifications !== 'undefined' ? $rootScope.notifications : {'mc':0,'p':0,'sm':0};


    // start heartbeat function on app start
    HeartBeat();

    // set interval to run heartbeat function each 10 sec
    $interval(function(){
        HeartBeat();
    }, 10000);


    function HeartBeat(){
        $http.get(AppSettings.apiUrl + 'account/heartbeat')
            .then(
                resolve => {
                    //show notification for each new message
                    if (resolve.data.m.length > 0) {
                        angular.forEach(resolve.data.m, function(value, key) {
                            var notify = {
                                title: 'New Message From ' + resolve.data.m[key].name,
                                body: resolve.data.m[key].body ,
                                pid:resolve.data.m[key].convo
                            };
                            // pass notify for check for config to showing to user or not
                            NotificationService.ShowNotification(notify) ;
                            //broadcast for new message
                            $rootScope.$emit('NewMessage', resolve.data.m[key]);
                            //increase messages counter
                            $rootScope.notifications.mc += 1 ;
                        });
                    }
                    //increase system messages counter if any exist
                    if (resolve.data.s.length > 0){
                        $rootScope.notifications.sm +=  resolve.data.s.length;
                    }
                    //pass watched posts counter
                    $rootScope.notifications.p = resolve.data.p ;
                },
                reject => {
                    //noinspection JSUnresolvedVariable
                    if(reject.status == 403){
                        $rootScope.IsAuthorized = false ;
                        $state.go('Login');
                    }
                }
            );
    }//HeartBeat




    //Other Modules


    //user sidebar menu toggle show and hide
    function SideMenuHandler(){
        $('#side-pane')
            .transition('horizontal flip')
        ;
        $rootScope.side_menu = !$rootScope.side_menu;
    }

    //logout user and clear credentials
    function Logout(){
        AuthenticationService.ClearCredentials();
        $state.go('Login');
    }

}//MainController function


export default {
    name: 'MainController',
    fn: MainController
};
