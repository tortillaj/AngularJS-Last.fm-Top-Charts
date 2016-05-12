(function(angular) {
  'use strict';

  function ArtistList(ArtistListService) {
    var directive = {
      replace: true,
      require: '?artist',
      restrict: 'E',
      link: link,
      templateUrl: 'app/components/artistList/directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
      scope.pagination = {
        page: Number(attrs.page) || 1,
        limit: Number(attrs.limit) || 10
      };

      scope.filter = function() {
        ArtistListService.getTopArtists(scope.pagination)
          .then(function (response) {
            if (response.data.artists && response.data.artists.artist) {
              scope.artists = response.data.artists.artist.slice(-scope.pagination.limit);
            }
            else {
              scope.artists = [];
            }
          }, function (error) {
            console.dir(error);
          });
      };

      scope.prevPage = function() {
        if (scope.pagination.page > 1) {
          scope.pagination.page--;

          scope.filter();
        }
      };

      scope.nextPage = function() {
        scope.pagination.page ++;

        scope.filter();
      };


      scope.filter();
    }
  }

  ArtistList.$inject = ['ArtistListService'];

  angular.module('topcharts').directive('artistList', ArtistList);

})(angular);