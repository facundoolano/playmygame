var showAppCtrl = angular.module('showAppCtrl', []);


showAppCtrl.controller('showAppCtrl', ['app', '$scope', '$filter', '$route', function(app, $scope, $filter, $route) {
    $scope.app = app;
    $scope.description = description;
    $scope.stars = stars;
    $scope.next = $route.reload;

    if (isTouchDevice()) {
        $scope.slide = "slide";
    }

    function description() {
        var LIMIT = 200;
        var desc = $scope.app.description;

        if (desc.length > LIMIT) {
            desc = $filter("limitTo")(desc, LIMIT - 1) + "…";
        }

        return desc;
    }

    function stars() {
        var count = Math.round($scope.app.score);
        return new Array(count);
    }

    function isTouchDevice() {
      return 'ontouchstart' in window // works on most browsers
          || 'onmsgesturechange' in window; // works on ie10
    };

}]);