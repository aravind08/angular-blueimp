;(function() {

  'use strict';

  /**
   * Main navigation
   *
   * @example
   * <main-nav><main-nav/>
   *
   */
  angular
    .module('boilerplate')
    .component('mainNav', {
      templateUrl: 'app/main-nav/main-nav.html',
      controller: MainNavCtrl
    });

    MainNavCtrl.$inject = [];

    /// definition

    function MainNavCtrl() {}

})();
