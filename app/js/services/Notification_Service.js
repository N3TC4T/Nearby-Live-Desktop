function NotificationService($http, $rootScope, $localStorage, AppSettings) {
  'ngInject';

  const service = {};

  service.SystemNotifications = SystemNotifications;
  service.ShowNotification = ShowNotification ;
  service.DisableNotificationForUser = DisableNotificationForUser ;
  service.EnableNotificationForUser = EnableNotificationForUser ;
  service.GlobalNotificationSave = GlobalNotificationSave;
  service.RetrieveGlobalNotifiationSetting = RetrieveGlobalNotifiationSetting ;

  return service;

  function SystemNotifications(params){
    return $http.get(AppSettings.apiUrl + 'system-messages' , {params:params});
  }


  function ShowNotification(notify){
    // check if is there any settings for notify sender user
    if(typeof $rootScope.User.settings[notify.pid] != 'undefined'){
      if($rootScope.User.settings[notify.pid].notification == true){
        new Notification(notify.title, notify);
      }
    }else {
      //check if is notification enable in global or not
      if($rootScope.User.settings.global_settings.notification){
        new Notification(notify.title, notify);
      }
    }
  }

  function DisableNotificationForUser(pid){
    if (typeof $localStorage.settings[$rootScope.User.profile.id][pid] != 'undefined'){
      $localStorage.settings[$rootScope.User.profile.id][pid].notification = false ;
    }else {
      $localStorage.settings[$rootScope.User.profile.id][pid] = {} ;
      $localStorage.settings[$rootScope.User.profile.id][pid].notification = false ;
    }
    // update user settings
    $rootScope.User.settings = $localStorage.settings[$rootScope.User.profile.id];
  }

  function EnableNotificationForUser(pid){
    if (typeof $localStorage.settings[$rootScope.User.profile.id][pid] != 'undefined'){
      $localStorage.settings[$rootScope.User.profile.id][pid].notification = true ;
    }else {
      $localStorage.settings[$rootScope.User.profile.id][pid] = {} ;
      $localStorage.settings[$rootScope.User.profile.id][pid].notification = true ;
    }
    // update user settings
    $rootScope.User.settings = $localStorage.settings[$rootScope.User.profile.id];
  }


  function GlobalNotificationSave(){
    var current_settings = $localStorage.settings[$rootScope.User.profile.id].global_settings.notification ;
    $localStorage.settings[$rootScope.User.profile.id].global_settings.notification = !current_settings;
  }

  /**
   * @return {boolean}
   */
  function RetrieveGlobalNotifiationSetting(){
    return $localStorage.settings[$rootScope.User.profile.id].global_settings.notification ;
  }



}

export default {
  name: 'NotificationService',
  fn: NotificationService
};
