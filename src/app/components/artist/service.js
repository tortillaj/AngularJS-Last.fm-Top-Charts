(function(angular) {
  'use strict';

  function ArtistService($http, $localForage) {
    return {
      getArtist: getArtist
    };

    function getArtist(name) {
      return $http.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + name + '&api_key=230c59b08f8745c6a1a93577bdcad94c&format=json');
    }
  }

  ArtistService.$inject = ['$http', '$localForage'];

  angular.module('topcharts').factory('ArtistService', ArtistService);

})(angular);