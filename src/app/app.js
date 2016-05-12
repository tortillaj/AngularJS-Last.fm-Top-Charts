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