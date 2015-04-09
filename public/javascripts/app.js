
var playMyGameApp = angular.module("playMyGameApp", ["ngRoute", "showAppCtrl", "submitAppCtrl"]);

playMyGameApp.config(["$routeProvider",
      function($routeProvider) {
        $routeProvider.
          when("/", {
            templateUrl: "views/show.html",
            controller: "showAppCtrl",
            resolve: {app: appResolver}
          }).
          when("/about", {
            templateUrl: "views/about.html"
          }).
          when("/submit", {
            templateUrl: "views/submit.html",
            controller: "submitAppCtrl"
          }).
          otherwise({
            redirectTo: "/"
          });
      }]);

function appResolver($http) {
    return $http.get('/apps').then(function(response){
        return response.data;
    });
}