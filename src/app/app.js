;(function(angular) {

  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('boilerplate', [
      'ui.router'
    ])
    .config(config);

  config.$inject = ['$locationProvider', '$httpProvider', '$logProvider'];

  /**
   * App config
   */
  function config($locationProvider, $httpProvider, $logProvider) {
    // TODO:
    // you can turn off logging globaly here (for production)
    // $logProvider.debugEnabled(false);
    $logProvider.debugEnabled(true);

  }

  /**
   * Run block
   */
  angular
    .module('boilerplate')
    .run(run);

  run.$inject = [];

  function run() {}

})(window.angular);
