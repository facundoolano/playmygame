
var playMyGameApp = angular.module("playMyGameApp", ["ngRoute", "ngTouch", "ngAnimate", "showAppCtrl", "submitAppCtrl"]);

playMyGameApp.config(["$routeProvider", "$locationProvider",
      function($routeProvider, $locationProvider) {
        $routeProvider.
          when("/show/:appId?", {
            templateUrl: "views/show.html",
            controller: "showAppCtrl",
            resolve: {app: appIdResolver},
            reloadOnSearch: false
          }).
          when("/about", {
            templateUrl: "views/about.html"
          }).
          when("/submit", {
            templateUrl: "views/submit.html",
            controller: "submitAppCtrl"
          }).
          otherwise({
            redirectTo: "/show"
          });
        $locationProvider.html5Mode(true);
      }]);


function appIdResolver($http, $route, $location) {
    var appId = $route.current.params.appId;

    if (appId) {
      return $http.get('/apps/' + appId).then(function(response){
          return response.data;
      });
    } else {
        //save state to see different apps every time
        var skip = Number(sessionStorage.skip);
        if (!skip) {
            sessionStorage.skip = skip = 0;
        }

        return $http.get('/apps?skip=' + skip).then(function(response){
            sessionStorage.skip = skip + 1;

            // set taskId to prevent route reloading
            $route.current.pathParams ['appId'] = response.data.appId;
            $location.path('/show/' + response.data.appId);

            return response.data;
        });
    }
}
