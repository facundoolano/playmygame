var showAppCtrl = angular.module('showAppCtrl', []);


showAppCtrl.controller('showAppCtrl', ['app', '$scope', '$filter', '$route', function(app, $scope, $filter, $route) {
    console.log("GOT HERE");
    console.log(app);
    $scope.app = app;
    $scope.description = description;
    $scope.stars = stars;
    $scope.next = $route.reload;

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

}]);