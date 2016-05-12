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