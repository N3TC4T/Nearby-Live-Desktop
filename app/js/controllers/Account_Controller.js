function AccountController (shell, $state,$rootScope, $localStorage,AccountService,AuthenticationService, NotificationService) {
  'ngInject';

  var self = this ;

  self.Login = Login;
  self.Recover_Password = Recover_Password ;
  self.ChangePassword = ChangePassword ;
  self.Connect = Connect ;
  self.GetUserPointsDetails = GetUserPointsDetails ;
  self.SaveGlobalNotificationSetting = SaveGlobalNotificationSetting ;
  self.GlobalNotificationSettings = GlobalNotificationSettings ;

  if($state.current.name == 'Loader'){
    self.Connect();
  }else if($state.current.name == 'Account_Settings'){
    self.GetUserPointsDetails();
    self.GlobalNotificationSettings()
  }

  function Login() {
    self.IsLoggedin = true;
    AuthenticationService.Login(self.LoginForm)
      .then(
        resolve => {
          self.IsLoggedin = false;
          if(resolve.data.length > 3){
            AuthenticationService.SetCredentials(resolve.data);
            $state.go('Loader');
          }else {
            self.message = 'Invalid Email and/or Password!' ;
          }
        },
        reject => {
          self.IsLoggedin = false;
          self.message = 'Invalid Email and/or Password!' ;
        }
      );
  }//Login

  function Recover_Password(){
    self.IsRecovering = true ;
    AuthenticationService.ForgetPassword(self.RecoveryForm.email)
      .then(
        resolve => {
          self.IsRecovering = false ;
          self.RecoveryForm.email = '' ;
          self.message = 'Please check your email inbox for password reset instructions.';
          $('.ui.small.forget_password.modal').modal('hide');
        }
      );
  } //Recover_Password


  function ChangePassword(){
    if(self.ChangePasswordForm.currentPassword && self.ChangePasswordForm.newPassword && self.ChangePasswordForm.newPassword == self.ChangePasswordForm.confirmNewPassword){
      self.IsChangingPassword = true ;
      AuthenticationService.ChangePassword(self.ChangePasswordForm)
        .then(
          resolve => {
            self.IsChangingPassword = false ;
            if(resolve.data != false){
              self.message = 'Your account password has been changed.';
            }else {
              self.message = 'Unable to change password. Verify you have entered the current password correctly.';
            }
          },
          reject =>{
            self.IsChangingPassword = false ;
            self.message = 'Cannot change password right now , please try again later.'
          }
        );
    }
  }

  function Connect() {
    AuthenticationService.GetAuthInfo()
      .then(
        resolve => {
          $rootScope.IsAuthorized = true ;
          $rootScope.User = resolve.data;

          // this would be check if setting is none then make a empty variable
          $localStorage.settings = typeof $localStorage.settings !== 'undefined' ? $localStorage.settings : {};
          // enable side_menu by default
          $rootScope.side_menu = true ;

          // set settings belongs to user if any exists
          if($localStorage.settings[$rootScope.User.profile.id]){
            $rootScope.User.settings = $localStorage.settings[$rootScope.User.profile.id];
          }else {
            // if user don't have any settings then set some for it
            var temp_setting = {} ;
            temp_setting[$rootScope.User.profile.id] = {'global_settings':{'notification':true}};
            $localStorage.settings = angular.extend($localStorage.settings, temp_setting);
            $rootScope.User.settings = $localStorage.settings[$rootScope.User.profile.id];
          }
          // redirect user to LiveStream
          $state.go('Stream');
        },
        reject => {
          self.isChecking = false;
          if(reject.status == 403){
            $rootScope.IsAuthorized = false ;
          }else{
            self.Message = 'Can not Connect to server!';
          }
          $state.go('Login');

        }
      );
  }//Connect

  // get users points details
  function GetUserPointsDetails(){
    AccountService.GetUserPoints()
      .then(
        resolve => {
          self.UserCurrentPoints = resolve.data
        }
      )
  }

  //save global notification setting on toggle button clicked
  function SaveGlobalNotificationSetting(){
    NotificationService.GlobalNotificationSave()
  }

  //retrieve current global notification settings
  function GlobalNotificationSettings(){
    if(NotificationService.RetrieveGlobalNotifiationSetting()){
      $('.ui.checkbox').checkbox('check');
    }
  }



}//AccountController function


export default {
  name: 'AccountController',
  fn: AccountController
};
