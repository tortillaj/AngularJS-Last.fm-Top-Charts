(function(angular) {
  'use strict';

  function Artist(ArtistService) {
    var directive = {
      replace: true,
      restrict: 'E',
      link: link,
      templateUrl: 'app/components/artist/directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
      scope.name = attrs.name;
      if (attrs.name) {
        ArtistService.getArtist(attrs.name)
          .then(function(response) {
            if (response.data.artist) {
              scope.artist = response.data.artist;
            }
          }, function(error) {
            console.dir(error);
          });
      }
    }
  }

  Artist.$inject = ['ArtistService'];

  angular.module('topcharts').directive('artist', Artist);

})(angular);