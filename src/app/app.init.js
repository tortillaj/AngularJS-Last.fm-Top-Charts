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