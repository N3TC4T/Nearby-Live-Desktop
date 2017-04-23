function lazyImg() {

   return {

     replace: true,
     template: '<div class="lazy-img"><div class="sm"><img src="{{imgSmall}}" class="lazy-img-small"/></div><img src="{{imgLarge}}" class="lazy-img-larg"/></div>',
     scope: {
       imgLarge: '@srcLarge',
       imgSmall: '@srcSmall'
     },

     link: function (scope, elem) {
       var imgSmall = new Image();
       var imgLarge = new Image();
       imgSmall.src = scope.imgSmall;
       imgSmall.onload = function () {
         elem.children('.sm').find('img').css('opacity', '1');
         imgLarge.src = scope.imgLarge;
         imgLarge.onload = function () {
           elem.find('img').css('opacity', '1');
           elem.children('.sm').find('img').css('display', 'none');
         }
       }
     }
   }
}

export default {
  name: 'lazyImg',
  fn: lazyImg
};
