;(function(angular) {

  'use strict';

  /**
   * App routes
   */
  angular.module('boilerplate')
    .config(RoutingConfig);

  RoutingConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

  function RoutingConfig($urlRouterProvider, $stateProvider) {

    // for any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/');

    // now set up the states
    $stateProvider

      .state('home', {
        url: '/',
        component: 'home'
      });
  }

})(window.angular);
