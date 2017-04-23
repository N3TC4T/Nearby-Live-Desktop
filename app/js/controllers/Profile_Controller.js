function ProfileController ($state, $scope, $rootScope,$stateParams, AccountService, PeopleService,  ImageService) {
  'ngInject';

  var self = this ;
  self.GetUserProfile = GetUserProfile;
  self.FollowUser = FollowUser ;
  self.UnFollowUser = UnFollowUser ;
  self.EditProfile = EditProfile ;
  self.SaveAdditionalPhoto = SaveAdditionalPhoto ;
  self.DeleteAdditionalPhoto = DeleteAdditionalPhoto ;

  if($state.current.name == 'Profile' && $stateParams.pid){
    GetUserProfile($stateParams.pid)
  }

  // set current user profile gender
  if($state.current.name == 'Edit_Profile'){
    $('#gender_dropdown').dropdown('set selected',$rootScope.User.profile.gender);
  }

  // beacaus we need to make selecting new picture work DOM should inject after pictures listed and viewd in page
  $scope.$on('ngRepeatFinished', function () {
    $('#image_icon').click(function(){
      $('#image_input').click();
    });
    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $('#image_preview').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
      }
    }
    $('#image_input').change(function(){
      readURL(this);
    });
  });

  function FollowUser(profile){
    profile.Isfollowing = true ;
    PeopleService.Follow(profile.id)
      .then(
        resolve => {
          profile.Isfollowing = false ;
          profile.fav = true ;
          // update new list
          $rootScope.User.favs = resolve.data ;
        }
      );
  }


  function UnFollowUser(profile){
    profile.IsUnfollowing = true ;

    PeopleService.UnFollow(profile.id)
      .then(
        resolve => {
          profile.IsUnfollowing = false ;
          profile.fav = false ;
          // update new list
          $rootScope.User.favs = resolve.data ;
        }
      );
  }


  function GetUserProfile(pid){
    self.IsProfileLoading = true ;
    PeopleService.GetUserProfile(pid)
      .then(
        resolve => {
          self.IsProfileLoading = false ;
          self.UserProfile = resolve.data;
        }
      );
  }

  function EditProfile(){
    self.IsProfileSaving = true ;
    AccountService.SaveProfile($rootScope.User.profile)
      .then(
        resolve => {
          self.IsProfileSaving = false ;
          self.SuccessMessage = true ;
        }
      );
  }

  function SaveAdditionalPhoto(){
    var file = $scope.file;
    self.IsPostingAdditionalPhoto = true ;

    ImageService.UploadPhoto(file)
      .then(
        resolve => {
          var imageId = resolve.data;
          AccountService.PostAdditionalPhoto(imageId)
            .then(
              resolve => {
                self.IsPostingAdditionalPhoto = false ;
                $scope.file = '';
                $rootScope.User.profile.photos.push(imageId) ;
              }
            )
        }
      )
  }

  function DeleteAdditionalPhoto(index){
    var imageId = $rootScope.User.profile.photos[index] ;
    AccountService.RemoveAdditionalPhoto(imageId)
      .then(
        resolve => {
          $rootScope.User.profile.photos.splice(index, 1);
        })
  }



}//ProfileController function


export default {
  name: 'ProfileController',
  fn: ProfileController
};
