
var playMyGameApp = angular.module("playMyGameApp", ["ngRoute", "ngTouch", "ngAnimate", "showAppCtrl", "submitAppCtrl"]);

playMyGameApp.config(["$routeProvider", "$locationProvider",
      function($routeProvider, $locationProvider) {
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
        $locationProvider.html5Mode(true);
      }]);

function appResolver($http) {
    //save state to see different apps every time
    var skip = Number(sessionStorage.skip);
    if (!skip) {
        sessionStorage.skip = skip = 0;
    }


    return $http.get('/apps?skip=' + skip).then(function(response){
        sessionStorage.skip = skip + 1;
        return response.data;
    });
}