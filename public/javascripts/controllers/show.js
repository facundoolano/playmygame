var showAppCtrl = angular.module('showAppCtrl', []);

showAppCtrl.controller('showAppCtrl', ['$scope', '$filter', '$http', function($scope, $filter, $http) {
    $scope.app = undefined;
    $scope.description = description;
    $scope.stars = stars;
    $scope.next = next;

    $http.get('/apps')
        .success(function(data) {
            $scope.app = data;
        })
        .error(function(data) {
            console.log('Error getting app: ' + data);
        });

    function next() {
        //TODO
    }

    function description() {
        if (!$scope.app) return "";
        var desc = $scope.app.description;

        var LIMIT = 200;

        if (desc.length > LIMIT) {
            desc = $filter("limitTo")(desc, LIMIT - 1) + "…";
        }

        return desc;
    }

    function stars() {
        if (!$scope.app) return 0;
        var count = Math.round($scope.app.score);
        return new Array(count);
    }

}]);