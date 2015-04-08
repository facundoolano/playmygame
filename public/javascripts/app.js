
var playMyGameApp = angular.module('playMyGameApp', ['ngRoute', 'showAppCtrl', 'submitAppCtrl']);

playMyGameApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/show.html',
        controller: 'showAppCtrl'
      }).
      when('/about', {
        templateUrl: 'views/about.html'
      }).
      when('/submit', {
        templateUrl: 'views/submit.html',
        controller: 'submitAppCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);