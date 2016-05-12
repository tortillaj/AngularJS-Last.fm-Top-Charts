(function(angular) {
  'use strict';

  angular.module('topcharts', [
    'ui.router',
    'LocalForageModule',
    'angular-cache',
    'angucomplete-alt',
    'ngAnimate',
    'angularMoment',
    'ngSanitize',
    'topcharts.templates'
  ]);

  var config = {
    localStorageName: 'topchartsStore',
    cacheLifetimeMinutes: 5,
    cacheEnabled: true
  };

  angular.module('topcharts').constant('TopChart', config);

  angular.module('topcharts').filter('to_trusted', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]);

})(angular);
(function(angular) {
  'use strict';

  //
  // App configuration and routing
  //
  function Config($stateProvider, $urlRouterProvider) {

    $stateProvider.state('main', {
      url: '/',
      templateUrl: 'app/main/view.html',
      controller: 'MainCtrl',
      controllerAs: 'mainCtrl'
    });

    $urlRouterProvider.otherwise('/');
  }

  Config.$inject = ['$stateProvider', '$urlRouterProvider'];

  angular.module('topcharts').config(Config);

})(angular);
(function(angular) {
  'use strict';

  //
  // Instantiation of the app
  //

  function Bootstrap(TopChart, $rootScope, $http, CacheFactory) {
    $rootScope.TopChart = TopChart;

    // setup default caching in localStorage
    // this is only persistent during individual app usages
    if (TopChart.cacheEnabled) {
      $http.defaults.cache = CacheFactory(TopChart.localStorageName, {
        // items added to this cache expire after 5 minutes
        maxAge: TopChart.cacheLifetimeMinutes * 60 * 1000,
        deleteOnExpire: 'aggressive',
        storageMode: 'localStorage',
      });
    }
  }

  Bootstrap.$inject = ['TopChart', '$rootScope', '$http', 'CacheFactory',];

  angular.module('topcharts').run(Bootstrap);

})(angular);
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
(function(angular) {
  'use strict';

  function Controller() {

  }

  Controller.$inject = [];

  angular.module('topcharts').controller('MainCtrl', Controller);

})(angular);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcC5jb25maWcuanMiLCJhcHAuaW5pdC5qcyIsImRpcmVjdGl2ZS5qcyIsInNlcnZpY2UuanMiLCJjb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QURqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3RvcGNoYXJ0cycsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnTG9jYWxGb3JhZ2VNb2R1bGUnLFxuICAgICdhbmd1bGFyLWNhY2hlJyxcbiAgICAnYW5ndWNvbXBsZXRlLWFsdCcsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ2FuZ3VsYXJNb21lbnQnLFxuICAgICduZ1Nhbml0aXplJyxcbiAgICAndG9wY2hhcnRzLnRlbXBsYXRlcydcbiAgXSk7XG5cbiAgdmFyIGNvbmZpZyA9IHtcbiAgICBsb2NhbFN0b3JhZ2VOYW1lOiAndG9wY2hhcnRzU3RvcmUnLFxuICAgIGNhY2hlTGlmZXRpbWVNaW51dGVzOiA1LFxuICAgIGNhY2hlRW5hYmxlZDogdHJ1ZVxuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd0b3BjaGFydHMnKS5jb25zdGFudCgnVG9wQ2hhcnQnLCBjb25maWcpO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd0b3BjaGFydHMnKS5maWx0ZXIoJ3RvX3RydXN0ZWQnLCBbJyRzY2UnLCBmdW5jdGlvbigkc2NlKXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwodGV4dCk7XG4gICAgfTtcbiAgfV0pO1xuXG59KShhbmd1bGFyKTsiLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy9cbiAgLy8gQXBwIGNvbmZpZ3VyYXRpb24gYW5kIHJvdXRpbmdcbiAgLy9cbiAgZnVuY3Rpb24gQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgdXJsOiAnLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tYWluL3ZpZXcuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTWFpbkN0cmwnLFxuICAgICAgY29udHJvbGxlckFzOiAnbWFpbkN0cmwnXG4gICAgfSk7XG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gIH1cblxuICBDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJ107XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3RvcGNoYXJ0cycpLmNvbmZpZyhDb25maWcpO1xuXG59KShhbmd1bGFyKTsiLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy9cbiAgLy8gSW5zdGFudGlhdGlvbiBvZiB0aGUgYXBwXG4gIC8vXG5cbiAgZnVuY3Rpb24gQm9vdHN0cmFwKFRvcENoYXJ0LCAkcm9vdFNjb3BlLCAkaHR0cCwgQ2FjaGVGYWN0b3J5KSB7XG4gICAgJHJvb3RTY29wZS5Ub3BDaGFydCA9IFRvcENoYXJ0O1xuXG4gICAgLy8gc2V0dXAgZGVmYXVsdCBjYWNoaW5nIGluIGxvY2FsU3RvcmFnZVxuICAgIC8vIHRoaXMgaXMgb25seSBwZXJzaXN0ZW50IGR1cmluZyBpbmRpdmlkdWFsIGFwcCB1c2FnZXNcbiAgICBpZiAoVG9wQ2hhcnQuY2FjaGVFbmFibGVkKSB7XG4gICAgICAkaHR0cC5kZWZhdWx0cy5jYWNoZSA9IENhY2hlRmFjdG9yeShUb3BDaGFydC5sb2NhbFN0b3JhZ2VOYW1lLCB7XG4gICAgICAgIC8vIGl0ZW1zIGFkZGVkIHRvIHRoaXMgY2FjaGUgZXhwaXJlIGFmdGVyIDUgbWludXRlc1xuICAgICAgICBtYXhBZ2U6IFRvcENoYXJ0LmNhY2hlTGlmZXRpbWVNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICBkZWxldGVPbkV4cGlyZTogJ2FnZ3Jlc3NpdmUnLFxuICAgICAgICBzdG9yYWdlTW9kZTogJ2xvY2FsU3RvcmFnZScsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBCb290c3RyYXAuJGluamVjdCA9IFsnVG9wQ2hhcnQnLCAnJHJvb3RTY29wZScsICckaHR0cCcsICdDYWNoZUZhY3RvcnknLF07XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3RvcGNoYXJ0cycpLnJ1bihCb290c3RyYXApO1xuXG59KShhbmd1bGFyKTsiLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gQXJ0aXN0TGlzdChBcnRpc3RMaXN0U2VydmljZSkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgcmVxdWlyZTogJz9hcnRpc3QnLFxuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIGxpbms6IGxpbmssXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2FydGlzdExpc3QvZGlyZWN0aXZlLmh0bWwnXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHNjb3BlLnBhZ2luYXRpb24gPSB7XG4gICAgICAgIHBhZ2U6IE51bWJlcihhdHRycy5wYWdlKSB8fCAxLFxuICAgICAgICBsaW1pdDogTnVtYmVyKGF0dHJzLmxpbWl0KSB8fCAxMFxuICAgICAgfTtcblxuICAgICAgc2NvcGUuZmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIEFydGlzdExpc3RTZXJ2aWNlLmdldFRvcEFydGlzdHMoc2NvcGUucGFnaW5hdGlvbilcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmFydGlzdHMgJiYgcmVzcG9uc2UuZGF0YS5hcnRpc3RzLmFydGlzdCkge1xuICAgICAgICAgICAgICBzY29wZS5hcnRpc3RzID0gcmVzcG9uc2UuZGF0YS5hcnRpc3RzLmFydGlzdC5zbGljZSgtc2NvcGUucGFnaW5hdGlvbi5saW1pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgc2NvcGUuYXJ0aXN0cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5kaXIoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgc2NvcGUucHJldlBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHNjb3BlLnBhZ2luYXRpb24ucGFnZSA+IDEpIHtcbiAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uLnBhZ2UtLTtcblxuICAgICAgICAgIHNjb3BlLmZpbHRlcigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzY29wZS5uZXh0UGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5wYWdpbmF0aW9uLnBhZ2UgKys7XG5cbiAgICAgICAgc2NvcGUuZmlsdGVyKCk7XG4gICAgICB9O1xuXG5cbiAgICAgIHNjb3BlLmZpbHRlcigpO1xuICAgIH1cbiAgfVxuXG4gIEFydGlzdExpc3QuJGluamVjdCA9IFsnQXJ0aXN0TGlzdFNlcnZpY2UnXTtcblxuICBhbmd1bGFyLm1vZHVsZSgndG9wY2hhcnRzJykuZGlyZWN0aXZlKCdhcnRpc3RMaXN0JywgQXJ0aXN0TGlzdCk7XG5cbn0pKGFuZ3VsYXIpOyIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBBcnRpc3RMaXN0U2VydmljZSgkaHR0cCwgJGxvY2FsRm9yYWdlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFRvcEFydGlzdHM6IGdldFRvcEFydGlzdHNcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0VG9wQXJ0aXN0cyhwYWdpbmF0aW9uKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3MuYXVkaW9zY3JvYmJsZXIuY29tLzIuMC8/bWV0aG9kPWNoYXJ0LmdldHRvcGFydGlzdHMmYXBpX2tleT0yMzBjNTliMDhmODc0NWM2YTFhOTM1NzdiZGNhZDk0YyZmb3JtYXQ9anNvbiZsaW1pdD0nICsgcGFnaW5hdGlvbi5saW1pdCArICcmcGFnZT0nICsgcGFnaW5hdGlvbi5wYWdlKTtcbiAgICB9XG5cbiAgfVxuXG4gIEFydGlzdExpc3RTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRsb2NhbEZvcmFnZSddO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd0b3BjaGFydHMnKS5mYWN0b3J5KCdBcnRpc3RMaXN0U2VydmljZScsIEFydGlzdExpc3RTZXJ2aWNlKTtcblxufSkoYW5ndWxhcik7IiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XG5cbiAgfVxuXG4gIENvbnRyb2xsZXIuJGluamVjdCA9IFtdO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd0b3BjaGFydHMnKS5jb250cm9sbGVyKCdNYWluQ3RybCcsIENvbnRyb2xsZXIpO1xuXG59KShhbmd1bGFyKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
