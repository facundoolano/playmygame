
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