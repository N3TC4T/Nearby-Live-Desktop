function NotificationController (shell, NotificationService) {
    'ngInject';

    var self = this ;
    self.GetSystemNotifications = GetSystemNotifications;
    self.LoadMoreSystemNotifications = LoadMoreSystemNotifications ;
    self.OpenPostExternal = OpenPostExternal ;
    self.OpenGoldExternal = OpenGoldExternal ;

    GetSystemNotifications();

    function GetSystemNotifications(){
        self.IsNotificationsLoading = true ;

        var params = {'latest':true , 'last':-1} ;

        NotificationService.SystemNotifications(params)
            .then(
                resolve => {
                    self.IsNotificationsLoading = false ;
                    self.SystemNotifications = resolve.data;
                }
            );
    }

    function LoadMoreSystemNotifications(){

        self.IsLoadingMore = true ;
        var params = {'last' : self.SystemNotifications[self.SystemNotifications.length - 1].id , 'latest':false };

        NotificationService.SystemNotifications(params)
            .then(
                resolve => {
                    self.IsLoadingMore = false ;
                    self.SystemNotifications = self.SystemNotifications.concat(resolve.data);
                }
            );
    }

    //TODO: open post by link , get gold membership

    function OpenPostExternal(postId){
        shell.openExternal('https://www.wnmlive.com/post/'+postId) ;
    }

    function OpenGoldExternal(){
        shell.openExternal('https://www.wnmlive.com/gold') ;
    }



}//NotificationsController function


export default {
    name: 'NotificationController',
    fn: NotificationController
};
