//TODO: its not safe , xss will pass too
function Message($sce) {
 'ngInject';
  return function(message) {
    if(message.search('PHOTO-MSG') > -1 ){
      var ImageID = message.substr(11, message.lenght);
      return $sce.trustAsHtml('<a href="https://nearby-images.azureedge.net/image/'+ImageID+'" data-lightbox="'+ImageID+'"><img src="https://nearby-images.azureedge.net/image/'+ImageID+'/128"></a>');
    }else {
      return $sce.trustAsHtml(message)
    }
  };

}

export default {
  name: 'Message',
  fn: Message
};
