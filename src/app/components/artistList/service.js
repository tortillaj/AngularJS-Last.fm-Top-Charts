(function(angular) {
  'use strict';

  function ArtistListService($http, $localForage) {
    return {
      getTopArtists: getTopArtists
    };

    function getTopArtists(pagination) {
      return $http.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=230c59b08f8745c6a1a93577bdcad94c&format=json&limit=' + pagination.limit + '&page=' + pagination.page);
    }

  }

  ArtistListService.$inject = ['$http', '$localForage'];

  angular.module('topcharts').factory('ArtistListService', ArtistListService);

})(angular);