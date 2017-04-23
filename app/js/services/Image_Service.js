function ImageService($http,AppSettings) {
    'ngInject';

    const service = {};

    service.UploadPhoto = UploadPhoto;

    return service;


    function UploadPhoto(image){
        return $http({
              method: 'POST',
              url: AppSettings.siteUrl + 'upload-image.ashx',
              data: image,
              headers: {
                'Content-Type': 'jpg/jpeg'
              }
        });
    }

}

export default {
    name: 'ImageService',
    fn: ImageService
};
